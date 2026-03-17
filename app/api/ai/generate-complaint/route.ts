import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

   const prompt = `
You are a JSON generator.

Convert user input into STRICT JSON.

RULES:
- Return ONLY valid JSON
- No explanation
- No extra text
- No comments
- No sentences outside JSON

Format:
{
  "title": "...",
  "description": "...",
  "category": "Road | Water | Electricity | Sanitation | Other",
  "state": "...",
  "district": "...",
  "ward": "..."
}

Input:
"${message}"
`

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi3",
        prompt: prompt,
        stream: false,
      }),
    })

    const data = await response.json()

    const text = data.response
const clean = text.replace(/```json|```/g, "").trim()

let parsed;

try {
  parsed = JSON.parse(clean);
} catch (err) {
  console.log("RAW AI OUTPUT:", text);

  // 🔥 extract valid JSON part
  const match = clean.match(/\{[\s\S]*?\}/)

  if (match) {
    try {
      parsed = JSON.parse(match[0])
    } catch {
      parsed = {
        title: "",
        description: clean,
        category: "Other",
        state: "",
        district: "",
        ward: ""
      }
    }
  } else {
    parsed = {
      title: "",
      description: clean,
      category: "Other",
      state: "",
      district: "",
      ward: ""
    }
  }
}
    return NextResponse.json(parsed)

  } catch (err: any) {
    console.error("SERVER ERROR:", err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}