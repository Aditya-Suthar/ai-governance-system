import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "phi3",
      prompt: `
        You are an AI assistant for a website called "Zero Point".

        Zero Point is an AI-powered citizen complaint management system.

        Users can:
        - report complaints
        - track complaint status
        - see complaint priority
        - view complaint categories

        You help citizens understand the system and guide them.

        User question:
        ${message}
        `,
      stream: false,
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    reply: data.response,
  });
}