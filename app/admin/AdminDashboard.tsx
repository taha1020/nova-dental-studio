"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";

import StatusButtons from "@/components/StatusButtons";

export type Appointment = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  treatment: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  created_at: string | null;
  status: string | null;
};

type Props = {
  appointments: Appointment[];
};

type StatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "rejected";

function normalizeStatus(status: string | null) {
  const value = status?.trim().toLowerCase() || "pending";

  if (value === "new") return "pending";

  return value;
}

function getStatusLabel(status: string | null) {
  const value = normalizeStatus(status);

  if (value === "confirmed") return "Confirmed";
  if (value === "rejected") return "Rejected";

  return "Pending";
}

function getStatusClasses(status: string | null) {
  const value = normalizeStatus(status);

  if (value === "confirmed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value === "rejected") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getInitials(name: string | null) {
  if (!name?.trim()) return "PT";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatReceivedDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatReceivedDateTime(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function cleanPhoneForTel(phone: string | null) {
  if (!phone) return "";

  return phone.replace(/[^\d+]/g, "");
}

export default function AdminDashboard({
  appointments,
}: Props) {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [treatmentFilter, setTreatmentFilter] =
    useState("all");

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [showMobileFilters, setShowMobileFilters] =
    useState(false);

  // =========================
  // DASHBOARD STATS
  // =========================

  const dashboardStats = useMemo(() => {
    const total = appointments.length;

    const pending = appointments.filter(
      (appointment) =>
        normalizeStatus(appointment.status) === "pending"
    ).length;

    const confirmed = appointments.filter(
      (appointment) =>
        normalizeStatus(appointment.status) === "confirmed"
    ).length;

    const rejected = appointments.filter(
      (appointment) =>
        normalizeStatus(appointment.status) === "rejected"
    ).length;

    const conversionRate =
      total > 0
        ? Math.round((confirmed / total) * 100)
        : 0;

    return {
      total,
      pending,
      confirmed,
      rejected,
      conversionRate,
    };
  }, [appointments]);

  // =========================
  // UNIQUE TREATMENTS
  // =========================

  const treatments = useMemo(() => {
    const values = appointments
      .map((appointment) =>
        appointment.treatment?.trim()
      )
      .filter(
        (value): value is string => Boolean(value)
      );

    return Array.from(new Set(values)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [appointments]);

  // =========================
  // SEARCH + FILTERING
  // =========================

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments
      .filter((appointment) => {
        const status = normalizeStatus(
          appointment.status
        );

        const matchesStatus =
          statusFilter === "all" ||
          status === statusFilter;

        const matchesTreatment =
          treatmentFilter === "all" ||
          appointment.treatment?.trim() ===
            treatmentFilter;

        const searchableText = [
          appointment.name,
          appointment.phone,
          appointment.email,
          appointment.treatment,
          appointment.appointment_date,
          appointment.appointment_time,
          appointment.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query || searchableText.includes(query);

        return (
          matchesStatus &&
          matchesTreatment &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        const aPending =
          normalizeStatus(a.status) === "pending";

        const bPending =
          normalizeStatus(b.status) === "pending";

        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;

        return b.id - a.id;
      });
  }, [
    appointments,
    search,
    statusFilter,
    treatmentFilter,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    treatmentFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setTreatmentFilter("all");
  }

  function applyStatusFilter(status: StatusFilter) {
    setStatusFilter(status);
    setTreatmentFilter("all");
    setSearch("");
  }

  return (
    <>
      {/* ==================================================
          PREMIUM COMMAND CENTER HEADER
      ================================================== */}

      <section className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)] lg:rounded-[30px]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-100/40 blur-3xl" />

        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-700">
                <Sparkles size={13} />

                Nova Clinic Operations
              </div>

              <h1 className="mt-4 text-[28px] font-black tracking-[-0.04em] text-slate-950 sm:text-3xl lg:text-[38px]">
                Appointment Command Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                Review patient requests, manage booking
                decisions, and monitor clinic appointment
                performance from one workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-700">
                <Activity size={14} />

                System Active
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#071A52] px-3.5 py-2 text-xs font-extrabold text-white shadow-lg shadow-blue-950/10">
                <ShieldCheck size={14} />

                Admin Workspace
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          PRIMARY BUSINESS METRICS
      ================================================== */}

      <section className="mt-4 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-4 lg:gap-4">
        {/* TOTAL */}

        <article className="group rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] sm:p-5 lg:rounded-[24px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                Total Requests
              </p>

              <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {dashboardStats.total}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UsersRound size={18} />
            </div>
          </div>

          <p className="mt-3 text-[11px] font-medium text-slate-400">
            All appointment leads
          </p>
        </article>

        {/* PENDING */}

        <article className="group rounded-[22px] border border-amber-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] sm:p-5 lg:rounded-[24px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                Pending Review
              </p>

              <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {dashboardStats.pending}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock3 size={18} />
            </div>
          </div>

          <p className="mt-3 text-[11px] font-medium text-amber-600">
            Needs clinic action
          </p>
        </article>

        {/* CONFIRMED */}

        <article className="group rounded-[22px] border border-emerald-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] sm:p-5 lg:rounded-[24px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                Confirmed
              </p>

              <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {dashboardStats.confirmed}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <p className="mt-3 text-[11px] font-medium text-emerald-600">
            Approved appointments
          </p>
        </article>

        {/* CONVERSION */}

        <article className="group rounded-[22px] border border-violet-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] sm:p-5 lg:rounded-[24px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                Conversion Rate
              </p>

              <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {dashboardStats.conversionRate}%
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <TrendingUp size={18} />
            </div>
          </div>

          <p className="mt-3 text-[11px] font-medium text-violet-600">
            Confirmed from requests
          </p>
        </article>
      </section>

      {/* ==================================================
          OPERATIONAL SUMMARY
      ================================================== */}

      <section className="mt-3 grid gap-3 sm:grid-cols-3 lg:mt-4">
        {/* NEEDS ATTENTION */}

        <button
          type="button"
          onClick={() => applyStatusFilter("pending")}
          className="group flex items-center justify-between gap-4 rounded-[20px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Clock3 size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-slate-900">
                Needs Attention
              </p>

              <p className="mt-1 truncate text-[10px] text-slate-500">
                Pending appointment requests
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xl font-black text-slate-950">
              {dashboardStats.pending}
            </span>

            <ArrowUpRight
              size={15}
              className="text-amber-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </button>

        {/* BOOKING SUCCESS */}

        <button
          type="button"
          onClick={() => applyStatusFilter("confirmed")}
          className="group flex items-center justify-between gap-4 rounded-[20px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CalendarDays size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-slate-900">
                Booking Success
              </p>

              <p className="mt-1 truncate text-[10px] text-slate-500">
                Confirmed appointment requests
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xl font-black text-slate-950">
              {dashboardStats.confirmed}
            </span>

            <ArrowUpRight
              size={15}
              className="text-emerald-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </button>

        {/* DECLINED */}

        <button
          type="button"
          onClick={() => applyStatusFilter("rejected")}
          className="group flex items-center justify-between gap-4 rounded-[20px] border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <XCircle size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-slate-900">
                Declined Requests
              </p>

              <p className="mt-1 truncate text-[10px] text-slate-500">
                Rejected by clinic review
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xl font-black text-slate-950">
              {dashboardStats.rejected}
            </span>

            <ArrowUpRight
              size={15}
              className="text-rose-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </button>
      </section>

      {/* ==================================================
          SEARCH + FILTER BAR
      ================================================== */}

      <section className="mt-5 rounded-[22px] border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-4 lg:rounded-[26px]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* SEARCH */}

          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search patient, phone, email or treatment..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* DESKTOP FILTERS */}

          <div className="hidden items-center gap-2 lg:flex">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter
                )
              }
              className="h-12 min-w-[155px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

            <select
              value={treatmentFilter}
              onChange={(event) =>
                setTreatmentFilter(
                  event.target.value
                )
              }
              className="h-12 max-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">
                All Treatments
              </option>

              {treatments.map((treatment) => (
                <option
                  key={treatment}
                  value={treatment}
                >
                  {treatment}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </div>

          {/* MOBILE FILTER BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowMobileFilters((value) => !value)
            }
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 lg:hidden"
          >
            <SlidersHorizontal size={17} />

            Filters

            {(statusFilter !== "all" ||
              treatmentFilter !== "all") && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] text-white">
                {
                  [
                    statusFilter !== "all",
                    treatmentFilter !== "all",
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>
        </div>

        {/* MOBILE FILTER PANEL */}

        {showMobileFilters && (
          <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 lg:hidden">
            <div>
              <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Treatment
              </label>

              <select
                value={treatmentFilter}
                onChange={(event) =>
                  setTreatmentFilter(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="all">
                  All Treatments
                </option>

                {treatments.map((treatment) => (
                  <option
                    key={treatment}
                    value={treatment}
                  >
                    {treatment}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-700"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* RESULTS COUNT */}

        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <p className="text-xs font-medium text-slate-500">
            Showing{" "}
            <span className="font-extrabold text-slate-900">
              {filteredAppointments.length}
            </span>{" "}
            of{" "}
            <span className="font-extrabold text-slate-900">
              {appointments.length}
            </span>{" "}
            requests
          </p>

          {hasActiveFilters && (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
              <Filter size={12} />

              Filtered
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          EMPTY RESULT
      ================================================== */}

      {filteredAppointments.length === 0 && (
        <section className="mt-4 rounded-[24px] border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Search size={23} />
          </div>

          <h3 className="mt-4 font-extrabold text-slate-900">
            No matching appointments
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try another search term or clear your
            filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-[#071A52] px-5 py-3 text-sm font-bold text-white"
          >
            Clear Filters
          </button>
        </section>
      )}

      {/* ==================================================
          MOBILE APPOINTMENT CARDS
      ================================================== */}

      {filteredAppointments.length > 0 && (
        <section className="mt-4 lg:hidden">
          <div className="mb-3 flex items-end justify-between gap-3 px-1">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-600">
                Clinic Queue
              </p>

              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">
                Appointment Requests
              </h2>
            </div>

            <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
              {filteredAppointments.length} shown
            </span>
          </div>

          <div className="space-y-3">
            {filteredAppointments.map(
              (appointment) => {
                const status = normalizeStatus(
                  appointment.status
                );

                const isPending =
                  status === "pending";

                const phoneLink =
                  cleanPhoneForTel(
                    appointment.phone
                  );

                return (
                  <article
                    key={appointment.id}
                    className={`overflow-hidden rounded-[22px] border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] ${
                      isPending
                        ? "border-amber-200"
                        : "border-slate-200"
                    }`}
                  >
                    {isPending && (
                      <div className="h-1 bg-amber-400" />
                    )}

                    <div className="p-4">
                      {/* PATIENT TOP */}

                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAppointment(
                              appointment
                            )
                          }
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-xs font-extrabold text-white">
                            {getInitials(
                              appointment.name
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-[15px] font-extrabold text-slate-950">
                              {appointment.name ||
                                "Unknown Patient"}
                            </h3>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              Patient ID #
                              {appointment.id}
                            </p>
                          </div>
                        </button>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
                            appointment.status
                          )}`}
                        >
                          {getStatusLabel(
                            appointment.status
                          )}
                        </span>
                      </div>

                      {/* TREATMENT + SLOT */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAppointment(
                            appointment
                          )
                        }
                        className="mt-4 w-full rounded-2xl bg-slate-50 p-3.5 text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Treatment
                            </p>

                            <p className="mt-1 break-words text-sm font-extrabold text-slate-900">
                              {appointment.treatment ||
                                "General Inquiry"}
                            </p>
                          </div>

                          <ChevronRight
                            size={17}
                            className="mt-1 shrink-0 text-slate-400"
                          />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                            <p className="text-[9px] font-bold uppercase text-slate-400">
                              Date
                            </p>

                            <p className="mt-1 break-words text-xs font-bold text-slate-800">
                              {appointment.appointment_date ||
                                "Not set"}
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                            <p className="text-[9px] font-bold uppercase text-slate-400">
                              Time
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-800">
                              {appointment.appointment_time ||
                                "Not set"}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* MOBILE ACTIONS */}

                      <div className="mt-4 border-t border-slate-100 pt-4">
                        {isPending ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              {phoneLink ? (
                                <a
                                  href={`tel:${phoneLink}`}
                                  className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-xs font-bold text-blue-700"
                                >
                                  <Phone size={15} />

                                  Call
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-400"
                                >
                                  No Phone
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedAppointment(
                                    appointment
                                  )
                                }
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-700"
                              >
                                <UserRound size={15} />

                                Details
                              </button>
                            </div>

                            <StatusButtons
                              id={appointment.id}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${
                                status === "confirmed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {status === "confirmed" ? (
                                <CheckCircle2
                                  size={14}
                                />
                              ) : (
                                <XCircle size={14} />
                              )}

                              {status === "confirmed"
                                ? "Approved"
                                : "Declined"}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAppointment(
                                  appointment
                                )
                              }
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* ==================================================
          DESKTOP TABLE
      ================================================== */}

      {filteredAppointments.length > 0 && (
        <section className="mt-6 hidden overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)] lg:block">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                Appointment Queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search, review and manage patient
                requests.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-600">
              <Activity
                size={14}
                className="text-blue-600"
              />

              {filteredAppointments.length} records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  {[
                    "Patient",
                    "Contact",
                    "Treatment",
                    "Preferred Slot",
                    "Status",
                    "Decision",
                    "Received",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map(
                  (appointment) => {
                    const status =
                      normalizeStatus(
                        appointment.status
                      );

                    return (
                      <tr
                        key={appointment.id}
                        className="cursor-pointer transition-colors hover:bg-blue-50/40"
                        onClick={() =>
                          setSelectedAppointment(
                            appointment
                          )
                        }
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-xs font-extrabold text-white">
                              {getInitials(
                                appointment.name
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-bold text-slate-900">
                                {appointment.name ||
                                  "Unknown Patient"}
                              </p>

                              <p className="mt-1 text-[11px] text-slate-400">
                                ID #{appointment.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {appointment.phone || "—"}
                          </p>

                          <p className="mt-1 max-w-[210px] truncate text-xs text-slate-400">
                            {appointment.email || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex max-w-[190px] rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                            <span className="truncate">
                              {appointment.treatment ||
                                "General Inquiry"}
                            </span>
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {appointment.appointment_date ||
                              "—"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {appointment.appointment_time ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                              appointment.status
                            )}`}
                          >
                            {getStatusLabel(
                              appointment.status
                            )}
                          </span>
                        </td>

                        <td
                          className="px-5 py-4"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          {status === "confirmed" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                              <CheckCircle2
                                size={14}
                              />

                              Approved
                            </span>
                          ) : status === "rejected" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                              <XCircle size={14} />

                              Declined
                            </span>
                          ) : (
                            <StatusButtons
                              id={appointment.id}
                            />
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-500">
                          {formatReceivedDate(
                            appointment.created_at
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ==================================================
          PATIENT DETAIL DRAWER
      ================================================== */}

      {selectedAppointment && (
        <div className="fixed inset-0 z-[100]">
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close patient details"
            onClick={() =>
              setSelectedAppointment(null)
            }
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
          />

          {/* DRAWER */}

          <aside className="absolute bottom-0 right-0 top-auto flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:bottom-0 sm:top-0 sm:max-h-none sm:max-w-[460px] sm:rounded-none sm:rounded-l-[28px]">
            {/* HEADER */}

            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-extrabold text-white">
                    {getInitials(
                      selectedAppointment.name
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-extrabold text-slate-950">
                      {selectedAppointment.name ||
                        "Unknown Patient"}
                    </h2>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Appointment #
                      {selectedAppointment.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAppointment(null)
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                  aria-label="Close drawer"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                    selectedAppointment.status
                  )}`}
                >
                  {getStatusLabel(
                    selectedAppointment.status
                  )}
                </span>
              </div>
            </div>

            {/* CONTENT */}

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {/* CONTACT */}

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Patient Contact
                </p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Phone size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Phone
                      </p>

                      <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                        {selectedAppointment.phone ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Mail size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Email
                      </p>

                      <p className="mt-0.5 break-all text-sm font-bold text-slate-800">
                        {selectedAppointment.email ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* APPOINTMENT */}

              <div className="mt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Appointment Request
                </p>

                <div className="mt-3 rounded-[20px] border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Treatment
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-900">
                        {selectedAppointment.treatment ||
                          "General Inquiry"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <CalendarDays
                        size={15}
                        className="text-blue-600"
                      />

                      <p className="mt-2 text-[9px] font-bold uppercase text-slate-400">
                        Preferred Date
                      </p>

                      <p className="mt-1 break-words text-xs font-extrabold text-slate-800">
                        {selectedAppointment.appointment_date ||
                          "Not set"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <Clock3
                        size={15}
                        className="text-blue-600"
                      />

                      <p className="mt-2 text-[9px] font-bold uppercase text-slate-400">
                        Preferred Time
                      </p>

                      <p className="mt-1 text-xs font-extrabold text-slate-800">
                        {selectedAppointment.appointment_time ||
                          "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* REQUEST INFO */}

              <div className="mt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Request Information
                </p>

                <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
                    <span className="text-xs text-slate-500">
                      Patient ID
                    </span>

                    <span className="text-xs font-extrabold text-slate-900">
                      #{selectedAppointment.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-3">
                    <span className="text-xs text-slate-500">
                      Received
                    </span>

                    <span className="text-right text-xs font-extrabold text-slate-900">
                      {formatReceivedDateTime(
                        selectedAppointment.created_at
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER */}

            <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
              {normalizeStatus(
                selectedAppointment.status
              ) === "pending" ? (
                <div className="space-y-3">
                  {cleanPhoneForTel(
                    selectedAppointment.phone
                  ) && (
                    <a
                      href={`tel:${cleanPhoneForTel(
                        selectedAppointment.phone
                      )}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700"
                    >
                      <Phone size={16} />

                      Call Patient
                    </a>
                  )}

                  <StatusButtons
                    id={selectedAppointment.id}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {cleanPhoneForTel(
                    selectedAppointment.phone
                  ) ? (
                    <a
                      href={`tel:${cleanPhoneForTel(
                        selectedAppointment.phone
                      )}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700"
                    >
                      <Phone size={16} />

                      Call
                    </a>
                  ) : (
                    <button
                      disabled
                      className="rounded-xl bg-slate-100 text-sm font-bold text-slate-400"
                    >
                      No Phone
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAppointment(null)
                    }
                    className="rounded-xl bg-[#071A52] px-4 py-3 text-sm font-bold text-white"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}