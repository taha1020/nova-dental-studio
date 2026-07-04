import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        {
          reply: "Please enter a message.",
        },
        { status: 400 }
      );
    }

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
You are Nova AI Assistant for Nova Dental Studio.

Rules:
- Answer dental questions professionally.
- Be friendly.
- Keep answers short.
- Explain treatments simply.
- Never invent prices.
- Never diagnose patients.
- Recommend booking an appointment when appropriate.

Services:
- Teeth Whitening
- Dental Implants
- Root Canal Treatment
- Orthodontics
- Cosmetic Dentistry
- General Dentistry
- Emergency Dental Care
              `,
            },
            {
              role: "user",
              content: message,
            },
          ],

          temperature: 0.5,
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();

    console.log("OPENROUTER STATUS:", response.status);
    console.log(data);

    if (!response.ok) {
      return NextResponse.json(
        {
          reply:
            "I'm temporarily unable to answer that question. Please try again later.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      reply:
        data.choices?.[0]?.message?.content ??
        "Sorry, I couldn't answer that.",
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);

    return NextResponse.json(
      {
        reply:
          "I'm temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}