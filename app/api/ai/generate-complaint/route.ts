import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

   const prompt = `
You are a strict JSON generator.

Return ONLY valid JSON. No explanation.

Rules:
- Use double quotes ONLY
- No extra fields
- No text outside JSON
- Do NOT add comments
- Do NOT add sentences
- Do NOT write "to be filled"
- Always generate realistic Indian location

Format:
{
  "title": "...",
  "description": "...",
  "category": "Road | Water | Electricity | Sanitation | Other",
  "state": "Haryana",
  "district": "Kurukshetra",
  "ward": "..."
}

Input:
"${message}"
`;

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

let parsed: any;

try {
  parsed = JSON.parse(clean)

  // 🔥 FIX DOUBLE JSON (MAIN BUG)
  if (typeof parsed.description === "string" && parsed.description.includes("{")) {
    try {
      const inner = JSON.parse(parsed.description)
      parsed = inner
    } catch {}
  }

} catch (err) {
  console.log("AI PARSE FAILED:", clean)

  parsed = {
  title: clean.match(/"title":\s*"([^"]+)"/)?.[1] || "",
  description: clean.match(/"description":\s*"([^"]+)"/)?.[1] || "",
  category: clean.match(/"category":\s*"([^"]+)"/)?.[1] || "Other",
  state: clean.match(/"state":\s*"([^"]+)"/)?.[1] || "",
  district: clean.match(/"district":\s*"([^"]+)"/)?.[1] || "",
  ward: clean.match(/"ward":\s*"([^"]+)"/)?.[1] || "",
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