"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/libs/actions";
import MaterialIcon from "@/app/components/materialIcon";

interface IChangePasswordForm {
  userId: string;
  userType: "company" | "person";
  ipAddress: string;
  token: string;
  trans: Record<string, string>;
};

export default function ChangeForm({
  userId,
  userType,
  ipAddress,
  token,
  trans,
}: IChangePasswordForm
) {
  const [errorMessage, formAction, isPending] = useActionState(
    changePassword,
    undefined,
  );

  return (
    <form action={formAction}>
      <div className="flex-1 rounded-b-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="flex justify-between items-end">
          <h1 className="mb-3 text-2xl">{trans.change_password}</h1>
        </div>
        <div className="w-full">
          <div className="mb-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="user_id"
            >
              {trans.id}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md bg-slate-50 border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_id"
                type="text"
                name="userName"
                placeholder={trans.placeholder_id_code}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block font-medium text-gray-900 text-xs"
              htmlFor="user_old_password"
            >
              {trans.password_old}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_old_password"
                name="oldPassword"
                type="password"
                placeholder={trans.placeholder_old_password}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block font-medium text-gray-900 text-xs"
              htmlFor="user_new_password"
            >
              {trans.password_new}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_new_password"
                name="newPassword"
                type="password"
                placeholder={trans.placeholder_new_password}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block font-medium text-gray-900 text-xs"
              htmlFor="user_new_password_again"
            >
              {trans.password_new_again}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="user_new_password_again"
                name="newPasswordAgain"
                type="password"
                placeholder={trans.placeholder_new_password_again}
                required
              />
            </div>
          </div>
        </div>
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="ipAddress" value={ipAddress} />
        <input type="hidden" name="ipAddress" value={userType} />
        <input type="hidden" name="token" value={token} />
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
