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
import { ISearch, UserData } from "@/app/libs/types";
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

    if (session.user.role !== 'SUBSCRIPTION' && session.user.role !== 'PARTNER') {
        redirect('/'); // '/login'으로 리다이렉트
    };

    const searchData = {
        search_user_name: query,
        search_full_name: query,
        search_email: query,
        items_per_page: itemsPerPage,
        current_page: currentPage,
        user_name: userName,
        company_code: session.user.companyCode,
        ip_address: session.user.ipAddress,
    };

    const [trans, userListResult] = await Promise.all([
        getDictionary(locale),
        fetchData("/api/users/getuserlist", searchData, session.user.token),
    ]);

    console.log("users :", userListResult);
    const {ResultCode, totalPages, users} = userListResult;

    const userDataForInviteForm = {
        userName: userName,
        companyCode: session.user.companyCode,
        companyType:  session.user.role === 'PARTNER' ? 'PARTNER' :  "GENERAL",
        ipAddress: session.user.ipAddress
    };

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
            title: trans.user.user_id,
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: trans.user.user_name,
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: trans.common.status,
            dataIndex: 'user_status',
            key: 'user_status',
        },
        {
            title: "",
            dataIndex: 'actions',
            key: 'actions',
        },
    ];

    const dataSource = ResultCode === "0" ? users.map( (user : UserData) => {
        return {
            user_name: user.user_name,
            full_name: user.full_name,
            user_status: user.user_status,
            actions: 
                <div key={user.user_id} className='flex justify-center items-center gap-2'>
                    <UpdateButton link={`/user/${user.user_id}/edit`} />
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
                <h1 className="text-2xl">{trans.user.user}</h1>
            </div>
            <div className="mt-4 mb-2 flex items-center justify-between gap-4 md:mt-8 md:mb-4">
                <Search placeholder={trans.user.search_users} buttonText={trans.common.search} />
            </div>
            {!!userDataForInviteForm.companyCode &&
                <InviteForm
                    userData={userDataForInviteForm}
                    trans={transDataForInviteForm}
                    action={registerMember}
                />
            }
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