"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const results = [
  {
    treatment: "Professional Teeth Whitening",
    category: "Cosmetic Dentistry",
    description:
      "A brighter, more confident smile achieved through professional whitening care.",
    beforeImage: "/images/whitening-before.jpg",
    afterImage: "/images/whitening-after.jpg",
  },
  {
    treatment: "Smile Makeover",
    category: "Aesthetic Dentistry",
    description:
      "A personalized smile transformation designed around facial balance and dental aesthetics.",
    beforeImage: "/images/smile-before.jpg",
    afterImage: "/images/smile-after.jpg",
  },
  {
    treatment: "Dental Veneers",
    category: "Cosmetic Restoration",
    description:
      "A refined smile appearance using carefully planned aesthetic dental treatment.",
    beforeImage: "/images/veneers-before.jpg",
    afterImage: "/images/veneers-after.jpg",
  },
];

export default function Results() {
  const scrollToAppointment = () => {
    document.getElementById("appointment")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="results"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[360px] w-[360px] rounded-full bg-blue-100/35 blur-[110px]" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-[380px] w-[380px] rounded-full bg-cyan-100/35 blur-[120px]" />

      {/* Very subtle top separation */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* ================= MAIN CONTAINER ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ================= SECTION HEADER ================= */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-blue-600">
            <Sparkles size={14} />

            Patient Transformations
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Transforming Smiles,
            <span className="block text-blue-600">
              Building Confidence
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
            Explore selected smile transformations and discover how
            personalized dental care can improve confidence, comfort,
            and appearance.
          </p>

        </div>

        {/* ================= RESULTS GRID ================= */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-7">

          {results.map((item) => (
            <article
              key={item.treatment}
              className="
                group
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200/90
                bg-white
                shadow-[0_10px_35px_rgba(15,23,42,0.07)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-blue-200
                hover:shadow-[0_24px_60px_rgba(37,99,235,0.14)]
              "
            >
              {/* ================= IMAGE COMPARISON ================= */}

              <div className="relative grid h-[250px] grid-cols-2 overflow-hidden sm:h-[280px] lg:h-[270px]">

                {/* BEFORE IMAGE */}

                <div className="relative overflow-hidden bg-slate-100">
                  <Image
                    src={item.beforeImage}
                    alt={`${item.treatment} before treatment`}
                    fill
                    sizes="
                      (max-width: 768px) 50vw,
                      (max-width: 1024px) 25vw,
                      17vw
                    "
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                  <span className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-slate-950/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                    Before
                  </span>
                </div>

                {/* AFTER IMAGE */}

                <div className="relative overflow-hidden bg-blue-50">
                  <Image
                    src={item.afterImage}
                    alt={`${item.treatment} after treatment`}
                    fill
                    sizes="
                      (max-width: 768px) 50vw,
                      (max-width: 1024px) 25vw,
                      17vw
                    "
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent" />

                  <span className="absolute bottom-4 right-4 rounded-full border border-white/25 bg-blue-600/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                    After
                  </span>
                </div>

                {/* CENTER DIVIDER */}

                <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-10 w-px -translate-x-1/2 bg-white/90" />

                {/* CENTER ARROW */}

                <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[4px] border-white bg-blue-600 text-white shadow-[0_8px_25px_rgba(37,99,235,0.30)]">
                  <ArrowRight size={15} />
                </div>

              </div>

              {/* ================= CARD CONTENT ================= */}

              <div className="p-5 sm:p-6">

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.11em] text-blue-600">
                  <BadgeCheck size={14} />

                  {item.category}
                </div>

                <h3 className="mt-3 text-[19px] font-extrabold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-blue-600">
                  {item.treatment}
                </h3>

                <p className="mt-3 min-h-[72px] text-[13px] leading-6 text-slate-600">
                  {item.description}
                </p>

                {/* Bottom */}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <ShieldCheck
                      size={15}
                      className="text-blue-600"
                    />

                    Personalized Care
                  </div>

                  <button
                    type="button"
                    onClick={scrollToAppointment}
                    className="
                      group/button
                      inline-flex
                      items-center
                      gap-1.5
                      text-[11px]
                      font-bold
                      text-blue-600
                      transition-all
                      duration-300
                      hover:text-blue-700
                    "
                  >
                    Book Visit

                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/button:translate-x-1"
                    />
                  </button>

                </div>
              </div>

              {/* Bottom hover accent */}

              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 group-hover:w-full" />

            </article>
          ))}

        </div>

        {/* ================= BOTTOM CTA ================= */}

        <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-[24px] border border-blue-100 bg-[#F8FBFF] p-6 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8">

          {/* CTA decoration */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="relative z-10">

            <h3 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              Ready to Start Your Smile Journey?
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Request an appointment and let our dental team help you
              explore treatment options tailored to your needs.
            </p>

            <button
              type="button"
              onClick={scrollToAppointment}
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#071A52]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_12px_35px_rgba(7,26,82,0.20)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#0B2A74]
                hover:shadow-[0_18px_45px_rgba(7,26,82,0.28)]
              "
            >
              Book Your Consultation

              <ArrowRight size={17} />
            </button>

          </div>
        </div>

        {/* ================= DISCLAIMER ================= */}

        <p className="mx-auto mt-5 max-w-2xl text-center text-[10px] leading-5 text-slate-400 sm:text-[11px]">
          Treatment outcomes vary by patient. Images should represent
          genuine clinical cases and be used with appropriate patient consent.
        </p>

      </div>
    </section>
  );
}