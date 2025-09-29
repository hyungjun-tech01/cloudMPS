import { useActionState, useState } from 'react';
import { AgreementState } from './register-form';


export default function RegisterTermsOfService({
    userType, trans, terms, action
}: {
    userType: "company" | "person",
    trans: Record<string, string>,
    terms: {
        terms_of_service: string[][];
        privacy_policy: string[][];
        location_info_policy: string[][];
        event_promotion_policy: string[][];
    }
    action: (prevState: void | AgreementState, formData: FormData) => void | AgreementState,
}) {
    const initialState: AgreementState = { message: null, errors: {} };
    const [state, formAction] = useActionState(action, initialState);
    const [agreed, setAgreed] = useState(0);

    const handleAgreeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const CBTermsOfService = document.getElementById('agree_terms_of_service') as HTMLInputElement;
        const CBPrivacy = document.getElementById('agree_privacy_policy') as HTMLInputElement;
        const CBPosition = document.getElementById('agree_location_info_policy') as HTMLInputElement;
        const CBEventPromotion = document.getElementById('agree_event_promotion_policy') as HTMLInputElement;
        if (event.target.checked) {
            if (!!CBTermsOfService) CBTermsOfService.checked = true;
            if (!!CBPrivacy) CBPrivacy.checked = true;
            if (!!CBPosition) CBPosition.checked = true;
            if (!!CBEventPromotion) CBEventPromotion.checked = true;
            setAgreed(15);
        } else {
            if (!!CBTermsOfService) CBTermsOfService.checked = false;
            if (!!CBPrivacy) CBPrivacy.checked = false;
            if (!!CBPosition) CBPosition.checked = false;
            if (!!CBEventPromotion) CBEventPromotion.checked = false;
            setAgreed(0);
        }
    };
    const handleCheckAgreed = (value: number) => {
        setAgreed(value);
        const agreeAllEl = document.getElementById("agree_all") as HTMLInputElement;
        if (!!agreeAllEl) {
            if (value === 15) {
                agreeAllEl.checked = true;
            } else {
                if (agreeAllEl.checked) agreeAllEl.checked = false;
            }
        }
    };
    const handleAgreeTermsOfService = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.checked ? agreed | 1 : agreed & ~(1)
        handleCheckAgreed(updated);
    };
    const handleAgreePrivacyPolicy = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.checked ? agreed | 2 : agreed & ~(2);
        handleCheckAgreed(updated);
    };
    const handleAgreeLocationInfoPolicy = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.checked ? agreed | 4 : agreed & ~(4);
        handleCheckAgreed(updated);
    };
    const handleAgreeEventPolicy = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.checked ? agreed | 8 : agreed & ~(8);
        handleCheckAgreed(updated);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formAction(new FormData(event.currentTarget));
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col'>
            <div className="mt-2 px-2 flex flex-row justify-start items-center">
                <input type="checkbox" id="agree_all" className='h-4 w-4' onChange={handleAgreeAll} />
                <label htmlFor="agree_all" className='ml-2'>{trans.agree_all}</label>
            </div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_terms_of_service" name="agree_terms_of_service" className='h-4 w-4' onChange={handleAgreeTermsOfService} />
                <label htmlFor="agree_terms_of_service" className='ml-2'>{trans.terms_of_service}</label>
                <div id="agree_privacy_policy-error" aria-live="polite" aria-atomic="true">
                    {!!state?.errors && !!state.errors['agreeTermsOfService'] &&
                        <div className="ml-4 text-sm text-red-500">
                            {state.errors.agreeTermsOfService}
                        </div>
                    }
                </div>
            </div>
            <div className='mt-2 w-full h-40 p-2 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm' >
                { terms.terms_of_service.map((item, idx) => <div key={idx} className="mb-4">{item.map((content: string, index: number) => <div key={index}>{content}</div>)}</div>)}
            </div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_privacy_policy" name="agree_privacy_policy" className='h-4 w-4' onChange={handleAgreePrivacyPolicy} />
                <label htmlFor="agree_privacy_policy" className='ml-2'>{trans.privacy_policy}</label>
                <div id="agree_privacy_policy-error" aria-live="polite" aria-atomic="true">
                    {!!state?.errors && !!state.errors['agreePrivacyPolicy'] &&
                        <div className="ml-4 text-sm text-red-500">
                            {state.errors.agreePrivacyPolicy}
                        </div>
                    }
                </div>
            </div>
            <div className='mt-2 w-full h-40 p-2 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm'>
                { terms.privacy_policy.map((item, idx) => <div key={idx} className="mb-4">{item.map((content: string, index: number) => <div key={index}>{content}</div>)}</div>)}
            </div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_location_info_policy" name="agree_location_info_policy" className='h-4 w-4' onChange={handleAgreeLocationInfoPolicy} />
                <label htmlFor="agree_location_info_policy" className='ml-2'>{trans.location_info_policy}</label>
                <div id="agree_privacy_policy-error" aria-live="polite" aria-atomic="true">
                    {!!state?.errors && !!state.errors['agreeLocationInfoPolicy'] &&
                        <div className="ml-4 text-sm text-red-500">
                            {state.errors.agreeLocationInfoPolicy}
                        </div>
                    }
                </div>
            </div>
            <div className='mt-2 w-full h-40 p-2 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm'>
                { terms.location_info_policy.map((item, idx) => <div key={idx} className="mb-4">{item.map((content: string, index: number) => <div key={index}>{content}</div>)}</div>)}
            </div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_event_promotion_policy" name="agree_event_promotion_policy" className='h-4 w-4' onChange={handleAgreeEventPolicy} />
                <label htmlFor="agree_event_promotion_policy" className='ml-2'>{trans.event_promotion_policy}</label>
            </div>
            <div className='mt-2 w-full h-40 p-2 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm'>
                { terms.event_promotion_policy.map((item, idx) => <div key={idx} className="mb-4">{item.map((content: string, index: number) => <div key={index}>{content}</div>)}</div>)}
            </div>
            <div id="input-error" aria-live="polite" aria-atomic="true">
                {!!state?.message &&
                    <p className="mt-2 text-sm text-red-500">
                        {state.message}
                    </p>
                }
            </div>
            <div className="flex justify-end mt-4">
                <button type="submit" className="flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-600">
                    {trans.next}
                </button>
            </div>
        </form>
    )
}
