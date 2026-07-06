"use client";

import { useState } from "react";
import {
  Mic,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import VoiceAgent from "@/components/VoiceAgent";

export default function Features() {
  const [voiceOpen, setVoiceOpen] =
    useState(false);

  const handleVoiceAgent = () => {
    setVoiceOpen(true);
  };

  const handleCloseVoiceAgent = () => {
    setVoiceOpen(false);
  };

  return (
    <>
      <section
        id="voice-agent"
        className="relative overflow-hidden bg-[#061A4A]"
      >
        {/* ================= BACKGROUND EFFECTS ================= */}

        <div className="pointer-events-none absolute inset-0">
          {/* Left glow */}

          <div
            className="
              absolute
              -left-20
              top-1/2
              h-56
              w-56
              -translate-y-1/2
              rounded-full
              bg-blue-500/15
              blur-3xl
            "
          />

          {/* Right glow */}

          <div
            className="
              absolute
              -right-16
              top-1/2
              h-64
              w-64
              -translate-y-1/2
              rounded-full
              bg-cyan-400/15
              blur-3xl
            "
          />

          {/* Decorative line */}

          <div
            className="
              absolute
              left-0
              top-0
              h-px
              w-full
              bg-gradient-to-r
              from-transparent
              via-blue-400/40
              to-transparent
            "
          />
        </div>

        {/* ================= CONTENT ================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-7xl
            px-5
            py-7

            sm:px-6
            sm:py-8

            lg:px-8
            lg:py-9
          "
        >
          <div
            className="
              flex
              flex-col
              items-start
              justify-between
              gap-6

              md:flex-row
              md:items-center
            "
          >
            {/* ================= LEFT SIDE ================= */}

            <div className="flex items-center gap-4 sm:gap-5">
              {/* Voice Icon */}

              <div className="relative shrink-0">
                {/* Pulse Ring */}

                <div
                  className="
                    absolute
                    inset-0
                    animate-ping
                    rounded-2xl
                    bg-cyan-400/20
                  "
                />

                {/* Icon Box */}

                <div
                  className="
                    relative
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-cyan-300/25

                    bg-white/10

                    text-cyan-300

                    shadow-[0_10px_35px_rgba(34,211,238,0.12)]

                    backdrop-blur-md

                    sm:h-16
                    sm:w-16
                  "
                >
                  <PhoneCall
                    size={28}
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              {/* Text */}

              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="
                      text-lg
                      font-bold
                      tracking-tight
                      text-white

                      sm:text-xl

                      lg:text-2xl
                    "
                  >
                    Talk to Our AI Voice Agent
                  </h2>

                  <Sparkles
                    size={16}
                    className="
                      hidden
                      text-cyan-300
                      sm:block
                    "
                  />
                </div>

                <p
                  className="
                    mt-1.5
                    max-w-xl
                    text-sm
                    leading-6
                    text-blue-100/75

                    sm:text-[15px]
                  "
                >
                  Get instant information using voice.
                  Just click and speak naturally.
                </p>
              </div>
            </div>

            {/* ================= RIGHT BUTTON ================= */}

            <button
              type="button"
              onClick={handleVoiceAgent}
              aria-label="Start AI voice agent"
              className="
                group

                inline-flex
                w-full
                items-center
                justify-center
                gap-3

                rounded-full

                border
                border-cyan-300/20

                bg-gradient-to-r
                from-blue-600
                to-cyan-500

                px-7
                py-3.5

                text-sm
                font-semibold
                text-white

                shadow-[0_12px_35px_rgba(14,165,233,0.25)]

                transition-all
                duration-300

                hover:-translate-y-1
                hover:shadow-[0_18px_45px_rgba(14,165,233,0.38)]

                active:scale-95

                md:w-auto

                sm:px-8
                sm:py-4
              "
            >
              {/* Voice Animation */}

              <div
                className="flex items-center gap-[3px]"
                aria-hidden="true"
              >
                <span className="h-3 w-[2px] rounded-full bg-white/80 transition-all group-hover:h-5" />

                <span className="h-5 w-[2px] rounded-full bg-white transition-all group-hover:h-3" />

                <span className="h-4 w-[2px] rounded-full bg-white/90 transition-all group-hover:h-6" />

                <span className="h-6 w-[2px] rounded-full bg-white transition-all group-hover:h-4" />

                <span className="h-3 w-[2px] rounded-full bg-white/80 transition-all group-hover:h-5" />
              </div>

              <span>
                Talk to AI Agent
              </span>

              <Mic
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </button>
          </div>
        </div>

        {/* ================= BOTTOM LIGHT LINE ================= */}

        <div
          className="
            absolute
            bottom-0
            left-1/2
            h-px
            w-[70%]
            -translate-x-1/2

            bg-gradient-to-r
            from-transparent
            via-cyan-400/30
            to-transparent
          "
        />
      </section>

      {/* ================= VOICE AGENT MODAL ================= */}

      <VoiceAgent
        open={voiceOpen}
        onClose={handleCloseVoiceAgent}
      />
    </>
  );
}