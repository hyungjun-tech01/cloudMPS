'use server';

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
import { AuthError } from 'next-auth';
// import { z } from "zod";

import { signIn, signOut } from '@/auth';
import { BASE_PATH } from './constants';
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