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
  authType?: "USER_SIGN_UP" | "USER_TEMP_PASS";
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
export type UserState = {
  errors?: {
    userName?: string[];
    externalUserName?: string[];
    fullName?: string[];
    notes?: string[];
    totalJobs?: string[];
    totalPages?: string[];
    schedulePeriod?: string[];
    scheduleAmount?: string[];
    scheduleStart?: string[];
    department?: string[];
    office?: string[];
    cardNumber?: string[];
    cardNumber2?: string[];
    disabledPrinting?: string[];
    disabledPrintingUntil?: string[];
    homeDirectory?: string[];
    balance?: string[];
    sysadmin?: string[];
    privilege?: string[];
    userType?: string[];
    companyCode?: string[];
    userStatus?: string[];
    userRole?: string[];
  };
  message?: string | null;
};

export interface UserData {
  user_id: string;
  user_name: string;
  external_user_name: string | null;
  full_name: string;
  email: string;
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

// ----------- Members --------------------------------------------------------------------
export type MemberState = {
  errors?: {
    userName?: string[];
    userEmail?: string[];
    companyCode?: string[];
    ipAddress?: string[];
    updatedBy?: string[];
  };
  message?: string | null;
};

// ----------- Clients --------------------------------------------------------------------
export type ClientState = {
  errors?: {
    clientName?: string[];
    clientNameEn?: string[];
    ceoName?: string[];
    clientZipCode?: string[];
    clientAddress?: string[];
    clientPhoneNumber?: string[];
    clientFaxNumber?: string[];
    homepage?: string[];
    status?: string[];
    businessRegistrationCode?: string[];
    businessType?: string[];
    businessItem?: string[];
    industryType?: string[];
    clientGoup?: string[];
    clientScale?: string[];
    dealType?: string[];
    establishmentDate?: string[];
    closureDate?: string[];
    bankName?: string[];
    accountCode?: string[];
    accountOwner?: string[];
    salesResource?: string[];
    applicationEngineer?: string[];
    region?: string[];
    clientMemo?: string[];
  };
  message?: string | null;
};

export interface ClientData {
  client_id: string;
  client_group: string;
  client_scale: string;
  deal_type: string;
  client_name: string;
  client_name_en: string;
  business_registration_code: string;
  establishment_date: Date;
  closure_date: Date;
  ceo_name: string;
  business_type: string;
  business_item: string;
  industry_type: string;
  client_zip_code: string;
  client_address: string;
  client_phone_number: string;
  client_fax_number: string;
  homepage: string;
  client_memo: string;
  created_by: string;
  create_date: Date;
  modify_date: Date;
  recent_user: string;
  account_code: string;
  bank_name: string;
  account_owner: string;
  sales_resource: string;
  application_engineer: string;
  region: string;
  status: string;
  user_name: string;
  company_code: string;
  ip_address: string;
};

// ----------- Devices -------------------------------------------------------------------
export interface DeviceData {
  device_id: string;
  device_name: string;
  created_date: string;
  created_by: string;
  modified_date: string;
  modified_by: string;
  ext_device_function: string;
  physical_device_id: string;
  location: string;
  device_model: string;
  serial_number: string;
  device_status: string;
  device_type: string;
  black_toner_percentage: number;
  cyan_toner_percentage: number;
  magenta_toner_percentage: number;
  yellow_toner_percentage: number;
  app_type: string;
  black_drum_percentage: number;
  cyan_drum_percentage: number;
  magenta_drum_percentage: number;
  yellow_drum_percentage: number;
  client_name: string;
};

export type DeviceState = {
  errors?: {
    deviceName?: string[];
    extDeviceFunction?: string[];
    physicalDeviceId?: string[];
    location?: string[];
    deviceModel?: string[];
    serialNumber?: string[];
    deviceStatus?: string[];
    deviceType?: string[];
    blackTonerPercentage?: string[];
    cyanTonerPercentage?: string[];
    magentaTonerPercentage?: string[];
    yellowTonerPercentage?: string[];
    appType?: string[];
    blackDrumPercentage?: string[];
    cyanDrumPercentage?: string[];
    magentaDrumPercentage?: string[];
    yellowDrumPercentage?: string[];
    clientId?: string[];
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
  | "status_bar"
  | "date"
  | "number";
  defaultValue: string | number | Date | null;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  options?:
  | { title: string | string[]; value: string | number; suffix?: string }[]
  | null;
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
