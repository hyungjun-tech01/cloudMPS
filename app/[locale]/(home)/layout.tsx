'use client';

import { SessionProvider } from "next-auth/react";
import { useState } from 'react';
import Header from '@/app/components/header';
import SideNav from '@/app/components/sidenav/sidenav';
import { Box, Drawer } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sideNavExtended, extendSideNav] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', overflow: { md: 'hidden' } }}>
      <SessionProvider>
        <Header extendSideNav={() => extendSideNav(!sideNavExtended)} />
      </SessionProvider>
      <Box sx={{ display: 'flex', height: '100%', flexDirection: { xs: 'column', md: 'row' }, overflow: { md: 'hidden' } }}>
        {/* Mobile Sidebar (Popup Drawer) */}
        <Drawer
          anchor="left"
          open={sideNavExtended}
          onClose={() => extendSideNav(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 256 },
          }}
        >
          <SessionProvider>
            {/* On mobile, we always want the SideNav to look "extended" inside the popup */}
            <SideNav extended={true} />
          </SessionProvider>
        </Drawer>

        {/* Desktop Sidebar (Persistent) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            flexNone: 1,
            transition: 'width 0.2s',
            width: sideNavExtended ? 256 : 64,
            borderRight: 1,
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