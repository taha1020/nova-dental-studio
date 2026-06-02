import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const data = await req.json();

  await resend.emails.send({
    from: "Nova AI <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL!,
    subject: "🚨 New Appointment Request",
    html: `
      <h2>New Lead Received</h2>

      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Treatment:</strong> ${data.treatment}</p>
      <p><strong>Date:</strong> ${data.appointmentDate}</p>
      <p><strong>Time:</strong> ${data.appointmentTime}</p>
    `,
  });

  return NextResponse.json({
    success: true,
  });
}