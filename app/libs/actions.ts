'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from 'next-auth';
import { z } from "zod";

import { auth, signIn, signOut } from '@/auth';
import { BASE_PATH, MIN_PASSWORD_LENGTH } from './constants';
import { LoginData, MemberState, ClientState } from './types';
import { formatTimeYYYYpMMpDD } from './utils';


export async function logout() {
    await signOut({ redirectTo: '/login' });
};

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    // console.log('authenticate :', formData);
    const resObj : { ko: Record<string, string>, en: Record<string, string> } = {
        ko: {
            CredentialsSignin: "ID가 유효하지 않거나 비밀번호가 일치하지 않습니다.",
            default: "알 수 없는 오류가 발생하였습니다."
        },
        en: {
            CredentialsSignin: "Invalid credentials.",
            default: "Something went wrong.",
        }
    };
    const locale = formData.get('locale') || "ko";

    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return resObj[locale as keyof typeof resObj].CredentialsSignin;
                default:
                    return resObj[locale as keyof typeof resObj].default;
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
    // console.log('[requestInitializeAccount] formData :', formData);
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

    // console.log('changePassword :', validateData);
    if(validateData.error) {
        const tree = z.treeifyError(validateData.error);
        return {
            errors: tree.properties,
            message: "error_in_input",
        };
    };

    if(formData.get('newPassword') !== formData.get('newPasswordAgain')) {
        return {
            message: "new_passwords_not_same",
        };
    };

    const session = await auth();
    if(!session?.user) {
        return {
            message: "missing_authentication",
        }
    }

    const data = {
        user_id: formData.get('userId'),
        user_name: formData.get('userName'),
        old_password: formData.get('oldPassword'),
        new_password: formData.get('newPassword'),
        ip_address: session?.user.ipAddress
    };
s
    let result = null;

    try {
        const resp = await fetch(`${BASE_PATH}/api/users/change_pass`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session_token': session?.user.token ?? ""
            },
            body: JSON.stringify(data)
        });
        result = await resp.json();
    } catch (err) {
        console.error(`\t[ requestInitializeAccount ] Error : ${err}`);
        return err;
    };

    // console.log('changePassword :', result);
    if(result.ResultCode === '0') {
        const tempPath = "/";
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
    };
        
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
export async function registerUser(data: object) {
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

// ----------- Member ----------------------------------------------------------------
const registerMemberScheme = z.object({
    userName:  z.string().min(1, { message : 'error_miss_input' }),
    userEmail: z.email({ message : 'error_input_type_email' }),
    companyCode: z.string().min(6,{ message : 'error_miss_input' }),
    companyType: z.enum(['PATNER', 'GENERAL']),
    ipAddress: z.ipv4({ message : 'error_input_type_ipv4' }),
    updatedBy: z.string().min(1, { message : 'error_miss_input' }),
});

export async function registerMember(prevState: void | MemberState, formData: FormData) {
    const validatedFields = registerMemberScheme.safeParse({
        userName: formData.get('userName'),
        userEmail: formData.get('userEmail'),
        companyType: formData.get('companyType'),
        companyCode: formData.get('companyCode'),
        ipAddress: formData.get('ipAddress'),
        updatedBy:  formData.get('updatedBy'),
    });

    if (!validatedFields.success) {
        const tree = z.treeifyError(validatedFields.error);
        console.log('registerMember :', tree.properties);
        return {
            errors: tree.properties,
            message: 'errors_in_inputs',
        };
    };

    const inputData = {
        user_type: "COMPANY",
        full_name: validatedFields.data.userName,
        e_mail_adress: validatedFields.data.userEmail,
        company_type: validatedFields.data.companyType,
        company_code: validatedFields.data.companyCode,
        ip_address: validatedFields.data.ipAddress,
    };

    const resp = await registerUser(inputData);
    console.log('registerMember :', resp);

    if(resp.ResultCode !== 0) {
        return {
            message: resp.ErrorMessage,
        };
    };

    return;
}

// ----------- Client ----------------------------------------------------------------
const createClientScheme = z.object({
    clientName: z.string().min(1),
    clientNameEn: z.string().optional(),
    ceoName: z.string().optional(),
    clientZipCode: z.string().optional(),
    clientAddress: z.string().optional(),
    clientPhoneNumber: z.string().optional(),
    clientFaxNumber: z.string().optional(),
    homepage: z.string().optional(),
    status: z.string().optional(),
    businessRegistrationCode: z.string().optional(),
    businessType: z.string().optional(),
    businessItem: z.string().optional(),
    industryType: z.string().optional(),
    clientGoup: z.string().optional(),
    clientScale: z.string().optional(),
    dealType: z.string().optional(),
    establishmentDate:  z.string().optional(),
    closureDate: z.string().optional(),
    bankName: z.string().optional(),
    accountCode: z.string().optional(),
    accountOwner: z.string().optional(),
    salesResource: z.string().optional(),
    applicationEngineer: z.string().optional(),
    region: z.string().optional(),
    clientMemo: z.string().optional(),
});

export async function createClient(prevState : void | ClientState, formData: FormData) {
    const validatedFields = createClientScheme.safeParse({
        clientName: formData.get("clientName"),
        clientNameEn: formData.get("clientNameEn"),
        ceoName: formData.get("ceoName"),
        clientZipCode: formData.get("clientZipCode"),
        clientAddress: formData.get("clientAddress"),
        clientPhoneNumber: formData.get("clientPhoneNumber"),
        clientFaxNumber: formData.get("clientFaxNumber"),
        homepage: formData.get("homepage"),
        status: formData.get("status"),
        businessRegistrationCode: formData.get("businessRegistrationCode"),
        businessType: formData.get("businessType"),
        businessItem: formData.get("businessItem"),
        industryType: formData.get("industryType"),
        clientGoup: formData.get("clientGoup"),
        clientScale: formData.get("clientScale"),
        dealType: formData.get("dealType"),
        establishmentDate: formData.get("establishmentDate"),
        closureDate: formData.get("closureDate"),
        bankName: formData.get("bankName"),
        accountCode: formData.get("accountCode"),
        accountOwner: formData.get("accountOwner"),
        salesResource: formData.get("salesResource"),
        applicationEngineer: formData.get("applicationEngineer"),
        region: formData.get("region"),
        clientMemo: formData.get("clientMemo"),
    });

    if (!validatedFields.success) {
        const tree = z.treeifyError(validatedFields.error);
        console.log('createClient :', tree.properties);
        return {
            errors: tree.properties,
            message: 'errors_in_inputs',
        };
    };

    const session = await auth();
    if(!session?.user) {
        return {
            message: 'missing_authentication'
        }
    }
    const { name, companyCode, ipAddress, token } = session.user;
    const today = new Date();
    const todayStr = formatTimeYYYYpMMpDD(today);

    const inputData = {
        client_group : validatedFields.data.clientGoup,
        client_scale : validatedFields.data.clientScale,
        deal_type : validatedFields.data.dealType,
        client_name : validatedFields.data.clientName,
        client_name_en : validatedFields.data.clientNameEn,
        business_registration_code : validatedFields.data.businessRegistrationCode,
        establishment_date : validatedFields.data.establishmentDate,
        closure_date : validatedFields.data.closureDate,
        ceo_name : validatedFields.data.ceoName,
        business_type : validatedFields.data.businessType,
        business_item : validatedFields.data.businessItem,
        industry_type : validatedFields.data.industryType,
        client_zip_code : validatedFields.data.clientZipCode,
        client_address : validatedFields.data.clientAddress,
        client_phone_number : validatedFields.data.clientPhoneNumber,
        client_fax_number : validatedFields.data.clientFaxNumber,
        homepage : validatedFields.data.homepage,
        client_memo : validatedFields.data.clientMemo,
        created_by : name,
        create_date : todayStr,
        modify_date : todayStr,
        recent_user : name,
        account_code : validatedFields.data.accountCode,
        bank_name : validatedFields.data.bankName,
        account_owner : validatedFields.data.accountOwner,
        sales_resource : validatedFields.data.salesResource,
        application_engineer : validatedFields.data.applicationEngineer,
        region : validatedFields.data.region,
        status : validatedFields.data.status,
        user_name : name,
        company_code : companyCode,
        ip_address : ipAddress,
    }

    try {
        const resp = await fetch(`${BASE_PATH}/api/clients/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session_token': token ?? "",
            },
            body: JSON.stringify(inputData),
        });
        const response = await resp.json();
        if(response.ResultCode !== "0") {
            return {
                message: response.ErrorMessage
            };
        };
    } catch (err) {
        console.error(`\t[ create client ] Error : ${err}`);
        return {
            message: "failed_to_save_data"
        };
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