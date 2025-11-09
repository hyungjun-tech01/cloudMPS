import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import Breadcrumbs from '@/app/components/breadcrumbs';
import { EditForm } from '@/app/components/user/edit-form';
import NotFound from '@/app/components/not-found';
import Unauthorized from '@/app/components/unauthorized';
import { ISection, IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { fetchData } from '@/app/libs/actions';
import { interpretNY, interpretPrivilage } from '@/app/libs/utils'
import { auth } from "@/auth";


interface IEditUser {
    userName: string
}


export default async function Page(props: {
    searchParams?: Promise<IEditUser>;
    params: Promise<{ locale: "ko" | "en" }> },

) {
    const locale = (await props.params).locale;
    const userName = (await props.searchParams)?.userName;

    //----- Check session -----------------------------------
    const session = await auth();
    if(!session?.user) return redirect('/login');
    if (session.user.role !== 'SUBSCRIPTION' && session.user.role !== 'PARTNER') {
        redirect('/');
    };

    //----- Retreive data -----------------------------------
    const [ trans, userInfoResult] = await Promise.all([
        getDictionary(locale),
        fetchData('/api/users/getuserinfo',
            { user_name: userName, ip_address: session.user.ipAddress },
            session.user.token 
        )
    ]);

    if(!userName || userInfoResult.ResultCode !== '0')
        return NotFound(trans.error.not_found_user, trans.common.go_back, "/user");

    const userInfo = userInfoResult.user;

    //----- Check if the user have the same company code ---------------------------
    if(!!userInfo.company_code && userInfo.company_code !== Number(session.user.companyCode)) {
        return Unauthorized(trans.error.unauthorized_user, trans.common.go_back, "/user");
    }
    
    const formItems: ISection[] = [
        {
            title: trans.user.secTitle_info,
            description: trans.user.secDesc_basic_info,
            items: [
                { name: 'userID', title: "", type: 'hidden', defaultValue: "", placeholder: userInfo.user_id },
                { name: 'userName', title: trans.user.user_id, type: 'label', defaultValue: userInfo.user_name },
                { name: 'externalUserName', title: trans.user.external_user_name, type: 'input', defaultValue: userInfo.external_user_name, placeholder: trans.user.placeholder_external_user_name },
                { name: 'fullName', title: trans.user.full_name, type: 'input', defaultValue: userInfo.full_name, placeholder: trans.user.placeholder_full_name },
                { name: 'deptName', title: trans.user.department, type: 'input', defaultValue: userInfo.department, placeholder: trans.user.placeholder_department },
                { name: 'office', title: trans.user.office, type: 'input', defaultValue: userInfo.office, placeholder: trans.user.placeholder_office },
            ]
        },
        {
            title: trans.user.secTitle_activity_details,
            description: trans.user.secDesc_activity_details,
            items: [
                { name: 'totalJobs', title: trans.controlJobs.total_job_count, type: 'input', defaultValue: userInfo.total_jobs },
                { name: 'totalPages', title: trans.controlJobs.total_pages, type: 'input', defaultValue: userInfo.total_pages },
                { name: 'schedulePeriod', title: trans.user.schedule_period, type: 'input', defaultValue: userInfo.schedule_period, placeholder: trans.client.placeholder_client_name },
                { name: 'scheduleAmount', title: trans.user.schedule_amount, type: 'input', defaultValue: userInfo.schedule_amount, placeholder: trans.client.placeholder_client_name },
                { name: 'scheduleStart', title: trans.user.schedule_start, type: 'input', defaultValue: userInfo.schedule_start, placeholder: trans.client.placeholder_client_name },
                { name: 'disabledPrinting', title: trans.controlJobs.disable_printing, type: 'select', defaultValue: userInfo.disabled_printing, options: [
                    {title: trans.common.yes, value: 'Y'}, {title: trans.common.no, value: 'N'}
                ] },
                { name: 'disabledPrintingUtil', title: trans.controlJobs.disable_printing_util, type: 'input', defaultValue: userInfo.disabled_printing_until, placeholder: trans.client.placeholder_client_name },
                { name: 'homeDirectory', title: trans.controlJobs.home_directory, type: 'input', defaultValue: userInfo.home_directory, placeholder: trans.user.placeholder_home_directory },
                { name: 'balance', title: trans.controlJobs.balance, type: 'input', defaultValue: userInfo.balance, placeholder: trans.user.placeholder_balance_initial },
            ]
        },
        {
            title: trans.client.secTitle_etc,
            description: trans.client.secDesc_etc,
            items: [
                { name: 'sysadmin', title: trans.user.sysadmin, type: 'input', defaultValue: userInfo.sysadmin, placeholder: trans.client.placeholder_client_name },
                { name: 'privilege', title: trans.user.privilege, type: 'select', defaultValue: interpretPrivilage(locale,userInfo.privilege), options:[
                    {title: interpretPrivilage(locale, 'ALL'), value: 'ALL'},
                    {title: interpretPrivilage(locale, 'PRINT'), value: 'PRINT'},
                    {title: interpretPrivilage(locale, 'SCAN'), value: 'SCAN'},
                    {title: interpretPrivilage(locale, 'NONE'), value: 'NONE'},
                ] },
                { name: 'notes', title: trans.common.memo, type: 'input', defaultValue: userInfo.notes, placeholder: trans.client.placeholder_client_name },
            ]
        },
    ];
    
    const buttonItems: IButtonInfo = {
        cancel : { title: trans.common.cancel, link: '/user' },
        go : { title: trans.user.edit_user },
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.user.user, href: '/user' },
                    {
                        label: trans.user.edit_user,
                        href: `/user/edit?userName=${userName}`,
                        active: true,
                    },
                ]}
            />
            <EditForm
                id={userName}
                items={formItems}
                buttons={buttonItems}
                trans={trans.error}
            />
        </main>
    );
}