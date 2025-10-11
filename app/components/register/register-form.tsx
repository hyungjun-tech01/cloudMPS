"use client";

import { useState } from "react";
import Link from 'next/link';
import { z } from "zod";
import { Steps } from "antd";

import RegisterTermsOfService from "./register-use-of-term";
import RegisterUserInfo from "./register-user-info";

enum RegisterStep {
  AGREEMENT = 0,
  INFORMATION = 1,
  COMPLETE = 2,
}

export type AgreementState = {
  errors?: {
    agreeTermsOfService?: string;
    agreePrivacyPolicy?: string;
    agreeLocationInfoPolicy?: string;
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
  searchResult,
  trans,
  terms,
}: {
  userType: "company" | "person";
  searchResult: object[] | null;
  trans: { company: Record<string, string>,
    register: Record<string, string>,
    user: Record<string, string>
  };
  terms: {
    terms_of_service: string[][];
    privacy_policy: string[][];
    location_info_policy: string[][];
    event_promotion_policy: string[][];
  }
}) {
  const [agreed, setAgreed] = useState({
    termsOfService : false,
    privacyPolicy: false,
    locationInfoPolicy: false,
    eventPromotionPolicy: false,
  })

  const loginLink = userType === "company" ? "/login?userType=company" : "/login?userType=person";

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
    const check_errors: Record<string, string> = {};
    if (!agreeTermsOfService) {
      check_errors["agreeTermsOfService"] = trans.register.error_need_agree;
    };
    if(!agreePrivacyPolicy) {
      check_errors["agreePrivacyPolicy"] = trans.register.error_need_agree;
    };
    if(!agreeLocationInfoPolicy) {
      check_errors["agreeLocationInfoPolicy"] = trans.register.error_need_agree;
    }
    if (Object.keys(check_errors).length > 0) {
      return {
        errors: check_errors,
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
    userFullName: z.string().min(1, {
        error: trans.register.error_miss_input as string,
      }),
    userEmail: z.email({
        error: trans.register.error_input_type_email as string,
      }),
    userPwdNew: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.register.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      }),
    userPwdNewAgain: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.register.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      })
  });

  const CompanyUserFormSchema = z.object({
    companyName: z.string().trim().min(1, {
      error: (issue) => {
        if(issue.input === undefined) {
          return trans.register.error_miss_input as string;
        } else if(issue.code ==="too_small") {
          return trans.register.error_miss_input as string;
        } else {
          return  trans.register.error_input_type_string as string;
        }
      }
    }),
    ceoName: z.string().min(1, {
      error: (issue) => {
        if(issue.input === undefined) {
          return trans.register.error_miss_input as string;
        } else if(issue.code ==="too_small") {
          return trans.register.error_miss_input as string;
        } else {
          return  trans.register.error_input_type_string as string;
        }
      }
    }),
    companyRegistrationNo: z.string().min(1, {
      error: (issue) => {
        if(issue.input === undefined) {
          return trans.register.error_miss_input as string;
        } else if(issue.code ==="too_small") {
          return trans.register.error_miss_input as string;
        } else {
          return  trans.register.error_input_type_string as string;
        }
      }
    }),
    userName: z.string().min(1, {
        error: (issue) => {
          if(issue.input === undefined) {
            return trans.register.error_miss_input as string;
          } else if(issue.code ==="too_small") {
            return trans.register.error_miss_input as string;
          } else {
            return  trans.register.error_input_type_string as string;
          }
        }
      }),
    userEmail: z.email({
        error: trans.register.error_input_type_email as string,
      }),
    userPwdNew: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.register.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      }),
    userPwdNewAgain: z.string().min(6, {
      error: (issue) => issue.input === undefined ?
        trans.register.error_miss_input as string:
        trans.register.error_pwd_min_legnth as string
      })
  });

  const actionRegisterUser = async (
    prevState: void | RegisterPersonalUserState | RegisterCompanyUserState,
    formData: FormData
  ) => {
    console.log("actionRegisterUser called");
    const userType = formData.get("userType");
    console.log("actionRegisterUser / userType :", userType);

    let validatedFields = null;
    if (userType === "company") {
      validatedFields = CompanyUserFormSchema.safeParse({
        companyName: formData.get('companyName'),
        ceoName: formData.get('ceoName'),
        companyRegistrationNo: formData.get('companyRegistrationNo'),
        userName: formData.get('userName'),
        userEmail: formData.get('userEmail'),
        userPwdNew: formData.get('userPwdNew'),
        userPwdNewAgain: formData.get('userPwdNewAgain'),
      });
    } else {
      validatedFields = PersonalUserFormSchema.safeParse({
        userName: formData.get("userName"),
        userFullName: formData.get("userFullName"),
        userEmail: formData.get("userEmail"),
        userPwdNew: formData.get("userPwdNew"),
        userPwdNewAgain: formData.get("userPwdNewAgain"),
      });
    };

    if (!validatedFields.success) {
      const tree = z.treeifyError(validatedFields.error);
      console.log("actionRegisterUser / error :", tree);
      return {
        errors: tree.properties,
        message: trans.register.errors_in_inputs,
      } as RegisterPersonalUserState | RegisterCompanyUserState;
    };

    // check if passwords are same ----------------------------------------
    const { userPwdNew, userPwdNewAgain } = validatedFields.data;
    if (userPwdNew !== userPwdNewAgain) {
      return {
        errors: [
          {userPwdNew: trans.register.error_pwd_mismatch}
        ],
        message: trans.register.error_pwd_mismatch,
      } as RegisterPersonalUserState | RegisterCompanyUserState;
    };

    const registerData = {
      ...validatedFields.data,
      agreements: agreed
    };

    console.log('Register :', registerData);

    // try {
    //   const resp = await fetch(`${BASE_PATH}/user/signup_request`, {
    //     method: 'post',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(registerData)
    //   });

    //   const result = await resp.json();
    //   if(!!result) {
    //     if(result["ResultCode"] === 0) {
    //       // Succeeded ---------------------------
          handleNextStep();
          return;
    //     } else {
    //       return {
    //         message: result["ErrorMessage"]
    //       } as RegisterCompanyUserState | RegisterPersonalUserState;  
    //     };
    //   } else {
    //     return {
    //       message: "No Response from server"
    //     } as RegisterCompanyUserState | RegisterPersonalUserState;
    //   }
    // } catch(err) {
    //   console.error(`\t[ Regsiter ] Error : ${err}`);
    //   return {
    //     message: err
    //   } as RegisterCompanyUserState | RegisterPersonalUserState;
    // }
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
          trans={trans.register}
          terms={terms}
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
          searchResult={searchResult}
          trans={trans}
          agreements={agreed}
          action={actionRegisterUser}
          goback={handlePrevStep}
        />
      ),
    },
    {
      title: trans.register.complete,
      content: <>
        <div className="p-8 flex justify-center items-center text-2xl">{trans.register.complete}</div>
        <Link href={loginLink} className="p-4 flex justify-center items-center text-blue-500">{trans.register.login_next}</Link>
      </>,
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
