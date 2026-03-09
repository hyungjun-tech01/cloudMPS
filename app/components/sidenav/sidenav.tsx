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
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', px: { xs: 1.5, md: 1 }, py: 2 }}>
            <Box
                sx={{
                    display: { md: isAdmin ? 'flex' : 'block' },
                    flexDirection: { md: 'column' },
                    flexGrow: { md: isAdmin ? 1 : 0 },
                    justifyContent: { md: 'space-between' },
                    gap: 1
                }}
            >
                <NavLinks extended={extended} />
                {isAdmin &&
                    <>
                        <Box sx={{ display: { xs: 'none', md: 'block' }, height: 'auto', width: '100%', flexGrow: 1, borderRadius: 1 }} />
                        <form action={logout}>
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
                                <Box sx={{ display: { xs: 'none', md: extended ? 'block' : 'none' }, transition: 'all 0.15s' }}>
                                    로그아웃
                                </Box>
                            </Button>
                        </form>
                    </>
                }
            </Box>
        </Box>
    )
};