import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/lib/models/Complaint";

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:mini",
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
  "categoryConfidence": 0,
  "priority": "Low | Medium | High | Critical",
  "priorityConfidence": 0,
  "spamProbability": 0
}
`,
        stream: false,
      }),
    });

    const data = await response.json();

    // ✅ safe fallback
    const text: string = data?.response || "";

    const match = text.match(/\{[\s\S]*\}/);

    let parsed: {
      category: string;
      categoryConfidence: number;
      priority: string;
      priorityConfidence: number;
      spamProbability: number;
    };

    if (!match) {
      parsed = {
        category: "Unknown",
        categoryConfidence: 0,
        priority: "Low",
        priorityConfidence: 0,
        spamProbability: 0,
      };
    } else {
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
    }

    await connectDB();

    const related = await Complaint.find({
      category: parsed.category,
    })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title");

    const relatedComplaints = related.map((c) => c.title);

    return NextResponse.json({
      result: {
        ...parsed,
        relatedComplaints,
      },
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    return NextResponse.json({
      result: {
        category: "Unknown",
        categoryConfidence: 0,
        priority: "Low",
        priorityConfidence: 0,
        spamProbability: 0,
        relatedComplaints: [],
      },
    });
  }
}