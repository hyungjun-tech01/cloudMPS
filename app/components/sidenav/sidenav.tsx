import React from 'react';
import { useSession } from "next-auth/react";
import NavLinks from './nav-links';
import { logout } from '@/app/libs/actions';
import { Box, Button } from '@mui/material';
import { PowerSettingsNewOutlined } from '@mui/icons-material';


export default function SideNav({ extended }: { extended: boolean }) {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="flex flex-col h-full px-1 py-2">
            <div className="flex flex-col grow justify-between gap-2">
                <NavLinks />
                <div className="block h-auto w-full grow border-radius-1" />
                <form action={logout} className="block md:hidden">
                    <Button
                        type="submit"
                        variant="text"
                        color="inherit"
                        fullWidth
                        sx={{
                            display: 'flex',
                            height: 48,
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            gap: 1,
                            borderRadius: 1,
                            color: 'text.secondary',
                            p: { xs: 1.5, md: 1 },
                            px: { md: 1.5 },
                            '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' },
                            textTransform: 'none'
                        }}
                    >
                        <PowerSettingsNewOutlined className="w-6" />
                        <Box sx={{ display: { xs: 'block', md: 'none' }, transition: 'all 0.15s' }}>
                            로그아웃
                        </Box>
                    </Button>
                </form>
            </div>
        </div>
    )
};