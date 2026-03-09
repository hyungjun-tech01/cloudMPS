import type { ISideMenuItem } from '@/app/libs/types';
import {
  HomeOutlined,
  Quickreply,
  SpaceDashboardOutlined,
  SmartToyOutlined,
  EventNoteOutlined,
  ArticleOutlined,
  PersonOutlined,
  GroupOutlined,
  PrintOutlined,
  PeopleOutlined,
  InventoryOutlined,
  AnalyticsOutlined,
  PlagiarismOutlined,
  SettingsOutlined,
  PersonAddOutlined,
  RuleOutlined
} from '@mui/icons-material';

export const globalButtonHeight = 36;
export const defaultFontFamily = 'Pretendard';

export const colorPalette = {
  svgblack: '#1C1B1F',
  datepickerblack: 'rgba(0, 0, 0, 0.87)',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray110: '#FAFBFC',
  gray200: '#EEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#9E9E9E',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#222222',
  gray650: '#4A5568',
  gray660: '#718096',
  gray670: '#A0AEC0',
  green50: '#E5FCE3',
  green100: '#A5F4A0',
  green500: '#00C400',
  green600: '#01A900',
  green700: '#018600',
  darkgreen: '#1DA3A4',
  teal50: '#E0F2F1',
  teal100: '#D1F5F8',
  teal500: '#43BED0',
  teal600: '#2DA2B8',
  purple50: '#FBF5FF',
  purple500: '#9D50E5',
  blue30: '#EDF2F7',
  blue40: '#F7FAFC',
  blue50: '#EEF7FF',
  blue100: '#CBE8FF',
  blue200: '#A7D9FF',
  blue400: '#329CFF',
  blue500: '#067DFD',
  blue550: '#329CFF',
  blue600: '#0062E5',
  blue700: '#0048C8',
  geekBlue: '#6DA4FA',
  orange50: '#FFF6F2',
  orange100: '#FFF6F2',
  orange400: '#FF7638',
  orange500: '#F9560E',
  orange700: '#B43200',
  sunsetOrange: '#FFA956',
  yellow50: '#FFFCE5',
  yellow100: '#FDF8C8',
  yellow400: '#FFCC1F',
  yellow500: '#EAAD06',
  yellow600: '#CF8B00',
  yellow700: '#AC6600',
  indigo50: '#E8EAF6',
  indigo500: '#706FF7',
  goldenPurple: '#A677C6',
  red50: '#FFF5F5',
  red100: '#FFDADB',
  red500: '#EF2B2A',
  red600: '#DA120D',
  red700: '#BF0A03',
  dustRed: '#F17B62',
  pink500: '#E413C3',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  white: '#FFF',
  black: '#000',
  none: 'none',
  transparent: 'transparent'
} as const;

export type ColorPalette = typeof colorPalette;

export const SideMenuList: {
  ko: Record<string, ISideMenuItem>,
  en: Record<string, ISideMenuItem>
} = {
  ko: {
    home: {
      name: 'home',
      title: '홈',
      href: '/',
      icon: <HomeOutlined className="w-5" />,
      submenu: [
        {
          name: "home",
          title: "업무 관리",
          href: "/",
          icon: <SpaceDashboardOutlined className="w-4" />,
        },
        {
          name: "quickJobs",
          title: "빠른 작업",
          href: "/quickJobs",
          icon: <Quickreply className="w-4" />,
        },
        {
          name: "smartJobs",
          title: "스마트 업무",
          href: "/smartJobs",
          icon: <SmartToyOutlined className="w-4" />,
        },
        {
          name: "schedule",
          title: "일정관리",
          href: "/schedule",
          icon: <EventNoteOutlined className="w-4" />,
        },
        {
          name: "report",
          title: "보고서",
          href: "/report",
          icon: <ArticleOutlined className="w-4" />,
        }
      ],
    },
    user: {
      name: 'user',
      title: '사용자',
      href: "/user",
      icon: <PersonOutlined className="w-5" />,
    },
    client: {
      name: 'client',
      title: '거래처',
      href: "/client",
      icon: <GroupOutlined className="w-5" />,
    },
    device: {
      name: "device",
      title: "출력장치",
      href: "/device",
      icon: <PrintOutlined className="w-5" />,
    },
    group: {
      name: "group",
      title: "그룹",
      href: "/group/device",
      icon: <PeopleOutlined className="w-5" />,
    },
    document: {
      name: "document",
      title: "문서",
      href: "/document/fax",
      icon: <InventoryOutlined className="w-5" />,
    },
    analysis: {
      name: "analysis",
      title: "통계",
      href: "/analysis/privacy",
      icon: <AnalyticsOutlined className="w-5" />,
    },
    logs: {
      name: "logs",
      title: "로그",
      href: "/logs/auditlogs",
      icon: <PlagiarismOutlined className="w-5" />,
    },
    settings: {
      name: "settings",
      title: "설정",
      href: "",
      icon: <SettingsOutlined className="w-5" />,
      submenu: [
        {
          name: "registerUsers",
          title: "사용자 일괄 등록",
          href: "/settings/registerUsers",
          icon: <PersonAddOutlined className="w-4" />,
        },
        {
          name: "regularExprPrivateInfo",
          title: "정규식/보안단어 관리",
          href: "/settings/regularExprPrivateInfo",
          icon: <RuleOutlined className="w-4" />,
        },
      ],
    },
  },
  en: {
    home: {
      name: 'home',
      title: 'Home',
      href: '/',
      icon: <SpaceDashboardOutlined className="w-5" />,
      submenu: [
        {
          name: "home",
          title: "Manage Jobs",
          href: "/",
          icon: <PersonAddOutlined className="w-4" />,
        },
        {
          name: "quickJobs",
          title: "Quick Jobs",
          href: "/quickJobs",
          icon: <PersonAddOutlined className="w-4" />,
        },
        {
          name: "smartJobs",
          title: "Smart Jobs",
          href: "/smartJobs",
          icon: <PersonAddOutlined className="w-4" />
        },
        {
          name: "schedule",
          title: "Manage Schedule",
          href: "/schedule",
          icon: <PersonAddOutlined className="w-4" />
        },
        {
          name: "report",
          title: "Report",
          href: "/report",
          icon: <PersonAddOutlined className="w-4" />
        }
      ],
    },
    user: {
      name: 'user',
      title: 'User',
      href: "/user",
      icon: <PersonOutlined className="w-5" />,
    },
    client: {
      name: 'client',
      title: 'client',
      href: "/client",
      icon: <GroupOutlined className="w-5" />,
    },
    device: {
      name: "device",
      title: "Device",
      href: "/device",
      icon: <PrintOutlined className="w-5" />,
    },
    group: {
      name: "group",
      title: "Group",
      href: "/group/device",
      icon: <PeopleOutlined className="w-5" />,
    },
    document: {
      name: "document",
      title: "Document",
      href: "/document/fax",
      icon: <InventoryOutlined className="w-5" />,
    },
    analysis: {
      name: "analysis",
      title: "Analisys",
      href: "/analysis/privacy",
      icon: <AnalyticsOutlined className="w-5" />,
    },
    logs: {
      name: "logs",
      title: "Logs",
      href: "/logs/auditlogs",
      icon: <PlagiarismOutlined className="w-5" />,
    },
    settings: {
      name: "settings",
      title: "Settings",
      href: "",
      icon: <SettingsOutlined className="w-5" />,
      submenu: [
        {
          name: "registerUsers",
          title: "Batch Register Users",
          href: "/settings/registerUsers",
          icon: <PersonAddOutlined className="w-4" />,
        },
        {
          name: "regularExprPrivateInfo",
          title: "Manage Regular Exp./Security",
          href: "/settings/regularExprPrivateInfo",
          icon: <RuleOutlined className="w-4" />,
        },
      ],
    },
  }
};

export const MIN_PASSWORD_LENGTH = 6;
export const BASE_PATH = "http://localhost:38005";
export const REQ_INIT_ACCOUNT_PATH = "/login/init";

export const USER_TYPE = {
  PARTNER: "PARTNER",
  SUBSCRIPTION: "SUBSCRIPTION",
  FREE_USER: "FREE_USER",
  PARTNER_USER: "PARTNER_USER",
  SUBSCRIPT_USER: "SUBSCRIPT_USER"
}

export const USER_STATUS_TYPE = {
  NEED_AUTH: "NEED_AUTH",
  COMPLETE_AUTH: "COMPLETE_AUTH",
  PASSWORD_CHANGING: "PASSWORD_CHANGING"
}

export const DEVICE_TYPE = {
  MONO_PRINTER: "mono_printer",
  COLOR_PRINTER: "color_printer",
  MONO_MFP: "mono_mfp",
  COLOR_MFP: "color_mfp"
}
