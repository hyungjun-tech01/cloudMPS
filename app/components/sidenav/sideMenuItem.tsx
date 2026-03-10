'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ISideMenuItem } from '@/app/libs/types';
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";


export default function SideMenuItem({
    menuItem, path, extended, setExtended
}: {
    menuItem: ISideMenuItem,
    path: string,
    extended: boolean,
    setExtended?: () => void
}) {
    const { name, title, href, icon, icon_small, submenu } = menuItem;
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
                    className={clsx("flex items-center justify-between gap-2 rounded-md text-gray-500 duration-150 hover:bg-slate-200 hover:text-slate-700 cursor-pointer",
                        {
                            "h-[48px] p-3 font-medium text-base bg-slate-50": !selected,
                            "h-[36px] p-2 font-semibold text-sm bg-white": selected,
                        }
                    )}
                >
                    <div className='flex items-center gap-2 flex-none justify-start py-2'>
                        {selected ? icon_small : icon}
                        {extended && <p className="block duration-150">{title}</p>}
                    </div>
                    {extended && (selected ? <KeyboardArrowUp className="h-4 w-4" /> : <KeyboardArrowDown className="h-4 w-4" />)}
                </div>
                {selected && submenu.map((subItem) => {
                    const isActive = path.startsWith(subItem.name);
                    return (
                        <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={clsx(
                                "flex h-[42px] items-center gap-2 rounded-md bg-slate-50 text-base text-gray-500 font-medium duration-150 hover:bg-slate-200 hover:text-slate-700 flex-none justify-start py-2",
                                {
                                    'bg-slate-200 text-slate-700': isActive,
                                    'pl-8': extended,
                                    'pl-2': !extended
                                }
                            )}
                            onClick={setExtended ? () => setExtended() : undefined}
                        >
                            {subItem.icon}
                            {extended && <p className="block duration-150">{subItem.title}</p>}
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
                    "flex h-[48px] items-center justify-center gap-2 rounded-md bg-slate-50 p-3 text-base text-gray-500 font-medium duration-150 hover:bg-slate-200 hover:text-slate-700 cursor-pointer flex-none justify-start p-2 px-3",
                    {
                        'bg-slate-200 text-slate-700': path.startsWith(name),
                    }
                )}
                onClick={setExtended ? () => setExtended() : undefined}
            >
                {icon}
                {extended && <p className="block duration-150">{title}</p>}
            </Link>
        );
    }
}