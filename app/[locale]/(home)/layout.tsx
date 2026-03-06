'use client';

import { SessionProvider } from "next-auth/react";
import { useState } from 'react';
import Header from '@/app/components/header';
import SideNav from '@/app/components/sidenav/sidenav';
import { Box } from '@mui/material';


export default function Layout({ children }: { children: React.ReactNode }) {
  const [sideNavExtended, extendSideNav] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', overflow: { md: 'hidden' } }}>
      <SessionProvider>
        <Header extendSideNav={() => extendSideNav(!sideNavExtended)} />
      </SessionProvider>
      <Box sx={{ display: 'flex', height: '100%', flexDirection: { xs: 'column', md: 'row' }, overflow: { md: 'hidden' } }}>
        <Box
          sx={{
            flexNone: 1,
            transition: 'width 0.2s',
            width: { xs: '100%', md: sideNavExtended ? 256 : 64 },
            borderRight: { md: 1 },
            borderColor: 'divider',
            bgcolor: 'background.paper',
            zIndex: 1 // keeps side nav visually separated
          }}
        >
          <SessionProvider>
            <SideNav extended={sideNavExtended} />
          </SessionProvider>
        </Box>
        <Box sx={{ flexGrow: 1, p: { xs: 3, md: 6 }, overflowY: { md: 'auto' }, bgcolor: 'background.default' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}