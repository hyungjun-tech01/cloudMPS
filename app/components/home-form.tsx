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
        <div id="subItems" className='flex flex-row justify-between items-center gap-10'>
          <div id="selectUserType" className='flex flex-row justify-between items-center gap-4'>
              {trans.personal_user}
              <Switch checked={userType === 'company'} onChange={handleUserTypeChange} style={{ backgroundColor: userType === 'company' ? '#1677ff' : 'gray' }} />
              {trans.company_user}
          </div>
          <div className='w-48'>{' '}</div>
          <div className="flex justify-end items-center gap-4">
            <Link
              href={"/login?userType=" + userType}
              className="flex h-10 min-w-24 bg-slate-900 hover:bg-slate-200 hover:text-lime-900 border-lime-50 border-[1px] justify-center items-center rounded-md text-sm font-medium text-lime-50 transition-colors"
            >
            {trans.login}
            </Link>
            <Link
              href={"/register?userType=" + userType}
              className="flex h-10 min-w-24 bg-orange-400 hover:bg-orange-200 hover:text-slate-900 justify-center items-center rounded-md text-sm font-medium text-lime-50 transition-colors"
            >
            {trans.register}
            </Link>
          </div>
        </div>
    )
}
