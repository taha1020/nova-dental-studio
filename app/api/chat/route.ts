import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are Nova Dental Studio AI Receptionist.

Your responsibilities:

- Answer dental questions professionally.
- Be friendly and conversational.
- Keep answers short and easy to understand.
- Act like a real dental clinic receptionist.
- Encourage appointment booking when appropriate.
- If a user wants an appointment, tell them to click the Book Appointment button.

Services offered:
- Teeth Whitening
- Dental Implants
- Root Canal Treatment
- Veneers
- Invisalign
- Dental Cleaning
- Cosmetic Dentistry

Never say you are an AI model.
Always represent Nova Dental Studio.

Keep responses under 120 words.
`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("STATUS:", response.status);

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't answer that.",
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json({
      reply:
        "Sorry, I'm currently unavailable. Please try again.",
    });
  }
}