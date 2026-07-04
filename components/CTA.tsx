"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  Send,
  UserRound,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const treatments = [
  "Teeth Whitening",
  "Dental Implants",
  "Root Canal Treatment",
  "Orthodontics",
  "Cosmetic Dentistry",
  "General Dentistry",
  "Emergency Dental Care",
  "Smile Makeover",
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  date: string;
  time: string;
};

type SubmitStatus = "idle" | "success" | "error";

const initialFormData: FormData = {
  name: "",
  phone: "",
  email: "",
  treatment: "",
  date: "",
  time: "",
};

function convertTimeTo24Hour(value: string) {
  const match = value
    .trim()
    .toUpperCase()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (!match) return value;

  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3];

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export default function CTA() {
  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitStatus, setSubmitStatus] =
    useState<SubmitStatus>("idle");

  const [errorMessage, setErrorMessage] =
    useState("");

  const minDate = useMemo(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const bookingPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        treatment: formData.treatment,
        appointmentDate: formData.date,
        appointmentTime: convertTimeTo24Hour(
          formData.time
        ),
      };

      const response = await fetch(
        "/api/book-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            bookingPayload
          ),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to submit appointment request."
        );
      }

      setSubmitStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      console.error(
        "Appointment form error:",
        error
      );

      setSubmitStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't submit your appointment request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="appointment"
      className="relative overflow-hidden bg-[#F8FBFF] py-20 sm:py-24 lg:py-28"
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -left-32 top-20 h-[320px] w-[320px] rounded-full bg-blue-200/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-[360px] w-[360px] rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
            <CalendarDays size={15} />
            Book An Appointment
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[48px]">
            Request Your Dental
            <span className="block text-blue-600">
              Appointment Online
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Complete the form with your
            preferred treatment, date, and
            time. Our clinic team will review
            your request and confirm
            availability.
          </p>
        </div>

        {/* CARD */}

        <div className="mt-14 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)] lg:mt-16">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            {/* LEFT IMAGE */}

            <div className="relative min-h-[260px] overflow-hidden sm:min-h-[360px] md:min-h-[440px] lg:min-h-[620px]">

              <Image
                src="/images/clinic-interior.jpg"
                alt="Modern dental clinic reception"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#061A4A]/90 via-[#061A4A]/15 to-transparent" />

              {/* Hidden on mobile */}

              <div className="absolute inset-x-0 bottom-0 hidden p-6 md:block sm:p-8 lg:p-10">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-xl">
                  <CheckCircle2
                    size={15}
                    className="text-cyan-300"
                  />
                  Simple Online Request
                </div>

                <h3 className="mt-5 max-w-md text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                  Modern Dental Care,
                  Designed Around You
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-200">
                  Request your preferred
                  appointment in just a few
                  steps. Our clinic team will
                  review your details and
                  confirm availability.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                    <CalendarDays
                      size={19}
                      className="text-cyan-300"
                    />

                    <p className="mt-2 text-sm font-bold text-white">
                      Easy Booking
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      Choose preferred date
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                    <Clock3
                      size={19}
                      className="text-cyan-300"
                    />

                    <p className="mt-2 text-sm font-bold text-white">
                      Flexible Time
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      Select a time slot
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT FORM */}

            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  Appointment Request
                </p>

                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Book Your Appointment
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Fill in your details below
                  and select your preferred
                  treatment, date, and time.
                </p>
              </div>

              {/* SUCCESS */}

              {submitStatus === "success" && (
                <div
                  role="status"
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="font-bold">
                      Appointment request received
                    </p>

                    <p className="mt-1 text-emerald-700">
                      Our clinic team will
                      review your request and
                      contact you to confirm
                      availability.
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR */}

              {submitStatus === "error" && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="font-bold">
                      Request not submitted
                    </p>

                    <p className="mt-1 text-red-700">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">

                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        minLength={3}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03XX-XXXXXXX"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* TREATMENT */}

                  <div>
                    <label
                      htmlFor="treatment"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Treatment Needed
                    </label>

                    <div className="relative">
                      <Stethoscope
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        id="treatment"
                        name="treatment"
                        required
                        value={formData.treatment}
                        onChange={handleChange}
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">
                          Select Treatment
                        </option>

                        {treatments.map(
                          (treatment) => (
                            <option
                              key={treatment}
                              value={treatment}
                            >
                              {treatment}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* DATE */}

                  <div>
                    <label
                      htmlFor="date"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Preferred Date
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="date"
                        name="date"
                        type="date"
                        min={minDate}
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* TIME */}

                  <div>
                    <label
                      htmlFor="time"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Preferred Time
                    </label>

                    <div className="relative">
                      <Clock3
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        id="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">
                          Select Time
                        </option>

                        {timeSlots.map(
                          (time) => (
                            <option
                              key={time}
                              value={time}
                            >
                              {time}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#071A52] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B2A74] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit Appointment Request
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
                  Submitting this form sends
                  an appointment request. Your
                  appointment is confirmed only
                  after clinic review.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}