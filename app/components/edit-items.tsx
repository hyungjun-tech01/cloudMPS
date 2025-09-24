"use client";

import * as React from 'react';
import { IEditItem } from '../libs/types';
import MaterialIcon from './materialIcon';


export interface IButtonInfo {
  cancel: { title: string, link: string },
  go: { title: string },
  save?: {title:string},
  delete?: {title:string},
  add?:{title:string}
};

export interface IOption {
  label: string | null;
  value: string | number |null;
  suffix?: string;
};


export function EditItem({
  name,
  title,
  type,
  defaultValue,
  placeholder,
  options,
  locale,
  error,
  chartData,
  other,
  onChange,
}: IEditItem) {
  switch (type) {
    case "label":
      return (
        <div className="mb-4">
          <label htmlFor={name} className="mb-2 block text-sm font-semibold">
            {title}
          </label>
          <div className="relative flex">
            <label htmlFor={name} className="mb-2 block text-sm font-medium">
              {defaultValue}
            </label>
            {!!other && (other)}
          </div>
        </div>
      );
    case "input":
      return (
        <div className="mb-4">
          <label htmlFor={name} className="mb-2 block text-sm font-semibold">
            {title}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id={name}
                name={name}
                type="text"
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
              {error &&
                error.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      );
    case "currency":
      return (
        <div className="mb-4">
          <label htmlFor={name} className="mb-2 block text-sm font-semibold">
            {title}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id={name}
                name={name}
                type="text"
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              {
                <MaterialIcon name="paid" type="outlined" props="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              }
            </div>
            <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
              {error &&
                error.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      );
    case "checked":
      return (
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative flex">
              {defaultValue === "Y" ?
                <input
                  id={name}
                  name={name}
                  type="checkbox"
                  value="Y"
                  defaultChecked
                /> :
                <input
                  id={name}
                  name={name}
                  type="checkbox"
                  value="Y"
                />
              }
              <label htmlFor={name} className="ml-2 block text-sm font-medium">
                {title}
              </label>
            </div>
            <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
              {error &&
                error.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      );
    case "select":
      return (
        <div className="mb-4">
          <label htmlFor={name} className="mb-2 block text-sm font-semibold">
            {title}
          </label>
          <div className="relative">
            <select
              id={name}
              name={name}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={defaultValue}
              aria-describedby={`${name}-error`}
              onChange={onChange}
            >
              {options &&
                options.map((item) =>
                  <option key={item.value} value={item.value}>
                    {item.title}
                  </option>
                )}
            </select>
          </div>
          <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
            {error &&
              error.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      );
    case "password":
      return (
        <div className="mb-4">
          <label htmlFor={name} className="mb-2 block text-sm font-semibold">
            {title}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id={name}
                name={name}
                type="password"
                placeholder={placeholder}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
              {error &&
                error.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      );
    case "hidden":
      return (
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id={name}
                name={name}
                type="hidden"
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      );
    case "status_bar":
      return (
        <div className="mb-4">
          <label htmlFor={name} className="mb-2 block text-sm font-semibold">
            {title}
          </label>
          <div className="relative flex flex-col">
            { options?.map( (item, idx) => <div key={idx} className='w-full flex py-1'>
                <div className='flex-0 w-[5rem] text-sm font-light'>{item.title}</div>
                <div className='flex-1 rounded-full bg-white'>
                  <div className={item.suffix} style={{width: `${item.value || 0}%`}} >{' '}</div>
                </div>
                <div className='flex-0 w-[5rem] text-sm font-light text-right'>{item.value || 0}%</div>
              </div>
            )}
          </div>
        </div>
      );
  }
}
