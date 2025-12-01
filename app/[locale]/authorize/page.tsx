import { Suspense } from 'react';
import type { Metadata } from "next";
import AuthorizeForm from '@/app/components/authorize/authorize-form';
import getDictionary from '@/app/libs/dictionaries';


export const metadata: Metadata = {
  title: 'Register',
}

interface IRegister {
  userType?: "company" | "person";
}


export default async function Page(props: {
  searchParams?: Promise<IRegister>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const userType = searchParams?.userType || "company";
  const locale = (await props.params).locale;

  const t = await getDictionary(locale);
  const trans = {
    ...t.common,
    ...t.login
  }

  return (
    <main className="flex items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col p-4 md:-mt-8">
        <div className="flex h-20 w-full items-end justify-center rounded-t-lg p-8 md:h-36 text-2xl font-medium" >
          {trans.verify_auth_code}
        </div>
        <Suspense>
          <AuthorizeForm
            trans={trans}
          />
        </Suspense>
      </div>
    </main>
  );
}