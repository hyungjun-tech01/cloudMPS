'use client';

import { useActionState, useState } from 'react';
import { z } from "zod";
import { Steps } from 'antd';
import { RegisterState } from '@/app/libs/actions';
import 'material-icons/iconfont/material-icons.css';

import RegisterUseOfTerm from './register-use-of-term';
import RegisterUserInfo from './register-user-info';

enum RegisterStep {
  AGREEMENT = 0,
  INFORMATION = 1,
  COMPLETE = 2
};

export type AgreementState = {
  errors?: {
    agreeUseOfTerm?: string[];
    agreePrivacyPolicy?: string[];
    agreePositionPolicy?: string[];
  };
  message?: string | null;
};



export default function RegisterForm({
  userType,
  trans,
  action
}: {
  userType: "company" | "personal";
  trans: Record<string, Record<string, string | string[]>>
  action: (prevState: void | RegisterState, formData: FormData) => Promise<void>
}) {
  const [errorMessage, formAction, isPending] = useActionState(action, undefined);
  
  // use of terms --------------------------------------------------------------------
  const [agreements, setAgreements] = useState<number>(0);

  const actionAgreement = (prevState: void | AgreementState, formData: FormData) => {
    const agreeUseOfTerm = formData.get("agree_use_of_term");
    const agreePrivacyPolicy = formData.get("agree_privacy_policy");
    const agreePositionPolicy = formData.get("agree_position_policy");
    const agreeEventPromotionPolicy = formData.get("agree_event_promotion_policy");

    if (!agreeUseOfTerm || !agreePrivacyPolicy || !agreePositionPolicy) {
      return {
        errors: {
          agreeUseOfTerm: [trans.register.error_need_agree],
          agreePrivacyPolicy: [trans.register.error_need_agree],
          agreePositionPolicy: [trans.register.error_need_agree],
        },
        message: trans.register.error_omit_required_agreement,
      } as AgreementState;
    };

    let updatedUseOfTerm = 0;
    updatedUseOfTerm += agreeUseOfTerm ? 1 : 0;
    updatedUseOfTerm += agreePrivacyPolicy ? 2 : 0;
    updatedUseOfTerm += agreePositionPolicy ? 4 : 0;
    updatedUseOfTerm += agreeEventPromotionPolicy ? 8 : 0;
    setAgreements(updatedUseOfTerm);

    setRegisterStep(registerStep + 1);
  };

  // user information ------------------------------------------------------------------

  const [registerStep, setRegisterStep] = useState<RegisterStep>(RegisterStep.AGREEMENT);

  const registerSteps = [
    {
      title: trans.register.agreement,
      content: <RegisterUseOfTerm trans={trans} userType={userType} action={actionAgreement} />
    },
    {
      title: trans.register.information,
      content: <RegisterUserInfo trans={trans} userType={userType} />
    },
    {
      title: trans.register.complete,
      content: 'Complete',
    }
  ];

  const handleNextStep = () => {
    setRegisterStep(registerStep + 1);
  }
  const handlePrevStep = () => {
    setRegisterStep(registerStep - 1);
  }
  

  const items = registerSteps.map((step) => ({ key: step.title, title: step.title }));

  return (
    <form action={formAction} >
      <div className="flex-1 rounded-b-lg bg-gray-50 px-6 pb-4 pt-8">
        <input type="hidden" name="agreements" value={agreements} />
        <Steps current={registerStep} items={items} responsive />
        <div className="mt-8">{registerSteps[registerStep].content}</div>
        <div className="flex h-8 items-end space-x-1">
          {!!errorMessage && (
            <>
              <span className='material-icons h-5 w-5 text-red-500'>error_outline</span>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
