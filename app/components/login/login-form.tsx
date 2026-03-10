"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { authenticate } from "@/app/libs/actions";
import { useSearchParams } from "next/navigation";
import { ArrowForward, ErrorOutline, Key } from '@mui/icons-material';


export default function LoginForm({
  userType,
  isInit,
  locale,
  trans,
}: {
  userType: "company" | "person";
  isInit: boolean;
  locale: "ko" | "en";
  trans: Record<string, string>;
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [ipAddress, setIpAddress] = useState<string>('');

  useEffect(() => {
    const fetchIp = async () => {
      const res = await fetch('/api/get-ip');
      const data = await res.json();
      setIpAddress(data.ip);
    }
    fetchIp();
  }, []);

  return (
    <form action={formAction} className="w-full flex flex-col">
      <div className="flex-1 w-full rounded-b-lg p-8">
        <div className="flex justify-end items-end">
          {!isInit && (
            userType === "company" ? (
              <Link href="/login?userType=person">{trans.person_login} ▶</Link>
            ) : (
              <Link href="/login?userType=company">{trans.company_login} ▶</Link>
            ))}
        </div>
        <div className="w-full">
          {!isInit && userType === "company" && (
            <div className="my-8">
              <label
                className="mb-3 block text-sm font-medium text-gray-900"
                htmlFor="company_code"
              >
                {trans.company_code}
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-sm bg-slate-50 border border-slate-300 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                  id="company_code"
                  type="company_code"
                  name="company_code"
                  placeholder={trans.placeholder_company_code}
                  required
                />
              </div>
            </div>
          )}
          <div className="my-8">
            <label
              className="mb-3 block text-sm font-medium text-gray-900"
              htmlFor="user_name"
            >
              {trans.userId}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-sm bg-slate-50 border border-slate-300 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="user_name"
                type="user_name"
                name="user_name"
                placeholder={trans.placeholder_id_code}
                required
              />
            </div>
          </div>
          <div className="my-8">
            <div className={clsx("mb-3 flex font-medium text-gray-900 text-sm items-center", { "justify-between": !isInit })}>
              <label
                htmlFor="user_password"
              >
                {trans.password}
              </label>
              {!isInit && (<Link className="text-lime-800 font-semibold underline" href={'/login/init'}>{trans.forgot_password}</Link>)}
            </div>
            <div className="relative mb-5">
              <input
                className="peer block w-full rounded-sm bg-slate-50 py-[9px] pl-10 text-sm border border-slate-300 placeholder:text-gray-500"
                id="user_password"
                type="password"
                name="password"
                placeholder={trans.placeholder_password}
                required
                minLength={6}
              />
              <Key className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {!!isInit && userType === "company" && (
            <div className="my-8">
              <label
                className="mb-3 block text-sm font-medium text-gray-900"
                htmlFor="company_code"
              >
                {trans.company_code}
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-sm bg-slate-50 border border-slate-300 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                  id="company_code"
                  type="company_code"
                  name="company_code"
                  placeholder={trans.placeholder_company_code}
                  required
                />
              </div>
            </div>
          )}
          {!!isInit && <div className="my-8">
            <label
              className="mb-3 block text-sm font-medium text-gray-900"
              htmlFor="verification_code"
            >
              {trans.verification_code}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-sm bg-slate-50 border border-slate-300 py-[9px] pl-10 text-sm placeholder:text-gray-500"
                id="verification_code"
                type="verification_code"
                name="verification_code"
                placeholder={trans.placeholder_verfication_code}
                required
              />
            </div>
          </div>
          }
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <input type="hidden" name="ip_address" value={ipAddress === "::1" ? "127.0.0.1" : ipAddress} />
        <input type="hidden" name="is_init" value={isInit ? "Y" : "N"} />
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          className="mt-8 w-full bg-slate-500 text-white px-3 py-1 rounded-sm flex justify-center items-center cursor-pointer"
          aria-disabled={isPending}
        >
          {trans.login}
          <ArrowForward className="ml-auto h-5 w-5 text-white" />
        </button>
        <div className="flex h-12 items-start space-x-1">
          {errorMessage && (
            <>
              <ErrorOutline className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
