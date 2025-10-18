"use client";

import { useActionState, useEffect, useState } from "react";
import { requestInitializeAccount } from "@/app/libs/actions";
import MaterialIcon from "@/app/components/materialIcon";


export default function ForgotForm({
  trans,
}: {
  trans: Record<string, string>;
}) {
  const [errorMessage, formAction, isPending] = useActionState(
    requestInitializeAccount,
    undefined,
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
          <h1 className="mb-3 text-2xl">{trans.initialize_Password}</h1>
        </div>
        <div className="w-full">
          <div className="mb-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="user_name"
            >
              {trans.email}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md bg-slate-50 border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_name"
                type="text"
                name="user_email"
                placeholder={trans.placeholder_email}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block font-medium text-gray-900 text-xs"
              htmlFor="user_password"
            >
              {trans.user_name}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_full_name"
                name="user_full_name"
                placeholder={trans.placeholder_full_name}
                required
              />
            </div>
          </div>
        </div>
        <input type="hidden" name="ip_address" value={ipAddress} />
        <button
          type="submit"
          className="mt-8 w-full bg-slate-500 text-white px-3 py-0.5 rounded-sm flex justify-center items-center cusor-pointer"
          aria-disabled={isPending}
        >
          {trans.submit}
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
