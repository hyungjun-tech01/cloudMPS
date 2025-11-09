'use client';

import { useActionState } from 'react';
import { MemberState } from '@/app/libs/types';
import { registerMember } from '@/app/libs/actions';
import MaterialIcon from '@/app/components/materialIcon';


export function InviteForm({
  userData,
  trans,
}: {
  userData: {userName: string, companyType:string, companyCode?: number, ipAddress: string};
  trans: Record<string, string>;
}) {
  const initialState: MemberState = { message: null, errors: {} };
  const [state, formAction] = useActionState(registerMember, initialState);
  
  return (
    <form action={formAction}>
      <div className="my-4 rounded-lg bg-slate-100 p-4 flex flex-col">
        <div className="flex flex-row justify-between items-center md:p-6">
          <div className="flex items-center justify-between gap-4">
            <label className='font-medium' >{trans.userName}</label>
            <input name="userName" type="text"
              className='h-10 rounded-md bg-white border-2 border-slate-800 text-sm px-2'
            />
            <label className='font-medium' >{trans.userEmail}</label>
            <input name="userEmail" type="email"
              className='h-10 rounded-md bg-white border-2 border-slate-800 text-sm px-2'
            />
          </div>
          <button
            type="submit"
            className="flex h-10 items-center rounded-lg bg-slate-600 px-4 text-base font-medium text-white transition-colors hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            <span className="hidden md:block">{trans.invite}</span>{' '}
            <MaterialIcon name="add" props="h-5 md:ml-4" />
          </button>
        </div>
        {!!state?.errors &&
          Object.keys(state.errors).map(item =>
            state.errors[item].errors.map((err) =>
              <p className="ml-4 text-sm text-red-500" key={item} >
                {(trans[item] ?? item) + ":" + (trans[err] ?? err)}
              </p>
          ))
        }
      </div>
      <div id='input-error' aria-live="polite" aria-atomic="true">
        {!!state?.message &&
          <p className="my-2 ml-4 text-sm text-red-500" >
            {trans[state.message]?? state.message}
          </p>
        }
      </div>
      <input type="hidden" name="companyType" value={userData.companyType} />
      <input type="hidden" name="companyCode" value={userData.companyCode} />
      <input type="hidden" name="ipAddress" value={userData.ipAddress} />
      <input type="hidden" name="updatedBy" value={userData.userName} />
    </form>
  );
}
