"use client";

import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Heart,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "#" },
  { name: "Services", href: "#services" },
  { name: "About Us", href: "#about" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Contact", href: "#appointment" },
];

const services = [
  { name: "Teeth Whitening", href: "#services" },
  { name: "Dental Implants", href: "#services" },
  { name: "Root Canal Treatment", href: "#services" },
  { name: "Orthodontics", href: "#services" },
  { name: "General Dentistry", href: "#services" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-slate-200 bg-white"
    >
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.25fr] lg:gap-10">
          {/* Brand */}
          <div>
            <a
              href="#"
              className="inline-flex items-center"
              aria-label="Nova Dental Studio Home"
            >
              <Image
                src="/images/logo.png"
                alt="Nova Dental Studio"
                width={260}
                height={90}
                className="h-16 w-auto object-contain"
              />
            </a>

            <p className="mt-5 max-w-sm text-[15px] leading-7 text-slate-500">
              Advanced dental care powered by modern technology,
              experienced professionals, and intelligent AI support.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[17px] w-[17px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.2c0-1 .3-1.7 1.8-1.7H17V2.4c-.3 0-1.4-.1-2.7-.1-2.7 0-4.6 1.7-4.6 4.7v2.6H7v3.5h2.7v9h3.8Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:bg-pink-500 hover:text-white hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[17px] w-[17px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-[#0A66C2] hover:text-white hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[17px] w-[17px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.5 8.5H3.3V19h3.2V8.5ZM4.9 3A1.9 1.9 0 1 0 4.9 6.8 1.9 1.9 0 0 0 4.9 3ZM20.7 13c0-3.2-1.7-4.8-4-4.8-1.8 0-2.7 1-3.1 1.7V8.5h-3.2V19h3.2v-5.2c0-1.4.3-2.7 2-2.7 1.7 0 1.7 1.6 1.7 2.8V19h3.2l.2-6Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[15px] text-slate-500 transition-colors duration-300 hover:text-blue-600"
                  >
                    <span>{link.name}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Services
            </h3>

            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="group inline-flex items-center gap-2 text-[15px] text-slate-500 transition-colors duration-300 hover:text-blue-600"
                  >
                    <span>{service.name}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5">
              {/* Phone */}
              <a
                href="tel:+923001234567"
                className="group flex items-start gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Phone size={16} />
                </span>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-[15px] font-medium text-slate-600 transition-colors group-hover:text-blue-600">
                    +92 300 1234567
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@novadentalstudio.com"
                className="group flex items-start gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Mail size={16} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-[15px] font-medium text-slate-600 transition-colors group-hover:text-blue-600">
                    info@novadentalstudio.com
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={16} />
                </span>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 text-[15px] leading-6 text-slate-600">
                    123 Dental Square,
                    <br />
                    Lahore, Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 border-t border-slate-200 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Nova Dental Studio. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-blue-600"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-blue-600"
            >
              Terms of Service
            </a>

            <p className="inline-flex items-center gap-1.5">
              Designed with
              <Heart
                size={14}
                className="fill-red-500 text-red-500"
              />
              for healthy smiles.
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923001234567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_35px_rgba(37,211,102,0.45)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.52 2 2.03 6.48 2.03 12c0 1.76.46 3.48 1.33 4.99L2 22l5.15-1.35A9.94 9.94 0 0 0 12.04 22C17.56 22 22 17.52 22 12S17.56 2 12.04 2Zm0 18.18a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.06.8.82-2.98-.2-.31A8.17 8.17 0 0 1 3.86 12c0-4.51 3.67-8.18 8.18-8.18A8.18 8.18 0 0 1 20.22 12c0 4.51-3.67 8.18-8.18 8.18Zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z" />
        </svg>
      </a>
    </footer>
  );
}