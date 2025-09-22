'use client';

import { useState } from 'react';
import { Switch } from 'antd';
import Link from 'next/link';

export default function HomeForm({ trans }: { trans: Record<string, string> }) {
    const [userType, setUserType] = useState<'company' | 'personal'>('company');

    const handleUserTypeChange = (value: boolean) => {
        setUserType(value ? 'company' : 'personal');
    }

    return (
        <div id="subItems" className='w-full flex mx-10 my-5 flex-row justify-between items-center'>
          <div id="selectUserType" className='flex flex-row justify-between items-center gap-4'>
              {trans.personal_user}
              <Switch checked={userType === 'company'} onChange={handleUserTypeChange} />
              {trans.company_user}
          </div>
          <div id="selectInfo" className='flex text-xl flex-row justify-between items-center gap-4'>
            <div id="intro">{trans.intro}</div>
            <div id="doc">{trans.doc}</div>
          </div>
          <div id="select_process" className='flex gap-2'>
            <div className="mt-6 flex justify-end gap-4">
              <Link
                href={"/login?userType=" + userType}
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
              {trans.login}
              </Link>
              <Link
                href={"/register?userType=" + userType}
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
              {trans.register}
              </Link>
            </div>
          </div>
        </div>
    )
}
