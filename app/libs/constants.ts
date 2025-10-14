import type { ISideMenuItem } from '@/app/libs/types';

export const SideMenuList : {
  ko: Record<string, ISideMenuItem>,
  en: Record<string, ISideMenuItem>
} = {
  ko: {
    home: {
      name: 'home',
      title: '홈',
      href: '/',
      icon: { name: "home", type: "outlined" },
      submenu: [
        {
          name: "home",
          title: "업무 관리",
          href: "/",
          icon: { name: "space_dashboard", type: "outlined" },
        },
        {
          name: "quickJobs",
          title: "빠른 작업",
          href: "/quickJobs",
          icon: { name: "quickreply", type: "outlined" },
        },
        {
          name: "smartJobs",
          title: "스마트 업무",
          href: "/smartJobs",
          icon: { name: "smart_toy", type: "outlined" },
        },
        {
          name: "schedule",
          title: "일정관리",
          href: "/schedule",
          icon: { name: "event_note", type: "outlined" },
        },
        {
          name: "report",
          title: "보고서",
          href: "/report",
          icon: { name: "article", type: "outlined" },
        }
      ],
    },
    user: {
      name: 'user',
      title: '사용자',
      href: "/user",
      icon: { name: "person", type: "outlined" },
    },
    device: {
      name: "device",
      title: "출력장치",
      href: "/device",
      icon: { name: "print", type: "outlined" },
      submenu: [
        {
          name: "monitor",
          title: "모니터링",
          href: "/device",
          icon: { name: "monitor_heart", type: "outlined" },
        },
      ]
    },
    group: {
      name: "group",
      title: "그룹",
      href: "/group/device",
      icon: { name: "people", type: "outlined" },
    },
    document: {
      name: "document",
      title: "문서",
      href: "/document/fax",
      icon: { name: "inventory", type: "outlined" },
    },
    analysis: {
      name: "analysis",
      title: "통계",
      href: "/analysis/privacy",
      icon: { name: "analytics", type: "outlined" },
    },
    logs: {
      name: "logs",
      title: "로그",
      href: "/logs/auditlogs",
      icon: { name: "plagiarism", type: "outlined" },
    },
    settings: {
      name: "settings",
      title: "설정",
      href: "",
      icon: { name: "settings", type: "outlined" },
      submenu: [
        {
          name: "registerUsers",
          title: "사용자 일괄 등록",
          href: "/settings/registerUsers",
          icon: { name: "person_add", type: "outlined" },
        },
        {
          name: "regularExprPrivateInfo",
          title: "정규식/보안단어 관리",
          href: "/settings/regularExprPrivateInfo",
          icon: { name: "rule", type: "outlined" },
        },
      ],
    },
  },
  en: {
    home: {
      name: 'home',
      title: 'Home',
      href: '/',
      icon: { name: "space_dashboard", type: "outlined" },
      submenu: [
        {
          name: "home",
          title: "Manage Jobs",
          href: "/",
          icon: { name: "person_add", type: "outlined" },
        },
        {
          name: "quickJobs",
          title: "Quick Jobs",
          href: "/quickJobs",
          icon: { name: "person_add", type: "outlined" },
        },
        {
          name: "smartJobs",
          title: "Smart Jobs",
          href: "/smartJobs",
          icon: { name: "person_add", type: "outlined" },
        },
        {
          name: "schedule",
          title: "Manage Schedule",
          href: "/schedule",
          icon: { name: "person_add", type: "outlined" },
        },
        {
          name: "report",
          title: "Report",
          href: "/report",
          icon: { name: "person_add", type: "outlined" },
        }
      ],
    },
    user: {
      name: 'user',
      title: 'User',
      href: "/user",
      icon: { name: "person", type: "outlined" },
    },
    device: {
      name: "device",
      title: "Device",
      href: "/device",
      icon: { name: "print", type: "outlined" },
    },
    group: {
      name: "group",
      title: "Group",
      href: "/group/device",
      icon: { name: "people", type: "outlined" },
    },
    document: {
      name: "document",
      title: "Document",
      href: "/document/fax",
      icon: { name: "inventory", type: "outlined" },
    },
    analysis: {
      name: "analysis",
      title: "Analisys",
      href: "/analysis/privacy",
      icon: { name: "analytics", type: "outlined" },
    },
    logs: {
      name: "logs",
      title: "Logs",
      href: "/logs/auditlogs",
      icon: { name: "plagiarism", type: "outlined" },
    },
    settings: {
      name: "settings",
      title: "Settings",
      href: "",
      icon: { name: "settings", type: "outlined" },
      submenu: [
        {
          name: "registerUsers",
          title: "Batch Register Users",
          href: "/settings/registerUsers",
          icon: { name: "person_add", type: "outlined" },
        },
        {
          name: "regularExprPrivateInfo",
          title: "Manage Regular Exp./Security",
          href: "/settings/regularExprPrivateInfo",
          icon: { name: "rule", type: "outlined" },
        },
      ],
    },
  }
};

export const BASE_PATH = "http://localhost:38005";
