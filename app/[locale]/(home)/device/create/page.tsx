import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import Breadcrumbs from '@/app/components/breadcrumbs';
import { CreateForm } from '@/app/components/client/create-form';
import { ISection, IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { auth } from "@/auth";


export default async function Page(props: {
    params: Promise<{ locale: "ko" | "en" }> }
) {
    const params = await props.params;
    const locale = params.locale;

    //----- Check session -----------------------------------
    const session = await auth();
    if(!session?.user) return redirect('/login');
    if(new Date(session.expires) < new Date()) return redirect('/login');
    if (session.user.role === 'FREE_USER') redirect('/');

    //----- Retreive data -----------------------------------
    const trans = await getDictionary(locale);

    const formItems: ISection[] = [
        {
            title: trans.device.secTitle_basic_info,
            description: trans.device.secDesc_basic_info,
            items: [
                { name: "deviceName", title: trans.device.device_name, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "extDeviceFunction", title: trans.device.ext_device_function, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "physicalDeviceId", title: trans.device.physical_device_id, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "location", title: trans.device.location, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "deviceModel", title: trans.device.model, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "serialNumber", title: trans.device.serial, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "deviceStatus", title: trans.device.status, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "deviceType", title: trans.device.device_type, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "blackTonerPercentage", title: trans.device.black_toner_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "cyanTonerPercentage", title: trans.device.cyan_toner_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "magentaTonerPercentage", title: trans.device.magenta_toner_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "yellowTonerPercentage", title: trans.device.yellow_toner_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "appType", title: trans.device.app_type, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "blackDrumPercentage", title: trans.device.black_drum_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "cyanDrumPercentage", title: trans.device.cyan_drum_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "magentaDrumPercentage", title: trans.device.magenta_drum_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "yellowDrumPercentage", title: trans.device.yellow_drum_percentage, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
                { name: "clientId", title: trans.client.client_id, type: "input", defaultValue: "", placeholder: trans.client.placehodler_device },
            ]
        }
    ];

    const buttonItems: IButtonInfo = {
        cancel : { title: trans.common.cancel, link: '/deivce' },
        go : { title: trans.device.create_device },
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
                trans={trans.error}
            />
        </main>
    );
}