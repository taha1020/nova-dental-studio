"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  sender: "bot" | "user";
  text: string;
};

type NovaChatEvent = CustomEvent<{
  message?: string;
}>;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `Welcome to Nova Dental Studio 👋

I'm your virtual dental assistant.

I can help with:
• Dental treatments
• Appointment booking
• Teeth whitening
• Dental implants
• Root canal treatment
• General dental questions

How can I help you today?`,
    },
  ]);

  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [treatment, setTreatment] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ======================================================
     AUTO SCROLL CHAT
  ====================================================== */

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  /* ======================================================
     HIDE LAUNCHER INSIDE HERO VIEWPORT
     SHOW AFTER USER SCROLLS BELOW HERO
  ====================================================== */

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;

      setShowLauncher(
        window.scrollY > heroHeight * 0.72
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ======================================================
     HERO -> CHATBOT EVENT LISTENER
  ====================================================== */

  useEffect(() => {
    const handleOpenNovaChat = async (
      event: Event
    ) => {
      const customEvent = event as NovaChatEvent;
      const quickMessage =
        customEvent.detail?.message?.trim();

      setIsOpen(true);

      if (!quickMessage) return;

      // Prevent quick actions from interrupting
      // an active appointment booking flow
      if (step !== 0) {
        setInput(quickMessage);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: quickMessage,
        },
      ]);

      try {
        setIsTyping(true);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: quickMessage,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Failed to get AI response"
          );
        }

        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              data.reply ||
              "Sorry, I couldn't generate a response.",
          },
        ]);
      } catch (error) {
        console.error(
          "Hero quick action error:",
          error
        );

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, I'm currently unavailable. Please try again in a moment.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    };

    window.addEventListener(
      "open-nova-chat",
      handleOpenNovaChat
    );

    return () => {
      window.removeEventListener(
        "open-nova-chat",
        handleOpenNovaChat
      );
    };
  }, [step]);

  /* ======================================================
     MESSAGE HELPERS
  ====================================================== */

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text,
      },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);
  };

  /* ======================================================
     START BOOKING
  ====================================================== */

  const startBooking = () => {
    addBotMessage(
      "Great choice. What is your full name?"
    );

    setStep(1);
  };

  /* ======================================================
     SEND MESSAGE
  ====================================================== */

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const value = input.trim();

    setInput("");
    addUserMessage(value);

    const lower = value.toLowerCase();

    /* ================= STEP 0 ================= */

    if (
      step === 0 &&
      (
        lower.includes("appointment") ||
        lower.includes("book") ||
        lower.includes("booking") ||
        lower.includes("consultation") ||
        lower.includes("visit")
      )
    ) {
      startBooking();
      return;
    }

    /* ================= NORMAL AI CHAT ================= */

    if (step === 0) {
      try {
        setIsTyping(true);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: value,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Failed to get AI response"
          );
        }

        const data = await response.json();

        addBotMessage(
          data.reply ||
          "Sorry, I couldn't generate a response."
        );
      } catch (error) {
        console.error("Chat error:", error);

        addBotMessage(
          "Sorry, I'm currently unavailable. Please try again in a moment."
        );
      } finally {
        setIsTyping(false);
      }

      return;
    }

    /* ================= BOOKING FLOW ================= */

    if (step === 1) {
      setName(value);

      setTimeout(() => {
        addBotMessage(
          "What is your phone number?"
        );
      }, 300);

      setStep(2);
    }

    else if (step === 2) {
      setPhone(value);

      setTimeout(() => {
        addBotMessage(
          "What is your email address?"
        );
      }, 300);

      setStep(3);
    }

    else if (step === 3) {
      setEmail(value);

      setTimeout(() => {
        addBotMessage(
          "Which treatment are you interested in?"
        );
      }, 300);

      setStep(4);
    }

    else if (step === 4) {
      setTreatment(value);

      setTimeout(() => {
        addBotMessage(
          "What is your preferred appointment date?"
        );
      }, 300);

      setStep(5);
    }

    else if (step === 5) {
      setAppointmentDate(value);

      setTimeout(() => {
        addBotMessage(
          "What is your preferred appointment time?"
        );
      }, 300);

      setStep(6);
    }

    else if (step === 6) {
      const finalDate = appointmentDate;
      const finalTime = value;

      setAppointmentTime(finalTime);

      const { error } = await supabase
        .from("appointments")
        .insert([
          {
            name,
            phone,
            email,
            treatment,
            appointment_date: finalDate,
            appointment_time: finalTime,
          },
        ]);

      if (error) {
        console.error(error);

        addBotMessage(
          "❌ Something went wrong while saving your appointment."
        );
      } else {
        try {
          await fetch("/api/send-test-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              phone,
              email,
              treatment,
              appointmentDate: finalDate,
              appointmentTime: finalTime,
            }),
          });

          console.log("Admin Email Sent");
        } catch (emailError) {
          console.error(
            "Email Error:",
            emailError
          );
        }

        addBotMessage(
          "✅ Appointment request submitted successfully."
        );

        addBotMessage(
          "Our team will contact you shortly to confirm your appointment."
        );
      }

      setStep(7);
    }

    else {
      setTimeout(() => {
        addBotMessage(
          "Please start a new booking request if you need another appointment."
        );
      }, 300);
    }
  };

  return (
    <>
      {/* ==================================================
          FLOATING LAUNCHER
          Hidden while hero is visible
      ================================================== */}

      {showLauncher && !isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            fixed
            bottom-5
            right-5
            z-50

            rounded-full

            bg-[#071A52]

            px-5
            py-3.5

            text-white

            shadow-[0_18px_45px_rgba(7,26,82,0.28)]

            transition-all
            duration-300

            hover:-translate-y-1
            hover:bg-[#0B2A74]
            hover:shadow-[0_22px_55px_rgba(7,26,82,0.35)]

            active:scale-95

            sm:bottom-6
            sm:right-6
            sm:px-6
            sm:py-4
          "
        >
          <div className="flex items-center gap-3">

            <span className="relative flex h-3 w-3">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />

            </span>

            <span className="font-semibold">
              Ask Nova AI
            </span>

          </div>
        </button>
      )}

      {/* ==================================================
          CHAT WINDOW
      ================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            z-[60]

            inset-x-3
            bottom-3

            flex
            max-h-[calc(100dvh-24px)]
            flex-col

            overflow-hidden

            rounded-[24px]

            border
            border-slate-200

            bg-white

            shadow-[0_25px_80px_rgba(15,23,42,0.22)]

            sm:inset-x-auto
            sm:bottom-6
            sm:right-6
            sm:w-[400px]
            sm:max-h-[650px]
            sm:rounded-[28px]
          "
        >

          {/* ================= HEADER ================= */}

          <div className="shrink-0 border-b border-slate-200 p-4 sm:p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h3 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                    Nova AI Assistant
                  </h3>

                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" />

                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Appointment Booking • Patient Support
                </p>

              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  bg-slate-100

                  text-slate-500

                  transition

                  hover:bg-slate-200
                  hover:text-slate-900
                "
              >
                ✕
              </button>

            </div>
          </div>

          {/* ================= MESSAGES ================= */}

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">

            <div className="space-y-3">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.sender === "bot"
                      ? "max-w-[90%] whitespace-pre-line rounded-2xl rounded-tl-md border border-blue-100 bg-blue-50 p-3.5 text-sm leading-6 text-slate-700"
                      : "ml-auto max-w-[90%] whitespace-pre-line rounded-2xl rounded-tr-md bg-[#071A52] p-3.5 text-sm leading-6 text-white"
                  }
                >
                  {message.text}
                </div>
              ))}

              {/* Typing indicator */}

              {isTyping && (
                <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md bg-blue-50 px-4 py-3">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />

                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

            {/* Booking button */}

            {step === 0 && (
              <div className="mt-5 grid gap-3">

                <button
                  type="button"
                  onClick={startBooking}
                  className="
                    rounded-2xl

                    border
                    border-slate-200

                    bg-white

                    p-4

                    text-left
                    text-slate-700

                    transition-all

                    hover:border-blue-300
                    hover:bg-blue-50
                    hover:text-blue-700
                  "
                >
                  📅 Book Appointment
                </button>

              </div>
            )}

          </div>

          {/* ================= INPUT ================= */}

          <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">

            <div className="flex gap-2">

              <input
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                type="text"
                placeholder={
                  step === 0
                    ? "Ask about dental care..."
                    : "Type your answer..."
                }
                className="
                  min-w-0
                  flex-1

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-50

                  px-4
                  py-3

                  text-sm
                  text-slate-700

                  outline-none

                  placeholder:text-slate-400

                  focus:border-blue-500
                  focus:bg-white
                "
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={
                  !input.trim() ||
                  isTyping
                }
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center

                  rounded-2xl

                  bg-[#071A52]

                  font-semibold
                  text-white

                  transition-all

                  hover:bg-[#0B2A74]

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                →
              </button>

            </div>
          </div>

        </div>
      )}
    </>
  );
}