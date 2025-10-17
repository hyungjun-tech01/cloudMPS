'use client';

import { Table } from 'antd';
import type { IColumn } from '@/app/libs/types';


interface ITable {
    columns: IColumn[];
    dataSource: any[];
    totalPages: number;
}


export default function CustomizedTable({
    columns,
    dataSource,
    totalPages
}: ITable) {

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
        />
    );
}