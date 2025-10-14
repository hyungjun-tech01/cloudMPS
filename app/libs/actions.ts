'use server';

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
import { AuthError } from 'next-auth';
// import { z } from "zod";

import { signIn, signOut } from '@/auth';
import { BASE_PATH } from './constants';
import { UserData, LoginData } from './types';


export async function logout() {
    await signOut({ redirectTo: '/login' });
};

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
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

export const fetchIp = async (callback:(ip: string) => void) => {
    try {
        const res = await fetch('/api/get-ip');
        const data = await res.json();
        callback(data.ip);
    } catch (error) {
        console.error('IP 가져오기 실패:', error);
        return null;
    }
};

// ----------- Login ----------------------------------------------------------------
export async function login(data: LoginData) {
    try {
        const resp = await fetch(`${BASE_PATH}/api/users/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
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