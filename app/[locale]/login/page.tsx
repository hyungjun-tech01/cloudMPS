import { Suspense } from 'react';
import LoginForm from '@/app/components/login/login-form';
import getDictionary from '@/app/libs/dictionaries';
import type { Metadata } from "next";
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Login',
}

interface ILogin {
  userType?: "company" | "person";
  init?: boolean;
}


export default async function LoginPage(props: {
  searchParams?: Promise<ILogin>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const userType = searchParams?.userType || "company";
  const isInit = searchParams?.init || false;
  const locale = (await props.params).locale;
  const trans = await getDictionary(locale);

  return (
    <>
      {/* Mobile */}
      <div className='w-full h-full flex flex-col md:hidden'>
        <div className='bg-slate-800 w-full h-1/3 flex flex-col justify-end p-4'>
          <Link href="/intro"
            className="text-white text-2xl font-semibold"
          >
            {'Cloud MPS'}
          </Link>
        </div>
        <div className='w-full h-2/3 bg-slate-50 flex items-center justify-center bg-slate-100'>
          <Suspense>
            <LoginForm userType={userType} isInit={isInit} locale={locale} trans={trans.login} />
          </Suspense>
        </div>
      </div>
      {/* Desktop */}
      <div className='hidden md:flex md:flex-col md:w-full md:h-full md:items-center md:justify-center'>
        <div className="flex h-36 w-md items-end rounded-t-lg bg-slate-800 p-3" >
          <Link href="/intro"
            className="w-36 text-white text-2xl font-semibold"
          >
            {'Cloud MPS'}
          </Link>
        </div>
        <div className='w-md flex items-center justify-center bg-slate-100'>
          <Suspense>
            <LoginForm userType={userType} isInit={isInit} locale={locale} trans={trans.login} />
          </Suspense>
        </div>
      </div>
    </>
  );
}