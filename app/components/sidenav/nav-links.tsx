'use client';

import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { SideMenuList, SIDE_MENUS_BY_USER_TYPE } from '@/app/libs/constants';
import SideMenuItem from './sideMenuItem';


export default function NavLinks({ extended, setExtended }: {
  extended: boolean,
  setExtended?: () => void
}) {
  const pathname = usePathname();
  const splittedPathname = pathname.split('/');
  const locale = splittedPathname[0] === "" ? 'ko' : splittedPathname[0] as 'ko' | 'en';
  const category = splittedPathname[1] === "" ? 'home' : splittedPathname[1];
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? "FREE_USER";
  const menuList = SIDE_MENUS_BY_USER_TYPE[userRole];

  return (
    <>
      {menuList.map(name =>
        <SideMenuItem
          key={name}
          menuItem={SideMenuList[locale][name]}
          path={category}
          extended={extended}
          setExtended={setExtended}
        />)}
    </>
  );
}