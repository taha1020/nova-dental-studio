import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  treatment?: unknown;
  service?: unknown;
  appointmentDate?: unknown;
  appointmentTime?: unknown;
  appointment_date?: unknown;
  appointment_time?: unknown;
  source?: unknown;
};

const OFFICIAL_TREATMENTS = [
  "Teeth Whitening",
  "Dental Implants",
  "Root Canal Treatment",
  "Orthodontics",
  "Cosmetic Dentistry",
  "General Dentistry",
  "Emergency Dental Care",
  "Other",
] as const;

type Treatment =
  (typeof OFFICIAL_TREATMENTS)[number];

function getText(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeText(value: unknown): string {
  return getText(value)
    .toLowerCase()
    .replace(/[_/\\|]+/g, " ")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanName(
  value: unknown
): string | null {
  let name = getText(value)
    .replace(/\s+/g, " ")
    .trim();

  name = name
    .replace(
      /^(?:my name is|name is|i am|i'm|this is)\s+/i,
      ""
    )
    .trim();

  if (
    name.length < 2 ||
    name.length > 80
  ) {
    return null;
  }

  if (
    /[@\d]/.test(name)
  ) {
    return null;
  }

  const parts = name
    .split(" ")
    .filter(Boolean);

  if (
    parts.length < 1 ||
    parts.length > 6
  ) {
    return null;
  }

  const valid = parts.every((part) =>
    /^[\p{L}][\p{L}'’.-]*$/u.test(part)
  );

  if (!valid) {
    return null;
  }

  return parts
    .map((part) =>
      part
        .split("-")
        .map((piece) => {
          if (!piece) return piece;

          return (
            piece.charAt(0).toUpperCase() +
            piece.slice(1).toLowerCase()
          );
        })
        .join("-")
    )
    .join(" ");
}

function cleanPhone(
  value: unknown
): string | null {
  const raw = getText(value);

  if (!raw) {
    return null;
  }

  let digits = raw.replace(/\D/g, "");

  if (
    digits.startsWith("92") &&
    digits.length === 12
  ) {
    digits = `0${digits.slice(2)}`;
  }

  if (
    digits.startsWith("3") &&
    digits.length === 10
  ) {
    digits = `0${digits}`;
  }

  if (/^03\d{9}$/.test(digits)) {
    return digits;
  }

  if (
    digits.length >= 10 &&
    digits.length <= 15
  ) {
    return raw.startsWith("+")
      ? `+${digits}`
      : digits;
  }

  return null;
}

function cleanEmail(
  value: unknown
): string | null {
  const email = getText(value)
    .toLowerCase()
    .replace(/\s+/g, "");

  if (
    !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(
      email
    )
  ) {
    return null;
  }

  return email;
}

function cleanTreatment(
  value: unknown
): Treatment | null {
  const raw = normalizeText(value);

  if (!raw) {
    return null;
  }

  // Teeth Whitening
  if (
    raw.includes("teeth whitening") ||
    raw.includes("tooth whitening") ||
    raw.includes("whitening") ||
    raw.includes("white teeth") ||
    raw.includes("whiter teeth") ||
    raw.includes("teeth bleaching")
  ) {
    return "Teeth Whitening";
  }

  // Root Canal
  if (
    raw.includes("root canal") ||
    raw === "rct"
  ) {
    return "Root Canal Treatment";
  }

  // Dental Implants
  if (
    raw.includes("dental implant") ||
    raw.includes("tooth implant") ||
    raw === "implant" ||
    raw === "implants"
  ) {
    return "Dental Implants";
  }

  // Orthodontics
  if (
    raw.includes("orthodontic") ||
    raw.includes("braces") ||
    raw.includes("aligners") ||
    raw.includes("teeth alignment")
  ) {
    return "Orthodontics";
  }

  // Cosmetic Dentistry
  if (
    raw.includes("cosmetic dentistry") ||
    raw.includes("cosmetic dental") ||
    raw.includes("smile makeover") ||
    raw.includes("veneers")
  ) {
    return "Cosmetic Dentistry";
  }

  // Emergency
  if (
    raw.includes("emergency dental") ||
    raw.includes("dental emergency") ||
    raw.includes("emergency dentist") ||
    raw.includes("urgent dental") ||
    raw.includes("toothache") ||
    raw.includes("severe tooth pain")
  ) {
    return "Emergency Dental Care";
  }

  // General Dentistry
  if (
    raw.includes("general dentistry") ||
    raw.includes("general dental") ||
    raw.includes("dental checkup") ||
    raw.includes("check up") ||
    raw.includes("checkup") ||
    raw.includes("dental cleaning") ||
    raw.includes("teeth cleaning") ||
    raw === "cleaning"
  ) {
    return "General Dentistry";
  }

  // Existing chatbot compatibility
  if (
    raw === "other" ||
    raw === "others" ||
    raw === "other treatment" ||
    raw === "other dental treatment"
  ) {
    return "Other";
  }

  // Unknown garbage is rejected
  return null;
}

function cleanDate(
  value: unknown
): string | null {
  const raw = getText(value);

  const match = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (
    date.getTime() <
    today.getTime()
  ) {
    return null;
  }

  return raw;
}

function cleanTime(
  value: unknown
): string | null {
  const raw = getText(value)
    .toUpperCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) {
    return null;
  }

  // 17:00
  const full24 = raw.match(
    /^([01]\d|2[0-3]):([0-5]\d)$/
  );

  if (full24) {
    return raw;
  }

  // 7:00
  const short24 = raw.match(
    /^(\d|1\d|2[0-3]):([0-5]\d)$/
  );

  if (short24) {
    return `${String(
      Number(short24[1])
    ).padStart(2, "0")}:${short24[2]}`;
  }

  // 2 PM / 2:30 PM
  const twelveHour = raw.match(
    /^(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(AM|PM)$/
  );

  if (twelveHour) {
    let hour = Number(twelveHour[1]);

    const minute =
      twelveHour[2] ?? "00";

    const meridiem =
      twelveHour[3];

    if (
      meridiem === "PM" &&
      hour !== 12
    ) {
      hour += 12;
    }

    if (
      meridiem === "AM" &&
      hour === 12
    ) {
      hour = 0;
    }

    return `${String(hour).padStart(
      2,
      "0"
    )}:${minute}`;
  }

  return null;
}

function cleanSource(
  value: unknown
): "AI Voice Agent" | "Website" {
  const source = normalizeText(value);

  if (
    source.includes("voice") ||
    source.includes("ai agent")
  ) {
    return "AI Voice Agent";
  }

  return "Website";
}

function escapeHtml(
  value: string
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendAdminLeadEmail(data: {
  id: number;
  name: string;
  phone: string;
  email: string;
  treatment: Treatment;
  appointmentDate: string;
  appointmentTime: string;
  source: string;
}) {
  const adminEmail =
    process.env.ADMIN_EMAIL?.trim();

  if (!adminEmail) {
    console.warn(
      "ADMIN_EMAIL missing. Lead saved, email skipped."
    );

    return;
  }

  try {
    const result =
      await resend.emails.send({
        from:
          "Nova AI <onboarding@resend.dev>",

        to: adminEmail,

        subject:
          data.source === "AI Voice Agent"
            ? "🎙️ New Voice Agent Lead"
            : "🚨 New Appointment Lead",

        html: `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;color:#0f172a">
            <h2>New Appointment Request</h2>

            <p>
              A new lead has been received by
              Nova Dental Studio.
            </p>

            <hr />

            <p>
              <strong>Lead ID:</strong>
              #${data.id}
            </p>

            <p>
              <strong>Source:</strong>
              ${escapeHtml(data.source)}
            </p>

            <p>
              <strong>Patient:</strong>
              ${escapeHtml(data.name)}
            </p>

            <p>
              <strong>Phone:</strong>
              ${escapeHtml(data.phone)}
            </p>

            <p>
              <strong>Email:</strong>
              ${escapeHtml(data.email)}
            </p>

            <p>
              <strong>Treatment:</strong>
              ${escapeHtml(data.treatment)}
            </p>

            <p>
              <strong>Date:</strong>
              ${escapeHtml(data.appointmentDate)}
            </p>

            <p>
              <strong>Time:</strong>
              ${escapeHtml(data.appointmentTime)}
            </p>
          </div>
        `,
      });

    if (result.error) {
      console.error(
        "ADMIN EMAIL ERROR:",
        result.error
      );

      return;
    }

    console.log(
      "ADMIN EMAIL SENT:",
      result.data
    );
  } catch (error) {
    // Email failure must not break booking
    console.error(
      "ADMIN EMAIL EXCEPTION:",
      error
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as BookingRequest;

    const rawTreatment =
      body.treatment ??
      body.service;

    const rawDate =
      body.appointmentDate ??
      body.appointment_date;

    const rawTime =
      body.appointmentTime ??
      body.appointment_time;

    const name =
      cleanName(body.name);

    const phone =
      cleanPhone(body.phone);

    const email =
      cleanEmail(body.email);

    const treatment =
      cleanTreatment(rawTreatment);

    const appointmentDate =
      cleanDate(rawDate);

    const appointmentTime =
      cleanTime(rawTime);

    const source =
      cleanSource(body.source);

    console.log(
      "BOOKING NORMALIZED:",
      {
        name,
        phone,
        email,
        rawTreatment,
        treatment,
        appointmentDate,
        appointmentTime,
        source,
      }
    );

    const invalidFields: string[] = [];

    if (!name) {
      invalidFields.push("name");
    }

    if (!phone) {
      invalidFields.push("phone");
    }

    if (!email) {
      invalidFields.push("email");
    }

    if (!treatment) {
      invalidFields.push("treatment");
    }

    if (!appointmentDate) {
      invalidFields.push(
        "appointmentDate"
      );
    }

    if (!appointmentTime) {
      invalidFields.push(
        "appointmentTime"
      );
    }

    if (
      invalidFields.length > 0
    ) {
      console.warn(
        "BOOKING REJECTED:",
        {
          invalidFields,
          body,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Invalid appointment data: ${invalidFields.join(
              ", "
            )}`,
          invalidFields,
        },
        {
          status: 400,
        }
      );
    }

    // Explicit narrowed values
    const safeName = name as string;
    const safePhone = phone as string;
    const safeEmail = email as string;

    const safeTreatment =
      treatment as Treatment;

    const safeDate =
      appointmentDate as string;

    const safeTime =
      appointmentTime as string;

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL
        ?.trim();

    const supabaseKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY
        ?.trim() ||
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY
        ?.trim();

    if (
      !supabaseUrl ||
      !supabaseKey
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Booking service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        supabaseKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        }
      );

    // Duplicate protection
    const {
      data: duplicateRows,
      error: duplicateError,
    } = await supabase
      .from("appointments")
      .select("id")
      .eq("email", safeEmail)
      .eq(
        "appointment_date",
        safeDate
      )
      .eq(
        "appointment_time",
        safeTime
      )
      .eq(
        "treatment",
        safeTreatment
      )
      .limit(1);

    if (duplicateError) {
      console.error(
        "DUPLICATE CHECK ERROR:",
        duplicateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to validate appointment request.",
        },
        {
          status: 500,
        }
      );
    }

    const duplicate =
      duplicateRows?.[0];

    if (duplicate) {
      return NextResponse.json(
        {
          success: true,
          duplicate: true,
          id: duplicate.id,
          message:
            "This appointment request already exists.",
        },
        {
          status: 200,
        }
      );
    }

    const payload = {
      name: safeName,
      phone: safePhone,
      email: safeEmail,
      treatment: safeTreatment,
      appointment_date: safeDate,
      appointment_time: safeTime,
      status: "pending",
    };

    const {
      data: inserted,
      error: insertError,
    } = await supabase
      .from("appointments")
      .insert([payload])
      .select(
        `
          id,
          name,
          phone,
          email,
          treatment,
          appointment_date,
          appointment_time,
          status,
          created_at
        `
      )
      .single();

    if (insertError) {
      console.error(
        "SUPABASE INSERT ERROR:",
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to submit appointment request.",
        },
        {
          status: 500,
        }
      );
    }

    // Notify admin after successful DB insert
    await sendAdminLeadEmail({
      id: Number(inserted.id),
      name: safeName,
      phone: safePhone,
      email: safeEmail,
      treatment: safeTreatment,
      appointmentDate: safeDate,
      appointmentTime: safeTime,
      source,
    });

    return NextResponse.json(
      {
        success: true,
        duplicate: false,
        id: inserted.id,
        status: inserted.status,
        treatment:
          inserted.treatment,
        source,
        message:
          "Appointment request submitted successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "BOOKING ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to submit appointment request.",
      },
      {
        status: 500,
      }
    );
  }
}