import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    const { data: appointment } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", Number(id))
      .single();

    console.log("STATUS:", status);
    console.log("APPOINTMENT:", appointment);

    const { error } = await supabase
      .from("appointments")
      .update({
        status,
      })
      .eq("id", Number(id));

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    if (appointment?.email) {

      if (status === "Confirmed") {

        const result = await resend.emails.send({
          from: "Nova AI <onboarding@resend.dev>",
          to: appointment.email,
          subject: "Appointment Confirmed ✅",
          html: `
            <h2>Appointment Confirmed</h2>

            <p>Dear ${appointment.name},</p>

            <p>
              We are pleased to confirm your appointment request.
            </p>

            <p>
              <strong>Treatment:</strong>
              ${appointment.treatment}
            </p>

            <p>
              <strong>Date:</strong>
              ${appointment.appointment_date}
            </p>

            <p>
              <strong>Time:</strong>
              ${appointment.appointment_time}
            </p>

            <p>
              Thank you for choosing Nova Dental Studio.
            </p>

            <p>
              We look forward to seeing you soon.
            </p>

            <br />

            <p>
              Best Regards,<br />
              Nova Dental Studio
            </p>
          `,
        });
          console.log("EMAIL RESULT:", result);

      } else if (status === "Rejected") {

        const result = await  resend.emails.send({
          from: "Nova AI <onboarding@resend.dev>",
          to: appointment.email,
          subject: "Appointment Update",
          html: `
            <h2>Appointment Update</h2>

            <p>Dear ${appointment.name},</p>

            <p>
              Thank you for your appointment request.
            </p>

            <p>
              Unfortunately, your selected appointment slot is no longer available.
            </p>

            <p>
              Please submit a new appointment request and our team will be happy to assist you in finding the next available appointment.
            </p>

            <p>
              We appreciate your patience and understanding.
            </p>

            <br />

            <p>
              Best Regards,<br />
              Nova Dental Studio
            </p>
          `,
        });
          console.log("EMAIL RESULT:", result);

      }
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}