import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    const prompt = `
You are an AI used in a government complaint system.

Your tasks:
1. Classify complaint category
2. Assign priority
3. Detect spam probability (0 to 1)

Valid categories:
- Road
- Water
- Electricity
- Sanitation
- Other

Rules:
- Water leaks, pipes → Water
- Potholes, roads → Road
- Power cuts → Electricity
- Garbage → Sanitation
- Urgent issues → High priority
- Minor issues → Low priority
- Spam = ads, crypto, selling, promotion

Return ONLY JSON:

{
  "category": "...",
  "priority": "Low | Medium | High",
  "spamProbability": 0.0
}

Title: ${title}
Description: ${description}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi3",
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    let text = data.response || "";

    // clean markdown if exists
    text = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // fallback if AI gives bad JSON
      return NextResponse.json({
        category: "Other",
        priority: "Medium",
        spamProbability: 0.2,
      });
    }

    return NextResponse.json(parsed);

  } catch (error) {
    return NextResponse.json({
      category: "Other",
      priority: "Low",
      spamProbability: 0.5,
    });
  }
}