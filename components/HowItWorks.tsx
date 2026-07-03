"use client";

import {
  MessageCircle,
  Bot,
  CalendarDays,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Ask Anything",
    description:
      "Ask about treatments, procedures, pricing, availability, or general dental care.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Get Instant Answers",
    description:
      "Our AI assistant provides helpful information instantly, anytime you need it.",
    icon: Bot,
  },
  {
    number: "03",
    title: "Request Appointment",
    description:
      "Choose your preferred service, date, and time through a simple booking flow.",
    icon: CalendarDays,
  },
  {
    number: "04",
    title: "Clinic Confirmation",
    description:
      "Our clinic team reviews your request and confirms the appointment details.",
    icon: BadgeCheck,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="
        relative
        overflow-hidden
        border-y
        border-blue-100/70
        bg-[#EEF5FF]
        py-20
        sm:py-24
        lg:py-28
      "
    >
      {/* ================= BACKGROUND DECORATION ================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-16
          h-[360px]
          w-[360px]
          rounded-full
          bg-blue-300/20
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-[380px]
          w-[380px]
          rounded-full
          bg-cyan-300/20
          blur-[110px]
        "
      />

      {/* Subtle center glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[620px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/60
          blur-[120px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ================= HEADING ================= */}

        <div className="mx-auto max-w-3xl text-center">

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-200
              bg-white/80
              px-4
              py-2
              text-[11px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-blue-600
              shadow-sm
              backdrop-blur-md
            "
          >
            <Bot size={14} />

            Simple AI-Powered Process
          </span>

          <h2
            className="
              mt-5
              text-3xl
              font-extrabold
              leading-[1.08]
              tracking-[-0.04em]
              text-slate-950
              sm:text-4xl
              lg:text-5xl
            "
          >
            From Question To Appointment
            <span className="block text-blue-600">
              In Four Simple Steps
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-[15px]
              leading-7
              text-slate-600
              sm:text-base
            "
          >
            Get instant dental guidance, explore treatment information,
            and request an appointment through a simple AI-assisted experience.
          </p>

        </div>

        {/* ================= DESKTOP PROCESS ================= */}

        <div className="relative mt-16 hidden lg:block">

          {/* Connector background line */}
          <div
            className="
              absolute
              left-[12.5%]
              right-[12.5%]
              top-[46px]
              h-[2px]
              bg-blue-200
            "
          />

          {/* Active gradient line */}
          <div
            className="
              absolute
              left-[12.5%]
              right-[12.5%]
              top-[46px]
              h-[2px]
              bg-gradient-to-r
              from-blue-400
              via-blue-600
              to-cyan-400
            "
          />

          <div className="relative grid grid-cols-4 gap-7">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative text-center"
                >
                  {/* ================= ICON NODE ================= */}

                  <div
                    className="
                      relative
                      z-10
                      mx-auto
                      flex
                      h-[94px]
                      w-[94px]
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-blue-200
                      bg-white
                      shadow-[0_15px_40px_rgba(37,99,235,0.12)]

                      transition-all
                      duration-500

                      group-hover:-translate-y-2
                      group-hover:border-blue-400
                      group-hover:shadow-[0_22px_55px_rgba(37,99,235,0.20)]
                    "
                  >
                    <div
                      className="
                        flex
                        h-[52px]
                        w-[52px]
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-50
                        text-blue-600

                        transition-all
                        duration-500

                        group-hover:rotate-3
                        group-hover:bg-blue-600
                        group-hover:text-white
                      "
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>

                    {/* Step number */}
                    <span
                      className="
                        absolute
                        -bottom-3
                        flex
                        h-8
                        min-w-8
                        items-center
                        justify-center
                        rounded-full
                        border-[4px]
                        border-[#EEF5FF]
                        bg-[#071A52]
                        px-1
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* ================= STEP CONTENT ================= */}

                  <div className="mt-9 px-3">

                    <h3
                      className="
                        text-[17px]
                        font-bold
                        tracking-tight
                        text-slate-950

                        transition-colors
                        duration-300

                        group-hover:text-blue-600
                      "
                    >
                      {step.title}
                    </h3>

                    <p
                      className="
                        mx-auto
                        mt-3
                        max-w-[245px]
                        text-[13px]
                        leading-6
                        text-slate-600
                      "
                    >
                      {step.description}
                    </p>

                  </div>

                </article>
              );
            })}

          </div>
        </div>

        {/* ================= MOBILE / TABLET PROCESS ================= */}

        <div className="relative mx-auto mt-14 max-w-2xl lg:hidden">

          {/* Vertical line */}
          <div
            className="
              absolute
              bottom-8
              left-[29px]
              top-8
              w-[2px]
              bg-gradient-to-b
              from-blue-400
              via-blue-600
              to-cyan-400
            "
          />

          <div className="relative space-y-5">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="
                    group
                    relative
                    flex
                    items-start
                    gap-4
                    sm:gap-5
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      relative
                      z-10
                      flex
                      h-[60px]
                      w-[60px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-blue-200
                      bg-white
                      text-blue-600
                      shadow-[0_10px_30px_rgba(37,99,235,0.12)]
                    "
                  >
                    <Icon size={23} strokeWidth={2} />

                    <span
                      className="
                        absolute
                        -right-2
                        -top-2
                        flex
                        h-6
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[#071A52]
                        px-1
                        text-[9px]
                        font-bold
                        text-white
                      "
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content card */}
                  <div
                    className="
                      flex-1
                      rounded-[20px]
                      border
                      border-blue-100
                      bg-white/90
                      p-5
                      shadow-[0_10px_35px_rgba(15,23,42,0.06)]
                      backdrop-blur-md

                      transition-all
                      duration-300

                      group-hover:border-blue-300
                      group-hover:shadow-[0_15px_40px_rgba(37,99,235,0.12)]
                    "
                  >
                    <h3 className="text-base font-bold text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>

                </article>
              );
            })}

          </div>
        </div>

        {/* ================= TRUST NOTE ================= */}

        <div
          className="
            mx-auto
            mt-14
            flex
            max-w-2xl
            items-center
            justify-center
            gap-2.5
            rounded-2xl
            border
            border-blue-200
            bg-white/85
            px-5
            py-4
            text-center
            text-xs
            font-medium
            text-slate-600
            shadow-[0_10px_35px_rgba(37,99,235,0.08)]
            backdrop-blur-md
            sm:text-sm
          "
        >
          <CheckCircle2
            size={18}
            className="shrink-0 text-blue-600"
          />

          Available anytime to guide patients and simplify appointment requests.
        </div>

      </div>
    </section>
  );
}