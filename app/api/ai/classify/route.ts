import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, description } = await req.json();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi3",
      prompt: `
Return ONLY JSON. No explanation.

Classify this civic complaint.

Title: ${title}
Description: ${description}

JSON format:
{
  "category": "Roads | Water | Electricity | Healthcare | Sanitation | Safety",
  "priority": "Low | Medium | High | Critical"
}
`,
      stream: false,
    }),
  });

  const data = await response.json();

  // try to extract JSON safely
  const text = data.response;
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    return NextResponse.json({ result: { category: "Unknown", priority: "Low" } });
  }

  const parsed = JSON.parse(match[0]);

  return NextResponse.json({ result: parsed });
}