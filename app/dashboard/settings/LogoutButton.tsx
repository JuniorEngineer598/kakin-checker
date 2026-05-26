"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "../../lib/auth";

export default function LogoutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setErrorMessage("");
    setIsLoggingOut(true);

    const { error } = await signOut();

    setIsLoggingOut(false);

    if (error) {
      setErrorMessage("ログアウトに失敗しました");
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-blue-400 bg-white px-6 text-sm font-bold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 sm:w-auto"
      >
        <LogOut size={18} strokeWidth={2.2} aria-hidden="true" />
        {isLoggingOut ? "ログアウト中..." : "ログアウト"}
      </button>

      {errorMessage ? (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {errorMessage}
        </p>
      ) : null}

      <p className="text-sm font-semibold leading-6 text-slate-500">
        ログアウト後は、再度ログインが必要になります。
      </p>
    </div>
  );
}