import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import MaterialIcon from "@/app/components/materialIcon";

import Search from '@/app/components/search';
import { InviteForm } from "@/app/components/user/invite-form";
import { TableSkeleton } from "@/app/components/skeletons";
import Table from '@/app/components/table';
import { UpdateButton } from "@/app/components/buttons";

import getDictionary from '@/app/libs/dictionaries';
import { ISearch, ClientData } from "@/app/libs/types";
import { fetchData, modifyUser, deleteUser, registerMember } from "@/app/libs/actions";


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
    const userName = session?.user.name;

    if (!userName) {
        redirect('/login'); // '/login'으로 리다이렉트
    };

    if (session.user.role !== 'PARTNER') {
        redirect('/'); // '/login'으로 리다이렉트
    };

    const searchData = {
        search_client_name: query,
        search_business_registration_code: query,
        search_client_address: query,
        search_sales_resource: query,
        items_per_page: itemsPerPage,
        current_page: currentPage,
        user_name: userName,
        company_code: session.user.companyCode,
        ip_address: session.user.ipAddress,
    };

    const [trans, clientListResult] = await Promise.all([
        getDictionary(locale),
        fetchData("/api/clients/getclientlist", searchData, session.user.token),
    ]);

    // console.log("clients :", clientListResult);
    const {ResultCode, totalPages, clients} = clientListResult;

    const transDataForInviteForm = {
        invite: trans.user.invite_user,
        errors_in_inputs: trans.register.errors_in_inputs,
        error_input_type_email: trans.register.error_input_type_email,
        error_input_type_ipv4: trans.register.error_input_type_ipv4,
        error_input_type_string: trans.register.error_input_type_string,
        error_miss_input: trans.common.error_miss_input,
        fail_parsing:  trans.common.fail_parsing,
        userEmail: trans.user.user + ' ' + trans.common.email,
        userName: trans.user.user_name,
    };

    const handleMenuOpen = async (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('handleMenuOpen');
    };

    const columns = [
        {
            title: trans.client.client_id,
            dataIndex: 'client_name',
            key: 'client_name',
        },
        {
            title: trans.company.group,
            dataIndex: 'client_group',
            key: 'group',
        },
        {
            title: trans.company.phone_number,
            dataIndex: 'client_phone_number',
            key: 'client_phone_number',
        },
        {
            title: "",
            dataIndex: 'actions',
            key: 'actions',
        },
    ];

    const dataSource = ResultCode === "0" ? clients.map( (client : ClientData) => {
        return {
            client_name: client.client_name,
            group: client.client_group,
            phone: client.client_phone_number,
            actions: 
                <div key={client.user_id} className='flex justify-center items-center gap-2'>
                    <UpdateButton link={`/user/${client.user_id}/edit`} />
                    <button
                        className="rounded-md px-1 pt-1 border hover:bg-gray-100"
                        // onClick={handleMenuOpen}
                    >
                        <span className="sr-only">{trans.common.delete}</span>
                        <MaterialIcon name='delete' props="w-6 text-inherit" />
                    </button>
                </div>
        }
    }) : [];

    const actions = {
        modify : modifyUser,
        delete : deleteUser,
    }

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">{trans.client.client}</h1>
            </div>
            <div className="mt-4 mb-2 flex items-center justify-between gap-4 md:mt-8 md:mb-4">
                <Search placeholder={trans.client.search_clients} buttonText={trans.common.search} />
            </div>
            <Suspense fallback={<TableSkeleton />}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    totalPages={totalPages}
                    actions={actions}
                />
            </Suspense>
        </div>
    );
}