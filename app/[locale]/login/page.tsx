import { Suspense } from 'react';
import LoginForm from '@/app/components/login-form';
import getDictionary from '@/app/libs/dictionaries';
import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login',
}

interface ILogin {
  userType?: "company" | "personal";
}

export default async function LoginPage(props: {
  searchParams?: Promise<ILogin>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const userType = searchParams?.userType || "company";
  const locale = (await props.params).locale;
  const trans = await getDictionary(locale);

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-t-lg bg-[#142131] p-3 md:h-36" >
          <Link href="/intro"
            className="w-32 text-white text-2xl font-medium md:w-36"
          >
            {'Cloud MPS'}
          </Link>
        </div>
        <Suspense>
          <LoginForm userType={userType} trans={trans.login}/>
        </Suspense>
      </div>
    </main>
  );
}