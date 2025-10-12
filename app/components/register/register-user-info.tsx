'use client';

import { useActionState, useEffect, useState } from "react";
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import clsx from "clsx";
import { getAllTimezones, getCountriesForTimezone } from "countries-and-timezones";
import type { ICountry, TLanguageCode } from 'countries-list'
import { getCountryData, countries, languages } from "countries-list";
import { IEditItem, ISection } from "@/app/libs/types";
import { EditItem } from "../edit-items";
import {
  RegisterPersonalUserState,
  RegisterCompanyUserState,
} from "./register-form";
import Search from "@/app/components/register/searchCompany";


interface SearchCompnayDataType {
  key: React.Key;
  company_code: string;
  company_name: string;
  address: string;
}


export default function RegisterUserInfo({
  userType,
  searchResult,
  trans,
  agreements,
  action,
  goback,
}: {
  userType: "company" | "person";
  searchResult: SearchCompnayDataType[] | null;
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
  const [haveCompanyCode, setHaveCompanyCode] = useState(false);
  const [formItems, setFormItems] = useState<ISection[]>([]);

  const CountryList:{title:string, value:string}[] = [];
  const CurrencyList:{title:string, value:string}[] = [];
  for(const [key, data] of Object.entries(countries)) {
    CountryList.push({title:data.name, value: key});

    for(const val of data.languages) {
      const foundIdx = CurrencyList.findIndex(item => item.value === val);
      if(foundIdx === -1) {
        CurrencyList.push({title: val, value: val});
      }
    };
  };

  const LanguageList:{title:string, value:string}[] = [];
  for(const [key, data] of Object.entries(languages)) {
    LanguageList.push({title: data.native, value: key});
  };

  const handleSelectTimeZone = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const tempCountryList:{title:string, value:string}[] = [];
    let tempLangList:string[] = [];
    let tempCurrencyList:string[] = [];

    const tempCountries = getCountriesForTimezone(event.target.value);
    tempCountries.forEach(country => {
      const foundCountry = countries[country.id];
      if(!!foundCountry) {
        tempCountryList.push({title: foundCountry.name, value: country.id});
      }
      
      tempLangList = [...tempLangList, ...foundCountry.languages];
      tempCurrencyList = [...tempCurrencyList, ...foundCountry.currency]
    });

    // Update options for country selection -------------------------------------------------
    const selectCountryElem = document.getElementById('companyCountry') as HTMLSelectElement;
    selectCountryElem.length = 0;

    for(let i=0; i<tempCountryList.length; i++) {
      selectCountryElem.options[i] = new Option(tempCountryList[i].title, tempCountryList[i].value);
    };

    // Update options for language selection -------------------------------------------------
    const selectLanguageElem = document.getElementById('language') as HTMLSelectElement;
    selectLanguageElem.length = 0;

    for(let i=0; i<tempLangList.length; i++) {
      const tempLang = languages[tempLangList[i] as TLanguageCode];
      selectLanguageElem.options[i] = new Option(tempLang.native, tempLangList[i]);
    };

    // Update options for currency selection -------------------------------------------------
    const selectCurrencyElem = document.getElementById('currencyCode') as HTMLSelectElement;
    selectCurrencyElem.length = 0;

    for(let i=0; i<tempCurrencyList.length; i++) {
      selectCurrencyElem.options[i] = new Option(tempCurrencyList[i], tempCurrencyList[i]);
    }
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    console.log("handleSelectCountry :", event.target.value);
  };

  const handleSelectLanguage = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    console.log("handleSelectLanguage :", event.target.value);
  };

  const handleSelectCurrency = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    console.log("handleSelectCurrency :", event.target.value);
  };

  // const ItemsOfNoCompanyCode : ISection[] = [
  //   {
  //     title: trans.company.secTitle_company_info,
  //     description: "",
  //     items: [
  //       {
  //         name: "companyType",
  //         title: trans.company.company_type,
  //         type: "select",
  //         defaultValue: "",
  //         options: [ 
  //           { title: trans.company.general_company, value: 'GENERAL' },
  //           { title: trans.company.partner_company, value: 'PARTNER' }
  //         ]
  //       },
  //       {
  //         name: "companyName",
  //         title: trans.company.company_name,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.company.placeholder_company_name,
  //       },
  //       {
  //         name: "companyRegistrationNo",
  //         title: trans.company.business_registration_code,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: "",
  //       },
  //       {
  //         name: "dealCompanyCode",
  //         title: trans.company.deal_company_code,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.company.placeholder_deal_company_code,
  //       },
  //       {
  //         name: "ceoName",
  //         title: trans.company.ceo_name,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: "",
  //       },
  //       {
  //         name: "timeZone",
  //         title: trans.common.time_zone,
  //         type: "select",
  //         defaultValue: "",
  //         options: [],
  //       },
  //       {
  //         name: "country",
  //         title: trans.common.country,
  //         type: "select",
  //         defaultValue: "",
  //         options: countryOptions,
  //       },
  //       {
  //         name: "language",
  //         title: trans.common.language,
  //         type: "select",
  //         defaultValue: "",
  //         options: [ { title: "한글", value: "ko" }, { title: "영어", value: "en" } ],
  //       },
  //       {
  //         name: "currencyCode",
  //         title: trans.common.currency,
  //         type: "select",
  //         defaultValue: "",
  //         options: [],
  //       },
  //       {
  //         name: "companyBusinessItem",
  //         title: trans.company.business_item,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: "",
  //       },
  //       {
  //         name: "companyBusinessType",
  //         title: trans.company.business_type,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: "",
  //       }
  //     ],
  //   },
  //   {
  //     title: trans.company.secTitle_manager_info,
  //     description: trans.user.user_edit_account_description,
  //     items: [
  //       {
  //         name: "userName",
  //         title: trans.user.user_name,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_full_name,
  //       },
  //       {
  //         name: "userEmail",
  //         title: trans.user.email,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_email,
  //       }
  //     ],
  //   },
  //   {
  //     title: trans.user.secTitle_password,
  //     description: "",
  //     items: [
  //       {
  //         name: "userPwdNew",
  //         title: trans.user.password,
  //         type: "password",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_password_new,
  //       },
  //       {
  //         name: "userPwdNewAgain",
  //         title: trans.user.password_again,
  //         type: "password",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_password_new_again,
  //       },
  //     ],
  //   },
  // ];

  // const ItemsOfHavingCompanyCode : ISection[]= [
  //   {
  //     title: trans.company.secTitle_company_info,
  //     description: "",
  //     items: [
  //       {
  //         name: "companyCode",
  //         title: trans.company.company_code,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.company.placeholder_company_code,
  //       },
  //       {
  //         name: "dealCompanyCode",
  //         title: trans.company.deal_company_code,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.company.placeholder_deal_company_code,
  //       }
  //     ],
  //   },
  //   {
  //     title: trans.company.secTitle_manager_info,
  //     description: trans.user.user_edit_account_description,
  //     items: [
  //       {
  //         name: "userName",
  //         title: trans.user.user_name,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_full_name,
  //       },
  //       {
  //         name: "userEmail",
  //         title: trans.user.email,
  //         type: "input",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_email,
  //       }
  //     ],
  //   },
  //   {
  //     title: trans.user.secTitle_password,
  //     description: "",
  //     items: [
  //       {
  //         name: "userPwdNew",
  //         title: trans.user.password,
  //         type: "password",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_password_new,
  //       },
  //       {
  //         name: "userPwdNewAgain",
  //         title: trans.user.password_again,
  //         type: "password",
  //         defaultValue: "",
  //         placeholder: trans.user.placeholder_password_new_again,
  //       },
  //     ],
  //   },
  // ];

  const ColumnsForSearchedCompany : TableColumnsType<SearchCompnayDataType> = [
    {
      title: trans.company.company_code,
      dataIndex: 'company_code',
      key: 'company_code',
    },
    {
      title: trans.company.company_name,
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: trans.company.address,
      dataIndex: 'address',
      key: 'address',
    }
  ];

  const rowSelection: TableProps<SearchCompnayDataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: SearchCompnayDataType[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setFormItems([{
        title: trans.company.secTitle_company_info,
        description: "",
        items: [
          {
            name: "companyCode",
            title: trans.company.company_code,
            type: "label",
            defaultValue: selectedRows[0].company_code,
          },
          {
            name: "companyName",
            title: trans.company.company_name,
            type: "label",
            defaultValue: selectedRows[0].company_name,
          },
          {
            name: "address",
            title: trans.company.address,
            type: "label",
            defaultValue: selectedRows[0].address,
          },
          {
            name: "dealCompanyCode",
            title: trans.company.deal_company_code,
            type: "input",
            defaultValue: "",
            placeholder: trans.company.placeholder_deal_company_code,
          }
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
          }
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
      }]);
    },
    getCheckboxProps: (record: SearchCompnayDataType) => ({
      disabled: record.company_name === 'Disabled User', // Column configuration not to be checked
      name: record.company_name,
    }),
  };
  
  const handleChangeHaveCompanyCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Change - have company code :", event.target.id);
    if(event.target.id === "rb_company_code_yes") {
      setHaveCompanyCode(true);
      setFormItems([]);
    } else {
      setHaveCompanyCode(false);
      setFormItems([...ItemsOfNoCompanyCode]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formAction(new FormData(event.currentTarget));
  };

  useEffect(() => {
    if(userType === 'person') {
      setFormItems([
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
      ]);
    } else {
      if(haveCompanyCode) {
        setFormItems([]);
      } else {
        setFormItems([
          {
            title: trans.company.secTitle_company_info,
            description: "",
            items: [
              {
                name: "companyType",
                title: trans.company.company_type,
                type: "select",
                defaultValue: "",
                options: [ 
                  { title: trans.company.general_company, value: 'GENERAL' },
                  { title: trans.company.partner_company, value: 'PARTNER' }
                ]
              },
              {
                name: "companyName",
                title: trans.company.company_name,
                type: "input",
                defaultValue: "",
                placeholder: trans.company.placeholder_company_name,
              },
              {
                name: "companyRegistrationNo",
                title: trans.company.business_registration_code,
                type: "input",
                defaultValue: "",
                placeholder: "",
              },
              {
                name: "dealCompanyCode",
                title: trans.company.deal_company_code,
                type: "input",
                defaultValue: "",
                placeholder: trans.company.placeholder_deal_company_code,
              },
              {
                name: "ceoName",
                title: trans.company.ceo_name,
                type: "input",
                defaultValue: "",
                placeholder: "",
              },
              {
                name: "timeZone",
                title: trans.common.time_zone,
                type: "select",
                defaultValue: "",
                onChange: handleSelectTimeZone,
                options: Object.values(getAllTimezones()).map(timezone => ({title: timezone.name, value: timezone.name})),
              },
              {
                name: "companyCountry",
                title: trans.common.country,
                type: "select",
                defaultValue: "",
                onChange: handleSelectCountry,
                options: CountryList,
              },
              {
                name: "language",
                title: trans.common.language,
                type: "select",
                defaultValue: "",
                onChange: handleSelectLanguage,
                options: LanguageList,
              },
              {
                name: "currencyCode",
                title: trans.common.currency,
                type: "select",
                defaultValue: "",
                onChange: handleSelectCurrency,
                options: CurrencyList,
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
              }
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
              }
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
        ]);
      }
    }
  }, [userType, haveCompanyCode]);

  return (
    <>
      { userType === 'company' && <div className="pl-4 flex gap-1 my-2">
          <input type="radio" id="rb_company_code_yes" name="rb_company_code" defaultChecked={haveCompanyCode} onChange={handleChangeHaveCompanyCode} />
          <label htmlFor="rb_company_code_yes" className="mr-4">{trans.company.company_code_exists}</label>
          <input type="radio" id="rb_company_code_no" name="rb_company_code" defaultChecked={!haveCompanyCode} onChange={handleChangeHaveCompanyCode} />
          <label htmlFor="rb_company_code_no">{trans.company.no_company_code}</label> 
        </div>
      }
      { !!haveCompanyCode && 
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 mb-4">
          <Search queryName="searchCompany" placeholder={trans.company.placeholder_company_code} buttonTitle={trans.common.search}/>
        </div>
      }
      {
        !!searchResult && 
          <div className="border border-slate-500 rounded-md mb-4">
            <Table 
              rowSelection={{ type: 'radio', ...rowSelection }}
              dataSource={searchResult}
              columns={ColumnsForSearchedCompany}
            />
          </div> 
      }
      <form onSubmit={handleSubmit} className="rounded-xl bg-slate-100 p-4 md:p-6">
        {formItems.map((sec: ISection, idx) => {
          return (
            <div
              key={idx}
              className={clsx("w-full p-2 flex flex-col md:flex-row", {
                "border-b": idx !== formItems.length - 1,
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
                    onChange={item.onChange}
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
    </>
  );
}
