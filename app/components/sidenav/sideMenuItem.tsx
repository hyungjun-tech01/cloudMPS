'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ISideMenuItem } from '@/app/libs/types';
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";


export default function SideMenuItem({
    menuItem, path, extended
}: {
    menuItem: ISideMenuItem,
    path: string,
    extended: boolean
}) {
    const { name, title, href, icon, submenu } = menuItem;
    const [selected, setSelected] = useState(false);
    const handleClick = () => {
        if (!!submenu) {
            setSelected(!selected);
        }
    };

    if (!!submenu) {
        return (
            <>
                <div
                    onClick={handleClick}
                    className="flex h-[48px] items-center justify-between gap-2 rounded-md bg-gray-50 p-3 text-base text-gray-500 font-medium duration-150 hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
                >
                    <div className={clsx('flex justifiy-center gap-2', {
                        'grow md:flex-none md:justify-start md:py-2': extended,
                    })}>
                        {icon}
                        <p className={clsx("hidden duration-150", { 'md:block': extended })}>{title}</p>
                    </div>
                    {extended && selected && <KeyboardArrowUp className="h-4 w-4" />}
                    {extended && !selected && <KeyboardArrowDown className="h-4 w-4" />}
                </div>
                {selected && submenu.map((subItem) => {
                    const isActive = path.startsWith(subItem.name);
                    return (
                        <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={clsx(
                                "flex h-[42px] items-center gap-3 rounded-md bg-slate-50 text-sm text-gray-500 font-medium duration-150 hover:bg-slate-200 hover:text-slate-700",
                                {
                                    'bg-slate-200 text-slate-700': isActive,  // 이 부분 수정,
                                    'grow md:flex-none md:justify-start md:py-2 md:pl-3 md:ml-8': extended,
                                    'ml-2 p-2': !extended
                                }
                            )}
                        >
                            {subItem.icon}
                            <p className={clsx("hidden duration-150", { 'md:block': extended })}>{subItem.title}</p>
                        </Link>
                    );
                })}
            </>
        );
    } else {
        return (
            <Link
                href={href}
                className={clsx(
                    "flex h-[48px] items-center justify-center gap-2 rounded-md bg-slate-50 p-3 text-base text-gray-500 font-medium duration-150 hover:bg-slate-200 hover:text-slate-700 cursor-pointer",
                    {
                        'bg-slate-200 text-slate-700': path.startsWith(name),
                        'grow md:flex-none md:justify-start md:p-2 md:px-3': extended,
                    }
                )}
            >
                {icon}
                <p className={clsx("hidden duration-150",
                    { 'md:block': extended }
                )}>{title}</p>
            </Link>
        );
    }
}