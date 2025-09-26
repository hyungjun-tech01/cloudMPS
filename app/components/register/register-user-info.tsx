import clsx from 'clsx'; 
import { IEditItem, ISection } from '@/app/libs/types';
import { EditItem } from '../edit-items';


export default function RegisterUserInfo({
    userType, trans 
}: {
    userType: "company" | "personal",
    trans: Record<string, Record<string, string | string[]>>
}) {
    const formItems: { company : ISection[], personal : ISection[]} = {
      company : [
        {
            title: trans.company.secTitle_company_info,
            description: "",
            items: [
                { name: 'companyName', title: trans.company.company_name, type: 'input', defaultValue: "", placeholder: trans.company.placeholder_company_name },
                { name: 'ceoName', title: trans.company.ceo_name, type: 'input', defaultValue: "", placeholder: "" },
                { name: 'companyRegistrationNo', title: trans.company.business_registration_code, type: 'input', defaultValue: "", placeholder: "" },
                { name: 'companyBusinessItem', title: trans.company.business_item, type: 'input', defaultValue: "", placeholder: "" },
                { name: 'companyBusinessType', title: trans.company.business_type, type: 'input', defaultValue: "", placeholder: "" },
            ]
        },
        {
            title: trans.company.secTitle_manager_info, description: trans.user.user_edit_account_description, items: [
              { name: 'userName', title: trans.user.user_name, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_full_name },
              { name: 'userEmail', title: trans.user.email, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_email },
              { name: 'userDepartment', title: trans.user.department, type: 'input', defaultValue: "" },
            ]
        },
        {
          title: trans.user.secTitle_password, description: "",
          items: [
              { name: 'userPwdNew', title: trans.user.password, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new },
              { name: 'userPwdNewAgain', title: trans.user.password_again, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new_again },
          ]
        },
      ],
      personal: [
        {
            title: trans.user.secTitle_info,
            description: "",
            items: [
                { name: 'userName', title: trans.user.user_name, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_full_name },
                { name: 'userEmail', title: trans.user.email, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_email },
            ]
        },
        {
          title: trans.user.secTitle_password, description: "",
          items: [
              { name: 'userPwdNew', title: trans.user.password, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new },
              { name: 'userPwdNewAgain', title: trans.user.password_again, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new_again },
          ]
        },
      ]
    };

    return (
        <div className="rounded-xl bg-slate-100 p-4 md:p-6">
        {formItems[userType].map((sec: ISection, idx) => {
          return (
            <div key={idx} className={clsx('w-full p-2 flex flex-col md:flex-row',
              { 'border-b': idx !== formItems[userType].length - 1 }
            )}>
              <div className='w-full md:w-1/3 pb-4 md:pr-6'>
                <div className='mb-5 text-xl font-semibold'>{sec.title}</div>
                {typeof sec.description === 'string' &&
                  <div className='text-sm'>{sec.description}</div>
                }
                {Array.isArray(sec.description) &&
                  sec.description.map((item, idx) => {
                    if (idx !== (sec.description as string[]).length - 1) {
                      return <div key={idx} className='text-sm mb-4'>{item}</div>
                    } else {
                      return <div key={idx} className='text-sm'>{item}</div>
                    }
                  })
                }
              </div>
              <div className='w-full md:w-2/3'>
                {sec.items.map((item: IEditItem) =>
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
                    // error={(!!state?.errors && !!state?.errors[item.name as keyof UserState['errors']])
                    //   ? state?.errors[item.name as keyof UserState['errors']]
                    //   : null
                    // }
                    error={null}
                  />
                )}
              </div>
            </div>
          )
        })}
        {/* <div id="input-error" aria-live="polite" aria-atomic="true">
          {!!state?.message &&
            <p className="mt-2 text-sm text-red-500">
              {state.message}
            </p>
          }
        </div> */}
      </div>
    )
}
