export interface IEditItem {
  name: string;
  title: string | string[];
  type: "label" | "input" | "currency" | "select" | "checked" | "chart" | "password" | "hidden" | "react-select" | "button" | "status_bar";
  defaultValue: string | number;
  placeholder?: string | string[];
  options?: { title: string | string[]; value: string | number; suffix?: string }[] | null;
  locale?: string;
  error?: string[] | null;
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