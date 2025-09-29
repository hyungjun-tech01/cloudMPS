'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import MaterialIcon from '../materialIcon';


export default function SideMenu({
    name, title, href, icon, submenu, extended, expanded
}:{
    name: string,
    title: string,
    href: URL,
    icon: { name: string, type: string, props?: string},
    submenu?: { name: string, title: string, href: string, icon: { name: string, type: string}},
    extended: boolean,
    expanded: boolean
}) {
    const [selected, setSelected] = useState(false);
    const handleClick = () => {
        setSelected(!selected);
    };
    const LinkIcon = <MaterialIcon name={icon.name} type={icon.type} props={`${icon.props} w-6`} />;

    if(!!submenu) {
        return (
            <div
                onClick={handleClick}
                className={clsx(
                    "flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-base text-gray-500 font-medium duration-150 hover:bg-lime-100 hover:text-lime-700 cursor-pointer",
                    {
                        'bg-lime-100 text-lime-700': selected,
                        'grow md:flex-none md:justify-start md:p-2 md:px-3': extended,
                    }
                )}
            >
                {LinkIcon}
                <p className={clsx("hidden duration-150",
                    { 'md:block': extended }
                )}>{title}</p>
            </div>
        );
    } else {
        return (
            <Link
                href={href}
                className={clsx(
                    "flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-base text-gray-500 font-medium duration-150 hover:bg-lime-100 hover:text-lime-700 cursor-pointer",
                    {
                        'bg-lime-100 text-lime-700': selected,
                        'grow md:flex-none md:justify-start md:p-2 md:px-3': extended,
                    }
                )}
            >
                {LinkIcon}
                <p className={clsx("hidden duration-150",
                    { 'md:block': extended }
                )}>{title}</p>
            </Link>
        );
    }
}