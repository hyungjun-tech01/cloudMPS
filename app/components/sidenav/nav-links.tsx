'use client';

import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { SideMenuList } from '@/app/libs/constants';
import SideMenuItem from './sideMenuItem';


export default function NavLinks({ extended }: { extended: boolean }) {
  const pathname = usePathname();
  const splittedPathname = pathname.split('/');
  const locale = splittedPathname[0] === "" ? 'ko' : splittedPathname[0] as 'ko' | 'en';
  const category = splittedPathname[1] === "" ? 'home' : splittedPathname[1];
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? "user";
  const menuList = [];

  console.log('Path:', pathname);
  console.log('User Role:', userRole);

  if(userRole === 'admin') {
    menuList.push('home');
    menuList.push('device');
    menuList.push('analysis');
  } else {
    menuList.push('home');
    menuList.push('device');
  }

  return (
    <>
      { menuList.map(name => 
        <SideMenuItem 
          key={name}
          menuItem={SideMenuList[locale][name]}
          path={category} extended={extended}
        /> )}
    </>
  );
}