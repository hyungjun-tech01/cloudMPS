import getDictionary from '@/app/libs/dictionaries';
import type { Metadata } from "next";
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Information',
}

interface IInfo {
  userType?: "company" | "person";
}

export default async function ForgotPasswordPage(props: {
  searchParams?: Promise<IInfo>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const userType = searchParams?.userType || "company";
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
          <div className="p-8 flex justify-center items-center text-2xl">
            {trans.login.initialize_Password_done}
          </div>
          <div className="pt-8 pb-1 flex justify-center items-center text-xl text-slate-500">
            {trans.login.completed_1}
          </div>
          <div className="pt-1 pb-8 flex justify-center items-center text-xl text-slate-500">
            {trans.login.completed_2}
          </div>
          <Link
            href={`/login?userType=${userType}&init=true`}
            className="p-8 flex justify-center items-center text-blue-500"
          >
            {trans.login.login}
          </Link>
      </div>
    </main>
  );
}