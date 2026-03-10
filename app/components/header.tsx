'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logout } from "@/app/libs/actions";
import { useSession } from 'next-auth/react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Avatar } from '@mui/material';
import MaterialIcon from './materialIcon';


interface IHeader {
    extendSideNav: () => void;
}

export default function Header({ extendSideNav }: IHeader) {
    const session = useSession();
    const userFullName = session?.data?.user.fullName ?? "Unknown";

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={extendSideNav}
                >
                    <MaterialIcon name="menu" type="outlined" props="" />
                </IconButton>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    <Link href="/intro" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Cloud MPS
                    </Link>
                </Typography>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                    <Link href="/account" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', color: 'white' }}>
                            {userFullName.charAt(0)}
                        </Avatar>
                        <Typography variant="body1">{userFullName}</Typography>
                    </Link>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 1 }}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        color="inherit"
                    >
                        <MaterialIcon name="more_vert" type="outlined" props="" />
                    </IconButton>
                </Box>
            </Toolbar>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { handleMenuClose(); logout(); }}>로그아웃</MenuItem>
            </Menu>
        </AppBar>
    )
};