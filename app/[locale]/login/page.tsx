import { Suspense } from 'react';
import LoginForm from '@/app/components/login-form';
import { getDictionary } from '@/app/libs/dictionaries';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login',
}

export default async function LoginPage(props: {
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const locale = (await props.params).locale;
  const trans = await getDictionary(locale);
  const languageData = {
    title : trans.login.title,
    login : trans.login.login,
    userId : trans.login.userId,
    password : trans.login.password,
  }
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-t-lg bg-lime-900 p-3 md:h-36" >
          <div className="w-32 text-white text-2xl font-medium md:w-36">
            {'Cloud MPS'}
          </div>
        </div>
        <Suspense>
          <LoginForm languageData={languageData}/>
        </Suspense>
      </div>
    </main>
  );
}