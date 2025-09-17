'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logout } from "@/app/libs/actions";
import { useSession } from 'next-auth/react';
import 'material-icons/iconfont/material-icons.css';


interface IHeader {
    extendSideNav: () => void;
}

export default function Header({ extendSideNav }: IHeader) {
    const session = useSession();
    const userFullName = session?.data?.user.full_name ?? "Unknown";

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-account-menu';
    // const mobileMenuId = 'primary-search-account-menu-mobile';

    const renderMenu = (
        <div
            // anchorEl={anchorEl}
            // anchorOrigin={{
            //     vertical: 'bottom',
            //     horizontal: 'right',
            // }}
            id={menuId}
            // keepMounted
            // transformOrigin={{
            //     vertical: 'top',
            //     horizontal: 'right',
            // }}
            // open={isMenuOpen}
            // onClose={handleMenuClose}
        >
            <div>
                <div onClick={() => logout()}>
                    <span className='mr-3 font-medium'>로그아웃</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grow-0">
            <div className="static">
                <div>
                    <button
                        color="inherit"
                        aria-label="menu"
                    >
                        < div  className="text-lime-50" onClick={extendSideNav} />
                    </button>
                    <h4 className="grow pl-1 text-lime-50">
                        <Link href="/">
                            MPS Next
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
                            aria-controls={menuId}
                            aria-haspopup="true"
                            href={`/account`}
                            // onClick={handleProfileMenuOpen}
                            className="inherit flex items-center gap-2"
                        >
                            <span className='material-icons text-lime-50'>accout_circle</span>
                            <span className="text-lime-50">{userFullName}</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex">
                        <button
                            aria-label="show more"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            color="inherit"
                        >
                            <span className='material-icons text-lime-50'>more_vert</span>
                        </button>
                    </div>
                </div>
            </div>
            {renderMenu}
        </div>
    )
};