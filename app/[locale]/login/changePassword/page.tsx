import { Suspense } from 'react';
import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { auth } from '@/auth';
import getDictionary from '@/app/libs/dictionaries';
import ChangeForm from '@/app/components/login/change-form';


export const metadata: Metadata = {
  title: 'Forgot Password',
}

interface ILogin {
  userType?: "company" | "person";
  init?: boolean;
}

export default async function ForgotPasswordPage(props: {
  searchParams?: Promise<ILogin>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const locale = (await props.params).locale;
  const session = await auth();
  // if(!session?.user.name) {
  //   redirect('/login');
  // };
  const temData = {
    user_id: session?.user.id ?? 'test',
    user_name: session?.user.name ?? "test",
    ip_address: session?.user.ip_address ?? "127.0.0.1",
  };

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
            user_id={temData.user_id}
            user_name={temData.user_name}
            ip_address={temData.ip_address}
            trans={someTrans}
          />
        </Suspense>
      </div>
    </main>
  );
}