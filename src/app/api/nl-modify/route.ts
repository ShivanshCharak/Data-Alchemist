import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, data } = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
            role: "system",
            content: `
          You are an AI assistant that updates JSON data based on user instructions.
          
          Rules:
          - Always return valid JSON (an array of modified objects).
          - Use exact matching for fields like TaskID. Do not perform fuzzy or partial matching.
          - Preserve all fields unless the instruction changes them.
          - Only modify rows that exactly match the criteria.
          Return only the modified rows.
          
          Example:
          Input: Set duration to 5 for task with TaskID "T1"
          Output:
          [
            { "TaskID": "T1", "Duration": 5 }
          ]
          `.trim()
          },
          
        { role: "user", content: `Data: ${JSON.stringify(data)}\nInstruction: ${prompt}` },
      ],
    }),
  });

  let body = await res.json();
  body = body.choices?.[0]?.message?.content || "";
  const cleaned = body
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();


  try {
    const modified = await JSON.parse(cleaned);
    return NextResponse.json({ modifiedData: modified });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI output", raw: body });
  }
}