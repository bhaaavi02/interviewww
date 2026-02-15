import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { question, answer } = await req.json();

  const { text } = await generateText({
    model: google("gemini-3-flash-preview"),
    prompt: `
      You are a professional interviewer.
      Question: ${question}
      Candidate Answer: ${answer}

      Give short feedback.
      Say if it is correct, partially correct, or weak.
      Keep response short and natural (voice conversation style).
    `,
  });

  return Response.json({ feedback: text });
}
