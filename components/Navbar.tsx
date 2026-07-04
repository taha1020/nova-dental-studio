"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Results", href: "#results" },
  { name: "Reviews", href: "#testimonials" },
  { name: "Contact", href: "#appointment" },
  { name: "FAQs", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-4 sm:pt-4 lg:px-8 lg:pt-5">

        {/* ================= MAIN NAVBAR ================= */}

        <div
          className="
            flex
            h-[76px]
            items-center
            justify-between
            rounded-[24px]
            border
            border-slate-200
            bg-white/95
            px-4
            shadow-xl
            backdrop-blur-xl

            sm:h-[84px]
            sm:rounded-[26px]
            sm:px-5

            lg:h-[96px]
            lg:rounded-[30px]
            lg:px-8

            xl:px-10
          "
        >
          {/* ================= LOGO ================= */}

          <a
            href="#"
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center"
            aria-label="Nova Dental Studio Home"
          >
            <Image
              src="/images/logo.png"
              alt="Nova Dental Studio"
              width={400}
              height={100}
              priority
              className="
                h-[58px]
                w-auto
                object-contain

                sm:h-[66px]

                lg:h-[76px]

                xl:h-[82px]
              "
            />
          </a>

          {/* ================= DESKTOP MENU ================= */}

          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            {navLinks.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`
                  whitespace-nowrap
                  rounded-full
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-300

                  xl:px-4
                  xl:text-[15px]

                  ${
                    index === 0
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* ================= DESKTOP CTA ================= */}

          <a
            href="#appointment"
            className="
              hidden
              shrink-0
              items-center
              gap-2
              whitespace-nowrap
              rounded-full
              bg-[#071A52]
              px-5
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300

              hover:scale-[1.03]
              hover:bg-[#0B2A74]

              lg:flex

              xl:px-6
              xl:py-4
            "
          >
            <CalendarDays
              size={18}
              className="shrink-0"
            />

            Book Appointment
          </a>

          {/* ================= MOBILE MENU BUTTON ================= */}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={
              open
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="
              relative
              z-[60]
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-black
              shadow-sm
              transition-all
              duration-300

              hover:bg-slate-100

              active:scale-95

              lg:hidden
            "
          >
            {open ? (
              <X
                size={28}
                strokeWidth={2.7}
                className="text-black"
              />
            ) : (
              <Menu
                size={30}
                strokeWidth={2.7}
                className="text-black"
              />
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}

        <div
          id="mobile-navigation"
          className={`
            overflow-hidden
            transition-all
            duration-300
            ease-in-out
            lg:hidden

            ${
              open
                ? "mt-3 max-h-[650px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              rounded-[24px]
              border
              border-slate-200
              bg-white
              p-4
              shadow-2xl

              sm:p-5
            "
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    ${
                      index === 0
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    }
                  `}
                >
                  {item.name}
                </a>
              ))}

              {/* Mobile CTA */}

              <a
                href="#appointment"
                onClick={() => setOpen(false)}
                className="
                  mt-3
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#071A52]
                  px-5
                  py-4
                  text-center
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300

                  hover:bg-[#0B2A74]

                  active:scale-[0.98]
                "
              >
                <CalendarDays size={18} />

                Book Appointment
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}