import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Table from "@/app/components/table";
import MaterialIcon from "@/app/components/materialIcon";
import Search from "@/app/components/search";
import { TableSkeleton } from "@/app/components/skeletons";
import { UpdateButton } from "@/app/components/buttons";
import { CreateButton } from "@/app/components/buttons";
import { fetchData } from "@/app/libs/actions";
import getDictionary from "@/app/libs/dictionaries";
import { DeviceData } from "@/app/libs/types";
import { auth } from "@/auth";


export const metadata: Metadata = {
  title: "Monitoring",
};

interface IMonitoringParams {
  installed: Date;
  status: string;
  deviceType: "inkjet" | "laser" | "a4" | "a3";
  contractType: string;
  paymentDate: string;
  startDate: string;
  remainToner: number;
  remainDrum: number;
  query: string;
  itemsPerPage: string;
  page: string;
}

export default async function Page(props: {
  searchParams?: Promise<IMonitoringParams>;
  params: Promise<{ locale: "ko" | "en" }>;
}) {
  const params = await props.params;
  const locale = params.locale;
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
  const currentPage = Number(searchParams?.page) || 1;

  const session = await auth();
  const userName = session?.user.name;

  if (!userName) {
    redirect("/login"); // '/login'으로 리다이렉트
  }

  const searchData = {
    search_client_name: query,
    search_device_name: query,
    search_device_location: query,
    search_device_notes: query,
    search_device_ip_address: query,
    search_device_model: query,
    items_per_page: itemsPerPage,
    current_page: currentPage,
    user_name: userName,
    company_code: session.user.companyCode,
    ip_address: session.user.ipAddress,
  };

  const [trans, deviceListResult] = await Promise.all([
    getDictionary(locale),
    fetchData("/api/devices/getdevicelist", searchData, session.user.token),
  ]);

  const columns = [
    {
      title: trans.device.device_name,
      dataIndex: "device_name",
      key: "device_name",
    },
    {
      title: trans.device.ext_device_function,
      dataIndex: "ext_device_function",
      key: "ext_device_function",
    },
    {
      title: trans.common.status,
      dataIndex: "physical_device_id",
      key: "physical_device_id",
    },
    {
      title: trans.device.location,
      dataIndex: "location",
      key: "location",
    },
    {
      title: trans.device.model,
      dataIndex: "device_model",
      key: "device_model",
    },
    {
      title: trans.device.serial,
      dataIndex: "serial_number",
      key: "serial_number",
    },
    {
      title: trans.device.status,
      dataIndex: "device_status",
      key: "device_status",
    },
    {
      title: trans.device.ink_toner,
      children: [
        {
          title: <MaterialIcon name="circle" props={"text-black"}/>,
          dataIndex: 'black_toner_percentage',
          key: 'black_toner_percentage',
        },
        {
          title: <MaterialIcon name="circle" props={"text-blue-400"}/>,
          dataIndex: 'cyan_toner_percentage',
          key: 'cyan_toner_percentage',
        },
        {
          title: <MaterialIcon name="circle" props={"text-pink-400"}/>,
          dataIndex: 'magenta_toner_percentage',
          key: 'magenta_toner_percentage',
        },
        {
          title: <MaterialIcon name="circle" props={"text-yellow-400"}/>,
          dataIndex: 'yellow_toner_percentage',
          key: 'yellow_toner_percentage',
        },
      ]
    },
    {
      title: trans.device.drum,
      children: [
        {
          title: <MaterialIcon name="circle" props={"text-black"}/>,
          dataIndex: 'black_drum_percentage',
          key: 'black_drum_percentage',
        },
        {
          title: <MaterialIcon name="circle" props={"text-blue-400"}/>,
          dataIndex: 'cyan_drum_percentage',
          key: 'cyan_drum_percentage',
        },
        {
          title: <MaterialIcon name="circle" props={"text-pink-400"}/>,
          dataIndex: 'magenta_drum_percentage',
          key: 'magenta_drum_percentage',
        },
        {
          title: <MaterialIcon name="circle" props={"text-yellow-400"}/>,
          dataIndex: 'yellow_drum_percentage',
          key: 'yellow_drum_percentage',
        },
      ]
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const { ResultCode, totalPages, devices } = deviceListResult;

  const dataSource =
    ResultCode === "0"
      ? devices.map((device: DeviceData) => {
          return {
            device_name: device.device_name,
            created_date: device.created_date,
            created_by: device.created_by,
            modified_date: device.modified_date,
            modified_by: device.modified_by,
            ext_device_function: device.ext_device_function,
            physical_device_id: device.physical_device_id,
            location: device.location,
            device_model: device.device_model,
            serial_number: device.serial_number,
            device_status: device.device_status,
            device_type: device.device_type,
            black_toner_percentage: device.black_toner_percentage,
            cyan_toner_percentage: device.cyan_toner_percentage,
            magenta_toner_percentage: device.magenta_toner_percentage,
            yellow_toner_percentage: device.yellow_toner_percentage,
            app_type: device.app_type,
            black_drum_percentage: device.black_drum_percentage,
            cyan_drum_percentage: device.cyan_drum_percentage,
            magenta_drum_percentage: device.magenta_drum_percentage,
            yellow_drum_percentage: device.yellow_drum_percentage,
            client_name: device.client_name,
            actions: (
              <div
                key={device.device_id}
                className="flex justify-center items-center gap-2"
              >
                <UpdateButton
                  link={`/device/edit?deviceId=${device.device_id}`}
                />
                <button
                  className="rounded-md px-1 pt-1 border hover:bg-gray-100"
                  // onClick={handleMenuOpen}
                >
                  <span className="sr-only">{trans.common.delete}</span>
                  <MaterialIcon name="delete" props="w-6 text-inherit" />
                </button>
              </div>
            ),
          };
        })
      : [];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">{trans.user.user}</h1>
        <CreateButton link="/device/create" title={trans.device.create_device} />
      </div>
      <div className="mt-4 mb-2 flex items-center justify-between gap-4 md:mt-8 md:mb-4">
        <Search
          placeholder={trans.user.search_users}
          buttonText={trans.common.search}
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <Table
          dataSource={dataSource}
          columns={columns}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}
