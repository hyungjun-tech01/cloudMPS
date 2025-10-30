'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useActionState, useState, useEffect } from 'react';
import { Table } from 'antd';


export function InviteForm({
  sessionUserName,
  action,
}: {
  sessionUserName:string;
  action: (prevState: void | UserState, formData: FormData)
    => Promise<UserState | void>;
}) {
  const initialState: UserState = { message: null, errors: {} };
  const [state, formAction] = useActionState(action, initialState);
  const [ipAddress, setIpAddress] = useState('');
  const [userList, setUserList] = useState([]);

  const columns = [
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: "Name",
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: "Status",
            dataIndex: 'user_status',
            key: 'user_status',
        },
    ];

  useEffect(() => {
    const fetchIp = async () => {
    try {
        const res = await fetch('/api/get-ip');
        const data = await res.json();
        setIpAddress(data.ip);
    } catch (error) {
        console.error('IP 가져오기 실패:', error);
    }
    };

    fetchIp();
}, []);

  return (
    <form action={formAction}>
      <input type="hidden" name="ipAddress" value={ipAddress}/>
      <input type="hidden" name="updatedBy" value={sessionUserName}/>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mt-4 mb-2 flex items-center justify-between gap-2 md:mt-8 md:mb-4">
          <label >Email</label>
          <input />
          <label >Name</label>
          <input />
        </div>
        <Table
          dataSource={userList}
          columns={columns}
        />
      </div>
    </form>
  );
}
