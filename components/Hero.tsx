"use client";

import Image from "next/image";
import {
  Bot,
  CalendarDays,
} from "lucide-react";

export default function Hero() {
  // Open existing chatbot
  const openAIChat = () => {
    window.dispatchEvent(
      new CustomEvent("open-nova-chat")
    );
  };

  // Scroll to appointment section
  const goToAppointment = () => {
    document
      .getElementById("appointment")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section
      id="home"
      className="
        relative
        isolate
        min-h-[100svh]
        w-full
        overflow-hidden
        bg-[#06142f]
      "
    >
      {/* ================= BACKGROUND IMAGE ================= */}

      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-clinic.jpg"
          alt="Modern dental clinic"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />
      </div>

      {/* ================= DARK OVERLAY ================= */}

      <div
        className="
          absolute
          inset-0
          z-[1]
          bg-slate-950/50
        "
      />

      {/* ================= PREMIUM BLUE OVERLAY ================= */}

      <div
        className="
          absolute
          inset-0
          z-[2]

          bg-gradient-to-b

          from-[#071A52]/30
          via-[#071A52]/20
          to-[#020817]/65
        "
      />

      {/* ================= CENTER GLOW ================= */}

      <div
        className="
          pointer-events-none

          absolute
          left-1/2
          top-1/2
          z-[3]

          h-[420px]
          w-[760px]
          max-w-[90vw]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-blue-500/10

          blur-[110px]
        "
      />

      {/* ================= MAIN WRAPPER ================= */}

      <div
        className="
          relative
          z-10

          mx-auto

          flex
          min-h-[100svh]
          w-full
          max-w-7xl

          items-center
          justify-center

          px-5

          pt-[125px]
          pb-12

          sm:px-6
          sm:pt-[135px]

          lg:px-8
          lg:pt-[140px]
          lg:pb-16
        "
      >
        {/* ================= CENTER CONTENT ================= */}

        <div
          className="
            mx-auto

            flex
            w-full
            max-w-[1000px]

            flex-col

            items-center
            justify-center

            text-center
          "
        >
          {/* ================= HEADING ================= */}

          <h1
            className="
              max-w-[980px]

              text-[42px]
              font-extrabold
              leading-[1.02]
              tracking-[-0.045em]

              text-white

              drop-shadow-[0_6px_24px_rgba(0,0,0,0.30)]

              sm:text-[54px]

              md:text-[64px]

              lg:text-[76px]

              xl:text-[82px]
            "
          >
            Your Smart Dental

            <span className="mt-2 block">
              Assistant{" "}

              <span
                className="
                  bg-gradient-to-r
                  from-blue-400
                  via-sky-300
                  to-cyan-300

                  bg-clip-text

                  text-transparent
                "
              >
                24/7
              </span>
            </span>
          </h1>

          {/* ================= DESCRIPTION ================= */}

          <p
            className="
              mt-7

              max-w-[720px]

              text-[15px]
              leading-7

              text-white/80

              drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]

              sm:text-[16px]

              md:text-[18px]
              md:leading-8
            "
          >
            Get instant answers, explore dental treatments,
            and book appointments anytime with your intelligent
            AI Dental Receptionist.
          </p>

          {/* ================= CTA BUTTONS ================= */}

          <div
            className="
              mt-9

              flex
              w-full
              flex-col

              items-center
              justify-center

              gap-4

              sm:w-auto
              sm:flex-row
            "
          >
            {/* ================= ASK AI ================= */}

            <button
              type="button"
              onClick={openAIChat}
              className="
                group

                inline-flex
                w-full

                items-center
                justify-center

                gap-2.5

                rounded-full

                bg-[#1268F5]

                px-8
                py-4

                text-[14px]
                font-semibold
                text-white

                shadow-[0_16px_40px_rgba(37,99,235,0.35)]

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-[#2478FF]

                hover:shadow-[0_20px_50px_rgba(37,99,235,0.48)]

                active:scale-[0.97]

                sm:w-auto

                md:text-[15px]
              "
            >
              <Bot
                size={19}
                className="
                  transition-transform
                  duration-300

                  group-hover:scale-110
                "
              />

              Ask AI Assistant
            </button>

            {/* ================= BOOK APPOINTMENT ================= */}

            <button
              type="button"
              onClick={goToAppointment}
              className="
                group

                inline-flex
                w-full

                items-center
                justify-center

                gap-2.5

                rounded-full

                border
                border-white/30

                bg-white/10

                px-8
                py-4

                text-[14px]
                font-semibold
                text-white

                shadow-[0_12px_30px_rgba(0,0,0,0.12)]

                backdrop-blur-xl

                transition-all
                duration-300

                hover:-translate-y-1

                hover:border-white/60

                hover:bg-white
                hover:text-slate-900

                hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]

                active:scale-[0.97]

                sm:w-auto

                md:text-[15px]
              "
            >
              <CalendarDays
                size={19}
                className="
                  transition-transform
                  duration-300

                  group-hover:scale-110
                "
              />

              Book Appointment
            </button>
          </div>

          {/* ================= SUBTLE TRUST TEXT ================= */}

          <p
            className="
              mt-7

              text-[12px]
              font-medium

              tracking-[0.03em]

              text-white/45

              sm:text-[13px]
            "
          >
            Instant answers • Easy booking • Available 24/7
          </p>
        </div>
      </div>
    </section>
  );
}