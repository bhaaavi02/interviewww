import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const conversation = messages
    .map((m: any) => `${m.role}: ${m.content}`)
    .join("\n");

  const systemPrompt = `
You are a professional job interviewer conducting a real voice interview.

Rules:
- Ask one question at a time
- Wait for user response
- Ask follow-up questions
- Be natural
- Be professional
- Keep responses short
`;

  const { text } = await generateText({
    model: google("gemini-3-flash-preview"),

    system: systemPrompt,

    prompt: conversation || "Start interview",
  });

  return Response.json({
    message: text,
  });
}
