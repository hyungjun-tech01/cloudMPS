'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logout } from "@/app/libs/actions";
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import MaterialIcon from './materialIcon';


interface IHeader {
    extendSideNav: () => void;
}

export default function Header({ extendSideNav }: IHeader) {
    const session = useSession();
    const userFullName = session?.data?.user.full_name ?? "Unknown";

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        setAnchorEl(target);

        setTimeout(() => {
            const menuEl = document.getElementById(menuId);
            if(!!menuEl) {
                menuEl.style.left = `${target.offsetLeft - menuEl.clientWidth}px`;
                menuEl.style.top = `${target.offsetHeight + target.clientHeight}px`;
                menuEl.style.visibility = 'visible';
            }
        }, 100);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        const menuEl = document.getElementById(menuId);
        if(menuEl) {
            menuEl.style.visibility = 'hidden';
        }
    };
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        const target = event.target as HTMLElement;
        if(!target || !target.id || (target.id !== menuId)) {
            handleMenuClose();
        }
    };
    

    const menuId = 'primary-search-account-menu';
    // const mobileMenuId = 'primary-search-account-menu-mobile';


    const renderMenu = (
        <div
            className={clsx("absolute top-0 left-0 w-screen h-screen z-10",
                {"hidden": !isMenuOpen},
                {"block": isMenuOpen}
            )}
            onClick={handleMenuClick}
        >
            <div 
                id={menuId}
                className='absolute rounded-md bg-slate-50 shadow-xl/30 invisible'
            >
                <div className='min-w-32 h-12 px-2 py-1 flex items-center justify-strech' onClick={() => logout()}>
                    <span className='font-medium hover:bg-slate-100'>로그아웃</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grow-0">
            <div className="static">
                <div className="bg-[#142131] h-16 px-6 flex flex-row justify-between items-center">
                    <div
                        className='flex mr-2'
                        onClick={extendSideNav}
                    >
                        <MaterialIcon name="menu" type="outlined" props="h-6 w-6 text-slate-50 cursor-pointer" />
                    </div>
                    <h4 className="grow pl-1 text-slate-50 text-2xl font-semibold">
                        <Link href="/home">
                            Cloud MPS
                        </Link>
                    </h4>
                    <div className="grow" />
                    <div className="hidden gap-2 md:flex">
                        {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon className="text-lime-50" />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon className="text-lime-50" />
                            </Badge>
                        </IconButton> */}
                        <Link
                            aria-label="account of current user"
                            href={`/account`}
                            // onClick={handleProfileMenuOpen}
                            className="inherit flex items-center gap-2"
                        >
                            <MaterialIcon name="account_circle" props="h-6 w-6 text-slate-50" />
                            <span className="text-slate-50">{userFullName}</span>
                        </Link>
                    </div>
                    <div className="hidden text-slate-50 cursor-pointer ml-2 md:flex"
                        onClick={handleMenuOpen}
                    >
                        <MaterialIcon name="more_vert" type="outlined" props="h-6 w-6" />
                    </div>
                </div>
            </div>
            {renderMenu}
        </div>
    )
};