"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Mic,
  MicOff,
  PhoneOff,
  ShieldCheck,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type VoiceAgentProps = {
  open: boolean;
  onClose: () => void;
};

type AgentState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "booking"
  | "error";

type BookingStep =
  | "none"
  | "name"
  | "phone"
  | "email"
  | "treatment"
  | "date"
  | "time"
  | "confirm";

type BookingData = {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  appointmentDate: string;
  appointmentTime: string;
};

type SpeechRecognitionEventLike = {
  resultIndex?: number;

  results: {
    length: number;

    [index: number]: {
      isFinal?: boolean;

      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionErrorEventLike = {
  error?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;

  onerror:
    | ((event: SpeechRecognitionErrorEventLike) => void)
    | null;

  onend: (() => void) | null;
};

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/* =========================================================
   CONSTANTS
========================================================= */

const WELCOME_MESSAGE =
  "Hello, welcome to Nova Dental Studio. I am Nova, your virtual dental receptionist. How can I help you today?";

const EMPTY_BOOKING: BookingData = {
  name: "",
  phone: "",
  email: "",
  treatment: "",
  appointmentDate: "",
  appointmentTime: "",
};

const STOP_PHRASES = [
  "stop",
  "stop it",
  "okay stop",
  "ok stop",
  "nova stop",
  "please stop",
  "wait",
  "wait please",
  "hold on",
  "be quiet",
  "cancel speech",
];

const BOOKING_PHRASES = [
  "book appointment",
  "book an appointment",
  "make appointment",
  "make an appointment",
  "schedule appointment",
  "schedule an appointment",
  "appointment book",
  "i want appointment",
  "i want an appointment",
  "i need appointment",
  "i need an appointment",
  "reserve appointment",
];

/* =========================================================
   HELPERS
========================================================= */

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w@+.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isStopCommand(value: string) {
  const text = normalize(value);

  return STOP_PHRASES.some(
    (phrase) =>
      text === phrase ||
      text.includes(phrase)
  );
}

function isBookingIntent(value: string) {
  const text = normalize(value);

  return BOOKING_PHRASES.some((phrase) =>
    text.includes(phrase)
  );
}

function isYes(value: string) {
  const text = normalize(value);

  const yesWords = [
    "yes",
    "yeah",
    "yep",
    "confirm",
    "confirmed",
    "submit",
    "go ahead",
    "okay confirm",
    "ok confirm",
    "yes confirm",
  ];

  return yesWords.some(
    (item) =>
      text === item ||
      text.includes(item)
  );
}

function isNo(value: string) {
  const text = normalize(value);

  const noWords = [
    "no",
    "nope",
    "cancel",
    "cancel it",
    "do not submit",
    "don't submit",
    "stop booking",
  ];

  return noWords.some(
    (item) =>
      text === item ||
      text.includes(item)
  );
}

/* =========================================================
   VOICE BOOKING CLEANERS
========================================================= */

function cleanPatientName(input: string) {
  let value = input.trim();
  value = value.replace(/^(?:hi[,\s]+)?(?:my\s+(?:full\s+)?name\s+is|the\s+name\s+is|i\s+am|i'm|this\s+is|call\s+me)\s+/i, "").replace(/\s+/g, " ").trim();
  value = value.split(/\b(?:and\s+i|and\s+my|i\s+want|i\s+need|because|for\s+an?\s+appointment)\b/i)[0].trim();
  return value.split(" ").filter(Boolean).slice(0, 6).map((part) => part.split("-").map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase()).join("-")).join(" ");
}

const CANONICAL_TREATMENTS = [
  { name: "Teeth Whitening", phrases: ["teeth whitening", "tooth whitening", "whitening", "white teeth", "brighten my teeth"] },
  { name: "Dental Implants", phrases: ["dental implants", "dental implant", "tooth implant", "implants", "implant"] },
  { name: "Root Canal Treatment", phrases: ["root canal treatment", "root canal", "rct"] },
  { name: "Orthodontics", phrases: ["orthodontics", "orthodontic", "braces", "teeth alignment", "aligners"] },
  { name: "Cosmetic Dentistry", phrases: ["cosmetic dentistry", "cosmetic dental", "smile makeover", "veneers"] },
  { name: "General Dentistry", phrases: ["general dentistry", "general dental", "checkup", "check up", "dental cleaning", "cleaning"] },
  { name: "Emergency Dental Care", phrases: ["emergency dental care", "dental emergency", "emergency dentist", "urgent dental", "severe tooth pain", "toothache"] },
] as const;

function normalizeTreatment(input: string): string | null {
  const text = normalize(input);
  for (const treatment of CANONICAL_TREATMENTS) {
    if (treatment.phrases.some((phrase) => text.includes(phrase))) return treatment.name;
  }
  return null;
}

/* =========================================================
   DATE NORMALIZER
========================================================= */

function normalizeDate(
  input: string
): string | null {
  const raw = input.trim();

  // 2026-08-12
  const iso = raw.match(
    /^(\d{4})[-/ ](\d{1,2})[-/ ](\d{1,2})$/
  );

  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);

    const date = new Date(
      year,
      month - 1,
      day
    );

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
    }
  }

  // 12/08/2026
  const dmy = raw.match(
    /^(\d{1,2})[-/ ](\d{1,2})[-/ ](\d{4})$/
  );

  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);

    const date = new Date(
      year,
      month - 1,
      day
    );

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
    }
  }

  // Natural:
  // 12 August 2026
  // August 12 2026
  const parsed = new Date(raw);

  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(
      parsed.getMonth() + 1
    ).padStart(2, "0")}-${String(
      parsed.getDate()
    ).padStart(2, "0")}`;
  }

  return null;
}

/* =========================================================
   TIME NORMALIZER
========================================================= */

function normalizeTime(
  input: string
): string | null {
  const text = normalize(input)
    .replace(/\bnoon\b/, "12 pm")
    .replace(/\bmidnight\b/, "12 am");

  const match = text.match(
    /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/
  );

  if (!match) return null;

  let hour = Number(match[1]);

  const minute = Number(
    match[2] || "0"
  );

  const meridiem = match[3];

  if (minute > 59) {
    return null;
  }

  if (meridiem) {
    if (hour < 1 || hour > 12) {
      return null;
    }

    if (
      meridiem === "pm" &&
      hour !== 12
    ) {
      hour += 12;
    }

    if (
      meridiem === "am" &&
      hour === 12
    ) {
      hour = 0;
    }
  } else {
    if (hour > 23) {
      return null;
    }
  }

  return `${String(hour).padStart(
    2,
    "0"
  )}:${String(minute).padStart(2, "0")}`;
}

/* =========================================================
   PRETTY FORMATTERS
========================================================= */

function prettyDate(value: string) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function prettyTime(value: string) {
  const [hour, minute] =
    value.split(":").map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return value;
  }

  return new Date(
    2000,
    0,
    1,
    hour,
    minute
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* =========================================================
   COMPONENT
========================================================= */

export default function VoiceAgent({
  open,
  onClose,
}: VoiceAgentProps) {
  /* =======================================================
     REFS
  ======================================================= */

  const recognitionRef =
    useRef<SpeechRecognitionLike | null>(
      null
    );

  const mountedRef = useRef(true);

  const openRef = useRef(open);

  const mutedRef = useRef(false);

  const recognitionRunningRef =
    useRef(false);

  const speakingRef = useRef(false);

  const intentionalStopRef =
    useRef(false);

  const sessionStartedRef =
    useRef(false);

  const listenTimerRef =
    useRef<number | null>(null);

  const welcomeTimerRef =
    useRef<number | null>(null);

  const bookingStepRef =
    useRef<BookingStep>("none");

  const bookingDataRef =
    useRef<BookingData>({
      ...EMPTY_BOOKING,
    });

  const lastSpokenTextRef =
    useRef("");

  /* =======================================================
     STATE
  ======================================================= */

  const [state, setState] =
    useState<AgentState>("idle");

  const [muted, setMuted] =
    useState(false);

  const [transcript, setTranscript] =
    useState("");

  const [agentReply, setAgentReply] =
    useState(WELCOME_MESSAGE);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    bookingStep,
    setBookingStep,
  ] = useState<BookingStep>("none");

  const [
    bookingData,
    setBookingData,
  ] = useState<BookingData>({
    ...EMPTY_BOOKING,
  });

  /* =======================================================
     KEEP REFS SYNCED
  ======================================================= */

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    bookingStepRef.current =
      bookingStep;
  }, [bookingStep]);

  useEffect(() => {
    bookingDataRef.current =
      bookingData;
  }, [bookingData]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* =======================================================
     TIMER HELPERS
  ======================================================= */

  const clearListenTimer =
    useCallback(() => {
      if (
        listenTimerRef.current !== null
      ) {
        window.clearTimeout(
          listenTimerRef.current
        );

        listenTimerRef.current = null;
      }
    }, []);

  /* =======================================================
     RECOGNITION CONTROL
  ======================================================= */

  const hardStopRecognition =
    useCallback(() => {
      clearListenTimer();

      intentionalStopRef.current = true;

      if (
        !recognitionRunningRef.current
      ) {
        return;
      }

      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }

      recognitionRunningRef.current =
        false;
    }, [clearListenTimer]);

  const startListening =
    useCallback(() => {
      if (
        !openRef.current ||
        mutedRef.current ||
        recognitionRunningRef.current
      ) {
        return;
      }

      const recognition =
        recognitionRef.current;

      if (!recognition) {
        return;
      }

      clearListenTimer();

      intentionalStopRef.current = false;

      setErrorMessage("");

      try {
        recognition.start();

        recognitionRunningRef.current =
          true;

        if (mountedRef.current) {
          setState(
            bookingStepRef.current ===
              "none"
              ? "listening"
              : "booking"
          );
        }
      } catch (error) {
        console.warn(
          "RECOGNITION START ERROR:",
          error
        );
      }
    }, [clearListenTimer]);

  const scheduleListening =
    useCallback(
      (delay = 300) => {
        clearListenTimer();

        listenTimerRef.current =
          window.setTimeout(() => {
            listenTimerRef.current =
              null;

            startListening();
          }, delay);
      },
      [
        clearListenTimer,
        startListening,
      ]
    );

  /* =======================================================
     INTERRUPT SPEECH
  ======================================================= */

  const interruptSpeech =
    useCallback(() => {
      if (
        typeof window !== "undefined"
      ) {
        window.speechSynthesis?.cancel();
      }

      speakingRef.current = false;

      lastSpokenTextRef.current = "";

      if (mountedRef.current) {
        setAgentReply(
          "Sure. I stopped. What would you like to ask?"
        );

        setState(
          bookingStepRef.current ===
            "none"
            ? "listening"
            : "booking"
        );
      }

      scheduleListening(150);
    }, [scheduleListening]);

  /* =======================================================
     TEXT TO SPEECH
  ======================================================= */

  const speak = useCallback(
    (
      text: string,
      listenAfter = true
    ) => {
      if (
        typeof window === "undefined"
      ) {
        return;
      }

      if (
        !(
          "speechSynthesis" in window
        )
      ) {
        if (listenAfter) {
          scheduleListening(200);
        }

        return;
      }

      clearListenTimer();

      if (
        window.speechSynthesis
          .speaking ||
        window.speechSynthesis.pending
      ) {
        window.speechSynthesis.cancel();
      }

      const cleanText = text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/#{1,6}\s?/g, "")
        .replace(/\s+/g, " ")
        .trim();

      lastSpokenTextRef.current =
        normalize(cleanText);

      const utterance =
        new SpeechSynthesisUtterance(
          cleanText
        );

      utterance.rate = 0.98;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices =
        window.speechSynthesis.getVoices();

      const preferredVoice =
        voices.find((voice) =>
          /en-GB/i.test(voice.lang)
        ) ||
        voices.find((voice) =>
          /en-US/i.test(voice.lang)
        ) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice =
          preferredVoice;
      }

      utterance.onstart = () => {
        speakingRef.current = true;

        if (mountedRef.current) {
          setErrorMessage("");
          setState("speaking");
        }

        /*
          IMPORTANT:
          Recognition ko Nova speaking ke
          waqt bhi active rakhte hain.

          Is se:
          stop
          wait
          hold on
          nova stop

          detect ho sakta hai.
        */

        if (
          !mutedRef.current &&
          !recognitionRunningRef.current
        ) {
          scheduleListening(120);
        }
      };

      utterance.onend = () => {
        speakingRef.current = false;

        lastSpokenTextRef.current = "";

        if (!mountedRef.current) {
          return;
        }

        if (
          listenAfter &&
          openRef.current &&
          !mutedRef.current
        ) {
          scheduleListening(250);
        } else {
          setState("idle");
        }
      };

      utterance.onerror = (
        event
      ) => {
        const speechError =
          "error" in event
            ? String(event.error)
            : "";

        speakingRef.current = false;

        lastSpokenTextRef.current = "";

        if (!mountedRef.current) {
          return;
        }

        if (
          speechError ===
            "interrupted" ||
          speechError === "canceled"
        ) {
          if (
            listenAfter &&
            openRef.current &&
            !mutedRef.current
          ) {
            scheduleListening(180);
          }

          return;
        }

        setState("error");

        setErrorMessage(
          "Voice playback could not start."
        );
      };

      window.speechSynthesis.speak(
        utterance
      );
    },
    [
      clearListenTimer,
      scheduleListening,
    ]
  );

  /* =======================================================
     BOOKING STATE HELPERS
  ======================================================= */

  const updateBooking =
    useCallback(
      (
        patch: Partial<BookingData>
      ) => {
        const next = {
          ...bookingDataRef.current,
          ...patch,
        };

        bookingDataRef.current = next;

        setBookingData(next);

        return next;
      },
      []
    );

  const moveBookingStep =
    useCallback(
      (step: BookingStep) => {
        bookingStepRef.current = step;

        setBookingStep(step);

        if (step !== "none") {
          setState("booking");
        }
      },
      []
    );

  const resetBooking =
    useCallback(() => {
      bookingDataRef.current = {
        ...EMPTY_BOOKING,
      };

      setBookingData({
        ...EMPTY_BOOKING,
      });

      bookingStepRef.current = "none";

      setBookingStep("none");
    }, []);

  /* =======================================================
     START BOOKING
  ======================================================= */

  const beginBooking =
    useCallback(() => {
      resetBooking();

      moveBookingStep("name");

      const reply =
        "Of course. I can help you request an appointment. What is your full name?";

      setAgentReply(reply);

      speak(reply, true);
    }, [
      moveBookingStep,
      resetBooking,
      speak,
    ]);

  /* =======================================================
     SUBMIT BOOKING
  ======================================================= */

  const submitBooking =
    useCallback(async () => {
      const data =
        bookingDataRef.current;

      setState("thinking");

      setErrorMessage("");

      try {
        console.log(
          "VOICE BOOKING SUBMIT:",
          data
        );

        const response = await fetch(
          "/api/book-chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: data.name,
              phone: data.phone,
              email: data.email,
              treatment:
                data.treatment,
              appointmentDate:
                data.appointmentDate,
              appointmentTime:
                data.appointmentTime,
            }),
          }
        );

        const result =
          await response
            .json()
            .catch(() => null);

        console.log(
          "VOICE BOOKING RESPONSE:",
          result
        );

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.error ||
              `Booking failed with status ${response.status}`
          );
        }

        const reply = `Thank you, ${
          data.name
        }. Your appointment request for ${
          data.treatment
        } on ${prettyDate(
          data.appointmentDate
        )} at ${prettyTime(
          data.appointmentTime
        )} has been submitted successfully. Our clinic team will review availability and contact you to confirm.`;

        resetBooking();

        setAgentReply(reply);

        speak(reply, true);
      } catch (error) {
        console.error(
          "VOICE BOOKING ERROR:",
          error
        );

        const reply =
          "I could not submit your appointment request right now. Your details are still saved in this voice session. Say confirm to try again, or cancel to stop.";

        moveBookingStep("confirm");

        setAgentReply(reply);

        setErrorMessage(
          "Booking submission failed."
        );

        speak(reply, true);
      }
    }, [
      moveBookingStep,
      resetBooking,
      speak,
    ]);

  /* =======================================================
     BOOKING INPUT PROCESSOR
  ======================================================= */

  const handleBookingInput =
    useCallback(
      async (
        spokenText: string
      ) => {
        const step =
          bookingStepRef.current;

        const text =
          spokenText.trim();

        /* ---------------- NAME ---------------- */

        if (step === "name") {
          if (text.length < 2) {
            const reply =
              "Please tell me your full name.";

            setAgentReply(reply);

            speak(reply, true);

            return;
          }

          const cleanName = cleanPatientName(text);

          if (cleanName.length < 2 || cleanName.length > 60) {
            const reply = "I did not catch your name clearly. Please say only your full name, for example Muhammad Taha.";
            setAgentReply(reply);
            speak(reply, true);
            return;
          }

          updateBooking({ name: cleanName });
          moveBookingStep("phone");

          const reply = `Thank you, ${cleanName}. What is the best phone number to reach you?`;

          setAgentReply(reply);

          speak(reply, true);

          return;
        }

        /* ---------------- PHONE ---------------- */

        if (step === "phone") {
          const phone = text.replace(
            /[^\d+]/g,
            ""
          );

          if (
            phone.replace(/\D/g, "")
              .length < 7
          ) {
            const reply =
              "I did not catch a valid phone number. Please say the number again slowly.";

            setAgentReply(reply);

            speak(reply, true);

            return;
          }

          updateBooking({
            phone,
          });

          moveBookingStep("email");

          const reply =
            "Thank you. What is your email address? You can say something like name at gmail dot com.";

          setAgentReply(reply);

          speak(reply, true);

          return;
        }

        /* ---------------- EMAIL ---------------- */

        if (step === "email") {
          const email = text
            .toLowerCase()
            .replace(
              /\s+at\s+/g,
              "@"
            )
            .replace(
              /\s+dot\s+/g,
              "."
            )
            .replace(/\s/g, "");

          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              email
            )
          ) {
            const reply =
              "I did not catch a valid email address. Please say it again. For example, name at gmail dot com.";

            setAgentReply(reply);

            speak(reply, true);

            return;
          }

          updateBooking({
            email,
          });

          moveBookingStep(
            "treatment"
          );

          const reply =
            "Which treatment are you interested in? For example teeth whitening, dental implants, root canal treatment, orthodontics, cosmetic dentistry, general dentistry, or emergency dental care.";

          setAgentReply(reply);

          speak(reply, true);

          return;
        }

        /* ---------------- TREATMENT ---------------- */

        if (step === "treatment") {
          const treatment = normalizeTreatment(text);

          if (!treatment) {
            const reply = "I did not recognize that treatment. Please say teeth whitening, dental implants, root canal treatment, orthodontics, cosmetic dentistry, general dentistry, or emergency dental care.";
            setAgentReply(reply);
            speak(reply, true);
            return;
          }

          updateBooking({ treatment });
          moveBookingStep("date");

          const reply = `Got it. ${treatment}. What date would you prefer for your appointment?`;
          setAgentReply(reply);
          speak(reply, true);
          return;
        }

        /* ---------------- DATE ---------------- */

        if (step === "date") {
          const date =
            normalizeDate(text);

          if (!date) {
            const reply =
              "I could not understand that date. Please say a date like 12 August 2026.";

            setAgentReply(reply);

            speak(reply, true);

            return;
          }

          const selectedDate =
            new Date(
              `${date}T23:59:59`
            );

          if (
            selectedDate.getTime() <
            Date.now()
          ) {
            const reply =
              "That date is in the past. Please choose a future date.";

            setAgentReply(reply);

            speak(reply, true);

            return;
          }

          updateBooking({
            appointmentDate: date,
          });

          moveBookingStep("time");

          const reply =
            "What time would you prefer?";

          setAgentReply(reply);

          speak(reply, true);

          return;
        }

        /* ---------------- TIME ---------------- */

        if (step === "time") {
          const time =
            normalizeTime(text);

          if (!time) {
            const reply =
              "I could not understand that time. Please say something like 5 PM or 10 30 AM.";

            setAgentReply(reply);

            speak(reply, true);

            return;
          }

          const next =
            updateBooking({
              appointmentTime: time,
            });

          moveBookingStep(
            "confirm"
          );

          const reply = `Please confirm your appointment request. Name ${
            next.name
          }. Treatment ${
            next.treatment
          }. Date ${prettyDate(
            next.appointmentDate
          )}. Time ${prettyTime(
            next.appointmentTime
          )}. Say confirm to submit, or cancel to stop.`;

          setAgentReply(reply);

          speak(reply, true);

          return;
        }

        /* ---------------- CONFIRM ---------------- */

        if (step === "confirm") {
          if (isYes(text)) {
            await submitBooking();

            return;
          }

          if (isNo(text)) {
            resetBooking();

            const reply =
              "No problem. I cancelled the appointment request. What else can I help you with?";

            setAgentReply(reply);

            speak(reply, true);

            return;
          }

          const reply =
            "Please say confirm to submit the appointment request, or cancel to stop.";

          setAgentReply(reply);

          speak(reply, true);
        }
      },
      [
        moveBookingStep,
        resetBooking,
        speak,
        submitBooking,
        updateBooking,
      ]
    );

  /* =======================================================
     NORMAL AI QUESTION
  ======================================================= */

  const askAI = useCallback(
    async (message: string) => {
      if (!message.trim()) {
        return;
      }

      setState("thinking");

      setErrorMessage("");

      try {
        const response = await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message,
              mode: "voice",
            }),
          }
        );

        const data =
          await response
            .json()
            .catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.reply ||
              `AI request failed with status ${response.status}`
          );
        }

        const reply =
          typeof data?.reply ===
            "string" &&
          data.reply.trim()
            ? data.reply.trim()
            : "I am sorry, I could not answer that right now.";

        if (!mountedRef.current) {
          return;
        }

        setAgentReply(reply);

        speak(reply, true);
      } catch (error) {
        console.error(
          "VOICE AGENT AI ERROR:",
          error
        );

        const fallback =
          "I am having trouble connecting right now. Please try again in a moment.";

        if (!mountedRef.current) {
          return;
        }

        setAgentReply(fallback);

        setErrorMessage(
          "AI connection unavailable."
        );

        speak(fallback, true);
      }
    },
    [speak]
  );

  /* =======================================================
     PROCESS USER SPEECH
  ======================================================= */

  const processUserSpeech =
    useCallback(
      async (
        spokenText: string
      ) => {
        const text =
          spokenText.trim();

        if (!text) {
          return;
        }

        setTranscript(text);

        /* ---------------- STOP ---------------- */

        if (isStopCommand(text)) {
          interruptSpeech();

          return;
        }

        /*
          User ne Nova speaking ke
          beech new question bol diya.

          Nova ko interrupt karo.
        */

        if (
          speakingRef.current
        ) {
          const normalizedUser =
            normalize(text);

          const ownSpeech =
            lastSpokenTextRef.current;

          /*
            Basic echo protection:
            Nova ki own TTS ko user
            speech na samjho.
          */

          if (
            ownSpeech &&
            normalizedUser.length > 12 &&
            (
              ownSpeech.includes(
                normalizedUser
              ) ||
              normalizedUser.includes(
                ownSpeech.slice(0, 40)
              )
            )
          ) {
            return;
          }

          window.speechSynthesis?.cancel();

          speakingRef.current = false;
        }

        /* ---------------- BOOKING ACTIVE ---------------- */

        if (
          bookingStepRef.current !==
          "none"
        ) {
          await handleBookingInput(
            text
          );

          return;
        }

        /* ---------------- NEW BOOKING INTENT ---------------- */

        if (
          isBookingIntent(text)
        ) {
          beginBooking();

          return;
        }

        /* ---------------- NORMAL AI ---------------- */

        await askAI(text);
      },
      [
        askAI,
        beginBooking,
        handleBookingInput,
        interruptSpeech,
      ]
    );

  /* =======================================================
     CREATE SPEECH RECOGNITION
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const Recognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!Recognition) {
      setState("error");

      setErrorMessage(
        "Voice recognition is not supported in this browser. Please use the latest Chrome or Edge."
      );

      return;
    }

    const recognition =
      new Recognition();

    /*
      continuous false:
      Browser recognition zyada
      stable rehti hai.

      onend ke baad hum restart
      karte hain.
    */

    recognition.continuous = false;

    /*
      IMPORTANT:
      Interim true hona zaroori hai
      taake "stop" jaldi detect ho.
    */

    recognition.interimResults = true;

    recognition.lang = "en-US";

    /* ---------------- RESULT ---------------- */

    recognition.onresult = (
      event
    ) => {
      let combined = "";

      const length =
        event.results.length;

      for (
        let i =
          event.resultIndex ?? 0;
        i < length;
        i += 1
      ) {
        combined += `${
          event.results[i]?.[0]
            ?.transcript || ""
        } `;
      }

      const spokenText =
        combined.trim();

      if (!spokenText) {
        return;
      }

      /*
        STOP COMMAND:
        Final result ka wait nahi.
        Interim result par hi stop.
      */

      if (
        speakingRef.current &&
        isStopCommand(spokenText)
      ) {
        interruptSpeech();

        return;
      }

      const lastIndex =
        Math.max(
          0,
          length - 1
        );

      const isFinal =
        event.results[lastIndex]
          ?.isFinal === true;

      if (!isFinal) {
        return;
      }

      recognitionRunningRef.current =
        false;

      intentionalStopRef.current =
        true;

      void processUserSpeech(
        spokenText
      );
    };

    /* ---------------- ERROR ---------------- */

    recognition.onerror = (
      event
    ) => {
      const recognitionError =
        event.error || "unknown";

      recognitionRunningRef.current =
        false;

      console.log(
        "VOICE RECOGNITION ERROR:",
        recognitionError
      );

      if (
        recognitionError ===
          "aborted" ||
        recognitionError ===
          "no-speech"
      ) {
        if (
          openRef.current &&
          !mutedRef.current
        ) {
          scheduleListening(350);
        }

        return;
      }

      if (
        recognitionError ===
        "not-allowed"
      ) {
        setState("error");

        setErrorMessage(
          "Microphone permission was denied. Please allow microphone access."
        );

        return;
      }

      if (
        recognitionError ===
        "audio-capture"
      ) {
        setState("error");

        setErrorMessage(
          "Microphone is unavailable or already in use."
        );

        return;
      }

      setErrorMessage(
        "I could not hear you clearly. Please try again."
      );

      if (
        openRef.current &&
        !mutedRef.current
      ) {
        scheduleListening(600);
      }
    };

    /* ---------------- END ---------------- */

    recognition.onend = () => {
      recognitionRunningRef.current =
        false;

      const wasIntentional =
        intentionalStopRef.current;

      intentionalStopRef.current =
        false;

      if (
        !openRef.current ||
        mutedRef.current
      ) {
        return;
      }

      /*
        Nova speaking ho tab bhi
        recognition restart.

        Isi se stop command
        possible hota hai.
      */

      if (
        !wasIntentional ||
        speakingRef.current
      ) {
        scheduleListening(250);
      }
    };

    recognitionRef.current =
      recognition;

    /*
      Start recognition early
      for barge-in.
    */

    if (!mutedRef.current) {
      scheduleListening(150);
    }

    return () => {
      clearListenTimer();

      intentionalStopRef.current =
        true;

      try {
        recognition.abort();
      } catch {
        // ignore
      }

      recognitionRunningRef.current =
        false;

      recognitionRef.current = null;
    };
  }, [
    clearListenTimer,
    interruptSpeech,
    open,
    processUserSpeech,
    scheduleListening,
  ]);

  /* =======================================================
     OPEN / CLOSE SESSION
  ======================================================= */

  useEffect(() => {
    openRef.current = open;

    /* ---------------- CLOSE ---------------- */

    if (!open) {
      sessionStartedRef.current =
        false;

      clearListenTimer();

      hardStopRecognition();

      if (
        welcomeTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          welcomeTimerRef.current
        );

        welcomeTimerRef.current =
          null;
      }

      window.speechSynthesis?.cancel();

      speakingRef.current = false;

      resetBooking();

      setState("idle");

      setMuted(false);

      mutedRef.current = false;

      setTranscript("");

      setErrorMessage("");

      setAgentReply(
        WELCOME_MESSAGE
      );

      return;
    }

    /* ---------------- ALREADY STARTED ---------------- */

    if (
      sessionStartedRef.current
    ) {
      return;
    }

    /* ---------------- START ---------------- */

    sessionStartedRef.current = true;

    setState("connecting");

    setErrorMessage("");

    setTranscript("");

    setAgentReply(
      WELCOME_MESSAGE
    );

    welcomeTimerRef.current =
      window.setTimeout(() => {
        welcomeTimerRef.current =
          null;

        speak(
          WELCOME_MESSAGE,
          true
        );
      }, 500);

    return () => {
      if (
        welcomeTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          welcomeTimerRef.current
        );

        welcomeTimerRef.current =
          null;
      }
    };
  }, [
    open,
    clearListenTimer,
    hardStopRecognition,
    resetBooking,
    speak,
  ]);

  /* =======================================================
     MUTE
  ======================================================= */

  function handleMuteToggle() {
    const nextMuted = !muted;

    setMuted(nextMuted);

    mutedRef.current =
      nextMuted;

    if (nextMuted) {
      hardStopRecognition();

      if (
        !speakingRef.current
      ) {
        setState("idle");
      }

      return;
    }

    scheduleListening(150);
  }

  /* =======================================================
     CLOSE
  ======================================================= */

  function handleClose() {
    openRef.current = false;

    clearListenTimer();

    hardStopRecognition();

    if (
      welcomeTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        welcomeTimerRef.current
      );

      welcomeTimerRef.current =
        null;
    }

    window.speechSynthesis?.cancel();

    speakingRef.current = false;

    resetBooking();

    onClose();
  }

  /* =======================================================
     HIDDEN
  ======================================================= */

  if (!open) {
    return null;
  }

  /* =======================================================
     STATE LABEL
  ======================================================= */

  const stateLabel =
    state === "connecting"
      ? "Connecting"
      : state === "listening"
      ? "Listening"
      : state === "thinking"
      ? "Nova is thinking"
      : state === "speaking"
      ? "Nova is speaking"
      : state === "booking"
      ? "Booking appointment"
      : state === "error"
      ? "Connection issue"
      : muted
      ? "Microphone muted"
      : "Ready";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md">

      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close voice agent"
        onClick={handleClose}
        className="absolute inset-0 cursor-default"
      />

      {/* MODAL */}

      <div className="relative z-10 max-h-[94vh] w-full max-w-[460px] overflow-y-auto rounded-[32px] border border-white/10 bg-[#061A4A] shadow-[0_35px_100px_rgba(2,6,23,0.55)]">

        {/* GLOWS */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        {/* HEADER */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#061A4A]/90 px-5 py-4 backdrop-blur-xl">

          <div>
            <div className="flex items-center gap-2">

              <Sparkles
                size={15}
                className="text-cyan-300"
              />

              <p className="text-sm font-bold text-white">
                Nova AI Voice Agent
              </p>

            </div>

            <p className="mt-1 text-xs text-blue-100/60">
              Dental Reception • Live Voice
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white transition hover:bg-white/15"
          >
            <X size={18} />
          </button>

        </div>

        {/* BODY */}

        <div className="relative px-6 py-8 text-center sm:px-8">

          {/* STATUS */}

          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-200">

            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

            {stateLabel}

          </div>

          {/* MIC ORB */}

          <div className="relative mx-auto mt-8 flex h-40 w-40 items-center justify-center">

            <div
              className={`absolute inset-0 rounded-full bg-cyan-400/10 blur-xl ${
                state === "speaking" ||
                state === "listening" ||
                state === "booking"
                  ? "animate-pulse"
                  : ""
              }`}
            />

            <div className="absolute inset-3 rounded-full border border-cyan-300/20 bg-gradient-to-br from-blue-500/20 to-cyan-400/20" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_0_50px_rgba(34,211,238,0.18)] backdrop-blur-xl">

              {state === "speaking" ? (
                <Volume2
                  size={34}
                  className="text-cyan-200"
                />
              ) : (
                <Mic
                  size={34}
                  className="text-cyan-200"
                />
              )}

            </div>

          </div>

          {/* WAVE */}

          <div className="mt-6 flex h-9 items-center justify-center gap-1">

            {[
              12,
              22,
              16,
              30,
              20,
              34,
              18,
              27,
              14,
              24,
              12,
            ].map(
              (
                height,
                index
              ) => (
                <span
                  key={index}
                  className={`w-1 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300 ${
                    state ===
                      "listening" ||
                    state ===
                      "speaking" ||
                    state ===
                      "booking"
                      ? "animate-pulse"
                      : "opacity-40"
                  }`}
                  style={{
                    height,
                    animationDelay: `${index * 70}ms`,
                  }}
                />
              )
            )}

          </div>

          {/* NOVA RESPONSE */}

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left backdrop-blur">

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
              Nova
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-50/90">
              {agentReply}
            </p>

          </div>

          {/* USER TRANSCRIPT */}

          {transcript && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-left">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200/60">
                You said
              </p>

              <p className="mt-2 text-sm leading-6 text-white/80">
                {transcript}
              </p>

            </div>
          )}

          {/* BOOKING STATUS */}

          {bookingStep !== "none" && (
            <div className="mt-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-left">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                Appointment Request
              </p>

              <p className="mt-2 text-xs leading-5 text-blue-50/70">
                Current step:{" "}
                {bookingStep}

                {bookingData.treatment
                  ? ` • ${bookingData.treatment}`
                  : ""}
              </p>

            </div>
          )}

          {/* ERROR */}

          {errorMessage && (
            <p className="mt-4 text-xs leading-5 text-rose-200">
              {errorMessage}
            </p>
          )}

          {/* CONTROLS */}

          <div className="mt-7 flex items-center justify-center gap-4">

            {/* MUTE */}

            <button
              type="button"
              onClick={
                handleMuteToggle
              }
              className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${
                muted
                  ? "border-amber-300/30 bg-amber-400/15 text-amber-200"
                  : "border-white/10 bg-white/10 text-white hover:bg-white/15"
              }`}
              aria-label={
                muted
                  ? "Unmute microphone"
                  : "Mute microphone"
              }
            >
              {muted ? (
                <MicOff size={21} />
              ) : (
                <Mic size={21} />
              )}
            </button>

            {/* END */}

            <button
              type="button"
              onClick={handleClose}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_14px_35px_rgba(244,63,94,0.3)] transition hover:bg-rose-600 active:scale-95"
              aria-label="End voice session"
            >
              <PhoneOff size={24} />
            </button>

          </div>

          {/* FOOTER */}

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-blue-100/50">

            <ShieldCheck size={13} />

            Voice session powered by Nova

          </div>

        </div>

      </div>

    </div>
  );
}