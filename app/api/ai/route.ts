import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Complaint } from "@/lib/models/Complaint";

export async function POST(req: Request) {

  const { message } = await req.json()
  const text = message.toLowerCase()

  // 🔥 HOTSPOT DETECTION
  if (text.includes("hotspot")) {

    await connectDB()

    const hotspots = await Complaint.aggregate([
      {
        $group: {
          _id: "$district",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    let reply = "🔥 Most affected areas:\n\n"

    hotspots.forEach((h, i) => {
      reply += `${i + 1}. ${h._id} — ${h.count} complaints\n`
    })

    return NextResponse.json({ reply })
  }

  // 🛠️ UNRESOLVED COMPLAINTS
  if (text.includes("unresolved")) {

    await connectDB()

    const complaints = await Complaint.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .limit(5)

    let reply = "🛠️ Latest unresolved complaints:\n\n"

    complaints.forEach((c, i) => {
      reply += `${i + 1}. ${c.title} — ${c.district}\n`
    })

    return NextResponse.json({ reply })
  }

  // 🤖 NORMAL AI RESPONSE
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