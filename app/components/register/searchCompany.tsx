'use client';

import MaterialIcon from '../materialIcon';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({
  queryName = 'query',
  placeholder,
  buttonTitle,
}: {
  queryName?: string,
  placeholder: string,
  buttonTitle: string,
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    //console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(queryName, term);
    } else {
      params.delete(queryName);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSeachClick = () => {
    handleSearch((document.getElementById("id_search_company") as HTMLInputElement).value);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0 items-center">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="id_search_company"
        className="peer block w-full rounded-md border border-slate-200 py-[8px] pl-10 text-sm outline-2 placeholder:text-slate-500 focus:outline-slate-600"
        placeholder={placeholder}
        onKeyDown={(e: React.KeyboardEvent) => {
          if(e.key === 'Enter') {
            const targetElem = e.target as HTMLInputElement;
            handleSearch(targetElem.value);
          }
        }}
        defaultValue={searchParams.get(queryName)?.toString()}
      />
      <MaterialIcon name='search' props='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900'/>
      <button className="ml-4 w-20 py-[8px] border-2 border-slate-400 rounded-md bg-slate-300 text-sm" onClick={handleSeachClick} >{buttonTitle}</button>
    </div>
  );
}
