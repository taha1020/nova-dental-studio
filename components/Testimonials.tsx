"use client";

import {
  ArrowRight,
  MessageCircle,
  Quote,
  ShieldCheck,
  Star,
} from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Dental Implant Patient",
    treatment: "Dental Implants",
    initials: "AK",
    rating: 5,
    review:
      "The entire process was explained clearly from the first consultation. The team made me feel comfortable, answered all my questions, and the final result gave me real confidence in my smile.",
  },
  {
    name: "Hamza Ahmed",
    role: "Teeth Whitening Patient",
    treatment: "Teeth Whitening",
    initials: "HA",
    rating: 5,
    review:
      "A very professional and comfortable experience. The staff was welcoming, the process was smooth, and I was genuinely happy with how fresh and natural my smile looked afterward.",
  },
  {
    name: "Maham Ali",
    role: "Cosmetic Dentistry Patient",
    treatment: "Smile Makeover",
    initials: "MA",
    rating: 5,
    review:
      "From consultation to treatment, everything felt organized and personalized. The team listened carefully to what I wanted and guided me through every step with confidence.",
  },
];

export default function Testimonials() {
  const scrollToAppointment = () => {
    document.getElementById("appointment")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#F6F8FC] py-16 sm:py-20 lg:py-24"
    >
      {/* ================= TOP SEPARATOR ================= */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />

      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[360px] w-[360px] rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[380px] w-[380px] rounded-full bg-cyan-100/35 blur-[130px]" />

      {/* ================= CONTAINER ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-blue-600 shadow-sm">
            <MessageCircle size={14} />

            Patient Experiences
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Trusted Care.

            <span className="block text-blue-600">
              Real Patient Experiences.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
            Discover what patients value about their experience with
            Nova Dental — from clear communication and comfortable
            care to personalized treatment journeys.
          </p>

        </div>

        {/* ================= TESTIMONIAL GRID ================= */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-7">

          {testimonials.map((item) => (
            <article
              key={item.name}
              className="
                group
                relative
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200/90
                bg-white
                p-6

                shadow-[0_10px_35px_rgba(15,23,42,0.06)]

                transition-all
                duration-500

                hover:-translate-y-2
                hover:border-blue-200
                hover:shadow-[0_24px_60px_rgba(37,99,235,0.13)]

                sm:p-7
              "
            >
              {/* ================= TOP ROW ================= */}

              <div className="flex items-start justify-between gap-4">

                {/* Rating */}

                <div>

                  <div className="flex items-center gap-1">

                    {Array.from({ length: item.rating }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          size={15}
                          className="fill-amber-400 text-amber-400"
                        />
                      )
                    )}

                  </div>

                  <p className="mt-2 text-[11px] font-medium text-slate-400">
                    Patient Experience
                  </p>

                </div>

                {/* Quote */}

                <Quote
                  size={28}
                  strokeWidth={1.7}
                  className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200"
                />

              </div>

              {/* ================= REVIEW ================= */}

              <blockquote className="mt-6 flex-1">

                <p className="text-[14px] leading-7 text-slate-600 sm:text-[15px]">
                  “{item.review}”
                </p>

              </blockquote>

              {/* ================= TREATMENT ================= */}

              <div className="mt-6">

                <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-blue-700">
                  {item.treatment}
                </span>

              </div>

              {/* ================= DIVIDER ================= */}

              <div className="my-6 h-px bg-slate-100" />

              {/* ================= PATIENT INFO ================= */}

              <div className="flex items-center gap-3.5">

                {/* Avatar */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-extrabold text-blue-700">
                  {item.initials}
                </div>

                {/* Info */}

                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-sm font-bold text-slate-950 sm:text-base">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.role}
                  </p>

                </div>

              </div>

              {/* ================= HOVER LINE ================= */}

              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 group-hover:w-full" />

            </article>
          ))}

        </div>

        {/* ================= BOTTOM BUSINESS CTA ================= */}

        <div className="mt-12 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:mt-14">

          <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-8">

            {/* LEFT */}

            <div className="flex items-start gap-4">

              {/* Icon */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071A52] text-white shadow-lg shadow-blue-900/15">
                <ShieldCheck size={22} />
              </div>

              {/* Content */}

              <div>

                <h3 className="text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">
                  Ready To Discuss Your Dental Care?
                </h3>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
                  Explore treatment information with our AI Dental
                  Assistant or request an appointment with the Nova
                  Dental team.
                </p>

              </div>

            </div>

            {/* CTA */}

            <button
              type="button"
              onClick={scrollToAppointment}
              className="
                group
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#071A52]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white

                shadow-[0_12px_30px_rgba(7,26,82,0.18)]

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-[#0B2A74]
                hover:shadow-[0_18px_40px_rgba(7,26,82,0.25)]
              "
            >
              Book Appointment

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

          </div>
        </div>

      </div>
    </section>
  );
}