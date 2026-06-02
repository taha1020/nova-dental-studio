import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import StatusButtons from "@/components/StatusButtons";
import AdminGuard from "@/components/AdminGuard";
import { error } from "console";

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminPage() {

 

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .order("id", { ascending: false });
    console.log("APPOINTMENTS:", appointments);
console.log("ERROR:", error);

  const totalLeads = appointments?.length ?? 0;

  const newLeads =
    appointments?.filter(
      (a) => !a.status || a.status === "New"
    ).length ?? 0;

  const confirmedLeads =
    appointments?.filter(
      (a) => a.status === "Confirmed"
    ).length ?? 0;

  const rejectedLeads =
    appointments?.filter(
      (a) => a.status === "Rejected"
    ).length ?? 0;

  return (
      <AdminGuard>
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-sm font-medium">
            Admin Dashboard
          </span>

          <h1 className="mt-5 text-5xl font-bold text-slate-900">
            Nova AI Lead Management
          </h1>

          <p className="mt-3 text-slate-600 text-lg">
            Monitor appointment requests, manage patient bookings, and track clinic conversions in real time.
          </p>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl border border-cyan-100 p-8 shadow-sm">
            <p className="text-slate-500">
              Total Leads
            </p>

            <h3 className="text-5xl font-bold text-cyan-600 mt-3">
              {totalLeads}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-yellow-100 p-8 shadow-sm">
            <p className="text-slate-500">
              New Requests
            </p>

            <h3 className="text-5xl font-bold text-yellow-600 mt-3">
              {newLeads}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-green-100 p-8 shadow-sm">
            <p className="text-slate-500">
              Confirmed
            </p>

            <h3 className="text-5xl font-bold text-green-600 mt-3">
              {confirmedLeads}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-red-100 p-8 shadow-sm">
            <p className="text-slate-500">
              Rejected
            </p>

            <h3 className="text-5xl font-bold text-red-600 mt-3">
              {rejectedLeads}
            </h3>
          </div>

        </div>

        {/* Table */}

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              Recent Appointment Requests
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="text-left p-5 text-slate-600">
                    Patient
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Phone
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Email
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Treatment
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Date
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Time
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Status
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Actions
                  </th>

                  <th className="text-left p-5 text-slate-600">
                    Received
                  </th>

                </tr>

              </thead>

              <tbody>

                {appointments?.map((appointment) => (

                  <tr
                    key={appointment.id}
                    className="border-t border-slate-100 hover:bg-slate-50/40 transition"
                  >

                    <td className="p-5 font-medium text-slate-900">
                      {appointment.name}
                    </td>

                    <td className="p-5 text-slate-600">
                      {appointment.phone}
                    </td>

                    <td className="p-5 text-slate-600">
                      {appointment.email}
                    </td>

                    <td className="p-5">
                      <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm">
                        {appointment.treatment}
                      </span>
                    </td>

                    <td className="p-5 text-slate-600">
                      {appointment.appointment_date}
                    </td>

                    <td className="p-5 text-slate-600">
                      {appointment.appointment_time}
                    </td>
     <td className="p-5">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {appointment.status || "New"}
                      </span>

                    </td>

                    <td className="p-5">

                      {appointment.status === "Confirmed" ? (

                        <span className="bg-green-100 text-green-700 px-3 py-2 rounded-xl text-sm font-medium">
                          Approved ✓
                        </span>

                      ) : appointment.status === "Rejected" ? (

                        <span className="bg-red-100 text-red-700 px-3 py-2 rounded-xl text-sm font-medium">
                          Declined ✕
                        </span>

                      ) : (

                        <StatusButtons
                          id={appointment.id}
                        />

                      )}

                    </td>

                    <td className="p-5 text-slate-600 whitespace-nowrap">
                      {new Date(
                        appointment.created_at
                      ).toLocaleDateString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
    </AdminGuard>
  );
}
