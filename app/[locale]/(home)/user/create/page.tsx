import Breadcrumbs from '@/app/components/breadcrumbs';
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import

import { ISection, IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { CreateForm } from '@/app/components/user/create-form';
import { notFound } from 'next/navigation';
import { auth } from "@/auth";


export default async function Page(props: {
    params: Promise<{ id: string, job: string, locale: "ko" | "en" }> }
) {
    const params = await props.params;
    const locale = params.locale;
    const [ trans ] = await Promise.all([
        getDictionary(locale),
    ]);
    const session = await auth();

    if(!session?.user) return notFound();

    ///// application log ----------------------------------------------------------------------
    const userName = session?.user.name ?? "";
    if (!userName) {
        redirect('./login');
    };

    const formItems: ISection[] = [
        {
            title: trans.user.secTitle_details, description: trans.comment.user_edit_details_description, items: [
                { name: 'userName', title: "ID", type: 'input', defaultValue: "", placeholder: trans.user.placeholder_user_name },
                { name: 'userFullName', title: trans.user.full_name, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_full_name },
                { name: 'userEmail', title: trans.common.email, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_email },
                { name: 'userHomeDirectory', title: trans.user.home_directory, type: 'input', defaultValue: "", placeholder: trans.user.placeholder_home_directory },
                {
                    name: 'userDisabledPrinting', title: trans.user.enable_disable_printing, type: 'select', defaultValue: "N", options: [
                        { title: trans.user.enable_printing, value: 'N' },
                        { title: trans.user.disable_printing, value: 'Y' }
                    ]
                },
                { name: 'userNotes', title: trans.common.note, type: 'input', defaultValue: "", placeholder: "" },
            ]
        },
        {
            title: trans.user.secTitle_account_details, description: trans.comment.user_edit_account_description, items: [
                { name: 'userBalanceCurrent', title: trans.account.balance_current, type: 'currency', defaultValue: 0, placeholder: trans.user.placeholder_balance_initial },
            ]
        },
        {
            title: trans.user.secTitle_etc, description: trans.comment.user_edit_account_description, items: [
                { name: 'userCardNumber', title: trans.user.card_number, type: 'input', defaultValue: "" },
                { name: 'userCardNumber2', title: trans.user.card_number2, type: 'input', defaultValue: "" },
            ]
        },
    ];
    const buttonItems: IButtonInfo = {
        cancel : { title: trans.common.cancel, link: '/user' },
        go : { title: trans.user.create_user },
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.common.user, href: '/user' },
                    {
                        label: trans.user.create_user,
                        href: '/user/create',
                        active: true,
                    },
                ]}
            />
            <CreateForm items={formItems} buttons={buttonItems}  sessionUserName={userName} action={createUser}/>
            {/* <CreateForm items={formItems} /> */}
        </main>
    );
}