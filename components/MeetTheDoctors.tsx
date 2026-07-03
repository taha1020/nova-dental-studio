"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const doctors = [
  {
    name: "Dr. Ayesha Khan",
    role: "Implant & Restorative Dentist",
    focus: "Dental Implants & Restorative Care",
    image: "/images/dr-1.jpg",
  },
  {
    name: "Dr. Hamza Ahmed",
    role: "Cosmetic Dentist",
    focus: "Aesthetic & Cosmetic Dentistry",
    image: "/images/dr-2.jpg",
  },
  {
    name: "Dr. Mahnoor Ali",
    role: "Orthodontic Care Dentist",
    focus: "Smile Alignment & Orthodontic Care",
    image: "/images/doctor-3.jpg",
  },
];

export default function MeetTheDoctors() {
  const scrollToAppointment = () => {
    document.getElementById("appointment")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="doctors"
      className="
        relative
        overflow-hidden
        bg-white
        pt-16
        pb-16
        sm:pt-20
        sm:pb-20
        lg:pt-24
        lg:pb-20
      "
    >
      {/* ================= TOP SEPARATOR ================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-slate-200
          to-transparent
        "
      />

      {/* ================= BACKGROUND DECORATION ================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          h-[340px]
          w-[340px]
          rounded-full
          bg-blue-100/35
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-10
          h-[380px]
          w-[380px]
          rounded-full
          bg-cyan-100/30
          blur-[130px]
        "
      />

      {/* ================= MAIN CONTAINER ================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* ================= HEADER ================= */}

        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-100
              bg-blue-50
              px-4
              py-2
              text-[11px]
              font-bold
              uppercase
              tracking-[0.13em]
              text-blue-600
            "
          >
            <Stethoscope size={14} />

            Meet Our Dental Team
          </div>

          {/* Heading */}

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
            Experienced Dentists.

            <span className="block text-blue-600">
              Personalized Dental Care.
            </span>
          </h2>

          {/* Description */}

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
            Meet the dental professionals focused on clear
            communication, modern treatment planning, and
            comfortable patient care throughout your smile journey.
          </p>
        </div>

        {/* ================= DOCTORS GRID ================= */}

        <div
          className="
            mt-12
            grid
            gap-6

            md:grid-cols-2

            lg:mt-14
            lg:grid-cols-3
            lg:gap-7
          "
        >
          {doctors.map((doctor) => (
            <article
              key={doctor.name}
              className="
                group
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200/90
                bg-white

                shadow-[0_10px_35px_rgba(15,23,42,0.06)]

                transition-all
                duration-500

                hover:-translate-y-2
                hover:border-blue-200
                hover:shadow-[0_24px_60px_rgba(37,99,235,0.13)]
              "
            >
              {/* ================= IMAGE ================= */}

              <div
                className="
                  relative
                  h-[330px]
                  overflow-hidden
                  bg-slate-100

                  sm:h-[360px]

                  lg:h-[380px]
                "
              >
                <Image
                  src={doctor.image}
                  alt={`${doctor.name} - ${doctor.role}`}
                  fill
                  sizes="
                    (max-width: 768px) 100vw,
                    (max-width: 1024px) 50vw,
                    33vw
                  "
                  className="
                    object-cover
                    object-top

                    transition-transform
                    duration-700
                    ease-out

                    group-hover:scale-105
                  "
                />

                {/* Soft Image Overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#061A4A]/90
                    via-[#061A4A]/10
                    to-transparent
                  "
                />



                {/* Doctor Identity */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-5
                    sm:p-6
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-extrabold
                      tracking-tight
                      text-white

                      sm:text-2xl
                    "
                  >
                    {doctor.name}
                  </h3>

                  <p
                    className="
                      mt-1.5
                      text-sm
                      font-semibold
                      text-cyan-300
                    "
                  >
                    {doctor.role}
                  </p>
                </div>
              </div>

              {/* ================= CARD CONTENT ================= */}

              <div className="p-5 sm:p-6">
                {/* Focus Area */}

                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                    "
                  >
                    <GraduationCap size={18} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.1em]
                        text-slate-400
                      "
                    >
                      Focus Area
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        leading-6
                        text-slate-800
                      "
                    >
                      {doctor.focus}
                    </p>
                  </div>
                </div>

                {/* Divider */}

                <div className="my-5 h-px bg-slate-100" />

                {/* Bottom Row */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[11px]
                      font-medium
                      text-slate-500

                      sm:text-xs
                    "
                  >
                    <ShieldCheck
                      size={14}
                      className="shrink-0 text-blue-600"
                    />

                    Patient-Focused Care
                  </div>

                  <button
                    type="button"
                    onClick={scrollToAppointment}
                    className="
                      group/button
                      inline-flex
                      shrink-0
                      items-center
                      gap-1.5

                      text-xs
                      font-bold
                      text-blue-600

                      transition-all
                      duration-300

                      hover:gap-2
                      hover:text-blue-700
                    "
                  >
                    Book Visit

                    <ArrowRight
                      size={14}
                      className="
                        transition-transform
                        duration-300

                        group-hover/button:translate-x-1
                      "
                    />
                  </button>
                </div>
              </div>

              {/* Bottom Hover Accent */}

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[3px]
                  w-0

                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-400

                  transition-all
                  duration-500

                  group-hover:w-full
                "
              />
            </article>
          ))}
        </div>

        {/* ================= BOTTOM CTA ================= */}

        <div
          className="
            relative
            mt-12
            overflow-hidden
            rounded-[24px]
            bg-[#071A52]

            shadow-[0_18px_50px_rgba(7,26,82,0.18)]

            lg:mt-14
          "
        >
          {/* CTA Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-cyan-400/20
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10

              flex
              flex-col
              gap-6

              px-6
              py-7

              sm:px-8

              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-10
              lg:py-8
            "
          >
            {/* CTA CONTENT */}

            <div className="max-w-2xl">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-cyan-300
                "
              >
                <BadgeCheck size={14} />

                Personalized Dental Care
              </div>

              <h3
                className="
                  mt-3
                  text-xl
                  font-extrabold
                  tracking-tight
                  text-white

                  sm:text-2xl
                "
              >
                Not Sure Which Dentist Is Right for You?
              </h3>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-300
                "
              >
                Request an appointment and our clinic team can help
                guide your booking based on your treatment needs and
                preferred appointment time.
              </p>
            </div>

            {/* CTA BUTTON */}

            <button
              type="button"
              onClick={scrollToAppointment}
              className="
                group
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2.5

                rounded-full
                bg-white

                px-6
                py-3.5

                text-sm
                font-bold
                text-[#071A52]

                shadow-xl

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-blue-50
              "
            >
              <CalendarDays size={17} />

              Book Appointment

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                "
              />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}