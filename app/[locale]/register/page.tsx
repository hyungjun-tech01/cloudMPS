import { Suspense } from 'react';
import RegisterForm from '@/app/components/register/register-form';
import getDictionary from '@/app/libs/dictionaries';
import type { Metadata } from "next";
import { register } from '@/app/libs/actions';

export const metadata: Metadata = {
  title: 'Register',
}

interface IRegister {
  userType?: "company" | "personal";
}

export default async function Page(props: {
  searchParams?: Promise<IRegister>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const userType = searchParams?.userType || "company";
  const locale = (await props.params).locale;
  const trans = await getDictionary(locale);

  return (
    <main className="flex items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col p-4 md:-mt-8">
        <div className="flex h-20 w-full items-end rounded-t-lg p-3 md:h-36 text-2xl font-medium" >
          {trans.register.title}
        </div>
        <Suspense>
          <RegisterForm userType={userType} trans={trans} />
        </Suspense>
      </div>
    </main>
  );
}