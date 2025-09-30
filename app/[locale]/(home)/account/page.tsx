import { notFound } from 'next/navigation';
import { IButtonInfo, ISection } from '@/app/libs/types';
import { EditForm } from '@/app/components/user/edit-form';
import Breadcrumbs from '@/app/components/breadcrumbs';

import getDictionary from '@/app/libs/dictionaries';
import { auth } from "@/auth"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Account',
}

export default async function Page(props: {
    params: Promise<{ locale: "ko" | "en" }>
}) {
    const params = await props.params;
    const locale = params.locale;

    const session = await auth();
    if(!session?.user?.name)
        return notFound();

    // console.log('[Account] current user :', session.user);
    // const adapter = MyDBAdapter();
    const [trans, user] = await Promise.all([
        getDictionary(locale),
        // adapter.getUserByName(session.user.name)
        {}
    ]);

    // Items -------------------------------------------------------------------
    const items: ISection[] = [
        {
            title: trans.user.secTitle_details, description: "",
            items: [
                { name: 'userName', title: 'ID', type: 'label', defaultValue: user.user_name },
                { name: 'userFullName', title: trans.user.full_name, type: 'input', defaultValue: user.full_name, placeholder: trans.user.placeholder_full_name') },
                { name: 'userEmail', title: trans.common.email, type: 'input', defaultValue: user.email, placeholder: trans.user.placeholder_email') },
                { name: 'userDepartment', title: trans.user.department, type: 'input', defaultValue: user.department, placeholder: trans.user.placeholder_department') },
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
    ];

    const buttonItems: IButtonInfo = {
        cancel: { title: trans.common.cancel, link: '/' },
        go: { title: trans.user.update_user },
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.common.account, href: '/account', active: true },
                ]}
            />

            <EditForm id={user.user_id} items={items} buttons={buttonItems} sessionUserName='-1' action={adapter.updateAccount}/>
        </main>
    );
}