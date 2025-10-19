'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from 'next-auth';
import { z } from "zod";

import { signIn, signOut } from '@/auth';
import { BASE_PATH, MIN_PASSWORD_LENGTH } from './constants';
import { LoginData, UserData } from './types';


export async function logout() {
    await signOut({ redirectTo: '/login' });
};

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    // console.log('authenticate :', formData);
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
};

export type ReqInitAccountState = {
  errors?: {
    userEmail?: string[];
    userFullName?: string[];
  };
  message?: string | null;
};

export async function requestInitializeAccount(
    prevState: string | undefined,
    formData: FormData,
) {
    console.log('[requestInitializeAccount] formData :', formData);
    const data = {
        e_mail_address: formData.get('user_email'),
        full_name: formData.get('user_full_name'),
    };

    let result = null;

    try {
        const resp = await fetch(`${BASE_PATH}/api/users/forgot_pass`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        result = await resp.json();
    } catch (err) {
        console.error(`\t[ requestInitializeAccount ] Error : ${err}`);
        return err;
    }

    if(result.ResultCode === '0') {
        const redirectPath = `/login/info?userType=${result.user_type.toLowerCase()}`;
        revalidatePath(redirectPath);
        redirect(redirectPath);
    } else {
        console.log(`\t [ Request to initialize accout ] error : ${result.ErrorMessage}`)
        return result.ErrorMessage;
    }
};

export type ChangePasswordState = {
  errors?: {
    userName?: string[];
    oldPassword?: string[];
    newPassword?: string[];
    newPasswordAgain?: string[];
  };
  message?: string | null;
};

export async function changePassword(
    prevState: string | undefined,
    formData: FormData,
) {
    console.log('changePassword :', formData);
    const validateData = z.object({
        userName: z.email(),
        oldPassword: z.string().min(MIN_PASSWORD_LENGTH),
        newPassword: z.string().min(MIN_PASSWORD_LENGTH),
        newPasswordAgain: z.string().min(MIN_PASSWORD_LENGTH),
        // ip_address: z.ipv4()
    }).safeParse({
        userName: formData.get('userName'),
        oldPassword: formData.get('oldPassword'),
        newPassword: formData.get('newPassword'),
        newPasswordAgain: formData.get('newPasswordAgain')
    });

    console.log('changePassword :', validateData);
    if(validateData.error) {
        const tree = z.treeifyError(validateData.error);
        return {
        errors: tree.properties,
        message: "Erros in inputs",
        };
    };

    if(formData.get('newPassword') !== formData.get('newPasswordAgain')) {
        return {
            message: "New Passwords are not the same."
        };
    };

    const checkIP = formData.get('ipAddress') === "::1" ? "127.0.0.1" : formData.get('ipAddress');
    const checkToken = formData.get('token') ?? "";

    const data = {
        user_id: formData.get('userId'),
        user_name: formData.get('userName'),
        old_password: formData.get('oldPassword'),
        new_password: formData.get('newPassword'),
        ip_address: checkIP,
    };

    let result = null;

    try {
        const resp = await fetch(`${BASE_PATH}/api/users/change_pass`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json',
                'session_token': checkToken as string
            },
            body: JSON.stringify(data)
        });
        result = await resp.json();
    } catch (err) {
        console.error(`\t[ requestInitializeAccount ] Error : ${err}`);
        return err;
    };

    // console.log('changePassword :', result);
    const userType = formData.get('userType') || "company";
    if(result.ResultCode === '0') {
        const tempPath = `/login?userType=${userType}`;
        console.log('[ requestInitializeAccount ] path', tempPath);
        revalidatePath(tempPath);
        redirect(tempPath);
    } else {
        console.log(`\t [ Request to initialize accout ] error : ${result.ErrorMessage}`)
        return result.ErrorMessage;
    }
};

// ----------- Login ----------------------------------------------------------------
export async function login(data: LoginData) {
    // console.log("Login data:", data);
    const apiAddr = data.is_init === "Y"
        ? `${BASE_PATH}/api/users/login_vericode`
        : `${BASE_PATH}/api/users/login`;

    const checkIP = data.ip_address === "::1" ? "127.0.0.1" : data.ip_address;

    const realData = data.is_init === "Y" ? {
        user_name: data.user_name,
        password: data.password,
        verification_code: data.verification_code,
        company_code: data.company_code,
        ip_address: checkIP,
    } : {
        user_name: data.user_name,
        password: data.password,
        company_code: data.company_code,
        ip_address: checkIP,
    }
        
    try {
        const resp = await fetch(apiAddr, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(realData),
        });
        return resp.json();

    } catch (err) {
        console.error(`\t[ Login ] Error : ${err}`);
        return null;
    };
}

// ----------- User ------------------------------------------------------------------
export async function getUserInfo(userName: string, ipAddr:string, token: string) {
    try {
        const resp = await fetch(`${BASE_PATH}/api/users/getuserinfo`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json',
                'session_token': token
            },
            body: JSON.stringify({user_name: userName, ip_address: ipAddr}),
        });
        return resp.json();

    } catch (err) {
        console.error(`\t[ Login ] Error : ${err}`);
        return null;
    };
}

export async function modifyUser<DataType>(
  id: string,
  prevState: void | DataType,
  formData: FormData
) {
    console.log("NA");
}

export async function deleteUser(id:string, ipAddr:string, token:string) {
    console.log("NA");
}

// ----------- Register ----------------------------------------------------------------
export async function register(data: object) {
    try {
        const resp = await fetch(`${BASE_PATH}/api/users/signup_request`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return resp.json();
    } catch (err) {
        console.error(`\t[ Register ] Error : ${err}`);
        return null;
    };
}

// ----------- Common ----------------------------------------------------------------
export async function fetchData(path:string, data: object, token?:string) {
    try {
        const resp = await fetch(`${BASE_PATH}${path}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session_token': token?? "",
            },
            body: JSON.stringify(data),
        });
        return resp.json();
    } catch (err) {
        console.error(`\t[ fetchData ] ${path} / Error : ${err}`);
        return null;
    };
}