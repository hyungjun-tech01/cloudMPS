'use client';

import { useActionState, useState } from 'react';
import { AgreementState, getAuthorization } from '@/app/libs/actions';


export default function AuthorizeForm({
    trans
}: {
    trans: Record<string, string>,
}) {
    const initialState: AgreementState = { message: null, errors: {} };
    const [state, formAction] = useActionState(getAuthorization, initialState);
    const [authCode, setAuthCode] = useState("      ");

    const handleAuthCode = (value: string, index: number) => {
        const newVal = authCode.substring(0, index) + value + authCode.substring(index + 1);
        setAuthCode(newVal);
        const nextInput = document.getElementById(`auth_code_${index + 1}`);
        if (nextInput) {
            nextInput.focus();
        }
    }

    return (
        <form action={formAction} className='flex flex-col justify-center items-center gap-4'>
            <div>
                {trans.input_auth_code}
            </div>
            <div className='mt-2 px-2 flex flex-row justify-center items-center gap-2'>
                <input id="auth_code_0" className="w-12 h-12 text-center text-xl border border-slate-200 rounded-md" type="text" onChange={(e) => handleAuthCode(e.target.value, 0)} />
                <input id="auth_code_1" className="w-12 h-12 text-center text-xl border border-slate-200 rounded-md" type="text" onChange={(e) => handleAuthCode(e.target.value, 1)} />
                <input id="auth_code_2" className="w-12 h-12 text-center text-xl border border-slate-200 rounded-md" type="text" onChange={(e) => handleAuthCode(e.target.value, 2)} />
                <input id="auth_code_3" className="w-12 h-12 text-center text-xl border border-slate-200 rounded-md" type="text" onChange={(e) => handleAuthCode(e.target.value, 3)} />
                <input id="auth_code_4" className="w-12 h-12 text-center text-xl border border-slate-200 rounded-md" type="text" onChange={(e) => handleAuthCode(e.target.value, 4)} />
                <input id="auth_code_5" className="w-12 h-12 text-center text-xl border border-slate-200 rounded-md" type="text" onChange={(e) => handleAuthCode(e.target.value, 5)} />
            </div>
            <input type="hidden" name="auth_code" value={authCode} />
            <div className="flex justify-end mt-4">
                <button type="submit" className="flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-600">
                    {trans.submit}
                </button>
            </div>
        </form>
    )
}
