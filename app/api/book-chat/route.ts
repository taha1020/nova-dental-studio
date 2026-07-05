import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingRequest = {
  name?: string;
  phone?: string;
  email?: string;
  treatment?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  source?: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    // =========================================
    // 1. READ REQUEST BODY
    // =========================================

    const body =
      (await request.json()) as BookingRequest;

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const email = body.email
      ?.trim()
      .toLowerCase();

    const treatment =
      body.treatment?.trim();

    const appointmentDate =
      body.appointmentDate?.trim();

    const appointmentTime =
      body.appointmentTime?.trim();

    const source =
      body.source?.trim() || "Website Booking";

    console.log("BOOKING REQUEST RECEIVED:", {
      name,
      phone,
      email,
      treatment,
      appointmentDate,
      appointmentTime,
      source,
    });

    // =========================================
    // 2. VALIDATION
    // =========================================

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
          error:
            "Please complete all appointment details.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================
    // 3. ENV VARIABLES
    // =========================================

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL
        ?.trim();

    const supabaseAnonKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY
        ?.trim();

    const adminEmail =
      process.env.ADMIN_EMAIL?.trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "SUPABASE CONFIG MISSING:",
        {
          hasUrl: Boolean(supabaseUrl),
          hasAnonKey: Boolean(
            supabaseAnonKey
          ),
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Booking service is not configured correctly.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================
    // 4. CREATE SUPABASE CLIENT
    // =========================================

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

    // =========================================
    // 5. APPOINTMENT DATA
    // =========================================

    const appointmentData = {
      name,
      phone,
      email,
      treatment,
      appointment_date:
        appointmentDate,
      appointment_time:
        appointmentTime,
      status: "pending",
    };

    console.log(
      "SAVING APPOINTMENT:",
      appointmentData
    );

    // =========================================
    // 6. INSERT INTO SUPABASE
    // =========================================

    const {
      data: savedAppointment,
      error: insertError,
    } = await supabase
      .from("appointments")
      .insert([appointmentData])
      .select()
      .single();

    // =========================================
    // 7. HANDLE DATABASE ERROR
    // =========================================

    if (insertError) {
      console.error(
        "SUPABASE INSERT ERROR:",
        {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            process.env.NODE_ENV ===
            "development"
              ? insertError.message
              : "Unable to submit appointment request.",
          code: insertError.code,
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "APPOINTMENT SAVED SUCCESSFULLY:",
      savedAppointment
    );

    // =========================================
    // 8. SEND NEW LEAD EMAIL TO ADMIN
    // =========================================

    let adminEmailSent = false;
    let adminEmailError:
      | string
      | null = null;

    if (!adminEmail) {
      adminEmailError =
        "ADMIN_EMAIL is not configured.";

      console.error(
        "ADMIN EMAIL CONFIG MISSING"
      );
    } else {
      try {
        const safeName =
          escapeHtml(name);

        const safePhone =
          escapeHtml(phone);

        const safePatientEmail =
          escapeHtml(email);

        const safeTreatment =
          escapeHtml(treatment);

        const safeDate =
          escapeHtml(appointmentDate);

        const safeTime =
          escapeHtml(appointmentTime);

        const safeSource =
          escapeHtml(source);

        const result =
          await resend.emails.send({
            from:
              "Nova Dental Studio <onboarding@resend.dev>",

            // Your own Resend-approved email
            to: adminEmail,

            subject:
              `🚨 New Appointment Request | ${name}`,

            html: `
              <div
                style="
                  margin:0;
                  padding:32px 16px;
                  background:#f5f7fb;
                  font-family:Arial,sans-serif;
                "
              >
                <div
                  style="
                    max-width:620px;
                    margin:0 auto;
                    background:#ffffff;
                    border:1px solid #e2e8f0;
                    border-radius:20px;
                    overflow:hidden;
                  "
                >
                  <div
                    style="
                      padding:28px;
                      background:#071A52;
                      color:#ffffff;
                    "
                  >
                    <p
                      style="
                        margin:0 0 8px;
                        color:#67e8f9;
                        font-size:12px;
                        font-weight:bold;
                        text-transform:uppercase;
                        letter-spacing:1px;
                      "
                    >
                      Nova Clinic Operations
                    </p>

                    <h1
                      style="
                        margin:0;
                        font-size:25px;
                      "
                    >
                      New Appointment Request
                    </h1>
                  </div>

                  <div
                    style="
                      padding:30px 28px;
                      color:#334155;
                    "
                  >
                    <p
                      style="
                        margin-top:0;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      A new patient appointment
                      request has been received
                      and requires clinic review.
                    </p>

                    <div
                      style="
                        margin:24px 0;
                        padding:20px;
                        background:#f8fafc;
                        border:1px solid #e2e8f0;
                        border-radius:14px;
                      "
                    >
                      <p
                        style="
                          margin:0 0 12px;
                        "
                      >
                        <strong>
                          Patient:
                        </strong>
                        ${safeName}
                      </p>

                      <p
                        style="
                          margin:0 0 12px;
                        "
                      >
                        <strong>
                          Phone:
                        </strong>
                        ${safePhone}
                      </p>

                      <p
                        style="
                          margin:0 0 12px;
                        "
                      >
                        <strong>
                          Patient Email:
                        </strong>
                        ${safePatientEmail}
                      </p>

                      <p
                        style="
                          margin:0 0 12px;
                        "
                      >
                        <strong>
                          Treatment:
                        </strong>
                        ${safeTreatment}
                      </p>

                      <p
                        style="
                          margin:0 0 12px;
                        "
                      >
                        <strong>
                          Preferred Date:
                        </strong>
                        ${safeDate}
                      </p>

                      <p
                        style="
                          margin:0 0 12px;
                        "
                      >
                        <strong>
                          Preferred Time:
                        </strong>
                        ${safeTime}
                      </p>

                      <p
                        style="
                          margin:0;
                        "
                      >
                        <strong>
                          Booking Source:
                        </strong>
                        ${safeSource}
                      </p>
                    </div>

                    <div
                      style="
                        padding:16px;
                        background:#ecfeff;
                        border:1px solid #a5f3fc;
                        border-radius:12px;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          color:#0e7490;
                          font-size:13px;
                          line-height:1.6;
                        "
                      >
                        <strong>
                          Action Required:
                        </strong>
                        Review this request in the
                        Nova Admin Dashboard.
                      </p>
                    </div>

                    <p
                      style="
                        margin:24px 0 0;
                        color:#64748b;
                        font-size:13px;
                        line-height:1.6;
                      "
                    >
                      This is an automated
                      appointment notification from
                      Nova Dental Studio.
                    </p>
                  </div>
                </div>
              </div>
            `,
          });

        if (result.error) {
          throw new Error(
            result.error.message
          );
        }

        adminEmailSent = true;

        console.log(
          "NEW LEAD EMAIL SENT TO ADMIN:",
          result.data
        );
      } catch (emailError) {
        adminEmailError =
          emailError instanceof Error
            ? emailError.message
            : "Unable to send admin email.";

        console.error(
          "NEW LEAD ADMIN EMAIL ERROR:",
          emailError
        );
      }
    }

    // =========================================
    // 9. SUCCESS RESPONSE
    // =========================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Your appointment request has been submitted successfully.",

        appointment:
          savedAppointment,

        adminNotification: {
          sent: adminEmailSent,
          error: adminEmailError,
        },
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

    if (error instanceof Error) {
      console.error(
        "ERROR NAME:",
        error.name
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      console.error(
        "ERROR CAUSE:",
        error.cause
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit appointment request.",
      },
      {
        status: 500,
      }
    );
  }
}