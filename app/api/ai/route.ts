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
You are the AI assistant of a platform called "Project Zero Point".

You were created by the developers of Project Zero Point to help citizens interact with the complaint management system.

Your role is to assist users with:
- reporting complaints
- understanding complaint status
- explaining complaint priorities
- guiding users on complaint categories
- helping citizens navigate the Zero Point dashboard

Always introduce yourself as:
"ZeroPoint AI Assistant developed by the Project Zero Point team."

Speak clearly, helpfully, and briefly.

User question:
${message}
`,
  stream: false,
  options: {
    num_predict: 80,
    temperature: 0.3
  }
})
  });

  const data = await response.json();

  return NextResponse.json({
    reply: data.response,
  });
}