"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =========================================
  // CHECK EXISTING SESSION
  // =========================================

  useEffect(() => {
    let mounted = true;

    async function checkExistingSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error(
            "LOGIN SESSION CHECK ERROR:",
            error
          );

          setCheckingSession(false);
          return;
        }

        // Already logged in
        if (session?.user) {
          router.replace("/admin");
          return;
        }

        setCheckingSession(false);
      } catch (error) {
        console.error(
          "LOGIN SESSION CHECK FAILED:",
          error
        );

        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  // =========================================
  // LOGIN
  // =========================================

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setErrorMessage("");

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanPassword = password.trim();

    // Basic validation
    if (!cleanEmail || !cleanPassword) {
      setErrorMessage(
        "Please enter your email address and password."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      // Check login error FIRST
      if (error) {
        console.error(
          "ADMIN LOGIN ERROR:",
          error
        );

        setErrorMessage(
          error.message ===
            "Invalid login credentials"
            ? "Incorrect email or password. Please try again."
            : error.message
        );

        return;
      }

      // Confirm session returned
      if (!data.session || !data.user) {
        setErrorMessage(
          "Unable to create a secure admin session. Please try again."
        );

        return;
      }

      console.log(
        "ADMIN LOGIN SUCCESS:",
        data.user.email
      );

      // Replace login page in browser history
      router.replace("/admin");

      // Refresh server/client state
      router.refresh();
    } catch (error) {
      console.error(
        "ADMIN LOGIN FAILED:",
        error
      );

      setErrorMessage(
        "Unable to sign in right now. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // SESSION CHECKING SCREEN
  // =========================================

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4">
        <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071A52] text-white shadow-lg shadow-blue-950/15">
            <ShieldCheck size={24} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">
            Checking Secure Session
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Preparing your Nova clinic workspace.
          </p>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F7FB]">
      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-28 h-[460px] w-[460px] rounded-full bg-cyan-200/40 blur-[110px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[36px]">
          {/* =====================================
              LEFT BRAND PANEL
          ===================================== */}

          <section className="relative hidden overflow-hidden bg-[#071A52] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            {/* Decorative glow */}

            <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-cyan-100 backdrop-blur">
                <Sparkles size={14} />

                Nova Clinic Operations
              </div>

              <h1 className="mt-8 max-w-md text-5xl font-black leading-[1.05] tracking-[-0.05em]">
                Secure access to your clinic operations.
              </h1>

              <p className="mt-5 max-w-md text-[15px] leading-7 text-blue-100/80">
                Manage appointment requests, review
                patient details, track booking decisions,
                and operate your dental workflow from one
                protected workspace.
              </p>
            </div>

            {/* BUSINESS FEATURES */}

            <div className="relative space-y-3">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                  <Activity size={19} />
                </div>

                <div>
                  <p className="text-sm font-extrabold">
                    Live Appointment Workflow
                  </p>

                  <p className="mt-1 text-xs text-blue-100/65">
                    Review and manage patient requests.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-extrabold">
                    Protected Admin Workspace
                  </p>

                  <p className="mt-1 text-xs text-blue-100/65">
                    Authenticated access for clinic operations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              LOGIN PANEL
          ===================================== */}

          <section className="flex items-center justify-center p-5 sm:p-8 lg:p-12 xl:p-16">
            <div className="w-full max-w-md">
              {/* MOBILE BRAND */}

              <div className="mb-8 lg:hidden">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-700">
                  <Sparkles size={13} />

                  Nova Clinic Operations
                </div>
              </div>

              {/* ICON */}

              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#071A52] text-white shadow-[0_12px_30px_rgba(7,26,82,0.22)]">
                <ShieldCheck size={25} />
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-[36px]">
                Admin Sign In
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your authorized clinic credentials
                to access the appointment command center.
              </p>

              {/* ERROR MESSAGE */}

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-rose-600"
                  />

                  <p className="text-sm font-medium leading-6 text-rose-700">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* LOGIN FORM */}

              <form
                onSubmit={handleLogin}
                className="mt-7 space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="admin@novadental.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);

                        if (errorMessage) {
                          setErrorMessage("");
                        }
                      }}
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);

                        if (errorMessage) {
                          setErrorMessage("");
                        }
                      }}
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#071A52] px-5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(7,26,82,0.18)] transition hover:bg-[#0B2A74] hover:shadow-[0_16px_35px_rgba(7,26,82,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Signing In...
                    </>
                  ) : (
                    <>
                      Access Dashboard

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* SECURITY NOTE */}

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <LockKeyhole
                  size={16}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <p className="text-xs leading-5 text-slate-500">
                  This workspace is intended for authorized
                  clinic administrators only.
                </p>
              </div>

              {/* FOOTER */}

              <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                <p className="text-xs font-medium text-slate-400">
                  Nova Dental Studio
                  <span className="mx-2">•</span>
                  Secure Clinic Operations
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}