"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  Send,
  UserRound,
  Stethoscope,
  CheckCircle2,
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

export default function CTA() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    treatment: "",
    date: "",
    time: "",
  });

  const [submitted, setSubmitted] = useState(false);

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
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // IMPORTANT:
    // Yahan next step mein tumhari existing
    // Supabase appointment booking logic connect hogi.

    console.log("Appointment Data:", formData);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section
      id="appointment"
      className="relative overflow-hidden bg-[#F8FBFF] py-20 sm:py-24 lg:py-28"
    >
      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute -left-32 top-20 h-[320px] w-[320px] rounded-full bg-blue-200/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-[360px] w-[360px] rounded-full bg-cyan-200/20 blur-3xl" />

      {/* ================= MAIN CONTAINER ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

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
            Complete the form with your preferred treatment,
            date, and time. Our clinic team will review your
            request and confirm availability.
          </p>
        </div>

        {/* ================= APPOINTMENT CARD ================= */}

        <div className="mt-14 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)] lg:mt-16">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            {/* ================= LEFT IMAGE ================= */}

            <div className="relative min-h-[360px] overflow-hidden sm:min-h-[440px] lg:min-h-[620px]">

              <Image
                src="/images/clinic-interior.jpg"
                alt="Modern dental clinic reception"
                fill
                sizes="
                  (max-width: 1024px) 100vw,
                  45vw
                "
                className="object-cover"
              />

              {/* Image Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#061A4A]/90 via-[#061A4A]/15 to-transparent" />



              {/* Left Content - Hidden on Mobile */}

              <div className="absolute inset-x-0 bottom-0 hidden md:block p-6 sm:p-8 lg:p-10">

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
                  Request your preferred appointment in just a few
                  steps. Our clinic team will review your details
                  and confirm availability.
                </p>

                {/* Mini Trust Features */}

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

            {/* ================= RIGHT FORM ================= */}

            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">

              {/* Form Header */}

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  Appointment Request
                </p>

                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Book Your Appointment
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Fill in your details below and select your
                  preferred treatment, date, and time.
                </p>

              </div>

              {/* Success Message */}

              {submitted && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="font-bold">
                      Appointment request received
                    </p>

                    <p className="mt-1 text-emerald-700">
                      Our clinic team will review your request
                      and confirm availability.
                    </p>
                  </div>
                </div>
              )}

              {/* ================= FORM ================= */}

              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Full Name */}

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
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>
                  </div>

                  {/* Phone */}

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
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03XX-XXXXXXX"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>
                  </div>

                  {/* Email */}

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
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>
                  </div>

                  {/* Treatment */}

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
                  </div>

                  {/* Date */}

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
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />

                    </div>
                  </div>

                  {/* Time */}

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

                        {timeSlots.map((time) => (
                          <option
                            key={time}
                            value={time}
                          >
                            {time}
                          </option>
                        ))}

                      </select>

                    </div>
                  </div>

                </div>

                {/* ================= SUBMIT BUTTON ================= */}

                <button
                  type="submit"
                  className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#071A52] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B2A74]"
                >
                  <Send size={17} />

                  Submit Appointment Request
                </button>

                {/* Small Notice */}

                <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
                  Submitting this form sends an appointment request.
                  Your appointment is confirmed only after clinic review.
                </p>

              </form>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}