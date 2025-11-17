import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import Breadcrumbs from '@/app/components/breadcrumbs';
import { CreateForm } from '@/app/components/device/create-form';
import { ISection, IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { DEVICE_TYPE } from '@/app/libs/constants';
import { auth } from "@/auth";


export default async function Page(props: {
    params: Promise<{ locale: "ko" | "en" }> }
) {
    const params = await props.params;
    const locale = params.locale;

    const session = await auth();
    if(!session?.user) return redirect('/login');

    //----- Retreive data -----------------------------------
    const trans = await getDictionary(locale);

    const formItems: ISection[] = [
        {
            title: trans.device.secTitle_basic_info,
            description: trans.device.secDesc_basic_info,
            items: [
                { name: "deviceName", title: trans.device.device_name, type: "input", defaultValue: "", placeholder: trans.device.placeholder_device_name },
                { name: "deviceType", title: trans.device.device_type, type: "select", defaultValue: null, options: [
                    { title: trans.device.device_type_mono_printer, value: DEVICE_TYPE.MONO_PRINTER },
                    { title: trans.device.device_type_color_printer, value: DEVICE_TYPE.COLOR_PRINTER },
                    { title: trans.device.device_type_mono_mfp, value: DEVICE_TYPE.MONO_MFP },
                    { title: trans.device.device_type_color_mfp, value: DEVICE_TYPE.COLOR_MFP }
                ]},
                { name: "deviceModel", title: trans.device.model, type: "input", defaultValue: "", placeholder: trans.device.placeholder_model_name },
                { name: "serialNumber", title: trans.device.serial, type: "input", defaultValue: "", placeholder: trans.device.placeholder_serial_no },
                { name: "physicalDeviceId", title: trans.device.physical_device_id, type: "input", defaultValue: "", placeholder: trans.device.placeholder_phisical_device_id },
                { name: "extDeviceFunction", title: trans.device.ext_device_function, type: "input", defaultValue: "", placeholder: trans.device.placeholder_device_function },
                { name: "location", title: trans.device.location, type: "input", defaultValue: "", placeholder: trans.device.placeholder_device_location },
                { name: "appType", title: trans.device.app_type, type: "select", defaultValue: null, options: [
                    { title : 'Open API', value: 'OpenAPI' }, { title: 'Workpath SDK', value: 'WorkpathSDK' }
                ]},
                { name: "clientId", title: trans.client.client_id, type: "hidden", defaultValue: session.user.id ?? "" },
            ],
        },
        {
            title: trans.device.secTitle_status_info,
            description: trans.device.secDesc_status_info,
            items: [
                { name: "blackTonerPercentage", title: trans.device.black_toner_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "cyanTonerPercentage", title: trans.device.cyan_toner_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "magentaTonerPercentage", title: trans.device.magenta_toner_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "yellowTonerPercentage", title: trans.device.yellow_toner_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "blackDrumPercentage", title: trans.device.black_drum_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "cyanDrumPercentage", title: trans.device.cyan_drum_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "magentaDrumPercentage", title: trans.device.magenta_drum_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "yellowDrumPercentage", title: trans.device.yellow_drum_percentage, type: "number", defaultValue: 0, min: 0, max: 100 },
                { name: "deviceStatus", title: trans.device.status, type: "input", defaultValue: "", placeholder: trans.device.placeholder_device_status },
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
                    { label: trans.device.device, href: '/device' },
                    {
                        label: trans.device.create_device,
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