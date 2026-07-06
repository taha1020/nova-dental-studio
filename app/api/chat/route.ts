import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRequest = {
  message?: string;
  mode?: "chat" | "voice";
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

export async function POST(req: Request) {
  try {
    // =========================================
    // 1. READ REQUEST
    // =========================================

    const body =
      (await req.json()) as ChatRequest;

    const message =
      body.message?.trim();

    const mode =
      body.mode === "voice"
        ? "voice"
        : "chat";

    const history =
      Array.isArray(body.history)
        ? body.history
            .filter(
              (item) =>
                item &&
                (item.role === "user" ||
                  item.role === "assistant") &&
                typeof item.content === "string"
            )
            .slice(-8)
        : [];

    if (!message) {
      return NextResponse.json(
        {
          reply:
            mode === "voice"
              ? "I didn't catch that. Could you say it again?"
              : "Please enter a message.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================
    // 2. ENVIRONMENT
    // =========================================

    const apiKey =
      process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      console.error(
        "OPENROUTER_API_KEY is missing"
      );

      return NextResponse.json(
        {
          reply:
            "I'm temporarily unavailable. Please try again in a moment.",
        },
        {
          status: 500,
        }
      );
    }

    // Optional clinic facts.
    // Add these later in .env.local.
    const clinicAddress =
      process.env.NOVA_CLINIC_ADDRESS?.trim() ||
      "Not configured";

    const clinicPhone =
      process.env.NOVA_CLINIC_PHONE?.trim() ||
      "Not configured";

    const clinicHours =
      process.env.NOVA_CLINIC_HOURS?.trim() ||
      "Not configured";

    const clinicEmail =
      process.env.NOVA_CLINIC_EMAIL?.trim() ||
      "Not configured";

    // =========================================
    // 3. MODE-SPECIFIC RULES
    // =========================================

    const responseStyle =
      mode === "voice"
        ? `
VOICE MODE RULES:
- Speak naturally like a real receptionist.
- Keep most answers between 1 and 3 short sentences.
- Never use markdown.
- Never use bullet points.
- Never use numbered lists.
- Never use asterisks.
- Avoid long explanations.
- Answer the direct question first.
- If useful, ask one short follow-up question.
- Do not say "check the website" when a known clinic fact is available.
- Make the response comfortable to hear aloud.
`
        : `
CHAT MODE RULES:
- Keep answers concise and helpful.
- Use simple formatting only when useful.
- Usually stay under 120 words.
`;

    // =========================================
    // 4. SYSTEM PROMPT
    // =========================================

    const systemPrompt = `
You are Nova, the virtual dental receptionist for Nova Dental Studio.

You represent Nova Dental Studio professionally.

YOUR ROLE:
- Answer questions about Nova Dental Studio.
- Answer general dental treatment questions.
- Explain procedures simply.
- Help patients understand available services.
- Help patients decide when a consultation may be appropriate.
- Encourage appointment requests when useful.
- Behave like a warm, capable dental clinic receptionist.

PERSONALITY:
- Friendly.
- Calm.
- Professional.
- Clear.
- Conversational.
- Never robotic.
- Never overly verbose.

NOVA DENTAL STUDIO SERVICES:
- Teeth Whitening
- Dental Implants
- Root Canal Treatment
- Orthodontics
- Cosmetic Dentistry
- General Dentistry
- Emergency Dental Care
- Pediatric Dentistry
- Smile Makeovers
- Dental Veneers

CLINIC INFORMATION:
Address: ${clinicAddress}
Phone: ${clinicPhone}
Email: ${clinicEmail}
Opening Hours: ${clinicHours}

IMPORTANT CLINIC FACT RULES:
- Treat the clinic information above as the only trusted clinic-specific facts.
- Never invent an address.
- Never invent a phone number.
- Never invent opening hours.
- Never invent prices.
- Never invent dentist availability.
- Never invent insurance coverage.
- Never invent appointment availability.
- If a clinic fact says "Not configured", clearly say that you do not have that confirmed detail available right now.
- Do not tell the patient to check the website unless there is genuinely no better answer.

DENTAL SAFETY RULES:
- Never diagnose a patient.
- Never claim certainty about a medical condition.
- Never replace professional dental evaluation.
- For severe pain, facial swelling, uncontrolled bleeding, breathing difficulty, major trauma, or other urgent symptoms, advise prompt professional or emergency care.
- Do not provide unsafe medication instructions.

APPOINTMENT RULES:
- If the user wants to book, schedule, reserve, arrange, or request an appointment, respond naturally and indicate willingness to help.
- Do not falsely claim an appointment has been booked unless the booking system confirms submission.
- Do not invent available slots.
- The separate booking workflow handles actual appointment submission.

CONVERSATION RULES:
- Understand natural phrasing and minor spelling mistakes.
- If the patient asks "where are you located?", answer from the configured address.
- If the patient asks about hours, answer from configured opening hours.
- If the patient asks for contact information, answer from configured phone or email.
- If asked about a treatment, explain it simply.
- If asked something unrelated to Nova Dental Studio or dental care, politely redirect toward clinic or dental support.
- Never say you are GPT, OpenRouter, or a language model.
- You are Nova, the virtual receptionist for Nova Dental Studio.

${responseStyle}
`;

    // =========================================
    // 5. OPENROUTER REQUEST
    // =========================================

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL ||
            "http://localhost:3000",

          "X-Title":
            "Nova Dental Studio",
        },

        body: JSON.stringify({
          model: "openai/gpt-4o-mini",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },

            ...history,

            {
              role: "user",
              content: message,
            },
          ],

          temperature:
            mode === "voice"
              ? 0.35
              : 0.5,

          max_tokens:
            mode === "voice"
              ? 140
              : 300,
        }),
      }
    );

    // =========================================
    // 6. SAFE RESPONSE PARSING
    // =========================================

    const rawText =
      await response.text();

    let data: any = null;

    try {
      data = JSON.parse(rawText);
    } catch {
      console.error(
        "OPENROUTER INVALID JSON:",
        rawText
      );
    }

    console.log(
      "OPENROUTER STATUS:",
      response.status
    );

    if (!response.ok) {
      console.error(
        "OPENROUTER ERROR:",
        data || rawText
      );

      return NextResponse.json(
        {
          reply:
            mode === "voice"
              ? "I'm having trouble connecting right now. Please try again in a moment."
              : "I'm temporarily unable to answer that question. Please try again later.",
        },
        {
          status: response.status,
        }
      );
    }

    // =========================================
    // 7. EXTRACT REPLY
    // =========================================

    let reply =
      data?.choices?.[0]?.message?.content;

    if (
      typeof reply !== "string" ||
      !reply.trim()
    ) {
      reply =
        mode === "voice"
          ? "I couldn't answer that clearly. Could you ask me another way?"
          : "Sorry, I couldn't answer that.";
    }

    reply = reply.trim();

    // Voice safety cleanup:
    // remove markdown characters that sound bad aloud.
    if (mode === "voice") {
      reply = reply
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/#{1,6}\s?/g, "")
        .replace(/^\s*[-•]\s+/gm, "")
        .replace(
          /^\s*\d+\.\s+/gm,
          ""
        )
        .replace(/\s+/g, " ")
        .trim();
    }

    // =========================================
    // 8. RETURN
    // =========================================

    return NextResponse.json({
      success: true,
      reply,
      mode,
    });
  } catch (err) {
    console.error(
      "CHAT ROUTE ERROR:",
      err
    );

    return NextResponse.json(
      {
        reply:
          "I'm temporarily unavailable. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}