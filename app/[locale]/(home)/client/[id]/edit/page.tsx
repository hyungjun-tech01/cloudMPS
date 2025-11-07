import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import Breadcrumbs from '@/app/components/breadcrumbs';
import { EditForm } from '@/app/components/client/edit-form';
import { fetchData } from '@/app/libs/actions';
import { ISection, IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { auth } from "@/auth";
import NotFound from '@/app/components/not-found';


export default async function Page(props: {
    params: Promise<{ id: string, locale: "ko" | "en" }>
}
) {
    const params = await props.params;
    const id = params.id;
    const locale = params.locale;

    const session = await auth();
    if (!session?.user) return redirect('/login');
    if (session.user.role !== 'PARTNER') return redirect('/');

    const dataToGetClientInfo = {
        client_id: id,
        user_name: session.user.name,
        company_code: session.user.companyCode,
        ip_address: session.user.ipAddress
    }

    const [trans, clientInfoResult] = await Promise.all([
        getDictionary(locale),
        fetchData("/api/clients/getclientinfo", dataToGetClientInfo, session.user.token),
    ]);

    if(clientInfoResult.ResultCode !== "0")
        return NotFound(trans.error.not_found_client, trans.common.go_back, "/client");

    const clientInfo = clientInfoResult.clients;
    console.log("Client Info :", clientInfo);

    const openDate = !!clientInfo.establishment_date ? new Date(clientInfo.establishment_date) : null;
    const closeDate = !!clientInfo.closure_date ? new Date(clientInfo.closure_date) : null;

    const formItems: ISection[] = [
        {
            title: trans.client.secTitle_basic_info,
            description: trans.client.secDesc_basic_info,
            items: [
                { name: 'clientName', title: trans.client.client_name, type: 'input', defaultValue: clientInfo.client_name, placeholder: trans.client.placeholder_client_name },
                { name: "clientNameEn", title: trans.client.client_name_en, type: "input", defaultValue: clientInfo.client_name_en, placeholder: trans.client.placeholder_client_name_en },
                { name: "ceoName", title: trans.client.client_ceo, type: "input", defaultValue: clientInfo.ceo_name, placeholder: trans.client.placeholder_client_ceo },
                { name: "clientZipCode", title: trans.client.client_zip_code, type: "input", defaultValue: clientInfo.client_zip_code, placeholder: trans.client.placeholder_client_zip_code },
                { name: "clientAddress", title: trans.client.client_address, type: "input", defaultValue: clientInfo.client_address, placeholder: trans.client.placeholder_client_address },
                { name: "clientPhoneNumber", title: trans.client.client_phone, type: "input", defaultValue: clientInfo.client_phone_number, placeholder: trans.client.placeholder_client_phone },
                { name: "clientFaxNumber", title: trans.client.client_fax, type: "input", defaultValue: clientInfo.client_fax_number, placeholder: trans.client.placeholder_client_fax },
                { name: "homepage", title: trans.client.homepage, type: "input", defaultValue: clientInfo.homepage, placeholder: trans.client.placeholder_client_homepage },
                { name: "status", title: trans.common.status, type: "input", defaultValue: clientInfo.status, placeholder: "" },
            ]
        },
        {
            title: trans.client.secTitle_business_info,
            description: trans.client.secDesc_business_info,
            items: [
                { name: "businessRegistrationCode", title: trans.client.business_reg_no, type: "input", defaultValue: clientInfo.business_registration_code, placeholder: trans.client.placeholder_client_business_reg_no },
                { name: "businessType", title: trans.client.business_type, type: "input", defaultValue: clientInfo.business_type, placeholder: trans.client.placeholder_client_business_type },
                { name: "businessItem", title: trans.client.business_item, type: "input", defaultValue: clientInfo.business_item, placeholder: trans.client.placeholder_client_business_item },
                { name: "industryType", title: trans.client.industry_type, type: "input", defaultValue: clientInfo.industry_type, placeholder: trans.client.placeholder_client_industry_type },
                { name: "clientGoup", title: trans.client.client_group, type: "input", defaultValue: clientInfo.client_group, placeholder: trans.client.placeholder_client_group },
                { name: "clientScale", title: trans.client.client_scale, type: "input", defaultValue: clientInfo.client_scale, placeholder: trans.client.placeholder_client_scale },
                { name: "dealType", title: trans.client.client_dealtype, type: "input", defaultValue: clientInfo.deal_type, placeholder: trans.client.placeholder_client_dealtype },
                { name: "establishmentDate", title: trans.client.client_open_date, type: "date", defaultValue: openDate, placeholder: trans.client.placeholder_client_open_date },
                { name: "closureDate", title: trans.client.client_close_date, type: "date", defaultValue: closeDate, placeholder: trans.client.placeholder_client_close_date },
            ],
        },
        {
            title: trans.client.secTitle_deal_info,
            description: trans.client.secDesc_deal_info,
            items: [
                { name: "bankName", title: trans.client.bank_name, type: "input", defaultValue: clientInfo.bank_name, placeholder: trans.client.placeholder_client_bank_name },
                { name: "accountCode", title: trans.client.account_no, type: "input", defaultValue: clientInfo.account_code, placeholder: trans.client.placeholder_client_account_no },
                { name: "accountOwner", title: trans.client.account_owner, type: "input", defaultValue: clientInfo.account_owner, placeholder: trans.client.placeholder_client_account_owner },
                { name: "salesResource", title: trans.client.client_sales_source, type: "input", defaultValue: clientInfo.sales_resource, placeholder: trans.client.placeholder_client_sales_source },
                { name: "applicationEngineer", title: trans.client.client_engineer, type: "input", defaultValue: clientInfo.application_engineer, placeholder: trans.client.placeholder_client_engineer },
                { name: "region", title: trans.client.region, type: "input", defaultValue: clientInfo.region, placeholder: trans.client.placeholder_client_region },
            ],
        },
        {
            title: trans.client.secTitle_etc,
            description: trans.client.secDesc_etc,
            items: [
                { name: "clientMemo", title: trans.common.memo, type: "input", defaultValue: clientInfo.client_memo, placeholder: "" },
            ]
        },
    ];

    const buttonItems: IButtonInfo = {
        cancel: { title: trans.common.cancel, link: '/client' },
        go: { title: trans.client.edit_client },
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.client.client, href: '/client' },
                    {
                        label: trans.client.edit_client,
                        href: `/client/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditForm
                id={id}
                items={formItems}
                buttons={buttonItems}
                trans={trans.error}
            />
        </main>
    );
}