import { useState } from 'react';

enum Agreed {
    None = 0,
    UseOfTerm = 1,
    PrivacyPolicy = 2,
    PositionPolicy = 4,
    EventPromotionPolicy = 8,
    All = 15,
}
export default function RegisterUseOfTerm({
    userType, trans 
}: {
    userType: "company" | "personal",
    trans: Record<string, Record<string, string>>
}) {
    const [agreed, setAgreed] = useState<number>(0);
    const handleAgreeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('agree_all');
        const CBUseOfTerm = document.getElementById('agree_use_of_term') as HTMLInputElement;
        const CBPrivacy = document.getElementById('agree_privacy_policy') as HTMLInputElement;
        const CBPosition = document.getElementById('agree_position_policy') as HTMLInputElement;
        const CBEventPromotion = document.getElementById('agree_event_promotion_policy') as HTMLInputElement;
        if(event.target.checked) {
            setAgreed(Agreed.All);
            if(!!CBUseOfTerm) CBUseOfTerm.checked = true;
            if(!!CBPrivacy) CBPrivacy.checked = true;
            if(!!CBPosition) CBPosition.checked = true;
            if(!!CBEventPromotion) CBEventPromotion.checked = true;
        } else {
            setAgreed(Agreed.None);
            if(!!CBUseOfTerm) CBUseOfTerm.checked = false;
            if(!!CBPrivacy) CBPrivacy.checked = false;
            if(!!CBPosition) CBPosition.checked = false;
            if(!!CBEventPromotion) CBEventPromotion.checked = false;
        }
    }
    const handleUseOfTermAgreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('use_of_terms : ', event.target.checked);
        setAgreed(event.target.checked ? agreed | Agreed.UseOfTerm : agreed & ~Agreed.UseOfTerm)
    }
    const handlePrivacyPolicyAgreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreed(event.target.checked ? agreed | Agreed.PrivacyPolicy : agreed & ~Agreed.PrivacyPolicy)
    }
    const handlePositionPolicyAgreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreed(event.target.checked ? agreed | Agreed.PositionPolicy : agreed & ~Agreed.PositionPolicy)
    }
    const handleEventPromotionPolicyAgreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreed(event.target.checked ? agreed | Agreed.EventPromotionPolicy : agreed & ~Agreed.EventPromotionPolicy)
    }

    return (
        <div className='flex flex-col'>
            <div className="mt-2 px-2 flex flex-row justify-start items-center">
                <input type="checkbox" id="agree_all" className='h-4 w-4' onChange={handleAgreeAll}/>
                <label htmlFor="agree_all" className='ml-2'>Agree All</label>
            </div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_use_of_term" className='h-4 w-4' onChange={handleUseOfTermAgreeChange}/>
                <label htmlFor="agree_use_of_term" className='ml-2'>Use of Term</label>
            </div>
            <div className='mt-2 w-full h-40 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm' >{trans.register.term_of_use}</div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_privacy_policy" className='h-4 w-4' onChange={handlePrivacyPolicyAgreeChange}/>
                <label htmlFor="agree_privacy_policy" className='ml-2'>Privacy Policy</label>
            </div>
            <div className='mt-2 w-full h-40 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm'>{trans.register.privacy_policy}</div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_position_policy" className='h-4 w-4' onChange={handlePositionPolicyAgreeChange}/>
                <label htmlFor="agree_position_policy" className='ml-2'>Position Policy</label>
            </div>
            <div className='mt-2 w-full h-40 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm'>{trans.register.position_policy}</div>
            <div className='mt-6 px-2 flex flex-row justify-start items-center w-full h-5'>
                <input type="checkbox" id="agree_event_promotion_policy" className='h-4 w-4' onChange={handleEventPromotionPolicyAgreeChange}/>
                <label htmlFor="agree_event_promotion_policy" className='ml-2'>Event & Promotion Policy</label>
            </div>
            <div className='mt-2 w-full h-40 bg-gray-100 overflow-auto border-[1px] border-gray-400 rounded-sm'>{trans.register.event_promotion_policy}</div>
        </div>
    )
}
