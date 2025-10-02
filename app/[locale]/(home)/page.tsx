import { Suspense } from "react";
import BoardWrapper from "@/app/components/dashboard/board";
import { CardsSkeleton } from "@/app/components/dashboard/skeletons";
import getDictionary from '@/app/libs/dictionaries';
import clsx from "clsx";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Control Jobs',
}

interface IDashboardParams {
  period?: "today" | "week" | "month" | "specified",
  dept?:string,
  user?:string,
  periodStart?:string,
  periodEnd?:string,
}

export default async function Page(props: {
  searchParams?: Promise<IDashboardParams>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = params.locale;

  const session = await auth();
  if(!session?.user) {
    redirect('/intro');
  }
  const isAdmin = session?.user.role === "admin";
  const trans = await getDictionary(locale);

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">{trans.controlJobs.controlJobs}</h1>
      <div className={clsx("flex flex-col mb-4")}>
        <Suspense fallback={<CardsSkeleton />}>
          <BoardWrapper trans={trans.controlJobs}/>
        </Suspense>
      </div>
    </main>
  );
}
