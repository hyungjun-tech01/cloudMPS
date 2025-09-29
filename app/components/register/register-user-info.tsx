import { useActionState } from "react";
import clsx from "clsx";
import { IEditItem, ISection } from "@/app/libs/types";
import { EditItem } from "../edit-items";
import {
  RegisterPersonalUserState,
  RegisterCompanyUserState,
} from "./register-form";


export default function RegisterUserInfo({
  userType,
  trans,
  agreements,
  action,
  goback,
}: {
  userType: "company" | "person";
  trans: Record<string, Record<string, string>>;
  agreements: {
    termsOfService: boolean,
    privacyPolicy: boolean,
    locationInfoPolicy: boolean,
    eventPromotionPolicy: boolean,
  };
  action: (
    prevState: void | RegisterPersonalUserState | RegisterCompanyUserState,
    formData: FormData,
  ) => Promise<void | RegisterPersonalUserState | RegisterCompanyUserState>;
  goback: () => void;
}) {
  const initialState: RegisterPersonalUserState | RegisterCompanyUserState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(action, initialState, undefined);
  
  const formItems: { company: ISection[]; person: ISection[] } = {
    company: [
      {
        title: trans.company.secTitle_company_info,
        description: "",
        items: [
          {
            name: "companyName",
            title: trans.company.company_name,
            type: "input",
            defaultValue: "",
            placeholder: trans.company.placeholder_company_name,
          },
          {
            name: "ceoName",
            title: trans.company.ceo_name,
            type: "input",
            defaultValue: "",
            placeholder: "",
          },
          {
            name: "companyRegistrationNo",
            title: trans.company.business_registration_code,
            type: "input",
            defaultValue: "",
            placeholder: "",
          },
          {
            name: "companyBusinessItem",
            title: trans.company.business_item,
            type: "input",
            defaultValue: "",
            placeholder: "",
          },
          {
            name: "companyBusinessType",
            title: trans.company.business_type,
            type: "input",
            defaultValue: "",
            placeholder: "",
          },
        ],
      },
      {
        title: trans.company.secTitle_manager_info,
        description: trans.user.user_edit_account_description,
        items: [
          {
            name: "userName",
            title: trans.user.user_name,
            type: "input",
            defaultValue: "",
            placeholder: trans.user.placeholder_full_name,
          },
          {
            name: "userEmail",
            title: trans.user.email,
            type: "input",
            defaultValue: "",
            placeholder: trans.user.placeholder_email,
          },
          {
            name: "userDepartment",
            title: trans.user.department,
            type: "input",
            defaultValue: "",
          },
        ],
      },
      {
        title: trans.user.secTitle_password,
        description: "",
        items: [
          {
            name: "userPwdNew",
            title: trans.user.password,
            type: "password",
            defaultValue: "",
            placeholder: trans.user.placeholder_password_new,
          },
          {
            name: "userPwdNewAgain",
            title: trans.user.password_again,
            type: "password",
            defaultValue: "",
            placeholder: trans.user.placeholder_password_new_again,
          },
        ],
      },
    ],
    person: [
      {
        title: trans.user.secTitle_info,
        description: "",
        items: [
          {
            name: "userName",
            title: "ID",
            type: "input",
            defaultValue: "",
            placeholder: trans.user.placeholder_user_name,
          },
          {
            name: "userFullName",
            title: trans.user.full_name,
            type: "input",
            defaultValue: "",
            placeholder: trans.user.placeholder_full_name,
          },
          {
            name: "userEmail",
            title: trans.user.email,
            type: "input",
            defaultValue: "",
            placeholder: trans.user.placeholder_email,
          },
        ],
      },
      {
        title: trans.user.secTitle_password,
        description: "",
        items: [
          {
            name: "userPwdNew",
            title: trans.user.password,
            type: "password",
            defaultValue: "",
            placeholder: trans.user.placeholder_password_new,
          },
          {
            name: "userPwdNewAgain",
            title: trans.user.password_again,
            type: "password",
            defaultValue: "",
            placeholder: trans.user.placeholder_password_new_again,
          },
        ],
      },
    ],
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formAction(new FormData(event.currentTarget));
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-slate-100 p-4 md:p-6">
      {formItems[userType].map((sec: ISection, idx) => {
        return (
          <div
            key={idx}
            className={clsx("w-full p-2 flex flex-col md:flex-row", {
              "border-b": idx !== formItems[userType].length - 1,
            })}
          >
            <div className="w-full md:w-1/3 pb-4 md:pr-6">
              <div className="mb-5 text-xl font-semibold">{sec.title}</div>
              {typeof sec.description === "string" && (
                <div className="text-sm">{sec.description}</div>
              )}
              {Array.isArray(sec.description) &&
                sec.description.map((item, idx) => {
                  if (idx !== (sec.description as string[]).length - 1) {
                    return (
                      <div key={idx} className="text-sm mb-4">
                        {item}
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="text-sm">
                        {item}
                      </div>
                    );
                  }
                })}
            </div>
            <div className="w-full md:w-2/3">
              {sec.items.map((item: IEditItem) => (
                <EditItem
                  key={item.name}
                  name={item.name}
                  title={item.title}
                  type={item.type}
                  defaultValue={item.defaultValue}
                  placeholder={item.placeholder}
                  options={item.options}
                  locale={item.locale}
                  chartData={item.chartData}
                  other={item.other}
                  errors={(!!state?.errors && !!state?.errors[item.name as 
                    keyof RegisterPersonalUserState['errors'] | keyof RegisterCompanyUserState['errors']])
                    ? state?.errors[item.name as
                      keyof RegisterPersonalUserState['errors'] | keyof RegisterCompanyUserState['errors']]["errors"]
                    : null
                  }
                />
              ))}
            </div>
          </div>
        );
      })}
      <div id="input-error" aria-live="polite" aria-atomic="true">
        {!!state?.message &&
          <p className="mt-2 text-sm text-red-500">
            {state.message}
          </p>
        }
      </div>
      <div>
        <input type="hidden" name="userType" value={userType } />
        <input type="hidden" name="termsOfService" value={agreements.termsOfService ? "Y" : "N" } />
        <input type="hidden" name="privacyPolicy" value={agreements.privacyPolicy ? "Y" : "N" } />
        <input type="hidden" name="locationPolicy" value={agreements.locationInfoPolicy ? "Y" : "N" } />
        <input type="hidden" name="eventPoromotionPolicy" value={agreements.eventPromotionPolicy ? "Y" : "N" } />
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
    </form>
  );
}
