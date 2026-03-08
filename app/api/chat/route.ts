import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an assistant for Project Zero Point." },
      { role: "user", content: message }
    ]
  });

  return Response.json({
    reply: completion.choices[0].message.content
  });
}