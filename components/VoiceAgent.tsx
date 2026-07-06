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
  "stop", "stop it", "stop please", "please stop", "nova stop",
  "okay stop", "ok stop", "wait", "wait please", "hold on",
  "pause", "pause please", "enough", "be quiet", "quiet",
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
  if (!text || text.split(" ").length > 6) return false;

  const cleaned = text
    .replace(/^(?:hey\s+)?nova\s+/, "")
    .replace(/^(?:okay|ok|please)\s+/, "")
    .replace(/\s+(?:please|now)$/, "")
    .trim();

  return STOP_PHRASES.some(
    (phrase) => cleaned === normalize(phrase)
  );
}

function isImmediateStopCommand(value: string) {
  const text = normalize(value);
  if (!text) return false;

  // Fast barge-in matcher. Intentionally short and strict enough to avoid
  // stopping on normal dental questions containing the word "stop".
  return /^(?:(?:hey\s+)?nova\s+)?(?:(?:okay|ok|please)\s+)?(?:stop|stop it|wait|hold on|pause|enough|quiet|be quiet)(?:\s+(?:please|now))?$/.test(text);
}

function tokenSimilarity(a: string, b: string) {
  const left = new Set(normalize(a).split(" ").filter(Boolean));
  const right = new Set(normalize(b).split(" ").filter(Boolean));
  if (!left.size || !right.size) return 0;

  let overlap = 0;
  left.forEach((word) => {
    if (right.has(word)) overlap += 1;
  });

  return overlap / Math.max(1, Math.min(left.size, right.size));
}

function looksLikeOwnSpeech(heard: string, ownSpeech: string) {
  const heardText = normalize(heard);
  const ownText = normalize(ownSpeech);

  if (!heardText || !ownText) return false;
  if (heardText.length < 5) return false;

  return (
    ownText.includes(heardText) ||
    heardText.includes(ownText.slice(0, Math.min(55, ownText.length))) ||
    tokenSimilarity(heardText, ownText) >= 0.82
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

function cleanPatientName(input: string): string | null {
  let value = input.trim();

  value = value
    .replace(
      /^(?:hi[,.\s]+)?(?:my\s+(?:full\s+)?name\s+is|the\s+name\s+is|i\s+am|i'm|this\s+is|call\s+me)\s+/i,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

  // Never save a sentence, phone number, email, or booking intent as a name.
  if (
    !value ||
    value.length < 2 ||
    value.length > 60 ||
    /[@\d]/.test(value) ||
    /\b(?:appointment|book|booking|treatment|phone|email|whitening|implant|root canal|dentist|dental)\b/i.test(value)
  ) {
    return null;
  }

  const parts = value.split(" ").filter(Boolean);
  if (parts.length < 1 || parts.length > 5) return null;

  // Human names: Unicode letters plus apostrophe/hyphen only.
  if (!parts.every((part) => /^[\p{L}][\p{L}'’.-]*$/u.test(part))) {
    return null;
  }

  return parts
    .map((part) =>
      part
        .split("-")
        .map(
          (piece) =>
            piece.charAt(0).toUpperCase() +
            piece.slice(1).toLowerCase()
        )
        .join("-")
    )
    .join(" ");
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


function wordsToDigits(input: string) {
  const map: Record<string, string> = {
    zero: "0", oh: "0", o: "0", one: "1", won: "1",
    two: "2", to: "2", too: "2", three: "3",
    four: "4", for: "4", five: "5", six: "6",
    seven: "7", eight: "8", ate: "8", nine: "9"
  };
  return normalize(input).split(" ").map(x => map[x] ?? x).join(" ");
}

function normalizePhone(input: string): string | null {
  let digits = wordsToDigits(input)
    .replace(/\b(?:my|phone|number|is|mobile|contact)\b/g, " ")
    .replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length === 12) digits = `0${digits.slice(2)}`;
  if (digits.startsWith("3") && digits.length === 10) digits = `0${digits}`;
  if (/^03\d{9}$/.test(digits)) return digits;
  if (digits.length >= 10 && digits.length <= 15) return input.trim().startsWith("+") ? `+${digits}` : digits;
  return null;
}

function normalizeEmail(input: string): string | null {
  let value = normalize(input)
    .replace(/\bmy email(?: address)? is\b/g, " ")
    .replace(/\s+(?:at|add)\s+/g, "@")
    .replace(/\s+dot\s+/g, ".")
    .replace(/\s+underscore\s+/g, "_")
    .replace(/\s+(?:dash|hyphen)\s+/g, "-")
    .replace(/\s+/g, "");
  value = value
    .replace(/@gmailcom$/, "@gmail.com")
    .replace(/@outlookcom$/, "@outlook.com")
    .replace(/@hotmailcom$/, "@hotmail.com")
    .replace(/@yahoocom$/, "@yahoo.com");
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value) ? value : null;
}

function speakablePhone(value: string) { return value.replace(/\D/g, "").split("").join(" "); }
function speakableEmail(value: string) { return value.replace("@", " at ").replace(/\./g, " dot ").replace(/_/g, " underscore ").replace(/-/g, " dash "); }

/* =========================================================
   DATE NORMALIZER
========================================================= */

function normalizeDate(input: string): string | null {
  const raw = normalize(input);
  if (!raw) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toISO = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  if (raw === "today") return toISO(today);

  if (raw === "tomorrow") {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return toISO(d);
  }

  // "next monday", or a weekday name. A bare weekday means the next occurrence.
  const weekdayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };
  const weekdayMatch = raw.match(/^(?:next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/);
  if (weekdayMatch) {
    const target = weekdayMap[weekdayMatch[1]];
    let delta = (target - today.getDay() + 7) % 7;
    if (delta === 0 || raw.startsWith("next ")) delta += 7;
    const d = new Date(today);
    d.setDate(d.getDate() + delta);
    return toISO(d);
  }

  const iso = raw.match(/^(\d{4})[-/ ](\d{1,2})[-/ ](\d{1,2})$/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) return toISO(date);
    return null;
  }

  const dmy = raw.match(/^(\d{1,2})[-/ ](\d{1,2})[-/ ](\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) return toISO(date);
    return null;
  }

  // Month names are intentionally parsed only when a real date is present.
  const natural = raw.match(
    /^(?:(\d{1,2})\s+([a-z]+)|([a-z]+)\s+(\d{1,2}))(?:\s+(\d{4}))?$/
  );
  if (natural) {
    const monthNames: Record<string, number> = {
      january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
      april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6,
      august: 7, aug: 7, september: 8, sep: 8, sept: 8,
      october: 9, oct: 9, november: 10, nov: 10, december: 11, dec: 11,
    };
    const day = Number(natural[1] ?? natural[4]);
    const monthWord = natural[2] ?? natural[3];
    const month = monthNames[monthWord];
    let year = natural[5] ? Number(natural[5]) : today.getFullYear();
    if (month === undefined) return null;

    let date = new Date(year, month, day);
    if (
      !natural[5] &&
      date.getTime() < today.getTime()
    ) {
      year += 1;
      date = new Date(year, month, day);
    }
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) return toISO(date);
  }

  return null;
}

/* =========================================================
   TIME NORMALIZER
========================================================= */

function normalizeTime(input: string): string | null {
  const text = wordsToDigits(input)
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\bp\s*m\b/g, "pm")
    .replace(/\ba\s*m\b/g, "am")
    .replace(/\bnoon\b/g, "12 pm")
    .replace(/\bmidnight\b/g, "12 am")
    .replace(/\bo['’]?clock\b/g, "")
    .replace(/\s+in\s+the\s+morning/g, " am")
    .replace(/\s+in\s+the\s+(?:afternoon|evening)/g, " pm")
    .replace(/\b(?:at|around|about|i prefer|prefer|time is|appointment at)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const meridian = text.match(
    /(?:^|\s)(\d{1,2})(?:(?::|\s)(\d{1,2}))?\s*(am|pm)(?:\s|$)/
  );

  if (meridian) {
    let hour = Number(meridian[1]);
    const minute = Number(meridian[2] || "0");
    const suffix = meridian[3];

    if (hour < 1 || hour > 12 || minute > 59) return null;
    if (suffix === "pm" && hour !== 12) hour += 12;
    if (suffix === "am" && hour === 12) hour = 0;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  const clock24 = text.match(
    /(?:^|\s)([01]?\d|2[0-3]):([0-5]\d)(?:\s|$)/
  );

  if (clock24) {
    return `${String(Number(clock24[1])).padStart(2, "0")}:${clock24[2]}`;
  }

  const bareHour = text.match(/^(\d{1,2})$/);
  if (bareHour) {
    let hour = Number(bareHour[1]);
    if (hour < 1 || hour > 23) return null;
    if (hour >= 1 && hour <= 7) hour += 12;
    return `${String(hour).padStart(2, "0")}:00`;
  }

  return null;
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
   FINAL BOOKING VALIDATION
   Important: bookingDataRef already stores canonical values.
   Do not destructively re-parse valid canonical values at submit time.
========================================================= */

function isCanonicalTreatment(value: string): boolean {
  return CANONICAL_TREATMENTS.some((item) => item.name === value);
}

function isCanonicalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() >= today.getTime();
}

function isCanonicalTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function getFirstInvalidBookingStep(data: BookingData): BookingStep | null {
  if (!cleanPatientName(data.name)) return "name";
  if (!normalizePhone(data.phone)) return "phone";
  if (!normalizeEmail(data.email)) return "email";
  if (!isCanonicalTreatment(data.treatment)) return "treatment";
  if (!isCanonicalDate(data.appointmentDate)) return "date";
  if (!isCanonicalTime(data.appointmentTime)) return "time";
  return null;
}

function promptForBookingStep(step: BookingStep): string {
  switch (step) {
    case "name":
      return "I need your full name again. Please say only your full name.";
    case "phone":
      return "I need your phone number again. Please say only the digits slowly.";
    case "email":
      return "I need your email again. Please say it like taha at gmail dot com.";
    case "treatment":
      return "I need the treatment again. Please say teeth whitening, dental implants, root canal treatment, orthodontics, cosmetic dentistry, general dentistry, or emergency dental care.";
    case "date":
      return "I need the appointment date again. Please say a future date, for example 12 August 2026.";
    case "time":
      return "I need the appointment time again. Please say a short time, for example 2 PM or 5 30 PM.";
    default:
      return "Please tell me the missing appointment detail.";
  }
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

  const lastSpokenTextRef = useRef("");
  const lastProcessedRef = useRef({ text: "", at: 0 });
  const aiAbortRef = useRef<AbortController | null>(null);
  const speechGenerationRef = useRef(0);

  // Production listening pipeline:
  // collect fragmented final STT results into one patient turn,
  // debounce briefly, then process once.
  const finalSpeechBufferRef = useRef("");
  const finalSpeechTimerRef = useRef<number | null>(null);
  const recognitionRestartTimerRef = useRef<number | null>(null);
  const recognitionRestartAttemptsRef = useRef(0);
  const lastRecognitionStartRef = useRef(0);
  const bargeInCandidateRef = useRef({ text: "", at: 0 });

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
      if (listenTimerRef.current !== null) {
        window.clearTimeout(listenTimerRef.current);
        listenTimerRef.current = null;
      }
    }, []);

  const clearFinalSpeechTimer = useCallback(() => {
    if (finalSpeechTimerRef.current !== null) {
      window.clearTimeout(finalSpeechTimerRef.current);
      finalSpeechTimerRef.current = null;
    }
  }, []);

  const clearRecognitionRestartTimer = useCallback(() => {
    if (recognitionRestartTimerRef.current !== null) {
      window.clearTimeout(recognitionRestartTimerRef.current);
      recognitionRestartTimerRef.current = null;
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

  const scheduleMicroRestart = useCallback((delay = 250) => {
    clearRecognitionRestartTimer();

    recognitionRestartTimerRef.current = window.setTimeout(() => {
      recognitionRestartTimerRef.current = null;

      if (
        !openRef.current ||
        mutedRef.current ||
        recognitionRunningRef.current
      ) {
        return;
      }

      try {
        recognitionRef.current?.start();
        recognitionRunningRef.current = true;
        lastRecognitionStartRef.current = Date.now();
      } catch {
        // onend/onerror will schedule the next safe attempt.
      }
    }, Math.max(180, delay));
  }, [clearRecognitionRestartTimer]);

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
      clearRecognitionRestartTimer();

      intentionalStopRef.current = false;
      setErrorMessage("");

      // Chrome can throw InvalidStateError when start() is called repeatedly.
      const sinceLastStart = Date.now() - lastRecognitionStartRef.current;
      if (sinceLastStart < 180) {
        scheduleMicroRestart(180 - sinceLastStart);
        return;
      }

      try {
        lastRecognitionStartRef.current = Date.now();
        recognition.start();
        recognitionRunningRef.current = true;
        recognitionRestartAttemptsRef.current = 0;

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
    }, [
      clearListenTimer,
      clearRecognitionRestartTimer,
      scheduleMicroRestart,
    ]);

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

      speechGenerationRef.current += 1;
      aiAbortRef.current?.abort();
      aiAbortRef.current = null;
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

      // Voice agents should not read essay-length answers. Keep speech
      // interruptible and concise; the full text can still remain in UI.
      const spokenText =
        cleanText.length > 280
          ? `${cleanText.slice(0, 260).replace(/\s+\S*$/, "")}.`
          : cleanText;

      const generation = ++speechGenerationRef.current;

      lastSpokenTextRef.current =
        normalize(spokenText);

      const utterance =
        new SpeechSynthesisUtterance(
          spokenText
        );

      utterance.rate = 1.02;
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
        if (generation !== speechGenerationRef.current) return;
        speakingRef.current = true;

        if (mountedRef.current) {
          setErrorMessage("");
          setState("speaking");
        }

        // Keep recognition alive while Nova speaks so the user can barge in
        // with a short command such as "stop" or "wait". Echo is filtered
        // before normal user speech is processed.
      };

      utterance.onend = () => {
        if (generation !== speechGenerationRef.current) return;
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
    /*
      CRITICAL FIX:
      The booking flow already saves canonical values into bookingDataRef.
      The old code re-parsed every field at submit time and could turn a
      valid value into null, then reset the whole booking to "name".
      We now validate canonical state without destroying it.
    */
    const current: BookingData = {
      ...bookingDataRef.current,
    };

    const invalidStep = getFirstInvalidBookingStep(current);

    if (invalidStep) {
      console.warn("VOICE BOOKING VALIDATION FAILED:", {
        invalidStep,
        booking: current,
      });

      // Keep every valid field. Clear only the bad field.
      const fieldByStep: Partial<Record<BookingStep, keyof BookingData>> = {
        name: "name",
        phone: "phone",
        email: "email",
        treatment: "treatment",
        date: "appointmentDate",
        time: "appointmentTime",
      };

      const badField = fieldByStep[invalidStep];

      if (badField) {
        const next = {
          ...current,
          [badField]: "",
        } as BookingData;

        bookingDataRef.current = next;
        setBookingData(next);
      }

      moveBookingStep(invalidStep);

      const reply = promptForBookingStep(invalidStep);
      setAgentReply(reply);
      setErrorMessage("");
      speak(reply, true);
      return;
    }

    // Canonical payload: preserve exactly what the booking flow collected.
    const data: BookingData = {
      name: cleanPatientName(current.name)!,
      phone: normalizePhone(current.phone)!,
      email: normalizeEmail(current.email)!,
      treatment: current.treatment,
      appointmentDate: current.appointmentDate,
      appointmentTime: current.appointmentTime,
    };

    bookingDataRef.current = data;
    setBookingData(data);

    setState("thinking");
    setErrorMessage("");

    try {
      console.log("VOICE BOOKING SUBMIT:", {
        ...data,
        source: "AI Voice Agent",
      });

      const response = await fetch("/api/book-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          treatment: data.treatment,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          source: "AI Voice Agent",
        }),
      });

      const result = await response.json().catch(() => null);

      console.log("VOICE BOOKING RESPONSE:", {
        status: response.status,
        result,
      });

      if (!response.ok || result?.success !== true) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : `Booking failed with status ${response.status}`
        );
      }

      if (result?.duplicate === true) {
        const duplicateReply =
          `Thank you, ${data.name}. This appointment request has already been submitted. ` +
          `You do not need to book it again. Our clinic team will review it and contact you.`;

        resetBooking();
        setAgentReply(duplicateReply);
        setErrorMessage("");
        speak(duplicateReply, true);
        return;
      }

      const reply =
        `Thank you, ${data.name}. Your appointment request for ${data.treatment} ` +
        `on ${prettyDate(data.appointmentDate)} at ${prettyTime(data.appointmentTime)} ` +
        `has been submitted successfully. Our clinic team will review availability and contact you to confirm.`;

      resetBooking();
      setAgentReply(reply);
      setErrorMessage("");
      speak(reply, true);
    } catch (error) {
      console.error("VOICE BOOKING ERROR:", error);

      /*
        Do NOT reset booking data after API/network failure.
        User can say "confirm" and retry with the same validated details.
      */
      moveBookingStep("confirm");

      const reply =
        "I could not submit your appointment request right now. " +
        "Your details are still saved in this voice session. " +
        "Say confirm to try again, or cancel to stop.";

      setAgentReply(reply);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Booking submission failed."
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

          if (!cleanName) {
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
          const phone = normalizePhone(text);
          if (!phone) {
            const reply = "I missed part of the number. Please say only the digits slowly, for example zero three two one, seven six one, eight two zero nine.";
            setAgentReply(reply); speak(reply, true); return;
          }
          updateBooking({ phone }); moveBookingStep("email");
          const reply = `I heard ${speakablePhone(phone)}. Saved. Now say your email like taha at gmail dot com.`;
          setAgentReply(reply); speak(reply, true); return;
        }

        /* ---------------- EMAIL ---------------- */
        if (step === "email") {
          const email = normalizeEmail(text);
          if (!email) {
            const reply = "I missed part of the email. Please say only the address slowly, like taha at gmail dot com.";
            setAgentReply(reply); speak(reply, true); return;
          }
          updateBooking({ email }); moveBookingStep("treatment");
          const reply = `I heard ${speakableEmail(email)}. Saved. Which treatment would you like? Say teeth whitening, implants, root canal, braces, general dentistry, cosmetic dentistry, or emergency dental care.`;
          setAgentReply(reply); speak(reply, true); return;
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
              "I missed the time. Please say only a short time, for example 2 PM, 5 30 PM, or 10 AM.";

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

          const reply = `Please confirm. Name ${next.name}. Phone ${speakablePhone(next.phone)}. Email ${speakableEmail(next.email)}. Treatment ${next.treatment}. Date ${prettyDate(next.appointmentDate)}. Time ${prettyTime(next.appointmentTime)}. Say confirm to submit, or cancel to stop.`;

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

      aiAbortRef.current?.abort();
      const controller = new AbortController();
      aiAbortRef.current = controller;

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
            signal: controller.signal,
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
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

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

        const normalizedNow = normalize(text);
        const now = Date.now();
        const previous = lastProcessedRef.current;

        const duplicate =
          previous.text === normalizedNow ||
          (
            previous.text.length > 0 &&
            normalizedNow.length > 0 &&
            (
              previous.text.includes(normalizedNow) ||
              normalizedNow.includes(previous.text)
            )
          );

        if (duplicate && now - previous.at < 2500) return;

        lastProcessedRef.current = {
          text: normalizedNow,
          at: now,
        };

        // Ignore Nova's own TTS echo before evaluating commands. This is
        // essential because recognition stays active for real barge-in.
        if (speakingRef.current && lastSpokenTextRef.current) {
          const own = lastSpokenTextRef.current;
          const heard = normalizedNow;
          const heardWords = heard.split(" ").filter(Boolean);
          const overlap = heardWords.filter((word) => own.includes(word)).length;
          const looksLikeEcho =
            heard.length >= 8 &&
            (own.includes(heard) ||
              heard.includes(own.slice(0, Math.min(40, own.length))) ||
              overlap / Math.max(heardWords.length, 1) >= 0.8);

          if (looksLikeEcho && !isStopCommand(heard)) {
            return;
          }
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

    recognition.continuous = true;

    /*
      IMPORTANT:
      Interim true hona zaroori hai
      taake "stop" jaldi detect ho.
    */

    recognition.interimResults = true;

    recognition.lang = "en-US";

    /* ---------------- RESULT ---------------- */

    recognition.onresult = (event) => {
      const startIndex = event.resultIndex ?? 0;
      let interimText = "";
      const finalParts: string[] = [];

      for (let i = startIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result?.[0]?.transcript?.trim() || "";
        if (!piece) continue;

        if (result.isFinal === true) {
          finalParts.push(piece);
        } else {
          interimText += `${piece} `;
        }
      }

      const liveText = interimText.trim();

      // TRUE BARGE-IN:
      // detect stop/wait/pause from interim STT immediately, before finalization.
      if (
        speakingRef.current &&
        liveText &&
        (isStopCommand(liveText) || isImmediateStopCommand(liveText))
      ) {
        finalSpeechBufferRef.current = "";
        clearFinalSpeechTimer();
        interruptSpeech();
        return;
      }

      // While Nova speaks, ignore likely loudspeaker echo. But do NOT blindly
      // ignore all patient speech: a genuine new utterance can interrupt Nova.
      if (speakingRef.current && liveText) {
        if (looksLikeOwnSpeech(liveText, lastSpokenTextRef.current)) {
          return;
        }

        const candidate = normalize(liveText);
        const previousCandidate = bargeInCandidateRef.current;

        // Require a small amount of stable non-echo speech before cancelling
        // TTS. This prevents random room noise from interrupting Nova.
        if (
          candidate.split(" ").length >= 2 &&
          previousCandidate.text &&
          (
            candidate.includes(previousCandidate.text) ||
            previousCandidate.text.includes(candidate)
          ) &&
          Date.now() - previousCandidate.at < 1400
        ) {
          window.speechSynthesis?.cancel();
          speechGenerationRef.current += 1;
          speakingRef.current = false;
          lastSpokenTextRef.current = "";
        } else {
          bargeInCandidateRef.current = {
            text: candidate,
            at: Date.now(),
          };
        }
      }

      const finalText = finalParts.join(" ").trim();
      if (!finalText) return;

      if (isStopCommand(finalText) || isImmediateStopCommand(finalText)) {
        finalSpeechBufferRef.current = "";
        clearFinalSpeechTimer();
        interruptSpeech();
        return;
      }

      // Reject Nova's own TTS echo, but preserve real patient speech.
      if (
        speakingRef.current &&
        looksLikeOwnSpeech(finalText, lastSpokenTextRef.current)
      ) {
        return;
      }

      if (speakingRef.current) {
        window.speechSynthesis?.cancel();
        speechGenerationRef.current += 1;
        speakingRef.current = false;
        lastSpokenTextRef.current = "";
      }

      // Chrome often finalizes one sentence as several tiny chunks.
      // Aggregate them and process one patient turn after a short silence.
      finalSpeechBufferRef.current = [
        finalSpeechBufferRef.current,
        finalText,
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      clearFinalSpeechTimer();

      finalSpeechTimerRef.current = window.setTimeout(() => {
        finalSpeechTimerRef.current = null;

        const completeTurn = finalSpeechBufferRef.current.trim();
        finalSpeechBufferRef.current = "";

        if (!completeTurn) return;
        void processUserSpeech(completeTurn);
      }, bookingStepRef.current === "phone" ? 900 : 520);
    };

    /* ---------------- ERROR ---------------- */

    recognition.onerror = (
      event
    ) => {
      const recognitionError =
        event.error || "unknown";

      recognitionRunningRef.current =
        false;

      if (!["no-speech", "aborted"].includes(recognitionError)) {
        console.warn("VOICE RECOGNITION ERROR:", recognitionError);
      }

      if (recognitionError === "aborted") {
        return;
      }

      if (recognitionError === "no-speech") {
        // Silence is normal, not a user-facing error. Restart with a tiny
        // backoff so Chrome does not enter a rapid start/end loop.
        recognitionRestartAttemptsRef.current = Math.min(
          recognitionRestartAttemptsRef.current + 1,
          5
        );

        if (openRef.current && !mutedRef.current) {
          const backoff = Math.min(
            350 + recognitionRestartAttemptsRef.current * 180,
            1200
          );
          scheduleListening(speakingRef.current ? 220 : backoff);
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
      recognitionRunningRef.current = false;
      intentionalStopRef.current = false;

      if (!openRef.current || mutedRef.current) return;

      const delay = speakingRef.current
        ? 180
        : Math.min(
            280 + recognitionRestartAttemptsRef.current * 120,
            900
          );

      scheduleListening(delay);
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
      clearFinalSpeechTimer();
      clearRecognitionRestartTimer();
      finalSpeechBufferRef.current = "";

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
    clearFinalSpeechTimer,
    clearRecognitionRestartTimer,
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
      clearFinalSpeechTimer();
      clearRecognitionRestartTimer();
      finalSpeechBufferRef.current = "";

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

      aiAbortRef.current?.abort();
      aiAbortRef.current = null;
      speechGenerationRef.current += 1;
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
    clearFinalSpeechTimer,
    clearRecognitionRestartTimer,
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

      <div className="relative z-10 max-h-[94vh] w-full max-w-[460px] overflow-x-hidden overflow-y-auto rounded-[32px] border border-white/10 bg-[#061A4A] shadow-[0_35px_100px_rgba(2,6,23,0.55)]">

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
              className={`absolute inset-0 rounded-full bg-cyan-400/10 blur-xl ${state === "speaking" ||
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
                  className={`w-1 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300 ${state ===
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
              className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${muted
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