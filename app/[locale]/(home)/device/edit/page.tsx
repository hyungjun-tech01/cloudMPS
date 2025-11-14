import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import
import Breadcrumbs from '@/app/components/breadcrumbs';
import { EditForm } from '@/app/components/device/edit-form';
import NotFound from '@/app/components/not-found';
import { fetchData } from '@/app/libs/actions';
import { ISection, IButtonInfo } from '@/app/libs/types';
import getDictionary from '@/app/libs/dictionaries';
import { DEVICE_TYPE } from '@/app/libs/constants';
import { auth } from "@/auth";


interface IEditClient {
    deviceId: string
};


export default async function Page(props: {
    searchParams?: Promise<IEditClient>;
    params: Promise<{ locale: "ko" | "en" }>
}
) {
    const locale = (await props.params).locale;
    const deviceId = (await props.searchParams)?.deviceId ?? "";

    //----- Check session -----------------------------------
    const session = await auth();
    if(!session?.user) return redirect('/login');
    if(new Date(session.expires) < new Date()) return redirect('/login');
    if (session.user.role === 'FREE_USER') redirect('/');

    //----- Retreive data -----------------------------------
    const dataToGetDeviceInfo = {
        device_id: deviceId,
        user_name: session.user.name,
        company_code: session.user.companyCode,
        ip_address: session.user.ipAddress
    }

    const [trans, deviceInfoResult] = await Promise.all([
        getDictionary(locale),
        fetchData("/api/devices/getdeviceinfo", dataToGetDeviceInfo, session.user.token),
    ]);

    if(deviceInfoResult.ResultCode !== "0")
        return NotFound(trans.error.not_found_client, trans.common.go_back, "/device");

    const deviceInfo = deviceInfoResult.devices;
    const formItems: ISection[] = [
        {
            title: trans.device.secTitle_basic_info,
            description: trans.device.secDesc_basic_info,
            items: [
                { name: "deviceName", title: trans.device.device_name, type: "input", defaultValue: deviceInfo.devcie_name, placeholder: trans.device.placeholder_device_name },
                { name: "deviceType", title: trans.device.device_type, type: "select", defaultValue: null, options: [
                    { title: trans.device.device_type_mono_printer, value: DEVICE_TYPE.MONO_PRINTER },
                    { title: trans.device.device_type_color_printer, value: DEVICE_TYPE.COLOR_PRINTER },
                    { title: trans.device.device_type_mono_mfp, value: DEVICE_TYPE.LASER_PRINTER },
                    { title: trans.device.device_type_color_mfp, value: DEVICE_TYPE.INKJET_PRINTER }
                ]},
                { name: "deviceModel", title: trans.device.model, type: "input", defaultValue: "", placeholder: trans.device.placeholder_model_name },
                { name: "serialNumber", title: trans.device.serial, type: "input", defaultValue: "", placeholder: trans.device.placeholder_serial_no },
                { name: "physicalDeviceId", title: trans.device.physical_device_id, type: "input", defaultValue: deviceInfo.physical_device_id, placeholder: trans.device.placeholder_phisical_device_id },
                { name: "extDeviceFunction", title: trans.device.ext_device_function, type: "input", defaultValue: deviceInfo.ext_device_function, placeholder: trans.device.placeholder_device_function },
                { name: "location", title: trans.device.location, type: "input", defaultValue: deviceInfo.location, placeholder: trans.device.placeholder_device_location },
                { name: "appType", title: trans.device.app_type, type: "select", defaultValue: deviceInfo.app_type, options: [
                    { title : 'Open API', value: 'OpenAPI' }, { title: 'Workpath SDK', value: 'WorkpathSDK' }
                ]},
                { name: "clientId", title: trans.client.client_id, type: "hidden", defaultValue: session.user.id ?? "" },
            ],
        },
        {
            title: trans.device.secTitle_status_info,
            description: trans.device.secDesc_status_info,
            items: [
                { name: "blackTonerPercentage", title: trans.device.black_toner_percentage, type: "number", defaultValue: deviceInfo.black_toner_percentage, min: 0, max: 100 },
                { name: "cyanTonerPercentage", title: trans.device.cyan_toner_percentage, type: "number", defaultValue: deviceInfo.cyan_toner_percentage, min: 0, max: 100 },
                { name: "magentaTonerPercentage", title: trans.device.magenta_toner_percentage, type: "number", defaultValue: deviceInfo.magenta_toner_percentage, min: 0, max: 100 },
                { name: "yellowTonerPercentage", title: trans.device.yellow_toner_percentage, type: "number", defaultValue: deviceInfo.yellow_toner_percentage, min: 0, max: 100 },
                { name: "blackDrumPercentage", title: trans.device.black_drum_percentage, type: "number", defaultValue: deviceInfo.black_drum_percentage, min: 0, max: 100 },
                { name: "cyanDrumPercentage", title: trans.device.cyan_drum_percentage, type: "number", defaultValue: deviceInfo.cyan_drum_percentage, min: 0, max: 100 },
                { name: "magentaDrumPercentage", title: trans.device.magenta_drum_percentage, type: "number", defaultValue: deviceInfo.magenta_drum_percentage, min: 0, max: 100 },
                { name: "yellowDrumPercentage", title: trans.device.yellow_drum_percentage, type: "number", defaultValue: deviceInfo.yellow_drum_percentage, min: 0, max: 100 },
                { name: "deviceStatus", title: trans.device.status, type: "input", defaultValue: deviceInfo.device_status, placeholder: trans.device.placeholder_device_status },
            ]
        }
    ];
    
    const buttonItems: IButtonInfo = {
        cancel: { title: trans.common.cancel, link: '/device' },
        go: { title: trans.device.edit_device },
    };

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: trans.device.device, href: '/device' },
                    {
                        label: trans.device.edit_device,
                        href: `/client/${deviceId}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditForm
                id={deviceId}
                items={formItems}
                buttons={buttonItems}
                trans={trans.error}
            />
        </main>
    );
}