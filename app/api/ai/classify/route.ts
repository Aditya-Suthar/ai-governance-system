import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/lib/models/Complaint";

export async function POST(req: Request) {
  const { title, description } = await req.json();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi3",
      prompt: `
You are an AI used by a government complaint management system.

Your task is to classify citizen complaints and detect spam.

A VALID complaint is related to:
- roads
- water supply
- electricity
- sanitation
- healthcare
- public safety
- public infrastructure

A complaint is SPAM if it contains:
- crypto
- bitcoin
- trading
- investment
- advertisement
- promotion
- selling products
- personal business
- unrelated topics

Title: ${title}
Description: ${description}

Return ONLY JSON:

{
  "category": "Roads | Water | Electricity | Healthcare | Sanitation | Safety | Other",
  "categoryConfidence": 0-100,
  "priority": "Low | Medium | High | Critical",
  "priorityConfidence": 0-100,
  "spamProbability": 0-100
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
  return NextResponse.json({
    result: {
      category: "Unknown",
      categoryConfidence: 0,
      priority: "Low",
      priorityConfidence: 0,
      spamProbability: 0,
      relatedComplaints: []
    }
  });
}
  let parsed;

try {
  parsed = JSON.parse(match[0]);
} catch {
  parsed = {
    category: "Unknown",
    categoryConfidence: 0,
    priority: "Low",
    priorityConfidence: 0,
    spamProbability: 0,
  };
}

await connectDB();

// find related complaints using category
const related = await Complaint.find({
  category: parsed.category
})
.sort({ createdAt: -1 })
.limit(2)
.select("title");

const relatedComplaints = related.map((c) => c.title);

return NextResponse.json({
  result: {
    ...parsed,
    relatedComplaints
  }
});
}