// ----------- Login ----------------------------------------------------------------
export interface LoginData {
  user_name: string;
  password: string;
  company_code?: string;
  verification_code?: string;
  is_init: "Y" | "N";
  ip_address: string | null;
}

export interface LoginResultData {
  ResultCode: string | number;
  ErrorMessage: string;
  token: string;
}

// ----------- Register ----------------------------------------------------------------
export interface RegisterData {
  termsOfService: "Y" | "N";
  privacyPolicy: "Y" | "N";
  locationInfoPolicy: "Y" | "N";
  eventPromotionPolicy: "Y" | "N";
  userData: {
    companyName?: string;
    ceoName?: string;
    companyRegistrationNo?: string;
    business_type?: string;
    business_item?: string;
    userName: string;
    userFullName?: string;
    userEmail: string;
    userPassword: string;
    userType: "COMPANY" | "PERSON";
  };
}

// ----------- Users --------------------------------------------------------------------
export interface UserData {
  user_id: string;
  user_name: string;
  external_user_name: string | null;
  full_name: string;
  email: "newtons2002@naver.com";
  notes: string | null;
  total_jobs: number;
  total_pages: number;
  reset_by: string | null;
  reset_date: Date | null;
  schedule_period: string | null;
  schedule_amount: number | null;
  schedule_start: number | null;
  deleted: "Y" | "N";
  deleted_date: Date | null;
  created_date: Date;
  created_by: string;
  user_source_type: string | null;
  modified_date: Date | null;
  modified_by: string | null;
  department: string | null;
  office: string | null;
  card_number: string | null;
  card_number2: string | null;
  disabled_printing: "Y" | "N";
  disabled_printing_until: Date | null;
  home_directory: string | null;
  balance: number;
  sysadmin: string | null;
  privilege: string;
  user_type: "COMPANY" | "PERSON";
  company_code: number;
  user_status: string;
  terms_of_service: "Y" | "N";
  privacy_policy: "Y" | "N";
  location_information: "Y" | "N";
  notification_email: "Y" | "N";
  password?: string;
  user_role: "PARTNER" | "SUBSCRIPTION" | "FREE_USER" | "PARTNER_USER" | "SUBSCRIPT_USER";
}

export type UserState = {
  errors?: {
    userFullName?: string[];
  };
  message?: string | null;
};

// ----------- Components ----------------------------------------------------------------
export interface IEditItem {
  name: string;
  title: string | string[];
  type:
  | "label"
  | "input"
  | "currency"
  | "select"
  | "checked"
  | "chart"
  | "password"
  | "hidden"
  | "react-select"
  | "button"
  | "status_bar";
  defaultValue: string | number;
  placeholder?: string;
  options?:
  | { title: string | string[]; value: string | number; suffix?: string }[]
  | null;
  locale?: string;
  errors?: string[] | null;
  chartData?: { xlabels: string[]; ydata: number[]; maxY: number };
  other?: React.JSX.Element;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export interface ISection {
  title: string | string[];
  description: string | object | string[];
  items: IEditItem[];
}

export interface ISideMenuItem {
  name: string;
  title: string;
  href: string;
  icon: { name: string; type: string; props?: string };
  submenu?: {
    name: string;
    title: string;
    href: string;
    icon: { name: string; type: string; props?: string };
  }[];
}

export interface IButtonInfo {
  cancel: { title: string; link: string };
  go: { title: string };
  save?: { title: string };
  delete?: { title: string };
  add?: { title: string };
}

export interface ICardSubItem {
  first: {
    title: string;
    value: string;
    sub?: { title: string; value: number | string; color?: string }[];
  };
  second: {
    title: string;
    value: { title: string; value: number | string; color?: string }[];
  };
}

export interface ISearch {
  query?: string;
  itemsPerPage?: string;
  page?: string;
}

export interface IColumn {
  title: string;
  dataIndex: string;
  key: string;
}
