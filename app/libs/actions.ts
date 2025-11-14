'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from 'next-auth';
import { z } from "zod";

import { auth, signIn, signOut } from '@/auth';
import { BASE_PATH, MIN_PASSWORD_LENGTH } from './constants';
import { ClientState, DeviceState, LoginData, MemberState, UserState } from './types';
import { formatTimeYYYYMMDD } from './utils';
import { userAgent } from "next/server";


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
const UserFormScheme = z.object({
    userName: z.string().min(1, { message : 'error_miss_input' }),
    externalUserName: z.string().nullable(),
    fullName: z.string().min(1, { message : 'error_miss_input' }),
    notes: z.string().nullable(),
    totalJobs: z.coerce.number().min(0, { message : 'error_miss_input' }),
    totalPages: z.coerce.number().min(0, { message : 'error_miss_input' }),
    schedulePeriod: z.string().nullable(),
    scheduleAmount: z.string().nullable(),
    scheduleStart: z.string().nullable(),
    deptName: z.string().nullable(),
    office: z.string().nullable(),
    cardNumber: z.string().nullable(),
    cardNumber2: z.string().nullable(),
    disabledPrinting: z.enum(['Y', 'N']),
    disabledPrintingUntil: z.string().nullable(),
    homeDirectory: z.string().nullable(),
    balance: z.coerce.number().nullable(),
    sysadmin: z.string().nullable(),
    privilege: z.enum(['ALL', 'PRINT', 'SCAN', 'NONE']),
    userType: z.enum(['COMPANY', 'PERSON']),
    companyCode: z.coerce.number().nullish(),
    userStatus: z.string().nullable(),
    userRole: z.enum(['PARTNER', 'SUBSCRIPTION', 'FREE_USER', 'PARTNER_USER', 'SUBSCRIPT_USER']),
});

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

const ModifyUser = UserFormScheme.omit({
    userName: true, cardNumber: true, cardNumber2: true, userType: true, companyCode: true, userRole: true
});

export async function modifyUser(
  id: string,
  prevState: void | UserState,
  formData: FormData
) {
    const validateData = ModifyUser.safeParse({
        externalUserName: formData.get('externalUserName'),
        fullName: formData.get('fullName'),
        notes: formData.get('notes'),
        totalJobs: formData.get('totalJobs'),
        totalPages: formData.get('totalPages'),
        schedulePeriod: formData.get('schedulePeriod'),
        scheduleAmount: formData.get('scheduleAmount'),
        scheduleStart: formData.get('scheduleStart'),
        deptName: formData.get('deptName'),
        office: formData.get('office'),
        disabledPrinting: formData.get('disabledPrinting'),
        disabledPrintingUntil: formData.get('disabledPrintingUntil'),
        homeDirectory: formData.get('homeDirectory'),
        balance: formData.get('balance'),
        sysadmin: formData.get('sysadmin'),
        privilege: formData.get('privilege'),
        userStatus: formData.get('userStatus')
    });

    if(!validateData.success) {
        const tree = z.treeifyError(validateData.error);
        console.log('modifyUser :', tree.properties);
        return {
            errors: tree.properties,
            message: 'errors_in_inputs',
        } as UserState;
    };

    const session = await auth();
    if(!session?.user) {
        return {
            message: 'missing_authentication'
        } as UserState;
    };

    const { name, ipAddress, token } = session.user;
    const inputData = {
        user_id: id,
        external_user_name: validateData.data.externalUserName,
        full_name: validateData.data.fullName,
        notes: validateData.data.notes,
        total_jobs: validateData.data.totalJobs,
        total_pages: validateData.data.totalPages,
        schedule_period: validateData.data.schedulePeriod,
        schedule_amount: validateData.data.scheduleAmount,
        schedule_start: validateData.data.scheduleStart,
        department: validateData.data.deptName,
        office: validateData.data.office,
        disabled_printing: validateData.data.disabledPrinting,
        disabled_pprinting_until: validateData.data.disabledPrintingUntil,
        home_directory: validateData.data.homeDirectory,
        balance: validateData.data.balance,
        sysadmin: validateData.data.sysadmin,
        privilege: validateData.data.privilege,
        user_status: validateData.data.userStatus,
        user_name: name,
        ip_address: ipAddress
    };

    try {
        const resp = await fetch(`${BASE_PATH}/api/users/modify`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session_token': token ?? ""
            },
            body: JSON.stringify(inputData),
        });
        const response = await resp.json();
        console.log('modifyUser / response :', response);

        if(response.ResultCode !== "0") {
            return {
                message: response.ErrorMessage
            } as UserState;
        }
    } catch (err) {
        console.error(`\t[ modify user ] Error : ${err}`);
        return {
            message: "failed_to_save_data"
        };
    };
    revalidatePath("/user");
    redirect("/user");
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
        } as MemberState;
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
        } as MemberState;
    };
};

// ----------- Client ----------------------------------------------------------------
const ClientFormScheme = z.object({
    clientName: z.string().min(1),
    clientNameEn: z.string().nullish(),
    ceoName: z.string().nullish(),
    clientZipCode: z.string().nullish(),
    clientAddress: z.string().nullish(),
    clientPhoneNumber: z.string().nullish(),
    clientFaxNumber: z.string().nullish(),
    homepage: z.string().nullish(),
    status: z.string().nullish(),
    businessRegistrationCode: z.string().nullish(),
    businessType: z.string().nullish(),
    businessItem: z.string().nullish(),
    industryType: z.string().nullish(),
    clientGoup: z.string().nullish(),
    clientScale: z.string().nullish(),
    dealType: z.string().nullish(),
    establishmentDate:  z.string().nullable(),
    closureDate: z.string().nullable(),
    bankName: z.string().nullish(),
    accountCode: z.string().nullish(),
    accountOwner: z.string().nullish(),
    salesResource: z.string().nullish(),
    applicationEngineer: z.string().nullish(),
    region: z.string().nullish(),
    clientMemo: z.string().nullish(),
});

export async function createClient(prevState : void | ClientState, formData: FormData) {
    const validatedFields = ClientFormScheme.safeParse({
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
    const updatedOpenDate = validatedFields.data.establishmentDate;
    const updatedCloseDate = validatedFields.data.closureDate;

    const inputData = {
        client_group : validatedFields.data.clientGoup,
        client_scale : validatedFields.data.clientScale,
        deal_type : validatedFields.data.dealType,
        client_name : validatedFields.data.clientName,
        client_name_en : validatedFields.data.clientNameEn,
        business_registration_code : validatedFields.data.businessRegistrationCode,
        establishment_date : updatedOpenDate,
        closure_date : updatedCloseDate,
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
        console.log('createClient / response :', response);
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
};

export async function modifyClient(id: string, prevState : void | ClientState, formData: FormData) {
    const validatedFields = ClientFormScheme.safeParse({
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
        console.log('modifyClient :', tree.properties);
        return {
            errors: tree.properties,
            message: 'errors_in_inputs',
        } as ClientState;
    };

    const session = await auth();
    if(!session?.user) {
        return {
            message: 'missing_authentication'
        } as ClientState;
    }
    const { name, companyCode, ipAddress, token } = session.user;
    const today = new Date();
    const todayStr = formatTimeYYYYMMDD(today);
    const updatedOpenDate = validatedFields.data.establishmentDate;
    const updatedCloseDate = validatedFields.data.closureDate;

    const inputData = {
        client_id : id,
        client_group : validatedFields.data.clientGoup,
        client_scale : validatedFields.data.clientScale,
        deal_type : validatedFields.data.dealType,
        client_name : validatedFields.data.clientName,
        client_name_en : validatedFields.data.clientNameEn,
        business_registration_code : validatedFields.data.businessRegistrationCode,
        establishment_date : updatedOpenDate,
        closure_date : updatedCloseDate,
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
        const resp = await fetch(`${BASE_PATH}/api/clients/modify`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session_token': token ?? "",
            },
            body: JSON.stringify(inputData),
        });
        const response = await resp.json();
        console.log('modifyClient / response :', response);
        if(response.ResultCode !== "0") {
            return {
                message: response.ErrorMessage
            } as ClientState;
        };
    } catch (err) {
        console.error(`\t[ modify client ] Error : ${err}`);
        return {
            message: "failed_to_save_data"
        };
    };
    
    revalidatePath("/client");
    redirect("/client");
};

// ----------- Device ----------------------------------------------------------------
const DeviceFormScheme = z.object({
    deviceName: z.string(),
    deviceType: z.string().nullish(),
    deviceModel: z.string().nullish(),
    serialNumber: z.string().min(1),
    physicalDeviceId: z.string().nullish(),
    extDeviceFunction: z.string().nullish(),
    location: z.string().nullish(),
    appType: z.string().nullish(),
    clientId: z.string().nullish(),
    blackTonerPercentage: z.coerce.number().min(0).max(100),
    cyanTonerPercentage: z.coerce.number().min(0).max(100),
    magentaTonerPercentage: z.coerce.number().min(0).max(100),
    yellowTonerPercentage: z.coerce.number().min(0).max(100),
    blackDrumPercentage: z.coerce.number().min(0).max(100),
    cyanDrumPercentage: z.coerce.number().min(0).max(100),
    magentaDrumPercentage: z.coerce.number().min(0).max(100),
    yellowDrumPercentage: z.coerce.number().min(0).max(100),
    deviceStatus: z.string().nullish(),
});

export async function createDevice(prevState : void | DeviceState, formData: FormData) {
    const validatedFields = DeviceFormScheme.safeParse({
        deviceName: formData.get("deviceName"),
        extDeviceFunction: formData.get("extDeviceFunction"),
        physicalDeviceId: formData.get("physicalDeviceId"),
        location: formData.get("location"),
        deviceModel: formData.get("deviceModel"),
        serialNumber: formData.get("serialNumber"),
        deviceStatus: formData.get("deviceStatus"),
        deviceType: formData.get("deviceType"),
        blackTonerPercentage: formData.get("blackTonerPercentage"),
        cyanTonerPercentage: formData.get("cyanTonerPercentage"),
        magentaTonerPercentage: formData.get("magentaTonerPercentage"),
        yellowTonerPercentage: formData.get("yellowTonerPercentage"),
        appType: formData.get("appType"),
        blackDrumPercentage: formData.get("blackDrumPercentage"),
        cyanDrumPercentage: formData.get("cyanDrumPercentage"),
        magentaDrumPercentage: formData.get("magentaDrumPercentage"),
        yellowDrumPercentage: formData.get("yellowDrumPercentage"),
        clientId: formData.get("clientId"),
    });

    if (!validatedFields.success) {
        const tree = z.treeifyError(validatedFields.error);
        console.log('createDevice :', tree.properties);
        return {
            errors: tree.properties,
            message: 'errors_in_inputs',
        } as DeviceState;
    };

    const session = await auth();
    if(!session?.user) {
        return {
            message: 'missing_authentication'
        } as DeviceState;
    };

    const { name, companyCode, ipAddress, token } = session.user;
    const inputData = {
        device_name: validatedFields.data.deviceName,
        ext_device_function: validatedFields.data.extDeviceFunction,
        physical_device_id: validatedFields.data.physicalDeviceId,
        location: validatedFields.data.location,
        device_model: validatedFields.data.deviceModel,
        serial_number: validatedFields.data.serialNumber,
        device_status: validatedFields.data.deviceStatus,
        device_type: validatedFields.data.deviceType,
        black_toner_percentage: validatedFields.data.blackTonerPercentage,
        cyan_toner_percentage: validatedFields.data.cyanTonerPercentage,
        magenta_toner_percentage: validatedFields.data.magentaTonerPercentage,
        yellow_toner_percentage: validatedFields.data.yellowTonerPercentage,
        app_type: validatedFields.data.appType,
        black_drum_percentage: validatedFields.data.blackDrumPercentage,
        cyan_drum_percentage: validatedFields.data.cyanDrumPercentage,
        magenta_drum_percentage: validatedFields.data.magentaDrumPercentage,
        yellow_drum_percentage: validatedFields.data.yellowDrumPercentage,
        client_name: validatedFields.data.clientId,
        user_name: name,
        company_code: companyCode,
        ip_address: ipAddress,
    };

    try {
        const resp = await fetch(`${BASE_PATH}/api/devices/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session_token': token ?? "",
            },
            body: JSON.stringify(inputData),
        });
        const response = await resp.json();
        console.log('createDevice / response :', response);
        if(response.ResultCode !== "0") {
            return {
                message: response.ErrorMessage
            } as DeviceState;
        };
    } catch (err) {
        console.error(`\t[ create device ] Error : ${err}`);
        return {
            message: "failed_to_save_data"
        } as DeviceState;
    };

    revalidatePath("/device");
    redirect("/device");
};

export async function modifyDevice(id: string, prevState : void | DeviceState, formData: FormData) {
    const validatedFields = DeviceFormScheme.safeParse({
        deviceName: formData.get("deviceName"),
        extDeviceFunction: formData.get("extDeviceFunction"),
        physicalDeviceId: formData.get("physicalDeviceId"),
        location: formData.get("location"),
        deviceModel: formData.get("deviceModel"),
        serialNumber: formData.get("serialNumber"),
        deviceStatus: formData.get("deviceStatus"),
        deviceType: formData.get("deviceType"),
        blackTonerPercentage: formData.get("blackTonerPercentage"),
        cyanTonerPercentage: formData.get("cyanTonerPercentage"),
        magentaTonerPercentage: formData.get("magentaTonerPercentage"),
        yellowTonerPercentage: formData.get("yellowTonerPercentage"),
        appType: formData.get("appType"),
        blackDrumPercentage: formData.get("blackDrumPercentage"),
        cyanDrumPercentage: formData.get("cyanDrumPercentage"),
        magentaDrumPercentage: formData.get("magentaDrumPercentage"),
        yellowDrumPercentage: formData.get("yellowDrumPercentage"),
        clientId: formData.get("clientId"),
    });

    if (!validatedFields.success) {
        const tree = z.treeifyError(validatedFields.error);
        console.log('modifyDevice :', tree.properties);
        return {
            errors: tree.properties,
            message: 'errors_in_inputs',
        } as DeviceState;
    };

    const session = await auth();
    if(!session?.user) {
        return {
            message: 'missing_authentication'
        } as DeviceState;
    };

    const { name, companyCode, ipAddress, token } = session.user;
    const inputData = {
        device_id: id,
        device_name: validatedFields.data.deviceName,
        ext_device_function: validatedFields.data.extDeviceFunction,
        physical_device_id: validatedFields.data.physicalDeviceId,
        location: validatedFields.data.location,
        device_model: validatedFields.data.deviceModel,
        serial_number: validatedFields.data.serialNumber,
        device_status: validatedFields.data.deviceStatus,
        device_type: validatedFields.data.deviceType,
        black_toner_percentage: validatedFields.data.blackTonerPercentage,
        cyan_toner_percentage: validatedFields.data.cyanTonerPercentage,
        magenta_toner_percentage: validatedFields.data.magentaTonerPercentage,
        yellow_toner_percentage: validatedFields.data.yellowTonerPercentage,
        app_type: validatedFields.data.appType,
        black_drum_percentage: validatedFields.data.blackDrumPercentage,
        cyan_drum_percentage: validatedFields.data.cyanDrumPercentage,
        magenta_drum_percentage: validatedFields.data.magentaDrumPercentage,
        yellow_drum_percentage: validatedFields.data.yellowDrumPercentage,
        client_name: validatedFields.data.clientId,
        user_name: name,
        company_code: companyCode,
        ip_address: ipAddress,
    };

    try {
        const resp = await fetch(`${BASE_PATH}/api/devices/modify`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session_token': token ?? "",
            },
            body: JSON.stringify(inputData),
        });
        const response = await resp.json();
        console.log('modifyDevice / response :', response);
        if(response.ResultCode !== "0") {
            return {
                message: response.ErrorMessage
            } as DeviceState;
        };
    } catch (err) {
        console.error(`\t[ modify device ] Error : ${err}`);
        return {
            message: "failed_to_save_data"
        } as DeviceState;
    };

    revalidatePath("/device");
    redirect("/device");
};


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