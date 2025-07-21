import { summarizeWithGemini } from "@/app/lib/gemini";
import { postNoteToZendesk } from "@/app/lib/zendesk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, entityId } = await req.json();

    console.log("Incoming request:", text, entityId);

    if (!text || !entityId) {
      return NextResponse.json(
        { error: "Missing text or entityId" },
        { status: 400 }
      );
    }

    const summary = await summarizeWithGemini(text);

    // 1. Send to Zapier Webhook
    const zapierWebhookUrl =
      "https://hooks.zapier.com/hooks/catch/20553993/u2x25bc/";

    const zapierRes = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: text, // This is the user's original question
        summary, // Gemini-generated summary
        entityId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!zapierRes.ok) {
      return NextResponse.json(
        { error: "Zapier Webhook failed" },
        { status: 502 }
      );
    }


    return NextResponse.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request with { text, entityId }",
  });
}
