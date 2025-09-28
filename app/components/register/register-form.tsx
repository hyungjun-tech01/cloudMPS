"use client";

import { useActionState, useState } from "react";
import { z } from "zod";
import { Steps } from "antd";
import { register } from "@/app/libs/actions";
import "material-icons/iconfont/material-icons.css";

import RegisterTermsOfService from "./register-use-of-term";
import RegisterUserInfo from "./register-user-info";

enum RegisterStep {
  AGREEMENT = 0,
  INFORMATION = 1,
  COMPLETE = 2,
}

export type AgreementState = {
  errors?: {
    agreeTermsOfService?: string[];
    agreePrivacyPolicy?: string[];
    agreeLocationInfoPolicy?: string[];
  };
  message?: string | null;
};

export type RegisterPersonalUserState = {
  errors?: {
    userName?: string[];
    userFullName?: string[];
    userEmail?: string[];
    userPwdNew?: string[];
    userPwdNewAgain?: string[];
  };
  message?: string | null;
};

export type RegisterCompanyUserState = {
  errors?: {
    companyName?: string[];
    ceoName?: string[];
    companyRegistrationNo?: string[];
    userName?: string[];
    userEmail?: string[];
    userPwdNew?: string[];
    userPwdNewAgain?: string[];
  };
  message?: string | null;
};

export default function RegisterForm({
  userType,
  trans,
}: {
  userType: "company" | "personal";
  trans: Record<string, Record<string, string | string[]>>;
}) {
  const [agreed, setAgreed] = useState({
    termsOfService : false,
    privacyPolicy: false,
    locationInfoPolicy: false,
    eventPromotionPolicy: false,
  })

  // use of terms --------------------------------------------------------------------
  const actionAgreement = (
    prevState: void | AgreementState,
    formData: FormData
  ) => {
    const agreeTermsOfService = formData.get("agree_terms_of_service");
    const agreePrivacyPolicy = formData.get("agree_privacy_policy");
    const agreeLocationInfoPolicy = formData.get("agree_location_info_policy");
    const agreeEventPromotionPolicy = formData.get(
      "agree_event_promotion_policy"
    );

    // check if necessary agreements are done ----------------------------------------
    if (!agreeTermsOfService || !agreePrivacyPolicy || !agreeLocationInfoPolicy) {
      return {
        errors: {
          agreeTermsOfService: [trans.register.error_need_agree],
          agreePrivacyPolicy: [trans.register.error_need_agree],
          agreeLocationInfoPolicy: [trans.register.error_need_agree],
        },
        message: trans.register.error_omit_required_agreement,
      } as AgreementState;
    }

    const updatedAgreed = {
      termsOfService : !!agreeTermsOfService,
      privacyPolicy: !!agreePrivacyPolicy,
      locationInfoPolicy: !!agreeLocationInfoPolicy,
      eventPromotionPolicy: !!agreeEventPromotionPolicy,
    };

    setAgreed(updatedAgreed);
    handleNextStep();
  };

  // user information ------------------------------------------------------------------
  const PersonalUserFormSchema = z.object({
    userName: z.string().min(1, {
        error: (issue) => {
          if(issue.input === undefined) {
            return trans.user.error_miss_input as string;
          } else if(issue.code ==="too_small") {
            return trans.user.error_miss_input as string;
          } else {
            return  trans.user.error_input_type_string as string;
          }
        }
      }),
    userFullName: z.string({
        error: trans.user.error_input_type_string as string,
      }),
    userEmail: z.email({
        error: trans.user.error_input_type_email as string,
      }),
    userPwdNew: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.user.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      }),
    userPwdNewAgain: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.user.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      })
  });

  const CompanyUserFormSchema = z.object({
    userName: z.string().min(1, {
        error: (issue) => {
          if(issue.input === undefined) {
            return trans.user.error_miss_input as string;
          } else if(issue.code ==="too_small") {
            return trans.user.error_miss_input as string;
          } else {
            return  trans.user.error_input_type_string as string;
          }
        }
      }),
    userFullName: z.string({
        error: trans.user.error_input_type_string as string,
      }),
    userEmail: z.email({
        error: trans.user.error_input_type_email as string,
      }),
    userPwdNew: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.user.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      }),
    userPwdNewAgain: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.user.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      })
  });

  const actionRegisterUser = (
    prevState: void | RegisterPersonalUserState | RegisterCompanyUserState,
    formData: FormData
  ) => {
    let validatedFields = null;
    if (userType === "company") {
      validatedFields = CompanyUserFormSchema.safeParse({

      });
      if (!validatedFields.success) {
        return {
          errors: z.treeifyError(validatedFields.error).errors,
          message: trans.user.errors_in_inputs,
        };
      };
    } else {
      validatedFields = PersonalUserFormSchema.safeParse({
        userName: formData.get("userName"),
        userFullName: formData.get("userFullName"),
        userEmail: formData.get("userEmail"),
        userPwd: formData.get("userPwdNew"),
        userPwdAgain: formData.get("userPwdNewAgain"),
      });
    };

    if (!validatedFields.success) {
      return {
        errors: z.treeifyError(validatedFields.error).errors,
        message: trans.user.errors_in_inputs,
      };
    };

    // check if passwords are same ----------------------------------------
    const { userPwdNew, userPwdNewAgain } = validatedFields.data;
    if (userPwdNew !== userPwdNewAgain) {
      return {
        errors: {
          userPwd: trans.register.error_pwd_mismatch
        },
        message: trans.register.error_pwd_mismatch,
      } as RegisterPersonalUserState | RegisterCompanyUserState;
    };
  };

  // control ---------------------------------------------------------------------------
  const [registerStep, setRegisterStep] = useState<RegisterStep>(
    RegisterStep.AGREEMENT
  );

  const handleNextStep = () => {
    setRegisterStep(registerStep + 1);
  };
  const handlePrevStep = () => {
    setRegisterStep(registerStep - 1);
  };

  const registerSteps = [
    {
      title: trans.register.agreement,
      content: (
        <RegisterTermsOfService
          trans={trans}
          userType={userType}
          action={actionAgreement}
        />
      ),
    },
    {
      title: trans.register.information,
      content: (
        <RegisterUserInfo
          userType={userType}
          trans={trans}
          agreements={agreed}
          action={actionRegisterUser}
          goback={handlePrevStep}
        />
      ),
    },
    {
      title: trans.register.complete,
      content: "Complete",
    },
  ];

  const items = registerSteps.map((step) => ({
    key: step.title,
    title: step.title,
  }));

  return (
    <div className="flex-1 rounded-b-lg bg-gray-50 px-6 pb-4 pt-8">
      <Steps current={registerStep} items={items} responsive />
      <div className="mt-8">{registerSteps[registerStep].content}</div>
    </div>
  );
}
