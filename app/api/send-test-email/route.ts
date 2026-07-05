import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRequest = {
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

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as LeadRequest;

    const adminEmail =
      process.env.ADMIN_EMAIL?.trim();

    if (!adminEmail) {
      console.error("ADMIN_EMAIL is missing");

      return NextResponse.json(
        {
          success: false,
          error: "Admin email is not configured.",
        },
        { status: 500 }
      );
    }

    const name = escapeHtml(
      data.name || "Unknown Patient"
    );

    const phone = escapeHtml(
      data.phone || "Not provided"
    );

    const patientEmail = escapeHtml(
      data.email || "Not provided"
    );

    const treatment = escapeHtml(
      data.treatment || "Not specified"
    );

    const appointmentDate = escapeHtml(
      data.appointmentDate || "Not specified"
    );

    const appointmentTime = escapeHtml(
      data.appointmentTime || "Not specified"
    );

    const source = escapeHtml(
      data.source || "Website"
    );

    const result = await resend.emails.send({
      from:
        "Nova Dental Studio <onboarding@resend.dev>",

      // IMPORTANT:
      // Send only to your allowed Resend account email
      to: adminEmail,

      subject:
        "🚨 New Appointment Request | Nova Dental Studio",

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

            <div style="padding:30px 28px;">
              <p
                style="
                  margin-top:0;
                  color:#475569;
                  font-size:15px;
                  line-height:1.7;
                "
              >
                A new patient appointment request
                has been received and requires
                clinic review.
              </p>

              <div
                style="
                  margin-top:22px;
                  padding:20px;
                  border:1px solid #e2e8f0;
                  background:#f8fafc;
                  border-radius:14px;
                "
              >
                <p style="margin:0 0 12px;">
                  <strong>Patient:</strong>
                  ${name}
                </p>

                <p style="margin:0 0 12px;">
                  <strong>Phone:</strong>
                  ${phone}
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
                  <strong>Preferred Date:</strong>
                  ${appointmentDate}
                </p>

                <p style="margin:0 0 12px;">
                  <strong>Preferred Time:</strong>
                  ${appointmentTime}
                </p>

                <p style="margin:0;">
                  <strong>Booking Source:</strong>
                  ${source}
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
                Open the Nova Appointment Command
                Center to review and approve or
                reject this request.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (result.error) {
      console.error(
        "ADMIN LEAD EMAIL ERROR:",
        result.error
      );

      return NextResponse.json(
        {
          success: false,
          error: result.error.message,
        },
        { status: 500 }
      );
    }

    console.log(
      "ADMIN LEAD EMAIL SENT:",
      result.data
    );

    return NextResponse.json({
      success: true,
      message:
        "Admin notification sent successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN NOTIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to send admin notification.",
      },
      { status: 500 }
    );
  }
}