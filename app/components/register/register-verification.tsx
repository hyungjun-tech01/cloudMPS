import { useActionState } from 'react';
import { RegisterVerificationState } from './register-form';


export default function RegisterVerification({
    trans,
    action,
    goback,
}:{
    trans: Record<string, Record<string, string>>;
    action: (prevState: void | RegisterVerificationState, formData: FormData) => void | RegisterVerificationState;
    goback: () => void;
}) {
    const initialState: RegisterVerificationState = { message: null, errors: {} };
    const [state, formAction] = useActionState(action, initialState);
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formAction(new FormData(event.currentTarget));
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col'>
            <div className='justify-center'>
                <h3 className="">{trans.register.enter_verification_code}</h3>
                <div className='flex gap-4'>
                    <input name="code_1st" className='h-32 w-32 outline-2'/>
                    <input name="code_2nd" className='h-32 w-32 outline-2'/>
                    <input name="code_3rd" className='h-32 w-32 outline-2'/>
                    <input name="code_4th" className='h-32 w-32 outline-2'/>
                    <input name="code_5th" className='h-32 w-32 outline-2'/>
                    <input name="code_6th" className='h-32 w-32 outline-2'/>
                </div>
                <div className="flex justify-between mt-4">
                    <div 
                        className="flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-600"
                        onClick={goback}
                    >
                        {trans.register.previous}
                    </div>
                    <button type="submit" className="flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-600" aria-disabled={isPending}>
                        {trans.register.next}
                    </button>
                </div>
            </div>
        </form>
    )
}
