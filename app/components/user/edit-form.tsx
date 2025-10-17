'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { UserState } from '@/app/libs/types';
import { IButtonInfo, IEditItem, ISection } from '@/app/libs/types';
import { EditItem } from '@/app/components/edit-items';


export function EditForm({
  id,
  items,
  buttons,
  sessionUserName,
  action,
}: {
  id: string;
  items: ISection[];
  buttons?: IButtonInfo;
  sessionUserName: string;
  action: (id: string, prevState: void | UserState, formData: FormData)
    => Promise<UserState | void> | null;
}) {
  const initialState: UserState = { message: null, errors: {} };
  const updatedAction = action.bind(null, id);
  const [state, formAction] = useActionState(updatedAction, initialState);


  return (
    <form action={formAction}>
      <input type="hidden" name="updatedBy" value={""}/>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {items.map((sec: ISection, idx) => {
          return (
            <div key={idx} className={clsx('w-full p-2 flex flex-col md:flex-row',
              { 'border-b': idx !== items.length - 1 }
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
                    error={(!!state?.errors && !!state?.errors[item.name as keyof UserState['errors']])
                      ? state?.errors[item.name as keyof UserState['errors']]
                      : null
                    }
                  />
                )}
              </div>
            </div>
          )
        })}
        <div id="input-error" aria-live="polite" aria-atomic="true">
          {!!state?.message &&
            <p className="mt-2 text-sm text-red-500">
              {state.message}
            </p>
          }
        </div>
      </div>
      {!!buttons &&
        <div className="mt-6 flex justify-end gap-4">
          {!!buttons.cancel &&
            <Link
              href={buttons.cancel.link}
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              {buttons.cancel.title}
            </Link>
          }
          {!!buttons.go &&
            <button
              type="submit"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              {buttons.go.title}
            </button>
          }
        </div>
      }
    </form>
  );
}
