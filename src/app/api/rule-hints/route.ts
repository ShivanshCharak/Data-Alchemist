
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { clients, workers, tasks } = body;

  const prompt = `Based on the following task allocation data:\nClients: ${JSON.stringify(clients)}\nWorkers: ${JSON.stringify(workers)}\nTasks: ${JSON.stringify(tasks)}\n\nSuggest useful JSON rules such as coRun, load limits, or phase window constraints.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        { role: "system", content: "You only output useful task rules in JSON. No markdown or commentary." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";

  const clean = raw.replace(/```json|```/g, "").trim();

  try {
      const suggestions = await JSON.parse(clean);
      console.log("suggestions",suggestions)
    return NextResponse.json({ rules: Array.isArray(suggestions) ? suggestions : [suggestions] });
  } catch {
    return NextResponse.json({ rules: [], error: "Invalid JSON from AI", raw: data });
  }
}
