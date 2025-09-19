import { Suspense } from "react";
import BoardWrapper from "@/app/components/dashboard/board";
import { CardsSkeleton } from "@/app/components/dashboard/skeletons";
import getDictionary from '@/app/libs/dictionaries';
import clsx from "clsx";
import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard',
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

  const trans = await getDictionary(locale);

  const session = await auth();
  const isAdmin = session?.user.role === "admin";

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">"Dashboard"</h1>
      <div className={clsx("flex", {"flex-col mb-4 md:flex-row": isAdmin}, {"flex-col": !isAdmin})}>
        <div className={clsx("flex flex-col gap-6 mb-6", {"md:w-1/4": isAdmin})}>
          <Suspense fallback={<CardsSkeleton />}>
            <BoardWrapper trans={trans}/>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
