import { Suspense } from 'react';
import ForgotForm from '@/app/components/login/forgot-form';
import getDictionary from '@/app/libs/dictionaries';
import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Forgot Password',
}


export default async function ForgotPasswordPage(props: {
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const locale = (await props.params).locale;
  const trans = await getDictionary(locale);

  const someTrans = {...trans.common, ...trans.login, ...trans.user};

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
          <ForgotForm trans={someTrans}/>
        </Suspense>
      </div>
    </main>
  );
}