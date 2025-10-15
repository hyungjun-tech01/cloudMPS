export interface IEditItem {
  name: string;
  title: string | string[];
  type: "label" | "input" | "currency" | "select" | "checked" | "chart" | "password" | "hidden" | "react-select" | "button" | "status_bar";
  defaultValue: string | number;
  placeholder?: string;
  options?: { title: string | string[]; value: string | number; suffix?: string }[] | null;
  locale?: string;
  errors?: string[] | null;
  chartData?: { xlabels: string[], ydata: number[], maxY: number };
  other?: React.JSX.Element;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export interface ISection {
  title: string | string[];
  description: string | object | string[];
  items: IEditItem[];
};

export interface UserData {
  companyName?: string;
  ceoName?: string;
  companyRegistrationNo?: string;
  business_type?: string;
  business_item?: string;
  userName: string;
  userFullName?: string;
  userEmail: string;
  userPassword: string;
  userType: "company" | "person";
};

export interface RegisterData {
  termsOfService: "Y" | "N";
  privacyPolicy: "Y" | "N";
  locationInfoPolicy: "Y" | "N";
  eventPromotionPolicy: "Y" | "N";
  userData: UserData;
}

export interface LoginData {
  user_name: string;
  password: string;
  company_code?: string;
  verification_code?: string;
  is_init: boolean;
  ip_address: string | null;
}

export interface LoginResultData {
  ResultCode: string | number;
  ErrorMessage: string;
  token: string;
}

// 타입 정의 추가
export interface ISideMenuItem {
  name: string;
  title: string;
  href: string;
  icon: {name: string, type: string, props?: string};
  submenu?: {
    name: string;
    title: string;
    href: string;
    icon: {name: string, type: string, props?: string};
  }[];
}

export interface IButtonInfo {
  cancel: { title: string, link: string },
  go: { title: string };
  save?: {title:string};
  delete?: {title:string};
  add?:{title:string};
};

export interface ICardSubItem {
  first: { title: string, value: string, sub?: { title: string, value: number|string, color?:string }[] };
  second: { title: string, value: { title: string, value: number|string, color?:string }[] };
};