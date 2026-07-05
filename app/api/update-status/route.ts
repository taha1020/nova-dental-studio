import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    // =========================================
    // 1. READ REQUEST
    // =========================================

    const body = await req.json();

    const id = Number(body?.id);
    const status = String(body?.status ?? "").trim();

    console.log("STATUS UPDATE REQUEST:", {
      id,
      status,
    });

    // =========================================
    // 2. VALIDATE REQUEST
    // =========================================

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment ID.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedStatuses = [
      "Confirmed",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment status.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================
    // 3. CHECK SUPABASE CONFIG
    // =========================================

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "UPDATE STATUS: Missing Supabase configuration"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Database service is not configured.",
        },
        {
          status: 500,
        }
      );
    }

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
    // 4. FETCH APPOINTMENT FIRST
    // =========================================

    const {
      data: appointment,
      error: fetchError,
    } = await supabase
      .from("appointments")
      .select(
        `
          id,
          name,
          phone,
          email,
          treatment,
          appointment_date,
          appointment_time,
          status
        `
      )
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      console.error(
        "APPOINTMENT FETCH ERROR:",
        fetchError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Appointment not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================
    // 5. UPDATE DATABASE STATUS
    // =========================================

    const {
      data: updatedAppointment,
      error: updateError,
    } = await supabase
      .from("appointments")
      .update({
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error(
        "SUPABASE STATUS UPDATE ERROR:",
        {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "APPOINTMENT STATUS UPDATED:",
      updatedAppointment
    );

    // =========================================
    // 6. SEND PATIENT EMAIL
    // =========================================

    let emailSent = false;
    let emailError: string | null = null;

    const patientEmail =
      appointment.email?.trim();

    if (patientEmail) {
      try {
        const patientName = escapeHtml(
          appointment.name || "Patient"
        );

        const treatment = escapeHtml(
          appointment.treatment ||
            "Dental Consultation"
        );

        const appointmentDate = escapeHtml(
          appointment.appointment_date ||
            "To be confirmed"
        );

        const appointmentTime = escapeHtml(
          appointment.appointment_time ||
            "To be confirmed"
        );

        // =====================================
        // CONFIRMED EMAIL
        // =====================================

        if (status === "Confirmed") {
          const result =
            await resend.emails.send({
              from:
                "Nova Dental Studio <onboarding@resend.dev>",

              to: patientEmail,

              subject:
                "Your Appointment Is Confirmed ✅",

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
                      max-width:600px;
                      margin:0 auto;
                      background:#ffffff;
                      border-radius:20px;
                      overflow:hidden;
                      border:1px solid #e2e8f0;
                    "
                  >
                    <div
                      style="
                        background:#071A52;
                        padding:28px;
                        text-align:center;
                      "
                    >
                      <h1
                        style="
                          margin:0;
                          color:#ffffff;
                          font-size:24px;
                        "
                      >
                        Appointment Confirmed
                      </h1>
                    </div>

                    <div
                      style="
                        padding:32px 28px;
                        color:#334155;
                      "
                    >
                      <p
                        style="
                          margin-top:0;
                          font-size:16px;
                        "
                      >
                        Dear ${patientName},
                      </p>

                      <p
                        style="
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        Good news! Your appointment
                        request has been approved by
                        our clinic team.
                      </p>

                      <div
                        style="
                          margin:24px 0;
                          padding:20px;
                          background:#f8fafc;
                          border-radius:14px;
                          border:1px solid #e2e8f0;
                        "
                      >
                        <p style="margin:0 0 12px;">
                          <strong>Treatment:</strong>
                          ${treatment}
                        </p>

                        <p style="margin:0 0 12px;">
                          <strong>Date:</strong>
                          ${appointmentDate}
                        </p>

                        <p style="margin:0;">
                          <strong>Time:</strong>
                          ${appointmentTime}
                        </p>
                      </div>

                      <p
                        style="
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        We look forward to welcoming
                        you to Nova Dental Studio.
                        See you soon!
                      </p>

                      <p
                        style="
                          margin-bottom:0;
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        Best Regards,<br />
                        <strong>
                          Nova Dental Studio
                        </strong>
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

          emailSent = true;

          console.log(
            "CONFIRMATION EMAIL SENT:",
            result.data
          );
        }

        // =====================================
        // REJECTED EMAIL
        // =====================================

        if (status === "Rejected") {
          const result =
            await resend.emails.send({
              from:
                "Nova Dental Studio <onboarding@resend.dev>",

              to: patientEmail,

              subject:
                "Update About Your Appointment Request",

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
                      max-width:600px;
                      margin:0 auto;
                      background:#ffffff;
                      border-radius:20px;
                      overflow:hidden;
                      border:1px solid #e2e8f0;
                    "
                  >
                    <div
                      style="
                        background:#071A52;
                        padding:28px;
                        text-align:center;
                      "
                    >
                      <h1
                        style="
                          margin:0;
                          color:#ffffff;
                          font-size:24px;
                        "
                      >
                        Appointment Update
                      </h1>
                    </div>

                    <div
                      style="
                        padding:32px 28px;
                        color:#334155;
                      "
                    >
                      <p
                        style="
                          margin-top:0;
                          font-size:16px;
                        "
                      >
                        Dear ${patientName},
                      </p>

                      <p
                        style="
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        Thank you for choosing
                        Nova Dental Studio.
                      </p>

                      <p
                        style="
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        Due to high appointment
                        demand and current schedule
                        availability, we are unable
                        to confirm your requested
                        appointment slot at this time.
                      </p>

                      <div
                        style="
                          margin:24px 0;
                          padding:20px;
                          background:#fff7ed;
                          border-radius:14px;
                          border:1px solid #fed7aa;
                        "
                      >
                        <p style="margin:0 0 12px;">
                          <strong>Treatment:</strong>
                          ${treatment}
                        </p>

                        <p style="margin:0 0 12px;">
                          <strong>Requested Date:</strong>
                          ${appointmentDate}
                        </p>

                        <p style="margin:0;">
                          <strong>Requested Time:</strong>
                          ${appointmentTime}
                        </p>
                      </div>

                      <p
                        style="
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        You are welcome to submit a
                        new appointment request for
                        another preferred date or time,
                        and our team will be happy to
                        assist you.
                      </p>

                      <p
                        style="
                          margin-bottom:0;
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        Best Regards,<br />
                        <strong>
                          Nova Dental Studio
                        </strong>
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

          emailSent = true;

          console.log(
            "REJECTION EMAIL SENT:",
            result.data
          );
        }
      } catch (error) {
        emailError =
          error instanceof Error
            ? error.message
            : "Email delivery failed.";

        console.error(
          "PATIENT EMAIL ERROR:",
          error
        );
      }
    }

    // =========================================
    // 7. FINAL RESPONSE
    // =========================================

    return NextResponse.json({
      success: true,
      status,
      appointment: updatedAppointment,
      emailSent,
      emailError,
      message: emailSent
        ? `Appointment ${status.toLowerCase()} and patient email sent successfully.`
        : `Appointment ${status.toLowerCase()} successfully.`,
    });
  } catch (error) {
    console.error(
      "UPDATE STATUS ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}