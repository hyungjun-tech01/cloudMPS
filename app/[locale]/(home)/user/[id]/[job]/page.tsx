import Link from 'next/link';
import { notFound, redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import clsx from 'clsx';

import { IButtonInfo, ISection } from '@/app/libs/types';
import { EditForm } from '@/app/components/user/edit-form';
import Breadcrumbs from '@/app/components/breadcrumbs';

import getDictionary from '@/app/libs/dictionaries';
import { ISearch } from '@/app/libs/types';
import { modifyUser } from '@/app/libs/actions'; 

import { auth } from "@/auth";


export default async function Page(props: {
    searchParams?: Promise<ISearch>;
    params: Promise<{ id: string, job: string, locale: "ko" | "en" }>
}) {
    const params = await props.params;
    const { id, job, locale } = params;

    const session = await auth();
    const userName = session?.user.name;

    if(!userName) {
        redirect('/login'); // '/login'으로 리다이렉트
    };

    if (!['edit'].includes(job)) {
        notFound();
    };

    const [trans] = await Promise.all([
        getDictionary(locale),
    ]);

    // Items -------------------------------------------------------------------
    const subTitles = [
        { category: 'edit', title: trans.user.subTitle_detail, link: `/user/${id}/edit` },
    ];

    const items: { edit: ISection[] } = {
        edit: [
            {
                title: trans.user.secTitle_details, description: trans.user.description_edit_details,
                items: [
                    { name: 'userName', title: 'ID', type: 'label', defaultValue: userName },
                    { name: 'userFullName', title: trans.user.full_name, type: 'input', defaultValue: session.user.fullName, placeholder: trans.user.placeholder_full_name },
                ]
            },
            {
                title: trans.user.secTitle_password, description: "",
                items: [
                    { name: 'userPwdNew', title: trans.user.password_new, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new },
                    { name: 'userPwdNewAgain', title: trans.user.password_new_again, type: 'password', defaultValue: "", placeholder: trans.user.placeholder_password_new_again },
                ]
            },
        ],
    };

    const buttonItems: { edit: IButtonInfo } = {
        edit: {
            cancel: { title: trans.common.cancel, link: '/user' },
            go: { title: trans.user.update_user },
        },
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.user.user, href: '/user' },
                    {
                        label: `${trans.user.edit_user} : ${session.user.fullName}(${userName})`,
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
            {job === 'edit' && <EditForm id={id} items={items[job]} buttons={buttonItems.edit} sessionUserName={userName} action={modifyUser}/>}
        </main>
    );
}