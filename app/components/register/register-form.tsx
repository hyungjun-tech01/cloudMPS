'use client';

import { useActionState, useState } from 'react';
import { Button, Steps, theme } from 'antd';
import { authenticate, RegisterState } from '@/app/libs/actions';
import 'material-icons/iconfont/material-icons.css';

import RegisterUseOfTerm from './register-use-of-term';

enum RegisterStep {
  AGREEMENT = 0,
  INFORMATION = 1,
  COMPLETE = 2
};


export default function RegisterForm({
  userType,
  trans,
  action
}: {
  userType: "company" | "personal";
  trans: Record<string, string>
  action: (prevState: void | RegisterState, formData: FormData) => Promise<void>
}) {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const { token } = theme.useToken();
  const [registerStep, setRegisterStep] = useState<RegisterStep>(RegisterStep.AGREEMENT);
  const [aggreed, setAggreed] = useState<number>(0);

  const registerSteps = [
    {
      title: trans.agreement,
      content: <RegisterUseOfTerm userType={userType} trans={trans} />,
    },
    {
      title: trans.information,
      content: 'Information',
    },
    {
      title: trans.complete,
      content: 'Complete',
    }
  ];

  const handleNextStep = () => {
    setRegisterStep(registerStep + 1);
  }
  const handlePrevStep = () => {
    setRegisterStep(registerStep - 1);
  }

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const items = registerSteps.map((step) => ({ key: step.title, title: step.title }));

  return (
    <form action={formAction} >
      <div className="flex-1 rounded-b-lg bg-gray-50 px-6 pb-4 pt-8">
        <Steps current={registerStep} items={items} />
        <div style={contentStyle}>{registerSteps[registerStep].content}</div>
        <div className="flex mt-4">
          {registerStep < registerSteps.length - 1 && (
            <Button type="primary" onClick={() => handleNextStep()}>
              Next
            </Button>
          )}
          {registerStep === registerSteps.length - 1 && (
            <Button type="primary" onClick={() => alert('Processing complete!')}>
              Done
            </Button>
          )}
          {registerStep > 0 && (
            <Button className="my-0 mx-2" onClick={() => handlePrevStep()}>
              Previous
            </Button>
          )}
        </div>
        <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
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
