import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingRequest = {
  name?: string;
  phone?: string;
  email?: string;
  treatment?: string;
  appointmentDate?: string;
  appointmentTime?: string;
};

export async function POST(request: Request) {
  try {
    // =========================
    // READ REQUEST BODY
    // =========================

    const body = (await request.json()) as BookingRequest;

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim().toLowerCase();
    const treatment = body.treatment?.trim();
    const appointmentDate = body.appointmentDate?.trim();
    const appointmentTime = body.appointmentTime?.trim();

    console.log("BOOKING REQUEST RECEIVED:", {
      name,
      phone,
      email,
      treatment,
      appointmentDate,
      appointmentTime,
    });

    // =========================
    // VALIDATION
    // =========================

    if (
      !name ||
      !phone ||
      !email ||
      !treatment ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all appointment details.",
        },
        { status: 400 }
      );
    }

    // =========================
    // ENV VARIABLES
    // =========================

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("SUPABASE CONFIG MISSING:", {
        hasUrl: Boolean(supabaseUrl),
        hasAnonKey: Boolean(supabaseAnonKey),
      });

      return NextResponse.json(
        {
          success: false,
          error: "Booking service is not configured correctly.",
        },
        { status: 500 }
      );
    }

    // =========================
    // CREATE SUPABASE CLIENT
    // =========================

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    // =========================
    // MATCH EXACT DATABASE COLUMNS
    // =========================

    const appointmentData = {
      name: name,
      phone: phone,
      email: email,
      treatment: treatment,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: "pending",
    };

    console.log(
      "SAVING APPOINTMENT:",
      appointmentData
    );

    // =========================
    // INSERT INTO SUPABASE
    // =========================

    const { error } = await supabase
      .from("appointments")
      .insert([appointmentData]);

    // =========================
    // HANDLE DATABASE ERROR
    // =========================

    if (error) {
      console.error("SUPABASE INSERT ERROR:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      return NextResponse.json(
        {
          success: false,
          error:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Unable to submit appointment request.",
          code: error.code,
        },
        { status: 500 }
      );
    }

    // =========================
    // SUCCESS
    // =========================

    console.log(
      "APPOINTMENT SAVED SUCCESSFULLY"
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Your appointment request has been submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "BOOKING ROUTE ERROR:",
      error
    );

    if (error instanceof Error) {
      console.error("ERROR NAME:", error.name);
      console.error("ERROR MESSAGE:", error.message);
      console.error("ERROR CAUSE:", error.cause);
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit appointment request.",
      },
      { status: 500 }
    );
  }
}