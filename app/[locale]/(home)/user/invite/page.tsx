import Breadcrumbs from '@/app/components/breadcrumbs';
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import

import { IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { InviteForm } from '@/app/components/user/invite-form';
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
        redirect('/login');
    };

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
                        label: trans.user.invite_user,
                        href: '/user/invite',
                        active: true,
                    },
                ]}
            />
            <InviteForm sessionUserName={userName} action={inviteUser}/>
        </main>
    );
}