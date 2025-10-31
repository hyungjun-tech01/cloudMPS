'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useActionState, useState, useEffect } from 'react';
import MaterialIcon from '@/app/components/materialIcon';


export function InviteForm({
  userName,
  trans,
  action,
}: {
  userName:string;
  trans: Record<string, string>;
  action: (prevState: void | UserState, formData: FormData)
    => Promise<UserState | void>;
}) {
  const initialState: UserState = { message: null, errors: {} };
  const [state, formAction] = useActionState(action, initialState);
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    const fetchIp = async () => {
    try {
        const res = await fetch('/api/get-ip');
        const data = await res.json();
        setIpAddress(data.ip);
    } catch (error) {
        console.error('IP 가져오기 실패:', error);
    }
    };

    fetchIp();
}, []);

  return (
    <form action={formAction}>
      <input type="hidden" name="ipAddress" value={ipAddress}/>
      <input type="hidden" name="updatedBy" value={userName}/>
      <div className="my-4 rounded-lg bg-slate-100 p-4 flex justify-between items-center md:p-6">
        <div className="flex items-center justify-between gap-4">
          <label className='font-medium' >{trans.name}</label>
          <input name="user_name" type="text"
            className='h-10 rounded-md bg-white border-2 border-slate-800'
          />
          <label className='font-medium' >{trans.email}</label>
          <input name="user_email" type="email"
            className='h-10 rounded-md bg-white border-2 border-slate-800'
          />
        </div>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-lime-600 px-4 text-base font-medium text-white transition-colors hover:bg-lime-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
        >
          <span className="hidden md:block md:">{trans.invite}</span>{' '}
          <MaterialIcon name="add" props="h-5 md:ml-4" />
        </button>
      </div>
    </form>
  );
}
