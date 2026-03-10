import React from 'react';
import { useSession } from "next-auth/react";
import NavLinks from './nav-links';
import { logout } from '@/app/libs/actions';
import { Box, Button } from '@mui/material';
import { PowerSettingsNewOutlined } from '@mui/icons-material';
import { colorPalette } from '@/app/libs/constants';


export default function SideNav({ extended, setExtended }: {
    extended: boolean,
    setExtended?: () => void
}) {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="flex flex-col h-full px-1 py-2">
            <div className="flex flex-col grow justify-between gap-2">
                <NavLinks extended={extended} setExtended={setExtended} />
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
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 1,
                            borderRadius: 1,
                            backgroundColor: colorPalette.slate50,
                            color: 'text.secondary',
                            p: 1,
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