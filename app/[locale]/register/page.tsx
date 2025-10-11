import { Suspense } from 'react';
import RegisterForm from '@/app/components/register/register-form';
import getDictionary from '@/app/libs/dictionaries';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Register',
}

interface IRegister {
  userType?: "company" | "person";
  searchCompany?: string;
}

export default async function Page(props: {
  searchParams?: Promise<IRegister>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const userType = searchParams?.userType || "company";
  const searchCompany = searchParams?.searchCompany;
  const locale = (await props.params).locale;

  const t = await getDictionary(locale);
  const trans = {
    common: t.common,
    company: t.company,
    register: t.register,
    user: t.user
  }
  const terms = {
    terms_of_service: t.terms_of_service,
    privacy_policy: t.privacy_policy,
    location_info_policy: t.location_info_policy,
    event_promotion_policy: t.event_promotion_policy
  };

  //fake company info
  const fakeSearchedCompanies = !!searchCompany ? [{
      key: '110001',
      company_code: '110001',
      company_name : 'Sindoh',
      address : '서울시 성동구 성수이로24길 3',
    },
    {
      key: '110041',
      company_code: '110041',
      company_name : 'NodeData',
      address : '서울시 구로구 가산디지털단지',
    },
  ] : null;

  return (
    <main className="flex items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col p-4 md:-mt-8">
        <div className="flex h-20 w-full items-end rounded-t-lg p-3 md:h-36 text-2xl font-medium" >
          {trans.register.title}
        </div>
        <Suspense>
          <RegisterForm userType={userType} searchResult={fakeSearchedCompanies} trans={trans} terms={terms}/>
        </Suspense>
      </div>
    </main>
  );
}