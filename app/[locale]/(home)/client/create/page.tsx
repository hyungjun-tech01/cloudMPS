import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import Breadcrumbs from '@/app/components/breadcrumbs';
import { CreateForm } from '@/app/components/client/create-form';
import { createClient } from '@/app/libs/actions';
import { ISection, IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { auth } from "@/auth";


export default async function Page(props: {
    params: Promise<{ id: string, job: string, locale: "ko" | "en" }> }
) {
    const params = await props.params;
    const locale = params.locale;

    const trans = await getDictionary(locale);
    const session = await auth();

    if(!session?.user) return redirect('/login');
    if(session.user.role !== 'PARTNER') return redirect('/');

    const formItems: ISection[] = [
        {
            title: trans.user.secTitle_details,
            description: "test",
            items: [
                { name: 'clientName', title: "ID", type: 'input', defaultValue: "", placeholder: (trans.user.placeholder_user_name) },
                { name: "clientGoup", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "clientScale", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "dealType", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "clientNameEn", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "businessRegistrationCode", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "establishmentDate", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "closureDate", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "ceoName", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "businessType", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "businessItem", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "industryType", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "clientZipCode", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "clientAddress", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "clientPhoneNumber", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "clientFaxNumber", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "homepage", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "clientMemo", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "accountCode", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "bankName", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "accountOwner", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "salesResource", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "applicationEngineer", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "region", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "status", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "companyCode", title: "", type: "input", defaultValue: "", placeholder: "" },
                { name: "ipAddress", title: "", type: "input", defaultValue: "", placeholder: "" },
            ]
        }
    ];
    const buttonItems: IButtonInfo = {
        cancel : { title: trans.common.cancel, link: '/user' },
        go : { title: trans.user.create_user },
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.client.client, href: '/client' },
                    {
                        label: trans.client.create_client,
                        href: '/client/create',
                        active: true,
                    },
                ]}
            />
            <CreateForm 
                items={formItems}
                buttons={buttonItems}
                userName={session.user.name}
                ipAddress={session.user.ipAddress}
                action={createClient}
            />
        </main>
    );
}