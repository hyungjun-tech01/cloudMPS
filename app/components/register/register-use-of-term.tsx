import { useState } from 'react';

enum Agreed {
    useOfTerm = 1,
    PrivacyPolicy = 2,
    PositionPolicy = 4,
    EventPromotionPolicy = 8,
    All = 15,
}
export default function RegisterUseOfTerm({
    userType, trans 
}: {
    userType: "company" | "personal",
    trans: Record<string, string>
}) {
    const [agreed, setAgreed] = useState<number>(0);
    const handleAgreeAll = () => {
        console.log('agree_all');
        setAgreed(Agreed.All)
    }
    const handleUseOfTermAgreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreed(event.target.checked ? agreed | Agreed.useOfTerm : agreed & ~Agreed.useOfTerm)
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
        <>
            <div>
                <input type="checkbox" id="agree_all" onChange={handleAgreeAll}/>
                <label htmlFor="agree_all">Agree All</label>
            </div>
            <div>
                <div className='flex flex-row justify-start items-center w-full h-5'>
                    <input type="checkbox" id="agree_use_of_term" onChange={handleUseOfTermAgreeChange}/>
                    <label htmlFor="agree_use_of_term">Use of Term</label>
                </div>
                <textarea className='w-full h-40' value={trans.term_of_use} />
            </div>
            <div>
                <div className='flex flex-row justify-start items-center w-full h-5'>
                    <input type="checkbox" id="agree_privacy_policy" onChange={handlePrivacyPolicyAgreeChange}/>
                    <label htmlFor="agree_privacy_policy">Privacy Policy</label>
                </div>
                <textarea className='w-full h-40' value={trans.privacy_policy} />
            </div>
            <div>
                <div className='flex flex-row justify-start items-center w-full h-5'>
                    <input type="checkbox" id="agree_position_policy" onChange={handlePositionPolicyAgreeChange}/>
                    <label htmlFor="agree_position_policy">Position Policy</label>
                </div>
                <textarea className='w-full h-40' value={trans.position_policy} />
            </div>
            <div>
                <div className='flex flex-row justify-start items-center w-full h-5'>
                    <input type="checkbox" id="agree_event_promotion_policy" onChange={handleEventPromotionPolicyAgreeChange}/>
                    <label htmlFor="agree_event_promotion_policy">Event Promotion Policy</label>
                </div>
                <textarea className='w-full h-40' value={trans.event_promotion_policy} />
            </div>
        </>
    )
}
