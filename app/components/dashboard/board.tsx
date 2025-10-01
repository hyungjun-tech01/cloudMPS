import { auth } from "@/auth";
import Card from "./card";
import { formatCurrency } from '@/app/libs/utils';
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import


export default async function BoardWrapper({ trans }: { trans: Record<string, string> }) {
    const session = await auth();
    const userRole = session?.user.role;

    if (!userRole) {
        console.log("userName is undefined");

        // 여기서 redirect 함수를 사용해 리다이렉트 처리
        redirect('/login'); // '/login'으로 리다이렉트
    };

    const valMonthlyUsage:Record<string, Record<string, number|string>> = {
        auto: { current: 0, total: 0, error: 0, period: "월별", target: 58, created: 0, not_created: 58},
        manual: { current: 0, total: 0, error: 0, period: "월별", target: 166, created: 0, not_created: 166},
    };

    const valSales:Record<string, Record<string, number|string>> = {
        auto: { current: 0, total: 0, error: 0, period: "월별", target: 140, created: 67, not_created: 81},
        manual: { current: 0, total: 0, error: 0, period: "월별", target: 627, created: 1, not_created: 626},
    };

    const valAS:Record<string, Record<string, number>>= {
        auto: { value: 0, applied: 159, waiting: 2, processing: 8, canceled: 640, completed: 86, postponed: 2},
        manual: { value: 0, applied: 286, waiting: 132, processing: 16, canceled: 118, completed: 219, postponed: 1},
    };

    const valMonitor:Record<string, Record<string, number>> = {
        updated: { current: 0, thisMonth: 7, lastMonth: 33 },
        ink: { current: 56, total:162, until4: 0, until30: 26, over30: 106, lowSupply: 2 },
        laser: { current: 83, total:303, until4: 0, until30: 24, over30: 220, lowSupply: 48 }
    }

    const tempCardData: { title: string, type: string, data: Record<string, Record<string, number|string>>}[] = [
        { title: trans.monthy_usage, type: "monthlyUsage", data: valMonthlyUsage },
        { title: trans.sales, type: "sales", data: valSales },
        { title: trans.as, type: "as", data: valAS },
        { title: trans.monitor, type: "monitor", data: valMonitor },
    ]

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            { tempCardData.map(item => 
                <Card key={item.type} title={item.title} type={item.type} value={item.data} />
            )}
        </div>
    )
    
}
