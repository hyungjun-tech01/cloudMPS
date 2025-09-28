'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from 'next-auth';
import { z } from "zod";

import { signIn, signOut } from '@/auth';
import { BASE_PATH } from './constans';
import { UserData } from './types';


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

// ----------- Register -------------------------------------------------------------
export async function register(registerData: UserData) {
    console.log('[ Register ]', registerData);
    // Server is not ready yet
    // try {
    //     const resp = await fetch(`${BASE_PATH}/users/signup_request`, {
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(registerData),
    //     });
    // } catch (err) {
    //     console.error(`\t[ Regsiter ] Error : ${err}`);
    //     return false;
    // };
};