"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Steps } from "antd";

import { BASE_PATH } from "@/app/libs/constants";
import RegisterTermsOfService from "./register-use-of-term";
import RegisterUserInfo, { SearchCompnayDataType } from "./register-user-info";
import { fetchIp, register } from "@/app/libs/actions";

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
  searchResult: SearchCompnayDataType[] | null;
  trans: {
    company: Record<string, string>;
    register: Record<string, string>;
    user: Record<string, string>;
  };
  terms: {
    terms_of_service: string[][];
    privacy_policy: string[][];
    location_info_policy: string[][];
    event_promotion_policy: string[][];
  };
}) {
  const [agreed, setAgreed] = useState({
    termsOfService: false,
    privacyPolicy: false,
    locationInfoPolicy: false,
    eventPromotionPolicy: false,
  });

  const [userIp, setUserIp] = useState<string>("");

  const loginLink =
    userType === "company"
      ? "/login?userType=company&init=true"
      : "/login?userType=person&init=true";

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
    }
    if (!agreePrivacyPolicy) {
      check_errors["agreePrivacyPolicy"] = trans.register.error_need_agree;
    }
    if (!agreeLocationInfoPolicy) {
      check_errors["agreeLocationInfoPolicy"] = trans.register.error_need_agree;
    }
    if (Object.keys(check_errors).length > 0) {
      return {
        errors: check_errors,
        message: trans.register.error_omit_required_agreement,
      } as AgreementState;
    }

    const updatedAgreed = {
      termsOfService: !!agreeTermsOfService,
      privacyPolicy: !!agreePrivacyPolicy,
      locationInfoPolicy: !!agreeLocationInfoPolicy,
      eventPromotionPolicy: !!agreeEventPromotionPolicy,
    };

    setAgreed(updatedAgreed);
    handleNextStep();
  };

  // user information ------------------------------------------------------------------
  const PersonalUserFormSchema = z.object({
    userName: z
      .string()
      .min(1, { message: trans.user.error_miss_input as string }),
    userFullName: z
      .string()
      .min(1, { message: trans.register.error_miss_input as string }),
    userEmail: z
      .string()
      .email({ message: trans.register.error_input_type_email as string }),
    userPwdNew: z.string().min(6, {
      message: trans.register.error_pwd_min_legnth as string,
    }),
    userPwdNewAgain: z.string().min(6, {
      message: trans.register.error_pwd_min_legnth as string,
    }),
  });

  const CompanyUserFormSchema = z.object({
    companyType: z.enum(["GENERAL", "PARTNER"]),
    companyName: z
      .string()
      .trim()
      .min(1, {
        message: trans.register.error_miss_input as string,
      }),
    companyRegistrationNo: z.string().min(1, {
      message: trans.register.error_miss_input as string,
    }),
    dealCompanyCode: z.string(),
    ceoName: z
      .string()
      .min(1, { message: trans.user.error_miss_input as string }),
    timeZone: z.string(),
    companyCountry: z.string(),
    language: z.string(),
    currencyCode: z.string(),
    companyBusinessItem: z.string(),
    companyBusinessType: z.string(),
    userFullName: z
      .string()
      .min(1, { message: trans.user.error_miss_input as string }),
    userEmail: z.email({
      error: trans.register.error_input_type_email as string,
    }),
    userPwdNew: z.string().min(6, {
      error: (issue) =>
        issue.input === undefined
          ? (trans.register.error_miss_input as string)
          : (trans.register.error_pwd_min_legnth as string),
    }),
    userPwdNewAgain: z.string().min(6, {
      error: (issue) =>
        issue.input === undefined
          ? (trans.register.error_miss_input as string)
          : (trans.register.error_pwd_min_legnth as string),
    }),
  });

  const CompanyUserFormSchema2 = z.object({
    companyCode: z
      .string()
      .trim()
      .min(1, { message: trans.user.error_miss_input as string }),
    companyName: z
      .string()
      .trim()
      .min(1, { message: trans.user.error_miss_input as string }),
    dealCompanyCode: z.string(),
    userFullName: z
      .string()
      .min(1, { message: trans.user.error_miss_input as string }),
    userEmail: z.email({
      error: trans.register.error_input_type_email as string,
    }),
    userPwdNew: z.string().min(6, {
      error: (issue) =>
        issue.input === undefined
          ? (trans.register.error_miss_input as string)
          : (trans.register.error_pwd_min_legnth as string),
    }),
    userPwdNewAgain: z.string().min(6, {
      error: (issue) =>
        issue.input === undefined
          ? (trans.register.error_miss_input as string)
          : (trans.register.error_pwd_min_legnth as string),
    }),
  });

  const actionRegisterUser = async (
    prevState: void | RegisterPersonalUserState | RegisterCompanyUserState,
    formData: FormData
  ) => {
    //-----TEST : Start --------------------------------------
    // const tempTest = {
    //   "user_type": "COMPANY",
    //   "company_type": "GENERAL",
    //   "company_name": "(주)형성",
    //   "business_registration_code": "111-1111111-11111-11",
    //   "company_code": null,
    //   "deal_company_code": "",
    //   "ceo_name": "최형성",
    //   "language": "ko",
    //   "time_zone": "Asia/Seoul",
    //   "currency_code": "KRW",
    //   "country": "KR",
    //   "terms_of_service": "Y",
    //   "privacy_policy": "Y",
    //   "location_information": "Y",
    //   "notification_email": "N",
    //   "full_name": "최형성",
    //   "e_mail_adress": "newtons2002@gmail.com",
    //   "password": "test",
    //   "ip_address": "127.0.0.1"
    // };

    // const tempResult = await register(tempTest);
    // console.log("tempResult :", tempResult);
    // return;

    //-----TEST : End ----------------------------------------
    let validatedFields = null;
    if (userType === "company") {
      const companyCode = formData.get("companyCode");
      if (!companyCode) {
        validatedFields = CompanyUserFormSchema.safeParse({
          companyType: formData.get("companyType"),
          companyName: formData.get("companyName"),
          companyRegistrationNo: formData.get("companyRegistrationNo"),
          ceoName: formData.get("ceoName"),
          dealCompanyCode: formData.get("dealCompanyCode"),
          timeZone: formData.get("timeZone"),
          companyCountry: formData.get("companyCountry"),
          language: formData.get("language"),
          currencyCode: formData.get("currencyCode"),
          companyBusinessItem: formData.get("companyBusinessItem"),
          companyBusinessType: formData.get("companyBusinessType"),
          userFullName: formData.get("userFullName"),
          userEmail: formData.get("userEmail"),
          userPwdNew: formData.get("userPwdNew"),
          userPwdNewAgain: formData.get("userPwdNewAgain"),
        });
      } else {
        validatedFields = CompanyUserFormSchema2.safeParse({
          companyCode: formData.get("companyCode"),
          companyName: formData.get("companyName"),
          dealCompanyCode: formData.get("dealCompanyCode"),
          userFullName: formData.get("userFullName"),
          userEmail: formData.get("userEmail"),
          userPwdNew: formData.get("userPwdNew"),
          userPwdNewAgain: formData.get("userPwdNewAgain"),
        });
      }
    } else {
      validatedFields = PersonalUserFormSchema.safeParse({
        userFullName: formData.get("userFullName"),
        userEmail: formData.get("userEmail"),
        userPwdNew: formData.get("userPwdNew"),
        userPwdNewAgain: formData.get("userPwdNewAgain"),
      });
    }

    if (!!validatedFields && validatedFields.error) {
      const tree = z.treeifyError(validatedFields.error);
      // console.log("actionRegisterUser / error :", tree);
      return {
        errors: tree.properties,
        message: trans.register.errors_in_inputs,
      } as RegisterPersonalUserState | RegisterCompanyUserState;
    }

    // check if passwords are same ----------------------------------------
    const { userPwdNew, userPwdNewAgain } = validatedFields.data;
    if (userPwdNew !== userPwdNewAgain) {
      return {
        errors: [{ userPwdNew: trans.register.error_pwd_mismatch }],
        message: trans.register.error_pwd_mismatch,
      } as RegisterPersonalUserState | RegisterCompanyUserState;
    }

    const registerData = {
      user_type: userType.toUpperCase(),
      company_type: formData.get("companyType"),
      company_name: formData.get("companyName"),
      business_registration_code: formData.get("companyRegistrationNo"),
      company_code: formData.get("companyCode"),
      deal_company_code: formData.get("dealCompanyCode"),
      ceo_name: formData.get("ceoName"),
      language: formData.get("language"),
      time_zone: formData.get("timeZone"),
      currency_code: formData.get("currencyCode"),
      country: formData.get("companyCountry"),
      terms_of_service: agreed.termsOfService ? "Y" : "N",
      privacy_policy: agreed.privacyPolicy ? "Y" : "N",
      location_information: agreed.locationInfoPolicy ? "Y" : "N",
      notification_email: agreed.eventPromotionPolicy ? "Y" : "N",
      full_name: formData.get("userFullName"),
      e_mail_adress: formData.get("userEmail"),
      password: formData.get("userPwdNew"),
      ip_address: userIp,
    };

    // console.log('Register / data :', registerData);
    const result = await register(registerData);
    if (!!result) {
      if (result["ResultCode"] === 0) {
        // Succeeded ---------------------------
        handleNextStep();
        return;
      } else {
        return {
          message: result["ErrorMessage"],
        } as RegisterCompanyUserState | RegisterPersonalUserState;
      }
    } else {
      return {
        message: "No Response from server",
      } as RegisterCompanyUserState | RegisterPersonalUserState;
    }
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
      content: (
        <>
          <div className="p-8 flex justify-center items-center text-2xl">
            {trans.register.complete}
          </div>
          <Link
            href={loginLink}
            className="p-4 flex justify-center items-center text-blue-500"
          >
            {trans.register.go_to_verify}
          </Link>
        </>
      ),
    },
  ];

  const items = registerSteps.map((step) => ({
    key: step.title,
    title: step.title,
  }));

  useEffect(() => {
    fetchIp(setUserIp);
  }, []);

  return (
    <div className="flex-1 rounded-b-lg bg-gray-50 px-6 pb-4 pt-8">
      <Steps current={registerStep} items={items} responsive />
      <div className="mt-8">{registerSteps[registerStep].content}</div>
    </div>
  );
}
