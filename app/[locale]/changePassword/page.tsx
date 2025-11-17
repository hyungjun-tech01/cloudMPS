import { Suspense } from 'react';
import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { auth } from '@/auth';
import getDictionary from '@/app/libs/dictionaries';
import ChangeForm from '@/app/components/login/change-form';


export const metadata: Metadata = {
  title: 'Change Password',
};

interface IChangePassword {
  userType?: "company" | "person";
}

export default async function ChangePasswordPage(props: {
  searchParams?: Promise<IChangePassword>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const userType = searchParams?.userType || "company";
  const locale = (await props.params).locale;
  const session = await auth();

  const trans = await getDictionary(locale);
  const someTrans = {...trans.common, ...trans.login}

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
          <ChangeForm
            trans={someTrans}
          />
        </Suspense>
      </div>
    </main>
  );
}