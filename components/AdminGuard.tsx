"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { supabase } from "@/lib/supabase";

type AdminGuardProps = {
  children: ReactNode;
};

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    // =========================================
    // INITIAL AUTH CHECK
    // =========================================

    async function checkAuthentication() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error(
            "ADMIN AUTH CHECK ERROR:",
            error
          );

          setAuthorized(false);
          setLoading(false);

          router.replace("/login");
          return;
        }

        if (!session?.user) {
          setAuthorized(false);
          setLoading(false);

          router.replace("/login");
          return;
        }

        setAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error(
          "ADMIN GUARD ERROR:",
          error
        );

        if (!mounted) return;

        setAuthorized(false);
        setLoading(false);

        router.replace("/login");
      }
    }

    checkAuthentication();

    // =========================================
    // WATCH AUTH STATE
    // =========================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log(
          "ADMIN AUTH EVENT:",
          event
        );

        if (!session?.user) {
          setAuthorized(false);
          setLoading(false);

          router.replace("/login");
          return;
        }

        setAuthorized(true);
        setLoading(false);
      }
    );

    // =========================================
    // CLEANUP
    // =========================================

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // =========================================
  // PROFESSIONAL LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4">
        <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071A52] text-white shadow-lg shadow-blue-950/15">
            <ShieldCheck size={24} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">
            Securing Admin Workspace
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Verifying your authenticated clinic
            session.
          </p>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>
        </div>
      </main>
    );
  }

  // =========================================
  // BLOCK UNAUTHORIZED CONTENT
  // =========================================

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}