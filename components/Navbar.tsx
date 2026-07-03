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
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-5">

        <div className="h-[96px] bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[30px] shadow-xl flex items-center justify-between px-6 lg:px-10">

          {/* Logo */}

          <a href="/" className="flex items-center">

            <Image
              src="/images/logo.png"
              alt="Clinic Logo"
              width={400}
              height={100}
              priority
              className="h-[72px] lg:h-[82px] w-auto object-contain"
            />

          </a>

          {/* Desktop Menu */}

          <nav className="hidden lg:flex items-center gap-3">

            {navLinks.map((item, index) => (

              <a
                key={item.name}
                href={item.href}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${index === 0
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
              >
                {item.name}
              </a>

            ))}

          </nav>

          {/* CTA */}

          <a
            href="#appointment"
            className="hidden lg:flex items-center gap-2 bg-[#071A52] hover:bg-[#0B2A74] hover:scale-105 transition-all duration-300 text-white rounded-full px-6 py-4 font-semibold shadow-lg whitespace-nowrap shrink-0"
          >
            <CalendarDays size={18} className="shrink-0" />

            Book Appointment
          </a>
          {/* Mobile */}

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >
            {open ? (
              <X size={30} />
            ) : (
              <Menu size={30} />
            )}
          </button>

        </div>

        {/* Mobile Menu */}

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${open ? "max-h-[500px] mt-4" : "max-h-0"
            }`}
        >

          <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl p-6">

            <div className="flex flex-col gap-3">

              {navLinks.map((item) => (

                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  {item.name}
                </a>

              ))}

              <a
                href="#appointment"
                onClick={() => setOpen(false)}
                className="mt-3 bg-[#071A52] text-white rounded-full py-4 text-center font-semibold"
              >
                Book Appointment
              </a>

            </div>

          </div>

        </div>

      </div>
    </header>
  );
}