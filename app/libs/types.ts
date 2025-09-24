export interface IEditItem {
  name: string;
  title: string;
  type: "label" | "input" | "currency" | "select" | "checked" | "chart" | "password" | "hidden" | "react-select" | "button" | "status_bar";
  defaultValue: string | number;
  placeholder?: string;
  options?: { title: string; value: string | number; suffix?: string }[] | null;
  locale?: string;
  error?: string[] | null;
  chartData?: { xlabels: string[], ydata: number[], maxY: number };
  other?: React.JSX.Element;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export interface ISection {
  title: string;
  description: string | object | string[];
  items: IEditItem[];
};