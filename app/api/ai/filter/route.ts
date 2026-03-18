import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

  const prompt = `
Convert the user request into filters for a complaint dashboard.

Return ONLY JSON.

Format:
{
  "status": "Pending | In Progress | Resolved | all",
  "priority": "Critical | High | Medium | Low | all",
  "category": "Infrastructure | Healthcare | Education | Safety | Utilities | Other | all"
}

User input:
"${query}"
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "phi3:mini",
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  const text = data.response;

  const clean = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      status: "all",
      priority: "all",
      category: "all",
    });
  }
}