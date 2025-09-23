import { auth } from "@/auth";
import Card from "./card";
import type { IValueObject } from "./card";
import MaterialIcon from '@/app/components/materialIcon';
import { formatCurrency } from '@/app/libs/utils';
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import



export default async function BoardWrapper({ trans }: { trans: Record<string, string> }) {
    const session = await auth();
    // const adapter = MyDBAdapter();
    const boardInfo: { 
        title: string,
        value: string | number,
        icon?: {name: string, type: string, color?: string}
    }[] = [];

    const userName = session?.user.name;

    if (!userName) {
        console.log("userName is undefined");

        // 여기서 redirect 함수를 사용해 리다이렉트 처리
        redirect('/login'); // '/login'으로 리다이렉트
    };

    if (session?.user.role === "admin") {
        const [device_status, top5users, top5devices] =
            await Promise.all([
                {normal_count: 0, error_count: 0, warning_count: 0, low_supply_count: 0, offline_count: 0},
                [{user_name: 'test1', total_pages_sum: '0'}, {user_name: 'test2', total_pages_sum: '0'}, {user_name: 'test3', total_pages_sum: '0'}, {user_name: 'test4', total_pages_sum: '0'}, {user_name: 'test5', total_pages_sum: '0'}],
                [{device_name: 'test1', total_pages_sum: '0'}, {device_name: 'test2', total_pages_sum: '0'}, {device_name: 'test3', total_pages_sum: '0'}, {device_name: 'test4', total_pages_sum: '0'}, {device_name: 'test5', total_pages_sum: '0'}]
            ]);

        const normal_count = Number(device_status.normal_count);
        const error_count = Number(device_status.error_count);
        const warning_count = Number(device_status.warning_count);
        const low_supply_count = Number(device_status.low_supply_count);
        const offline_count = Number(device_status.offline_count);
        const total_count = normal_count + error_count + warning_count + low_supply_count + offline_count;

        const top5userInfo: IValueObject[] = top5users.map((item: {user_name:string, total_pages_sum:string}) => ({
            title: item.user_name, value: item.total_pages_sum
        }));

        const top5devicesInfo: IValueObject[] = top5devices.map((item: {device_name:string, total_pages_sum:string}) => ({
            title: item.device_name, value: item.total_pages_sum
        }));

        boardInfo.push({ 
            title: trans.total_device,
            value: total_count,
            icon: {name: "print", type: "outlined", color: "text-blue-500"}
        });
        boardInfo.push({ 
            title: trans.normal_device,
            value: normal_count,
            icon: {name: "print", type: "outlined", color: "text-blue-500"}
        });
        boardInfo.push({ 
            title: trans.error_device,
            value: error_count,
            icon: {name: "error", type: "outlined", color: "text-red-500"}
        });
        boardInfo.push({ 
            title: trans.low_supply_device,
            value: low_supply_count,
            icon: {name: "warning", type: "outlined", color: "text-yellow-500"}
        });

        return (
            <>
                <div className="rounded-xl bg-gray-50 p-2 border border-gray-300">
                    { boardInfo.map((item, idx) => {
                        return (
                            <div key={idx} className="flex p-4 justify-between">
                                <div className="flex justify-start">
                                    {!!item.icon && <MaterialIcon name={item.icon.name} type={item.icon.type} props={`h-6 w-6 ${item.icon.color}`} /> }
                                    <h3 className="ml-2 text-base text-sm">{item.title}</h3>
                                </div>
                                <div>{item.value}</div>
                            </div>
                        )
                    })}
                </div>
                <Card title={trans.top5_users} value={top5userInfo} icon={{name: "account_circle", type: "outlined", color: "text-gray-500"}} />
                <Card title={trans.top5_devices} value={top5devicesInfo} icon={{name: "print", type: "outlined", color: "text-blue-500"}} />
            </>
        )
    } else {
        const [myUsageStatus, myInfo] = await Promise.all([
            // adapter.getUsageStatusByUser(userName),
            // adapter.getUserByName(userName)
            {total_job_count: 0, copy_print_total_pages: 0}, {balance: 0}
        ]);

        boardInfo.push({ 
            title: trans.total_job_count,
            value: myUsageStatus.total_job_count || 0,
            icon : {name: "file_copy", type: "outlined", color: "text-blue-500"}
        });
        boardInfo.push({ 
            title: trans.total_pages,
            value: myUsageStatus.copy_print_total_pages || 0,
            icon: {name: "file_copy", type: "outlined", color: "text-blue-500"}}
        );
        boardInfo.push({ 
            title: trans.balance,
            value: formatCurrency(myInfo.balance?? 0, 'ko'),
            icon: {name: "paid", type: "outlined", color: "text-gray-500"}
        });

        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                { boardInfo.map((item, idx) => (
                    <Card key={idx} title={item.title} value={item.value} icon={item.icon} />
                ))}
            </div>
        )
    }
}
