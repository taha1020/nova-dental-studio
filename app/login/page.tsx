"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

async function login() {
  setLoading(true);

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("SESSION:", session);

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }
console.log(
  "LOCAL STORAGE:",
  localStorage
);
  router.push("/admin");
}

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-slate-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 p-10">

          <div className="text-center mb-8">

            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-cyan-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              N
            </div>

            <h1 className="text-4xl font-bold text-slate-900">
              Nova Admin
            </h1>

            <p className="text-slate-500 mt-2">
              Secure access to your dental clinic dashboard
            </p>

          </div>

          <div className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="admin@novadental.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 transition text-white py-3 rounded-2xl font-semibold shadow-lg"
            >
              {loading
                ? "Signing In..."
                : "Access Dashboard"}
            </button>

          </div>

          <div className="mt-8 text-center text-sm text-slate-400">
            Nova Dental Studio • AI Receptionist
          </div>

        </div>

      </div>

    </main>
  );
}