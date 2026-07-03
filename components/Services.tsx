"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "Dental Implants",
    description:
      "Permanent tooth replacement solutions designed for long-term function and aesthetics.",
    image: "/images/dental-implants.jpg",
  },
  {
    title: "Teeth Whitening",
    description:
      "Professional whitening treatments for a brighter, cleaner and more confident smile.",
    image: "/images/teeth-whitening.jpg",
  },
  {
    title: "Root Canal Treatment",
    description:
      "Advanced endodontic care focused on relieving pain and saving your natural tooth.",
    image: "/images/root-canal.jpg",
  },
  {
    title: "Orthodontics",
    description:
      "Modern teeth alignment treatments including clear aligners and braces.",
    image: "/images/orthodontics.jpg",
  },
  {
    title: "Pediatric Dentistry",
    description:
      "Gentle and friendly dental care designed especially for children.",
    image: "/images/pediatric-dentistry.jpg",
  },
  {
    title: "Cosmetic Dentistry",
    description:
      "Transform your smile with veneers, bonding and personalized cosmetic care.",
    image: "/images/cosmetic-dentistry.jpg",
  },
  {
    title: "Emergency Dental Care",
    description:
      "Fast support for dental pain, swelling, infection and urgent dental concerns.",
    image: "/images/emergency-dental.jpg",
  },
  {
    title: "General Dentistry",
    description:
      "Complete preventive and routine dental care for healthy smiles and families.",
    image: "/images/general-dentistry.jpg",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      {/* Soft background decorations */}
      <div className="pointer-events-none absolute left-[-120px] top-[80px] h-[320px] w-[320px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* ================= HEADING ================= */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-blue-100
              bg-blue-50
              px-4
              py-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-blue-600
            "
          >
            Premium Dental Services
          </span>

          <h2
            className="
              mt-5
              text-3xl
              font-extrabold
              tracking-[-0.035em]
              text-slate-950
              sm:text-4xl
              lg:text-5xl
            "
          >
            World-Class Dental Care
            <span className="block text-blue-600">
              For Healthier, Brighter Smiles
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
            From dental implants to smile makeovers, our specialists combine
            advanced technology with personalized care to deliver exceptional
            outcomes.
          </p>
        </div>

        {/* ================= SERVICE CARDS ================= */}
        <div
          className="
            mt-12
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:mt-14
            lg:grid-cols-4
            lg:gap-6
          "
        >
          {services.map((service) => (
            <article
              key={service.title}
              className="
                group
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-slate-200/80
                bg-white
                shadow-[0_8px_30px_rgba(15,23,42,0.06)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-blue-200
                hover:shadow-[0_22px_55px_rgba(37,99,235,0.13)]
              "
            >
              {/* ================= IMAGE ================= */}
              <div className="relative h-[190px] w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    25vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* Subtle image overlay only */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-slate-950/15
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              {/* ================= CONTENT ================= */}
              <div className="p-5">
                <h3
                  className="
                    text-[17px]
                    font-bold
                    tracking-tight
                    text-slate-900
                    transition-colors
                    duration-300
                    group-hover:text-blue-600
                  "
                >
                  {service.title}
                </h3>

                <p
                  className="
                    mt-2.5
                    min-h-[66px]
                    text-[13px]
                    leading-[1.65]
                    text-slate-600
                  "
                >
                  {service.description}
                </p>

                <button
                  type="button"
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-1.5
                    text-[12px]
                    font-bold
                    text-blue-600
                    transition-all
                    duration-300
                    hover:gap-2.5
                    hover:text-blue-700
                  "
                >
                  Explore Treatment

                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </button>
              </div>

              {/* Bottom hover line */}
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
      </div>
    </section>
  );
}