import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const adminEmail =
  process.env.ADMIN_EMAIL?.trim();

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
    const status = String(
      body?.status ?? ""
    ).trim();

    console.log("STATUS UPDATE REQUEST:", {
      id,
      status,
    });

    // =========================================
    // 2. VALIDATE REQUEST
    // =========================================

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
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
    // 3. CHECK DATABASE CONFIG
    // =========================================

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "SUPABASE CONFIGURATION MISSING"
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

    // =========================================
    // 4. CREATE SERVER SUPABASE CLIENT
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
    // 5. FETCH APPOINTMENT
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

    console.log(
      "APPOINTMENT FOUND:",
      appointment
    );

    // =========================================
    // 6. UPDATE APPOINTMENT STATUS
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
    // 7. PREPARE ADMIN EMAIL
    // =========================================

    let emailSent = false;
    let emailError: string | null = null;

    if (!adminEmail) {
      console.error(
        "ADMIN_EMAIL ENV VARIABLE MISSING"
      );

      emailError =
        "ADMIN_EMAIL is not configured.";
    } else {
      try {
        const patientName = escapeHtml(
          appointment.name || "Patient"
        );

        const patientPhone = escapeHtml(
          appointment.phone || "Not provided"
        );

        const patientEmail = escapeHtml(
          appointment.email || "Not provided"
        );

        const treatment = escapeHtml(
          appointment.treatment ||
            "Dental Consultation"
        );

        const appointmentDate = escapeHtml(
          appointment.appointment_date ||
            "Not specified"
        );

        const appointmentTime = escapeHtml(
          appointment.appointment_time ||
            "Not specified"
        );

        // =====================================
        // 8. CONFIRMED NOTIFICATION
        // =====================================

        if (status === "Confirmed") {
          const result =
            await resend.emails.send({
              from:
                "Nova Dental Studio <onboarding@resend.dev>",

              // Send to your allowed Resend email
              to: adminEmail,

              subject:
                `✅ Appointment Approved | ${appointment.name || "Patient"}`,

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
                        Appointment Approved
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
                        The following appointment
                        request has been approved
                        from the Nova Admin Dashboard.
                      </p>

                      <div
                        style="
                          margin:24px 0;
                          padding:20px;
                          background:#ecfdf5;
                          border:1px solid #a7f3d0;
                          border-radius:14px;
                        "
                      >
                        <p style="margin:0 0 12px;">
                          <strong>Patient:</strong>
                          ${patientName}
                        </p>

                        <p style="margin:0 0 12px;">
                          <strong>Phone:</strong>
                          ${patientPhone}
                        </p>

                        <p style="margin:0 0 12px;">
                          <strong>Patient Email:</strong>
                          ${patientEmail}
                        </p>

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

                      <div
                        style="
                          margin-top:20px;
                          padding:16px;
                          background:#f8fafc;
                          border-radius:12px;
                          border:1px solid #e2e8f0;
                        "
                      >
                        <p
                          style="
                            margin:0;
                            color:#475569;
                            font-size:13px;
                            line-height:1.6;
                          "
                        >
                          <strong>
                            System Status:
                          </strong>
                          Confirmed
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
                        This is an automated clinic
                        operations notification from
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

          emailSent = true;

          console.log(
            "ADMIN CONFIRMATION EMAIL SENT:",
            result.data
          );
        }

        // =====================================
        // 9. REJECTED NOTIFICATION
        // =====================================

        if (status === "Rejected") {
          const result =
            await resend.emails.send({
              from:
                "Nova Dental Studio <onboarding@resend.dev>",

              // Send to your allowed Resend email
              to: adminEmail,

              subject:
                `❌ Appointment Rejected | ${appointment.name || "Patient"}`,

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
                        Appointment Rejected
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
                        The following appointment
                        request has been rejected
                        from the Nova Admin Dashboard.
                      </p>

                      <div
                        style="
                          margin:24px 0;
                          padding:20px;
                          background:#fff1f2;
                          border:1px solid #fecdd3;
                          border-radius:14px;
                        "
                      >
                        <p style="margin:0 0 12px;">
                          <strong>Patient:</strong>
                          ${patientName}
                        </p>

                        <p style="margin:0 0 12px;">
                          <strong>Phone:</strong>
                          ${patientPhone}
                        </p>

                        <p style="margin:0 0 12px;">
                          <strong>Patient Email:</strong>
                          ${patientEmail}
                        </p>

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

                      <div
                        style="
                          margin-top:20px;
                          padding:16px;
                          background:#f8fafc;
                          border-radius:12px;
                          border:1px solid #e2e8f0;
                        "
                      >
                        <p
                          style="
                            margin:0;
                            color:#475569;
                            font-size:13px;
                            line-height:1.6;
                          "
                        >
                          <strong>
                            System Status:
                          </strong>
                          Rejected
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
                        This is an automated clinic
                        operations notification from
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

          emailSent = true;

          console.log(
            "ADMIN REJECTION EMAIL SENT:",
            result.data
          );
        }
      } catch (error) {
        emailError =
          error instanceof Error
            ? error.message
            : "Email delivery failed.";

        console.error(
          "ADMIN STATUS EMAIL ERROR:",
          error
        );
      }
    }

    // =========================================
    // 10. FINAL RESPONSE
    // =========================================

    return NextResponse.json({
      success: true,
      status,
      appointment: updatedAppointment,
      emailSent,
      emailError,
      message: emailSent
        ? `Appointment ${status.toLowerCase()} and admin notification sent successfully.`
        : `Appointment ${status.toLowerCase()} successfully, but admin notification was not sent.`,
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