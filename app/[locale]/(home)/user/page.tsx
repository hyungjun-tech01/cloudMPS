import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import Table from 'antd';

import Search from '@/app/components/search';
import { CreateButton } from '@/app/components/buttons';
import { ISearch } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { TableSkeleton } from "@/app/components/skeletons";
import { fetchData } from "@/app/libs/actions";


export const metadata: Metadata = {
    title: 'Users',
}

export default async function Page(props: {
    searchParams?: Promise<ISearch>;
    params: Promise<{ locale: "ko" | "en" }>;
}) {
    const locale = (await props.params).locale;
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.page) || 1;

    const session = await auth();

    if(!session?.user.id || !session?.user.name) {
        redirect('/login'); // '/login'으로 리다이렉트
    };

    const userName = session.user.name;
    const searchData = {
        search_user_name: query,
        search_full_name: query,
        search_email: query,
        items_per_page : itemsPerPage, 
        current_page : currentPage, 
        user_name: userName,
        company_code: "string",
        ip_address: "string",
    }

    const [trans, users] = await Promise.all([
        getDictionary(locale),
        fetchData("/api/users/getuserlist", searchData),
    ]);
    
    const columns = [
        {
          title: trans.user.user_id,
          dataIndex: 'user_name',
          key: 'user_name',
        },
        {
          title: trans.user.user_name,
          dataIndex: 'full_name',
          key: 'full_name',
        },
      ];
    

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">{t("common.user")}</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder={t("comment.search_users")} />
                <CreateButton link="/user/create" title={t("user.create_user")} />
            </div>
            <Suspense fallback={<TableSkeleton />}>
                <Table 
                    dataSource={users}
                    columns={columns}
                />
            </Suspense>
        </div>
    );
}