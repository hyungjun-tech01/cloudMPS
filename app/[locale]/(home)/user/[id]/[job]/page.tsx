import Link from 'next/link';
import { notFound } from 'next/navigation';
import clsx from 'clsx';

import { IButtonInfo, ISection } from '@/app/libs/types';
import { EditForm } from '@/app/components/user/edit-form';
import Breadcrumbs from '@/app/components/breadcrumbs';
import LogTable from '@/app/components/table';

import getDictionary from '@/app/libs/dictionaries';
import { IColumnData, ISearch } from '@/app/lib/definitions';
import { formatCurrency } from "@/app/libs/utils";

import { auth } from "@/auth";
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import


export default async function Page(props: {
    searchParams?: Promise<ISearch>;
    params: Promise<{ id: string, job: string, locale: "ko" | "en" }>
}) {
    const params = await props.params;
    const { id, job, locale } = params;
    const searchParams = await props.searchParams;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.page) || 1;

    const session = await auth();

    if(!session?.user.id || !session?.user.name) {
        redirect('/login'); // '/login'으로 리다이렉트
    };

    const userName = session.user.name;

    const [trans] = await Promise.all([
        getDictionary(locale),
    ]);

    if (!user) {
        notFound();
    }

    if (!['edit', 'charge', 'transaction', 'jobLog'].includes(job)) {
        notFound();
    }

    const [printerUsageInfo, printerUsageCount] = await Promise.all([
        adapter.getPrinterUsageLogByUserId(id, itemsPerPage, currentPage),
        adapter.getPrinterUsageLogByUserIdPages(id, itemsPerPage)
    ]);

    // Items -------------------------------------------------------------------
    const subTitles = [
        { category: 'edit', title: trans.user.subTitle_detail, link: `/user/${id}/edit` },
        { category: 'charge', title: trans.user.subTitle_budget, link: `/user/${id}/charge` },
        { category: 'jobLog', title: trans.user.subTitle_jobLog, link: `/user/${id}/jobLog` }
    ];

    const items: { edit: ISection[], charge: ISection[] } = {
        edit: [
            {
                title: trans.user.secTitle_details, description: trans.comment.user_edit_details_description,
                items: [
                    { name: 'userName', title: 'ID', type: 'label', defaultValue: user.user_name },
                    { name: 'userFullName', title: trans.user.full_name, type: 'input', defaultValue: user.full_name, placeholder: trans.user.placeholder_full_name },
                    { name: 'userEmail', title: trans.common.email, type: 'input', defaultValue: user.email, placeholder: trans.user.placeholder_email },
                    { name: 'userHomeDirectory', title: trans.user.home_directory, type: 'input', defaultValue: user.home_directory, placeholder: trans.user.placeholder_home_directory },
                    {
                        name: 'userDisabledPrinting', title: trans.user.enable_disable_printing, type: 'select', defaultValue: user.disabled_printing, options: [
                            { title: trans.user.enable_printing, value: 'N' },
                            { title: trans.user.disable_printing, value: 'Y' }
                        ]
                    },
                ]
            },
            {
                title: trans.user.secTitle_account_details, description: trans.comment.user_edit_account_description,
                items: [
                    { name: 'userBalanceCurrent', title: trans.account.balance_current, type: 'label', defaultValue: formatCurrency(user.balance, locale), placeholder: trans.user.placeholder_department, other: balanceLink },
                ]
            },
            {
                title: trans.user.secTitle_etc, description: trans.comment.user_edit_account_description,
                items: [
                    { name: 'userDepartment', title: trans.user.department, type: 'select', defaultValue: user.dept_id, placeholder: trans.user.placeholder_department, 
                        options: [{title: trans.user.select_dept, value: ""}, ...allDept.map((x:{dept_id:string, dept_name:string}) => ( {title:x.dept_name, value:x.dept_id} ))]
                    },
                    { name: 'userCardNumber', title: trans.user.card_number, type: 'input', defaultValue: user.card_number },
                    { name: 'userCardNumber2', title: trans.user.card_number2, type: 'input', defaultValue: user.card_number2 },
                ]
            },
            {
                title: trans.user.secTitle_password, description: "",
                items: [
                    { name: 'userPwdNew', title: trans.user.password_new, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new') },
                    { name: 'userPwdNewAgain', title: trans.user.password_new_again, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new_again') },
                ]
            },
        ],
        charge: [
            {
                title: trans.user.secTitle_details, description: trans.comment.user_edit_details_description,
                items: [
                    { name: 'balanceCurrent', title: trans.account.balance_current, type: 'label', defaultValue: formatCurrency(user.balance, locale) },
                    { name: 'balanceNew', title: trans.account.balance_new, type: 'currency', defaultValue: user.balance, locale: locale },
                    { name: 'txnComment', title: trans.common.explanation, type: 'input', defaultValue: "" },
                ]
            },
        ],
    };

    const printerUsageColumns: IColumnData[] = [
        { name: 'usage_date', title: trans.printer.usage_date },
        { name: 'display_name', title: trans.printer.printer },
        { name: 'pages', title: trans.common.page, align: 'center' },
        { name: 'color_total_pages', title: trans.common.color_total_pages, align: 'center' },
        { name: 'black_total_pages', title: trans.common.black_total_pages, align: 'center' },
        { name: 'document_name', title: trans.printer.document_name, align: 'center' },
        { name: 'status', title: trans.printer.status, align: 'center' },
    ];

    const buttonItems: { edit: IButtonInfo, charge: IButtonInfo } = {
        edit: {
            cancel: { title: trans.common.cancel, link: '/user' },
            go: { title: trans.user.update_user },
        },
        charge: {
            cancel: { title: trans.common.cancel, link: '/user' },
            go: { title: trans.common.apply },
        }
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.common.user, href: '/user' },
                    {
                        label: `${trans.user.edit_user} : ${user.full_name}(${user.user_name})`,
                        href: `/user/${id}/${job}`,
                        active: true,
                    },
                ]}
            />
            <div className='w-full pl-2 flex justify-start'>
                {subTitles.map((item, idx) => {
                    return <Link key={idx} href={item.link}
                        className={clsx("w-auto px-2 py-1 h-auto rounded-t-lg border-solid",
                            { "font-medium text-lime-900 bg-gray-50 border-x-2 border-t-2": item.category === job },
                            { "text-gray-300  bg-white border-2": item.category !== job },
                        )}>{item.title}</Link>;
                })}
            </div>
            {job === 'edit' && <EditForm id={id} items={items[job]} buttons={buttonItems[job]} sessionUserName={userName} action={adapter.modifyUser}/>}
            {job === 'charge' && <EditForm id={id} items={items[job]} buttons={buttonItems[job]} sessionUserName={userName} action={adapter.changeBalance}/>}
            {job === 'jobLog' &&
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    <LogTable
                        columns={printerUsageColumns}
                        rows={printerUsageInfo}
                        totalPages={printerUsageCount}
                        editable={false}
                    />
                </div>
            }
        </main>
    );
}