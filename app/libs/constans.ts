
export const SideMenuList = {
    admin: [
        { name: 'dashboard', title: '대쉬보드', href: '/dashboard', icon: {name: 'space_dashboard', type: 'outlined'} },
        { name: 'user', title: '사용자', href: '/user', icon: {name: 'person', type: 'outlined'} },
        { name: 'device', title: '출력장치', href: '/device', icon: {name: 'print', type: 'outlined'} },
        { name: 'group', title: '그룹', href: '/group/device', icon: {name: 'people', type: 'outlined'} },
        { name: 'document', title: '문서', href: '/document/fax', icon: {name: 'inventory', type: 'outlined'} },
        { name: 'analysis', title: '통계', href: '/analysis/privacy', icon: {name: 'analytics', type: 'outlined'} },
        { name: 'logs', title: '로그', href: '/logs/auditlogs', icon: {name: 'plagiarism', type: 'outlined'} },
        { 
            name: 'settings', 
            title: '설정', 
            href: '', 
            icon: {name: 'settings', type: 'outlined'} ,
            submenu:[
                { name: 'registerUsers', 
                  title: '사용자 일괄 등록', 
                  href: '/settings/registerUsers' ,
                  icon: {name: 'person_add', type: 'outlined'}  
                },
                { name: 'regularExprPrivateInfo', 
                    title: '정규식/보안단어 관리', 
                    href: '/settings/regularExprPrivateInfo' ,
                    icon: {name: 'rule', type: 'outlined'}   
                },
            ]
        },
    ],
    security_manager: [
        { name: 'dashboard', title: '대쉬보드', href: '/dashboard', icon: {name: 'space_dashboard', type: 'outlined'} },
        { name: 'device', title: '출력장치', href: '/device', icon: {name: 'print', type: 'outlined'} },
        { name: 'group', title: '그룹', href: '/group/device', icon: {name: 'people', type: 'outlined'} },
        { name: 'document', title: '문서', href: '/document/fax', icon: {name: 'inventory', type: 'outlined'} },
        { name: 'print', title: '출력 리스트', href: '/print', icon: {name: 'article', type: 'outlined'} },
        { name: 'logs', title: '로그', href: '/logs/auditlogs', icon: {name: 'plagiarism', type: 'outlined'} },
    ],
    manager: [
        { name: 'dashboard', title: '대쉬보드', href: '/dashboard', icon: {name: 'space_dashboard', type: 'outlined'} },
        { name: 'device', title: '출력장치', href: '/device', icon: {name: 'print', type: 'outlined'} },
        { name: 'group', title: '그룹', href: '/group/device', icon: {name: 'people', type: 'outlined'} },
        { name: 'document', title: '문서', href: '/document/fax', icon: {name: 'inventory', type: 'outlined'} },
        { name: 'print', title: '출력 리스트', href: '/print', icon: {name: 'article', type: 'outlined'} },
    ],
    user: [
        { name: 'dashboard', title: '대쉬보드', href: '/dashboard', icon: {name: 'space_dashboard', type: 'outlined'} },
        { name: 'document', title: '문서', href: '/document/fax', icon: {name: 'inventory', type: 'outlined'} },
        { name: 'print', title: '출력 리스트', href: '/print', icon: {name: 'article', type: 'outlined'} },
    ]
}

export const BASE_PATH = `http://127.0.0.1:37000`;