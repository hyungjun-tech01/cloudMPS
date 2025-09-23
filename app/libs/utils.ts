
export const formatCurrency = (
  amount: number | string | null | undefined,
  locale: string = "ko"
) => {
  let currency = "KRW";
  let check_locale = "";

  switch (locale) {
    case "en":
      currency = "USD";
      check_locale = "en-US";
      break;
    default:
      check_locale = "ko-KR";
      break;
  }

  if(!amount) {
    const temp = 0;
    return temp.toLocaleString(check_locale, {
      style: "currency",
      currency: currency,
    });
  }

  return amount.toLocaleString(check_locale, {
    style: "currency",
    currency: currency,
  });
};

export const formatDateToLocal = (dateStr: string, locale: string = "ko") => {
  let check_locale = "";
  switch (locale) {
    case "en":
      check_locale = "en-US";
      break;
    default:
      check_locale = "ko-KR";
      break;
  }
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(check_locale, options);
  return formatter.format(date);
};

export const formatTimeToLocal = (dateStr: string, locale: string = "ko") => {
  let check_locale = "";
  switch (locale) {
    case "en":
      check_locale = "en-US";
      break;
    default:
      check_locale = "ko-KR";
      break;
  }
  
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(check_locale, options);
  try {
    return formatter.format(date);
  }
  catch(e){
    console.log('[Error] message: ', e);
    console.log(' - formatDate / input :', dateStr);
    console.log(' - converted :', date);
    return "";
  }
};

// export const generateYAxis = (revenue: Revenue[]) => {
//   // Calculate what labels we need to display on the y-axis
//   // based on highest record and in 1000s
//   const yAxisLabels = [];
//   const highestRecord = Math.max(...revenue.map((month) => month.revenue));
//   const topLabel = Math.ceil(highestRecord / 1000) * 1000;

//   for (let i = topLabel; i >= 0; i -= 1000) {
//     yAxisLabels.push(`$${i / 1000}K`);
//   }

//   return { yAxisLabels, topLabel };
// };

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const generateStrOf30Days = () => {
  const today = new Date();
  const xData: string[] = [];
  for (let i = 0; i < 30; i++) {
    const tempDay = new Date();
    tempDay.setDate(today.getDate() + i - 30);
    const tempDayStr = tempDay.toISOString().split("T")[0];
    xData.push(tempDayStr);
  }
  return xData;
};

export const formatDateForPerMonth = (value: number, locale: string) => {
  if(locale === "en") {
    if(value == 1)
      return '1st';
    else if(value == 2)
      return '2nd';
    else if(value == 3)
      return '3rd';
    else
      return value + 'th';
  } else {
    return value + ' 일';
  }
}

export const formatDateForPerYear = (value: number, locale: string) => {
  const tempDate = new Date();
  tempDate.setMonth(Math.floor(value/100) - 1);
  tempDate.setDate(value%100);

  let check_locale = "";
  switch (locale) {
    case "en":
      check_locale = "en-US";
      break;
    default:
      check_locale = "ko-KR";
      break;
  }
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };
  const formatter = new Intl.DateTimeFormat(check_locale, options);
  return formatter.format(tempDate);
}

export const formatTimeSimple = (dateStr: string) => {
  try {
    const date = new Date(dateStr);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
  } catch(e){
    console.log('[Error] message: ', e);
    console.log(' - formatDate / input :', dateStr);
    console.log(' - converted :', dateStr);
    return "";
  }
};

export const formatTimeYYYYpMMpDD = (inputDate: Date) => {
  const yyyy = String(inputDate.getFullYear());
  const mo = String(inputDate.getMonth() + 1).padStart(2,'0');
  const dd = String(inputDate.getDate()).padStart(2,'0');

  return `${yyyy}.${mo}.${dd}`;
};

export const formatTimeYYYYpMMpDD_FromDB = (inputValue: number) => {
  const inputStr = String(inputValue);

  return `20${inputStr.slice(0,2)}.${inputStr.slice(2,4)}.${inputStr.slice(4,6)}`;
};

export const formatTimeYYYY_MM_DDbHHcMM_FromDB = (inputValue: number) => {
  const inputStr = String(inputValue);
  return `20${inputStr.slice(0,2)}-${inputStr.slice(2,4)}-${inputStr.slice(4,6)} ${inputStr.slice(6,8)}:${inputStr.slice(8,10)}`
}

export function generateChangeLog(
  oldData: Record<string, object | string | number | null>,
  newData: Record<string, object | string | number | null>,
  fieldLabels: Record<string, string>,
  ignoreFields: string[] = []
): string {
  const changes: string[] = [];

  for (const key in newData) {
    // 비교에서 제외할 필드이거나, 이전 데이터에 없는 키는 건너뜁니다.
    if (ignoreFields.includes(key) ) {
      continue;
    }

    const oldValue = oldData?.hasOwnProperty(key) ? oldData[key] : '';
    const newValue = newData[key];

    // 값이 변경되었는지 확인합니다 (null, undefined 처리 포함).
    if (String(oldValue) !== String(newValue)) {
      const label = fieldLabels[key] || key; // 매핑된 한글 이름이 없으면 키 값을 그대로 사용
      changes.push(`${label}: '${oldValue}' -> '${newValue}'`);
    }
  }
  
  if (!newData && oldData) {
    for (const key in oldData) {
      if (ignoreFields.includes(key)) continue;

      const oldValue = oldData[key];
      const label = fieldLabels[key] || key;

      changes.push(`${label}: '${oldValue}' -> ''`);
    }
  }

  console.log('changes', changes);
  return changes.join(', ');
}

export function generateDeleteLog(
  oldData: Record<string, object | string | number>,
  fieldLabels: Record<string, string>,
  ignoreFields: string[] = []
): string {
  const changes: string[] = [];

  for (const key in oldData) {
    // 비교에서 제외할 필드이거나, 이전 데이터에 없는 키는 건너뜁니다.
    if (ignoreFields.includes(key) || !oldData.hasOwnProperty(key)) {
      continue;
    }

    const oldValue = oldData[key];

    const label = fieldLabels[key] || key; // 매핑된 한글 이름이 없으면 키 값을 그대로 사용
    changes.push(`${label}:'${oldValue}' `);
  }

  //console.log(changes);
  return changes.join(', ');
}

export function generateCreateLog(
  newData: Record<string, object | string | number | FormDataEntryValue | null>,
  fieldLabels: Record<string, string>,
  ignoreFields: string[] = []
): string {
  const changes: string[] = [];

  for (const key in newData) {
    // 비교에서 제외할 필드이거나, 이전 데이터에 없는 키는 건너뜁니다.
    if (ignoreFields.includes(key) || !newData.hasOwnProperty(key)) {
      continue;
    }

    const newValue = newData[key];

    const label = fieldLabels[key] || key; // 매핑된 한글 이름이 없으면 키 값을 그대로 사용
    changes.push(`${label}:'${newValue}' `);
  }

  console.log(changes);
  return changes.join(', ');
}