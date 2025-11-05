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
            title: trans.client.secTitle_basic_info,
            description: trans.client.secDesc_basic_info,
            items: [
                { name: 'clientName', title: trans.client.client_name, type: 'input', defaultValue: "", placeholder: trans.client.placeholder_client_name },
                { name: "clientNameEn", title: trans.client.client_name_en, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_name_en },
                { name: "ceoName", title: trans.client.client_ceo, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_ceo },
                { name: "clientZipCode", title: trans.client.client_zip_code, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_zip_code },
                { name: "clientAddress", title: trans.client.client_address, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_address },
                { name: "clientPhoneNumber", title: trans.client.client_phone, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_phone },
                { name: "clientFaxNumber", title: trans.client.client_fax, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_fax },
                { name: "homepage", title: trans.client.homepage, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_homepage },
                { name: "status", title: trans.common.status, type: "input", defaultValue: "", placeholder: "" },
            ]
        },
        {
            title: trans.client.secTitle_business_info,
            description: trans.client.secDesc_business_info,
            items: [
                { name: "businessRegistrationCode", title: trans.client.business_reg_no, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_business_reg_no },
                { name: "businessType", title: trans.client.business_type, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_business_type },
                { name: "businessItem", title: trans.client.business_item, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_business_item },
                { name: "industryType", title: trans.client.industry_type, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_industry_type },
                { name: "clientGoup", title: trans.client.client_group, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_group },
                { name: "clientScale", title: trans.client.client_scale, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_scale },
                { name: "dealType", title: trans.client.client_dealtype, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_dealtype },
                { name: "establishmentDate", title: trans.client.client_open_date, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_open_date },
                { name: "closureDate", title: trans.client.client_close_date, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_close_date },
            ],
        },
        {
            title: trans.client.secTitle_deal_info,
            description: trans.client.secDesc_deal_info,
            items: [
                { name: "bankName", title: trans.client.bank_name, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_bank_name },
                { name: "accountCode", title: trans.client.account_no, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_account_no },
                { name: "accountOwner", title: trans.client.account_owner, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_account_owner },
                { name: "salesResource", title: trans.client.client_sales_source, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_sales_source },
                { name: "applicationEngineer", title: trans.client.client_engineer, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_engineer },
                { name: "region", title: trans.client.region, type: "input", defaultValue: "", placeholder: trans.client.placeholder_client_region },
            ],
        },
        {
            title: trans.client.secTitle_etc,
            description: trans.client.secDesc_etc,
            items: [
                { name: "clientMemo", title: trans.common.memo, type: "input", defaultValue: "", placeholder: "" },
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
                userName={session.user.name?? ""}
                companyCode={session.user.companyCode?? -1}
                ipAddress={session.user.ipAddress}
                action={createClient}
            />
        </main>
    );
}