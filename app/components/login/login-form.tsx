"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { authenticate } from "@/app/libs/actions";
import { useSearchParams } from "next/navigation";
import MaterialIcon from "@/app/components/materialIcon";


export default function LoginForm({
  userType,
  isInit,
  trans,
}: {
  userType: "company" | "person";
  isInit: boolean;
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
    <form action={formAction}>
      <div className="flex-1 rounded-b-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="flex justify-between items-end">
          <h1 className="mb-3 text-2xl">{trans.title}</h1>
          {!isInit && (
          userType === "company" ? (
            <Link href="/login?userType=person">{trans.person_login} ▶</Link>
          ) : (
            <Link href="/login?userType=company">{trans.company_login} ▶</Link>
          ))}
        </div>
        <div className="w-full">
          {!isInit && userType === "company" && (
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="company_code"
              >
                {trans.company_code}
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md bg-slate-50 border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="company_code"
                  type="company_code"
                  name="company_code"
                  placeholder={trans.placeholder_company_code}
                  required
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="user_name"
            >
              {trans.userId}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md bg-slate-50 border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_name"
                type="user_name"
                name="user_name"
                placeholder={trans.placeholder_id_code}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <div className={clsx("mb-3 mt-5 flex font-medium text-gray-900 text-xs items-center", {"justify-between" : !isInit})}>
              <label
                htmlFor="user_password"
              >
                {trans.password}
              </label>
              {!isInit && (<Link className="text-lime-800 font-semibold underline" href={'/login/init'}>{trans.forgot_password}</Link>)}
            </div>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_password"
                type="password"
                name="password"
                placeholder={trans.placeholder_password}
                required
                minLength={6}
              />
              <span className="material-icons pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                key
              </span>
            </div>
          </div>
          {!!isInit && userType === "company" && (
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="company_code"
              >
                {trans.company_code}
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md bg-slate-50 border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="company_code"
                  type="company_code"
                  name="company_code"
                  placeholder={trans.placeholder_company_code}
                  required
                />
              </div>
            </div>
          )}
          {!!isInit && <div className="mb-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="verification_code"
              >
                {trans.verification_code}
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md bg-slate-50 border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
        <input type="hidden" name="ip_address" value={ipAddress ===  "::1" ? "127.0.0.1" : ipAddress} />
        <input type="hidden" name="is_init" value={isInit ? "Y" : "N"} />
        <button
          type="submit"
          className="mt-8 w-full bg-slate-500 text-white px-3 py-0.5 rounded-sm flex justify-center items-center cursor-pointer"
          aria-disabled={isPending}
        >
          {trans.login}
          <MaterialIcon name="arrow_forward" props="ml-auto h-5 w-5 text-white" />
        </button>
        <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
            <>
              <MaterialIcon name="error" type="outlined" props="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
