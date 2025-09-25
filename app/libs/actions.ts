'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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
export type RegisterState = {
    errors?: {
        userName?: string[];
        userPassword?: string[];
        userPasswordConfirm?: string[];
        userType?: string[];
    };
    message?: string | null;
};

export async function register(prevState: void | RegisterState, formData: FormData) {
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
        throw error;
    }
};