import { createClient } from "@supabase/supabase-js";

import AdminGuard from "@/components/AdminGuard";
import AdminDashboard, {
  type Appointment,
} from "./AdminDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Environment configuration check
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "ADMIN DASHBOARD: Missing Supabase environment variables"
    );

    return (
      <AdminGuard>
        <main className="min-h-screen bg-[#F5F7FB] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
              <h1 className="text-lg font-extrabold text-rose-700">
                Dashboard configuration error
              </h1>

              <p className="mt-2 text-sm text-rose-600">
                Supabase environment variables are missing.
              </p>
            </div>
          </div>
        </main>
      </AdminGuard>
    );
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
        id,
        name,
        phone,
        email,
        treatment,
        appointment_date,
        appointment_time,
        created_at,
        status
      `
    )
    .order("id", {
      ascending: false,
    });

  if (error) {
    console.error(
      "ADMIN APPOINTMENTS FETCH ERROR:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    return (
      <AdminGuard>
        <main className="min-h-screen bg-[#F5F7FB] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
              <h1 className="text-xl font-extrabold text-slate-950">
                Unable to load appointments
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The dashboard could not retrieve appointment
                records. Check Supabase connectivity, table
                permissions, and server logs.
              </p>
            </div>
          </div>
        </main>
      </AdminGuard>
    );
  }

  const appointments: Appointment[] =
    (data ?? []).map((appointment) => ({
      id: Number(appointment.id),

      name:
        appointment.name === null
          ? null
          : String(appointment.name),

      phone:
        appointment.phone === null
          ? null
          : String(appointment.phone),

      email:
        appointment.email === null
          ? null
          : String(appointment.email),

      treatment:
        appointment.treatment === null
          ? null
          : String(appointment.treatment),

      appointment_date:
        appointment.appointment_date === null
          ? null
          : String(appointment.appointment_date),

      appointment_time:
        appointment.appointment_time === null
          ? null
          : String(appointment.appointment_time),

      created_at:
        appointment.created_at === null
          ? null
          : String(appointment.created_at),

      status:
        appointment.status === null
          ? null
          : String(appointment.status),
    }));

  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#F5F7FB]">
        <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <AdminDashboard
            appointments={appointments}
          />
        </div>
      </main>
    </AdminGuard>
  );
}