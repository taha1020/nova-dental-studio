"use client";

import Image from "next/image";
import {
  Award,
  BadgeCheck,
  HeartHandshake,
  Microscope,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const reasons = [
  {
    title: "Experienced Dental Team",
    description:
      "Skilled professionals focused on safe, precise, and comfortable dental care.",
    icon: Award,
  },
  {
    title: "Modern Technology",
    description:
      "Advanced diagnostics and modern treatment planning for better outcomes.",
    icon: Microscope,
  },
  {
    title: "Patient-Centered Care",
    description:
      "Every treatment plan is designed around your comfort, needs, and smile goals.",
    icon: HeartHandshake,
  },
];

const stats = [
  {
    value: "10K+",
    label: "Happy Patients",
  },
  {
    value: "15+",
    label: "Years Experience",
  },
  {
    value: "4.9★",
    label: "Patient Rating",
  },
  {
    value: "24/7",
    label: "Patient Support",
  },
];

export default function WhyChooseUs() {
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
      id="about"
      className="
        relative
        overflow-hidden
        bg-[#F8FBFF]

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
          top-20

          h-[320px]
          w-[320px]

          rounded-full
          bg-blue-200/30
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10

          h-[360px]
          w-[360px]

          rounded-full
          bg-cyan-200/30
          blur-3xl
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
        {/* ================= TOP ABOUT LAYOUT ================= */}

        <div
          className="
            grid
            items-center

            gap-12

            lg:grid-cols-2
            lg:gap-16
          "
        >
          {/* ================================================= */}
          {/* ================= LEFT IMAGE ===================== */}
          {/* ================================================= */}

          <div className="relative">

            {/* Main Image */}

            <div
              className="
                relative

                h-[420px]
                w-full

                overflow-hidden

                rounded-[28px]

                border
                border-white

                bg-slate-200

                shadow-[0_25px_70px_rgba(15,23,42,0.14)]

                sm:h-[500px]

                lg:h-[560px]
              "
            >
              <Image
                src="/images/about-clinic.jpg"
                alt="Nova Dental Studio"
                fill
                sizes="
                  (max-width: 1024px) 100vw,
                  50vw
                "
                className="
                  object-cover
                  object-center

                  transition-transform
                  duration-700

                  hover:scale-105
                "
              />

              {/* Image Gradient */}

              <div
                className="
                  absolute
                  inset-0

                  bg-gradient-to-t
                  from-[#061A4A]/45
                  via-transparent
                  to-transparent
                "
              />
            </div>

            {/* ================= FLOATING EXPERIENCE CARD ================= */}

            <div
              className="
                absolute

                -bottom-6
                left-5

                flex
                items-center
                gap-4

                rounded-2xl

                border
                border-white/70

                bg-white/95

                px-5
                py-4

                shadow-[0_18px_50px_rgba(15,23,42,0.15)]

                backdrop-blur-xl

                sm:left-8
                sm:px-6
                sm:py-5
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12

                  shrink-0

                  items-center
                  justify-center

                  rounded-xl

                  bg-blue-50

                  text-blue-600
                "
              >
                <Award size={24} />
              </div>

              <div>
                <p
                  className="
                    text-xl
                    font-extrabold
                    text-slate-950
                  "
                >
                  15+
                </p>

                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-500
                  "
                >
                  Years of Trusted Care
                </p>
              </div>
            </div>

            {/* ================= SMALL TRUST BADGE ================= */}

            <div
              className="
                absolute

                right-4
                top-5

                hidden

                items-center
                gap-2

                rounded-full

                border
                border-white/60

                bg-white/90

                px-4
                py-2.5

                text-xs
                font-semibold
                text-slate-800

                shadow-lg

                backdrop-blur-xl

                sm:flex
              "
            >
              <ShieldCheck
                size={16}
                className="text-blue-600"
              />

              Trusted Dental Care
            </div>

          </div>

          {/* ================================================= */}
          {/* ================= RIGHT CONTENT ================== */}
          {/* ================================================= */}

          <div>
            {/* Badge */}

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

                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
                text-blue-600
              "
            >
              <BadgeCheck size={15} />

              About Our Clinic
            </div>

            {/* Heading */}

            <h2
              className="
                mt-5

                text-3xl
                font-extrabold
                leading-[1.12]
                tracking-[-0.035em]

                text-slate-950

                sm:text-4xl

                lg:text-[48px]
              "
            >
              Modern Dentistry With

              <span
                className="
                  block
                  text-blue-600
                "
              >
                A Personal Touch
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mt-6

                max-w-xl

                text-[15px]
                leading-7

                text-slate-600

                sm:text-base
                sm:leading-8
              "
            >
              At Nova Dental Studio, we combine modern dental
              technology with compassionate, patient-focused care.
              Our goal is to make every visit comfortable, clear,
              and tailored to your individual smile.
            </p>

            {/* ================= REASONS ================= */}

            <div className="mt-8 space-y-4">

              {reasons.map((reason) => {
                const Icon = reason.icon;

                return (
                  <div
                    key={reason.title}
                    className="
                      group

                      flex
                      items-start

                      gap-4

                      rounded-2xl

                      border
                      border-slate-200/80

                      bg-white

                      p-4

                      shadow-[0_8px_30px_rgba(15,23,42,0.04)]

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-blue-200

                      hover:shadow-[0_15px_40px_rgba(37,99,235,0.10)]
                    "
                  >
                    {/* Icon */}

                    <div
                      className="
                        flex
                        h-11
                        w-11

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        bg-blue-50

                        text-blue-600

                        transition-all
                        duration-300

                        group-hover:bg-blue-600
                        group-hover:text-white
                      "
                    >
                      <Icon size={20} />
                    </div>

                    {/* Text */}

                    <div>
                      <h3
                        className="
                          text-[15px]
                          font-bold
                          text-slate-900
                        "
                      >
                        {reason.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[13px]
                          leading-6
                          text-slate-500
                        "
                      >
                        {reason.description}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* ================= CTA ================= */}

            <div
              className="
                mt-8

                flex
                flex-col

                gap-3

                sm:flex-row
                sm:items-center
              "
            >
              <button
                type="button"
                onClick={goToAppointment}
                className="
                  group

                  inline-flex
                  items-center
                  justify-center
                  gap-2.5

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
                <CalendarDays size={18} />

                Book Appointment

                <ArrowRight
                  size={17}
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

        {/* ================================================= */}
        {/* ================= STATS SECTION ================== */}
        {/* ================================================= */}

        <div
          className="
            mt-20

            grid

            grid-cols-2

            overflow-hidden

            rounded-[24px]

            border
            border-slate-200/80

            bg-white

            shadow-[0_15px_50px_rgba(15,23,42,0.06)]

            lg:mt-24
            lg:grid-cols-4
          "
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                relative

                px-4
                py-7

                text-center

                sm:px-6
                sm:py-8

                lg:py-9

                ${
                  index !== stats.length - 1
                    ? "lg:border-r lg:border-slate-200"
                    : ""
                }

                ${
                  index < 2
                    ? "border-b border-slate-200 lg:border-b-0"
                    : ""
                }

                ${
                  index % 2 === 0
                    ? "border-r border-slate-200 lg:border-r"
                    : ""
                }
              `}
            >
              <h3
                className="
                  text-3xl
                  font-extrabold
                  tracking-tight

                  text-[#071A52]

                  sm:text-4xl
                "
              >
                {stat.value}
              </h3>

              <p
                className="
                  mt-2

                  text-xs
                  font-medium
                  text-slate-500

                  sm:text-sm
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}