"use client";

import { useState } from "react";
import {
  Bot,
  ChevronDown,
  CircleHelp,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const faqs = [
  {
    question: "Do you accept emergency appointments?",
    answer:
      "Yes. We aim to accommodate urgent dental concerns as quickly as possible, subject to clinic availability. Contact our team or request an appointment online for assistance.",
  },
  {
    question: "Can I book an appointment online?",
    answer:
      "Yes. You can request an appointment online by selecting your treatment, preferred date, and preferred time. Our clinic team will review the request and confirm availability.",
  },
  {
    question: "Can I ask the AI Dental Assistant about treatments?",
    answer:
      "Yes. Our AI Dental Assistant can provide general information about available treatments and help guide you toward the appropriate next step. It does not replace professional diagnosis or clinical advice.",
  },
  {
    question: "Do you offer dental implants?",
    answer:
      "Yes. Implant services may include consultation, treatment planning, placement, and restoration depending on your individual clinical needs and suitability.",
  },
  {
    question: "What happens after I submit an appointment request?",
    answer:
      "Your request is securely submitted to the clinic workflow for review. A team member can then confirm the appointment or contact you if an alternative date or time is needed.",
  },

];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openAIChat = () => {
    window.dispatchEvent(
      new CustomEvent("open-nova-chat")
    );
  };

  return (
    <section
      id="faq"
      className="
        relative
        overflow-hidden
        bg-white
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
          bg-blue-200/20
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
          bg-cyan-200/20
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
        {/* ================= HEADER ================= */}

        <div className="mx-auto max-w-3xl text-center">

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
            <CircleHelp size={15} />

            Frequently Asked Questions
          </div>

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
            Questions About Your

            <span className="block text-blue-600">
              Dental Care?
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-slate-600
              sm:text-base
              sm:leading-8
            "
          >
            Find quick answers about appointments, treatments,
            online booking, and our AI-powered patient support experience.
          </p>
        </div>

        {/* ================= FAQ LAYOUT ================= */}

        <div
          className="
            mx-auto
            mt-14
            grid
            max-w-6xl
            items-start
            gap-8
            lg:mt-16
            lg:grid-cols-[minmax(0,1fr)_340px]
            lg:gap-10
          "
        >
          {/* ================= ACCORDION ================= */}

          <div className="space-y-4">

            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`
                    overflow-hidden
                    rounded-[22px]
                    border
                    bg-white
                    transition-all
                    duration-300

                    ${
                      isOpen
                        ? "border-blue-200 shadow-[0_16px_45px_rgba(37,99,235,0.10)]"
                        : "border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:border-blue-200"
                    }
                  `}
                >
                  {/* Question Button */}

                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-5
                      px-5
                      py-5
                      text-left
                      sm:px-6
                      sm:py-6
                    "
                  >
                    <div className="flex items-center gap-4">

                      {/* Number */}

                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          text-xs
                          font-extrabold
                          transition-all
                          duration-300

                          ${
                            isOpen
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600"
                          }
                        `}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      {/* Question */}

                      <h3
                        className="
                          text-[14px]
                          font-bold
                          leading-6
                          text-slate-900
                          sm:text-base
                        "
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron */}

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300

                        ${
                          isOpen
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }
                      `}
                    >
                      <ChevronDown
                        size={18}
                        className={`
                          transition-transform
                          duration-300

                          ${
                            isOpen
                              ? "rotate-180"
                              : "rotate-0"
                          }
                        `}
                      />
                    </div>
                  </button>

                  {/* Answer */}

                  <div
                    className={`
                      grid
                      transition-all
                      duration-300
                      ease-in-out

                      ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }
                    `}
                  >
                    <div className="overflow-hidden">

                      <div
                        className="
                          border-t
                          border-slate-100
                          px-5
                          pb-6
                          pt-5
                          sm:ml-20
                          sm:px-6
                        "
                      >
                        <p
                          className="
                            text-sm
                            leading-7
                            text-slate-600
                          "
                        >
                          {faq.answer}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* ================= AI HELP CARD ================= */}

          <aside
            className="
              relative
              overflow-hidden
              rounded-[28px]
              bg-[#071A52]
              p-7
              shadow-[0_20px_60px_rgba(7,26,82,0.20)]
              sm:p-8
              lg:sticky
              lg:top-32
            "
          >
            {/* Glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-56
                w-56
                rounded-full
                bg-cyan-400/20
                blur-3xl
              "
            />

            <div className="relative z-10">

              {/* Icon */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/10
                  text-cyan-300
                  backdrop-blur-xl
                "
              >
                <Bot size={27} />
              </div>

              {/* Content */}

              <h3
                className="
                  mt-6
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-white
                "
              >
                Still Have a Question?
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-slate-300
                "
              >
                Ask our AI Dental Assistant for instant general
                information about treatments, services, and the
                appointment process.
              </p>

              {/* Features */}

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <ShieldCheck
                    size={17}
                    className="shrink-0 text-cyan-300"
                  />

                  Available 24/7
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <MessageCircle
                    size={17}
                    className="shrink-0 text-cyan-300"
                  />

                  Instant general guidance
                </div>

              </div>

              {/* CTA */}

              <button
                type="button"
                onClick={openAIChat}
                className="
                  group
                  mt-7
                  inline-flex
                  w-full
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
                <Bot size={18} />

                Ask AI Assistant

                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>

              {/* Small Disclaimer */}

              <p
                className="
                  mt-4
                  text-center
                  text-[10px]
                  leading-5
                  text-slate-400
                "
              >
                AI responses provide general information and do not
                replace professional dental diagnosis or advice.
              </p>

            </div>
          </aside>
        </div>

      </div>
    </section>
  );
}