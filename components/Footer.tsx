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
                    +92 321 7618209
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
                    Dground  People's Colony
                    <br />
                    Faisalabad, Pakistan
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

  
    </footer>
  );
}