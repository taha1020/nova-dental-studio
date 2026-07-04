"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "bot" | "user";
  text: string;
};

type NovaChatEvent = CustomEvent<{
  message?: string;
}>;

type BookingData = {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  appointmentDate: string;
  appointmentTime: string;
};

const initialMessage: Message = {
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
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    initialMessage,
  ]);

  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [treatment, setTreatment] = useState("");
  const [appointmentDate, setAppointmentDate] =
    useState("");
  const [appointmentTime, setAppointmentTime] =
    useState("");

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const submittingRef = useRef(false);

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

  const resetBooking = () => {
    setStep(0);
    setName("");
    setPhone("");
    setEmail("");
    setTreatment("");
    setAppointmentDate("");
    setAppointmentTime("");
    setInput("");
    setIsSubmitting(false);
    setIsTyping(false);

    submittingRef.current = false;
  };

  /* ======================================================
     VALIDATION
  ====================================================== */

  const isValidName = (value: string) => {
    const clean = value.trim();

    return (
      clean.length >= 3 &&
      /^[A-Za-zÀ-ÿ' -]+$/.test(clean)
    );
  };

  const isValidPhone = (value: string) => {
    const clean = value.replace(
      /[\s()\-]/g,
      ""
    );

    return /^\+?\d{10,15}$/.test(clean);
  };

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
      value.trim()
    );
  };

  /* ======================================================
     DATE VALIDATION
  ====================================================== */

  const validateAndFormatDate = (
    year: number,
    month: number,
    day: number
  ): string | null => {
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    ) {
      return null;
    }

    if (
      year < new Date().getFullYear() ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return null;
    }

    const selectedDate = new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0
    );

    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() !== month - 1 ||
      selectedDate.getDate() !== day
    ) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const comparisonDate = new Date(
      year,
      month - 1,
      day
    );

    comparisonDate.setHours(0, 0, 0, 0);

    if (comparisonDate < today) {
      return null;
    }

    return `${year}-${String(month).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  };

  const normalizeDate = (
    value: string
  ): string | null => {
    const clean = value
      .trim()
      .replace(/,/g, " ")
      .replace(/\s+/g, " ");

    let year: number;
    let month: number;
    let day: number;

    const yearFirstMatch = clean.match(
      /^(\d{4})[\s/-](\d{1,2})[\s/-](\d{1,2})$/
    );

    if (yearFirstMatch) {
      year = Number(yearFirstMatch[1]);
      month = Number(yearFirstMatch[2]);
      day = Number(yearFirstMatch[3]);

      return validateAndFormatDate(
        year,
        month,
        day
      );
    }

    const dayFirstMatch = clean.match(
      /^(\d{1,2})[\s/-](\d{1,2})[\s/-](\d{4})$/
    );

    if (dayFirstMatch) {
      day = Number(dayFirstMatch[1]);
      month = Number(dayFirstMatch[2]);
      year = Number(dayFirstMatch[3]);

      return validateAndFormatDate(
        year,
        month,
        day
      );
    }

    const monthNames: Record<string, number> = {
      january: 1,
      jan: 1,
      february: 2,
      feb: 2,
      march: 3,
      mar: 3,
      april: 4,
      apr: 4,
      may: 5,
      june: 6,
      jun: 6,
      july: 7,
      jul: 7,
      august: 8,
      aug: 8,
      september: 9,
      sep: 9,
      sept: 9,
      october: 10,
      oct: 10,
      november: 11,
      nov: 11,
      december: 12,
      dec: 12,
    };

    const monthFirstText = clean.match(
      /^([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})$/
    );

    if (monthFirstText) {
      const monthValue =
        monthNames[
          monthFirstText[1].toLowerCase()
        ];

      if (!monthValue) return null;

      month = monthValue;
      day = Number(monthFirstText[2]);
      year = Number(monthFirstText[3]);

      return validateAndFormatDate(
        year,
        month,
        day
      );
    }

    const dayFirstText = clean.match(
      /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
    );

    if (dayFirstText) {
      const monthValue =
        monthNames[
          dayFirstText[2].toLowerCase()
        ];

      if (!monthValue) return null;

      day = Number(dayFirstText[1]);
      month = monthValue;
      year = Number(dayFirstText[3]);

      return validateAndFormatDate(
        year,
        month,
        day
      );
    }

    return null;
  };

  /* ======================================================
     TIME VALIDATION
  ====================================================== */

  const normalizeTime = (
    value: string
  ): string | null => {
    const clean = value
      .trim()
      .toUpperCase()
      .replace(/\./g, "")
      .replace(/\s+/g, " ");

    // 24-hour: 17:00 / 9:30
    const format24 = clean.match(
      /^([01]?\d|2[0-3]):([0-5]\d)$/
    );

    if (format24) {
      return `${String(
        Number(format24[1])
      ).padStart(2, "0")}:${format24[2]}`;
    }

    // 12-hour: 5 PM / 5PM / 5:30 PM
    const format12 = clean.match(
      /^(0?[1-9]|1[0-2])(?::([0-5]\d))?\s*(AM|PM)$/
    );

    if (format12) {
      let hour = Number(format12[1]);
      const minute = format12[2] || "00";
      const period = format12[3];

      if (period === "PM" && hour !== 12) {
        hour += 12;
      }

      if (period === "AM" && hour === 12) {
        hour = 0;
      }

      return `${String(hour).padStart(
        2,
        "0"
      )}:${minute}`;
    }

    // Flexible business input:
    // "5" -> 17:00
    // "10" -> 10:00
    const simpleHour = clean.match(
      /^(\d{1,2})$/
    );

    if (simpleHour) {
      let hour = Number(simpleHour[1]);

      if (hour < 0 || hour > 23) {
        return null;
      }

      // Common clinic assumption:
      // 1-7 means afternoon/evening
      if (hour >= 1 && hour <= 7) {
        hour += 12;
      }

      return `${String(hour).padStart(
        2,
        "0"
      )}:00`;
    }

    return null;
  };

  const formatDateForDisplay = (
    value: string
  ) => {
    const [year, month, day] = value
      .split("-")
      .map(Number);

    return new Intl.DateTimeFormat("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(
      new Date(year, month - 1, day)
    );
  };

  const formatTimeForDisplay = (
    value: string
  ) => {
    const [hour, minute] = value
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(
      hour,
      minute,
      0,
      0
    );

    return new Intl.DateTimeFormat("en-PK", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  /* ======================================================
     AUTO SCROLL
  ====================================================== */

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isOpen, isTyping]);

  /* ======================================================
     LAUNCHER VISIBILITY
  ====================================================== */

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;

      setShowLauncher(
        window.scrollY > heroHeight * 0.72
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ======================================================
     NORMAL AI REQUEST
  ====================================================== */

  const askAI = async (message: string) => {
    try {
      setIsTyping(true);

      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message,
        }),
      });

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to get AI response"
        );
      }

      addBotMessage(
        data?.reply ||
          "Sorry, I couldn't generate a response."
      );
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      addBotMessage(
        "I'm temporarily unable to answer that question. Please try again in a moment."
      );
    } finally {
      setIsTyping(false);
    }
  };

  /* ======================================================
     START BOOKING
  ====================================================== */

  const startBooking = () => {
    if (step !== 0) return;

    setStep(1);

    addBotMessage(
      "I'd be happy to help you request an appointment. What is your full name?"
    );
  };

  /* ======================================================
     HERO -> CHATBOT EVENT
  ====================================================== */

  useEffect(() => {
    const handleOpenNovaChat = async (
      event: Event
    ) => {
      const customEvent =
        event as NovaChatEvent;

      const quickMessage =
        customEvent.detail?.message?.trim();

      setIsOpen(true);

      if (!quickMessage) return;

      if (step !== 0) {
        setInput(quickMessage);
        return;
      }

      addUserMessage(quickMessage);

      const lower =
        quickMessage.toLowerCase();

      if (
        lower.includes("appointment") ||
        lower.includes("book") ||
        lower.includes("booking") ||
        lower.includes("consultation") ||
        lower.includes("visit")
      ) {
        setTimeout(() => {
          startBooking();
        }, 250);

        return;
      }

      await askAI(quickMessage);
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
     SUBMIT BOOKING
  ====================================================== */

  const submitBooking = async (
    booking: BookingData
  ) => {
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;

    try {
      setIsSubmitting(true);
      setIsTyping(true);

      const bookingPayload: BookingData = {
        name: booking.name.trim(),

        phone: booking.phone.trim(),

        email: booking.email
          .trim()
          .toLowerCase(),

        treatment: booking.treatment.trim(),

        appointmentDate:
          booking.appointmentDate.trim(),

        appointmentTime:
          booking.appointmentTime.trim(),
      };

      console.log(
        "Submitting appointment:",
        bookingPayload
      );

      const response = await fetch(
        "/api/book-chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            bookingPayload
          ),
        }
      );

      const rawText =
        await response.text();

      let data: any = {};

      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = {
            error: rawText,
          };
        }
      }

      if (!response.ok) {
        console.error(
          "Booking API failed:",
          {
            status: response.status,
            statusText:
              response.statusText,
            response: data,
          }
        );

        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to submit appointment (${response.status})`
        );
      }

      if (data?.success === false) {
        throw new Error(
          data?.error ||
            "Unable to submit appointment"
        );
      }

      addBotMessage(
        `✅ Thank you, ${bookingPayload.name}. Your appointment request has been submitted successfully.

Treatment: ${bookingPayload.treatment}
Preferred date: ${formatDateForDisplay(
          bookingPayload.appointmentDate
        )}
Preferred time: ${formatTimeForDisplay(
          bookingPayload.appointmentTime
        )}

Our clinic team will review availability and contact you to confirm your appointment.`
      );

      setStep(8);
    } catch (error) {
      console.error(
        "Appointment submission error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to submit appointment";

      addBotMessage(
        `❌ We couldn't submit your appointment request right now.

${errorMessage}

Your details are still saved in this chat. Please select Confirm again to retry, or Cancel to stop.`
      );

      setStep(7);
    } finally {
      submittingRef.current = false;

      setIsSubmitting(false);
      setIsTyping(false);
    }
  };

  /* ======================================================
     DIRECT CONFIRM BUTTON
  ====================================================== */

  const handleConfirmBooking = async () => {
    if (
      isSubmitting ||
      isTyping ||
      submittingRef.current
    ) {
      return;
    }

    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !treatment.trim() ||
      !appointmentDate.trim() ||
      !appointmentTime.trim()
    ) {
      addBotMessage(
        "Some appointment details are missing. Please restart the booking request."
      );

      return;
    }

    addUserMessage("Confirm");

    await submitBooking({
      name: name.trim(),

      phone: phone.trim(),

      email: email
        .trim()
        .toLowerCase(),

      treatment: treatment.trim(),

      appointmentDate:
        appointmentDate.trim(),

      appointmentTime:
        appointmentTime.trim(),
    });
  };

  /* ======================================================
     HANDLE SEND
  ====================================================== */

  const handleSend = async () => {
    if (
      !input.trim() ||
      isTyping ||
      isSubmitting ||
      submittingRef.current
    ) {
      return;
    }

    const value = input.trim();

    setInput("");

    addUserMessage(value);

    const lower = value.toLowerCase();

    /* ================= NORMAL CHAT ================= */

    if (step === 0) {
      const bookingIntent =
        lower.includes("appointment") ||
        lower.includes("book") ||
        lower.includes("booking") ||
        lower.includes("consultation") ||
        lower.includes("visit");

      if (bookingIntent) {
        setTimeout(() => {
          startBooking();
        }, 250);

        return;
      }

      await askAI(value);

      return;
    }

    /* ================= NAME ================= */

    if (step === 1) {
      if (!isValidName(value)) {
        addBotMessage(
          "Please enter your full name using letters only, for example: Muhammad Taha."
        );

        return;
      }

      setName(value);
      setStep(2);

      setTimeout(() => {
        addBotMessage(
          `Thank you, ${value}. What is your phone number?

Examples:
+92 300 1234567
0300 1234567`
        );
      }, 250);

      return;
    }

    /* ================= PHONE ================= */

    if (step === 2) {
      if (!isValidPhone(value)) {
        addBotMessage(
          "Please enter a valid phone number with 10 to 15 digits, for example +92 300 1234567."
        );

        return;
      }

      setPhone(value);
      setStep(3);

      setTimeout(() => {
        addBotMessage(
          "What is your email address? For example: name@example.com"
        );
      }, 250);

      return;
    }

    /* ================= EMAIL ================= */

    if (step === 3) {
      if (!isValidEmail(value)) {
        addBotMessage(
          "That email address doesn't look valid. Please enter a complete email, for example: name@example.com"
        );

        return;
      }

      setEmail(
        value.trim().toLowerCase()
      );

      setStep(4);

      setTimeout(() => {
        addBotMessage(
          `Which treatment are you interested in?

You can enter:
• Dental Implants
• Teeth Whitening
• Root Canal Treatment
• Orthodontics
• Cosmetic Dentistry
• General Dentistry
• Emergency Dental Care
• Other`
        );
      }, 250);

      return;
    }

    /* ================= TREATMENT ================= */

    if (step === 4) {
      if (value.length < 3) {
        addBotMessage(
          "Please enter the dental treatment you're interested in."
        );

        return;
      }

      setTreatment(value);
      setStep(5);

      setTimeout(() => {
        addBotMessage(
          `What date would you prefer for your appointment?

You can type it naturally:
• 12 July 2026
• 2026-7-12
• 12/7/2026
• 2026 7 12`
        );
      }, 250);

      return;
    }

    /* ================= DATE ================= */

    if (step === 5) {
      const validDate =
        normalizeDate(value);

      if (!validDate) {
        addBotMessage(
          `I couldn't understand that date.

Please enter a valid future date, for example:
• 12 July 2026
• 2026-7-12
• 12/7/2026`
        );

        return;
      }

      setAppointmentDate(validDate);
      setStep(6);

      setTimeout(() => {
        addBotMessage(
          `What time would you prefer?

You can type:
• 5 PM
• 5:30 PM
• 10 AM
• 17:00
• 5`
        );
      }, 250);

      return;
    }

    /* ================= TIME ================= */

    if (step === 6) {
      const validTime =
        normalizeTime(value);

      if (!validTime) {
        addBotMessage(
          `I couldn't understand that time.

Please try:
• 5 PM
• 5:30 PM
• 10 AM
• 17:00`
        );

        return;
      }

      setAppointmentTime(validTime);
      setStep(7);

      setTimeout(() => {
        addBotMessage(
          `Please confirm your appointment request:

Name: ${name}
Phone: ${phone}
Email: ${email}
Treatment: ${treatment}
Date: ${formatDateForDisplay(
            appointmentDate
          )}
Time: ${formatTimeForDisplay(
            validTime
          )}

Select Confirm to submit your request or Cancel to stop.`
        );
      }, 250);

      return;
    }

    /* ================= CONFIRMATION ================= */

    if (step === 7) {
      const confirmWords = [
        "confirm",
        "yes",
        "yes confirm",
        "submit",
        "submit booking",
        "confirm booking",
        "book it",
        "proceed",
        "ok",
        "okay",
      ];

      const cancelWords = [
        "cancel",
        "no",
        "stop",
        "cancel booking",
      ];

      if (cancelWords.includes(lower)) {
        resetBooking();

        setTimeout(() => {
          addBotMessage(
            "Your appointment request has been cancelled. No booking was submitted."
          );
        }, 250);

        return;
      }

      if (!confirmWords.includes(lower)) {
        addBotMessage(
          `Please select Confirm to submit your appointment request or Cancel to stop.`
        );

        return;
      }

      await submitBooking({
        name,
        phone,
        email,
        treatment,
        appointmentDate,
        appointmentTime,
      });

      return;
    }

    /* ================= AFTER SUCCESS ================= */

    if (step === 8) {
      if (
        lower.includes("new") ||
        lower.includes("another") ||
        lower.includes("book")
      ) {
        resetBooking();

        setTimeout(() => {
          setStep(1);

          addBotMessage(
            "Of course. What is your full name?"
          );
        }, 250);

        return;
      }

      addBotMessage(
        `Your appointment request has already been submitted. If you'd like another appointment, type "new booking".`
      );
    }
  };

  return (
    <>
      {/* ================= FLOATING LAUNCHER ================= */}

      {showLauncher && !isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Nova AI Assistant"
          className="
            fixed bottom-5 right-5 z-50
            rounded-full bg-[#071A52]
            px-5 py-3.5 text-white
            shadow-[0_18px_45px_rgba(7,26,82,0.28)]
            transition-all duration-300
            hover:-translate-y-1
            hover:bg-[#0B2A74]
            active:scale-95
            sm:bottom-6 sm:right-6
            sm:px-6 sm:py-4
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

      {/* ================= CHAT WINDOW ================= */}

      {isOpen && (
        <div
          className="
            fixed inset-x-3 bottom-3 z-[60]
            flex max-h-[calc(100dvh-24px)]
            flex-col overflow-hidden
            rounded-[24px]
            border border-slate-200
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
                onClick={() =>
                  setIsOpen(false)
                }
                aria-label="Close chatbot"
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full bg-slate-100
                  text-slate-500 transition
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
              {messages.map(
                (message, index) => (
                  <div
                    key={`${message.sender}-${index}`}
                    className={
                      message.sender === "bot"
                        ? "max-w-[90%] whitespace-pre-line rounded-2xl rounded-tl-md border border-blue-100 bg-blue-50 p-3.5 text-sm leading-6 text-slate-700"
                        : "ml-auto max-w-[90%] whitespace-pre-line rounded-2xl rounded-tr-md bg-[#071A52] p-3.5 text-sm leading-6 text-white"
                    }
                  >
                    {message.text}
                  </div>
                )
              )}

              {isTyping && (
                <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md bg-blue-50 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ================= BOOKING BUTTON ================= */}

            {step === 0 && (
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={startBooking}
                  className="
                    rounded-2xl
                    border border-slate-200
                    bg-white p-4
                    text-left text-slate-700
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

            {/* ================= CONFIRM / CANCEL ================= */}

            {step === 7 && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={
                    isSubmitting ||
                    isTyping
                  }
                  onClick={
                    handleConfirmBooking
                  }
                  className="
                    rounded-2xl
                    bg-[#071A52]
                    px-4 py-3
                    text-sm font-bold text-white
                    transition
                    hover:bg-[#0B2A74]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Confirm"}
                </button>

                <button
                  type="button"
                  disabled={
                    isSubmitting ||
                    isTyping
                  }
                  onClick={() => {
                    resetBooking();

                    addBotMessage(
                      "Your appointment request has been cancelled. No booking was submitted."
                    );
                  }}
                  className="
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    px-4 py-3
                    text-sm font-bold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:opacity-50
                  "
                >
                  Cancel
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
                disabled={
                  isTyping ||
                  isSubmitting
                }
                placeholder={
                  step === 0
                    ? "Ask about dental care..."
                    : step === 7
                    ? 'Type "Confirm" or "Cancel"...'
                    : step === 8
                    ? 'Type "new booking"...'
                    : "Type your answer..."
                }
                className="
                  min-w-0 flex-1
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm text-slate-700
                  outline-none
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:bg-white
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={
                  !input.trim() ||
                  isTyping ||
                  isSubmitting
                }
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-[#071A52]
                  font-semibold text-white
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