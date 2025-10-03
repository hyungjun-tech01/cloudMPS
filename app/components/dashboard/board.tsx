import { auth } from "@/auth";
import { ICardSubItem } from "@/app/libs/types";
import Card from "./card";
import { redirect } from 'next/navigation'; // 적절한 리다이렉트 함수 import


export default async function BoardWrapper({ trans }: { trans: Record<string, string> }) {
    const session = await auth();
    const userRole = session?.user.role;

    if (!userRole) {
        console.log("userName is undefined");

        // 여기서 redirect 함수를 사용해 리다이렉트 처리
        redirect('/login'); // '/login'으로 리다이렉트
    };

    const valMonthlyUsage : ICardSubItem[] = [
        {
            first: { title: "자동", value: "0/0", sub: [{title: "미생성", value: 0}] },
            second: { title: "당월", value: [
                { title: "대상", value: 58 },
                { title: "생성", value: 0, color: "text-blue-600" },
                { title: "미생성", value: 58, color: "text-red-600" }
            ]}
        },
        {   
            first: { title: "수동", value: "0/0", sub: [{title: "미생성", value: 0}] },
            second: { title: "당월", value: [
                { title: "대상", value: 166 },
                { title: "생성", value: 0, color: "text-blue-600" },
                { title: "미생성", value: 166, color: "text-red-600" }
            ]}
        }
    ];

    const valSales : ICardSubItem[] = [
        {
            first: { title: "자동", value: "0/0", sub: [{title: "미생성", value: 0}] },
            second: { title: "당월", value: [
                { title: "대상", value: 140 },
                { title: "생성", value: 67, color: "text-blue-600" },
                { title: "미생성", value: 81, color: "text-red-600" }
            ]}
        },
        {   
            first: { title: "수동", value: "0/0", sub: [{title: "미생성", value: 0}] },
            second: { title: "당월", value: [
                { title: "대상", value: 627 },
                { title: "생성", value: 1, color: "text-blue-600" },
                { title: "미생성", value: 626, color: "text-red-600" }
            ]}
        }
    ];

    const valAS : ICardSubItem[] = [
        {
            first: { title: "신규", value: "0"},
            second: { title: "누적", value: [ { title: "당월", value: 13 }, { title: "전월", value: 56 }, { title: "진행", value: 8 }, { title: "취소", value: 640 }, { title: "완료", value: 86 }, { title: "보류", value: 2 }
            ]}
        },
        {   
            first: { title: "수동접수", value: "0"},
            second: { title: "현황", value: [
                { title: "접수", value: 286 }, { title: "대기", value: 132 }, { title: "진행", value: 16 }, { title: "취소", value: 118 }, { title: "완료", value: 219 }, { title: "보류", value: 1 }
            ]}
        }
    ];

    const valMonitor : ICardSubItem[] = [
        {
            first: { title: "신규", value: "0" },
            second: { title: "누적", value: [ { title: "당월", value: 13 }, { title: "전월", value: 56 } ]}
        },
        {   
            first: { title: "잉크젯", value: "56/162" },
            second: { title: "지연/잔량부족", value: [
                { title: "3~4일", value: 0, color: "text-red-600"  },
                { title: "4~30일", value: 262, color: "text-red-600" },
                { title: "30일 이상", value: 106, color: "text-red-600" },
                { title: "소모품 부족", value: 2, color: "text-red-600" }
            ]}
        },
        {   
            first: { title: "레이저", value: "83/303" },
            second: { title: "지연/잔량부족", value: [
                { title: "3~4일", value: 0, color: "text-red-600" },
                { title: "4~30일", value: 24, color: "text-red-600" },
                { title: "30일 이상", value: 220, color: "text-red-600" },
                { title: "소모품 부족", value: 48, color: "text-red-600" }
            ]}
        }
    ];

    const tempCardData: { title: string, type: string, data: ICardSubItem[] }[] = [
        { title: trans.monthy_usage, type: "monthlyUsage", data: valMonthlyUsage },
        { title: trans.sales, type: "sales", data: valSales },
        { title: trans.as, type: "as", data: valAS },
        { title: trans.monitor, type: "monitor", data: valMonitor },
    ]

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            { tempCardData.map(item => 
                <Card key={item.type} title={item.title} value={item.data} />
            )}
        </div>
    )
}
