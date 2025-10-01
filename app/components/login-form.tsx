"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { authenticate } from "@/app/libs/actions";
import { useSearchParams } from "next/navigation";
import "material-icons/iconfont/material-icons.css";

export default function LoginForm({
  userType,
  trans,
}: {
  userType: "company" | "person";
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
      try {
        const res = await fetch("/api/get-ip");
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("IP 가져오기 실패:", error);
      }
    };

    fetchIp();
  }, []);

  return (
    <form action={formAction}>
      <div className="flex-1 rounded-b-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="flex justify-between items-end">
          <h1 className="mb-3 text-2xl">{trans.title}</h1>
          {userType === "company" ? (
            <Link href="/login?userType=person">{trans.person_login} ▶</Link>
          ) : (
            <Link href="/login?userType=company">{trans.company_login} ▶</Link>
          )}
        </div>
        <div className="w-full">
          {userType === "company" && (
            <div className="mb-4">
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
                  placeholder="Enter Company Code"
                  required
                />
              </div>
            </div>
          )}
          <div>
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
                placeholder="Enter your ID"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="user_password"
            >
              {trans.password}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <span className="material-icons pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                key
              </span>
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <input type="hidden" name="ip_address" value={ipAddress} />
        <button
          type="submit"
          className="mt-8 w-full bg-slate-500 text-white px-3 py-0.5 rounded-sm flex justify-center items-center"
          aria-disabled={isPending}
        >
          {trans.login}
          <span className="material-icons ml-auto h-5 w-5 text-white">
            arrow_forward
          </span>
        </button>
        <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
            <>
              <span className="material-icons h-5 w-5 text-red-500">
                error_outline
              </span>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
