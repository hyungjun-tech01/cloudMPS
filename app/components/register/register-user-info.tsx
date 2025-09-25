import clsx from 'clsx'; 
import { IEditItem, ISection } from '@/app/libs/types';
import { EditItem } from '../edit-items';


export default function RegisterUserInfo({
    userType, trans 
}: {
    userType: "company" | "personal",
    trans: Record<string, Record<string, string | string[]>>
}) {
    const formItems: ISection[] = [
        {
            title: trans.user.secTitle_details, description: trans.user.user_edit_details_description, items: [
                { name: 'userName', title: "ID", type: 'input', defaultValue: "", placeholder: trans.user.placeholder_user_name },
                { name: 'userFullName', title: trans.user.full_name, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_full_name },
                { name: 'userEmail', title: trans.user.email, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_email },
                { name: 'userHomeDirectory', title: trans.user.home_directory, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_home_directory },
                {
                    name: 'userDisabledPrinting', title: trans.user.enable_disable_printing, type: 'select', defaultValue: "N", options: [
                        { title: trans.user.enable_printing, value: 'N' },
                        { title: trans.user.disable_printing, value: 'Y' }
                    ]
                },
                { name: 'userNotes', title: trans.user.note, type: 'input', defaultValue: "", placeholder: "" },
            ]
        },
        {
            title: trans.user.secTitle_account_details, description: trans.user.user_edit_account_description, items: [
                { name: 'userBalanceCurrent', title: trans.user.balance_current, type: 'currency', defaultValue: 0, placeholder: trans.user.placeholder_balance_initial },
            ]
        },
        {
            title: trans.user.secTitle_etc, description: trans.user.user_edit_account_description, items: [
                { name: 'userDepartment', title: trans.user.department, type: 'input', defaultValue: "" },
                { name: 'userCardNumber', title: trans.user.card_number, type: 'input', defaultValue: "" },
                { name: 'userCardNumber2', title: trans.user.card_number2, type: 'input', defaultValue: "" },
            ]
        },
    ];

    return (
        <div className="rounded-xl bg-slate-100 p-4 md:p-6">
        {formItems.map((sec: ISection, idx) => {
          return (
            <div key={idx} className={clsx('w-full p-2 flex flex-col md:flex-row',
              { 'border-b': idx !== formItems.length - 1 }
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
