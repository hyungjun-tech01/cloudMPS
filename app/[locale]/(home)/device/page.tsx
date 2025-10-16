import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Table } from "antd";
import MaterialIcon from "@/app/components/materialIcon";

import { auth } from "@/auth";
import getDictionary from '@/app/libs/dictionaries';

export const metadata: Metadata = {
  title: 'Monitoring',
}

interface IMonitoringParams {
  installed: Date;
  status: string;
  deviceType: "inkjet" | "laser" | "a4" | "a3";
  contractType: string;
  paymentDate: string;
  startDate: string;
  remainToner: number;
  remainDrum: number;
}

export default async function Page(props: {
  searchParams?: Promise<IMonitoringParams>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = params.locale;

  const session = await auth();
  if(!session?.user) {
    redirect('/intro');
  }
  
  const trans = await getDictionary(locale);

  const columns = [
    {
      title: trans.device.installed_date,
      dataIndex: 'installed_date',
      key: 'installed_date',
    },
    {
      title: trans.device.collected_date,
      dataIndex: 'collected_date',
      key: 'collected_date',
    },
    {
      title: trans.device.status,
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: trans.device.customer,
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: trans.device.sales_point,
      dataIndex: 'sales_point',
      key: 'sales_point',
    },
    {
      title: trans.device.model,
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: trans.device.auto_manual,
      dataIndex: 'auto_manual',
      key: 'auto_manual',
    },
    {
      title: trans.device.location,
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: trans.device.refill_ink,
      dataIndex: 'refill_ink',
      key: 'refill_ink',
    },
    {
      title: trans.device.ink_toner,
      children: [
        {
          title: <MaterialIcon name="circle" props={"text-black"}/>,
          dataIndex: 'ink_toner_black',
          key: 'ink_toner_black',
        },
        {
          title: <MaterialIcon name="circle" props={"text-blue-400"}/>,
          dataIndex: 'ink_toner_cyan',
          key: 'ink_toner_cyan',
        },
        {
          title: <MaterialIcon name="circle" props={"text-pink-400"}/>,
          dataIndex: 'ink_toner_magenta',
          key: 'ink_toner_magenta',
        },
        {
          title: <MaterialIcon name="circle" props={"text-yellow-400"}/>,
          dataIndex: 'ink_toner_yellow',
          key: 'ink_toner_yellow',
        },
      ]
    },
    {
      title: trans.device.drum,
      children: [
        {
          title: <MaterialIcon name="circle" props={"text-black"}/>,
          dataIndex: 'drum_black',
          key: 'drum_black',
        },
        {
          title: <MaterialIcon name="circle" props={"text-blue-400"}/>,
          dataIndex: 'drum_cyan',
          key: 'drum_cyan',
        },
        {
          title: <MaterialIcon name="circle" props={"text-pink-400"}/>,
          dataIndex: 'drum_magenta',
          key: 'drum_magenta',
        },
        {
          title: <MaterialIcon name="circle" props={"text-yellow-400"}/>,
          dataIndex: 'drum_yellow',
          key: 'drum_yellow',
        },
      ]
    },
    {
      title: trans.device.total_printed,
      children: [
        {
          title: trans.device.paper_size,
          dataIndex: "paper_size",
          key: "paper_size,"
        },
        {
          title: trans.device.black_white,
          dataIndex: 'black_white',
          key: 'black_white',
        },
        {
          title: trans.device.color,
          dataIndex: 'color',
          key: 'color',
        },
        {
          title: trans.device.sum,
          dataIndex: 'sum',
          key: 'sum',
        }
      ]
    },
  ];

  const dataSource = [
    {
      key: '1',
      installed_date: 'Mike',
      collected_date: 32,
      status: "정상",
      customer: '삼성',
      sales_point:  '강남점',
      model: 'M247',
      auto_manual: '자동',
      location: '사무동2층',
      refill_ink: 'Y',
      ink_toner_black: 80,
      ink_toner_cyan: 65,
      ink_toner_magenta: 53,
      ink_toner_yellow: 48,
      drum_black: 80,
      drum_cyan: 65,
      drum_magenta: 53,
      drum_yellow: 48,
      paper_size: 'A4',
      black_white: 146751,
      color: 80281,
      sum: 227032
    },
  ];

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">{trans.device.monitoring}</h1>
      <div className="w-full">
        <Table 
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </main>
  );
}
