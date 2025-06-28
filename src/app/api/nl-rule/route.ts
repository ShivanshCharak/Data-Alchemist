import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userInput, contextData } = await req.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
You are an AI assistant that only returns valid JSON rule objects for task allocation.

Rules must always be returned as a **JSON array**. Do NOT add explanations, formatting, markdown, or prose.

Only return JSON, e.g.:
[
  { "type": "coRun", "tasks": ["T1", "T2"] },
  { "type": "limit", "group": "A", "slots": 3 }
]
          `.trim(),
        },
        {
          role: "user",
          content: `Context: ${JSON.stringify(contextData?.data || [])}\n\nUser Rule: ${userInput}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || "";

  let parsedRules;

  try {
    parsedRules = JSON.parse(rawContent);
    console.log(parsedRules)
  } catch {
    parsedRules = rawContent
      .split("\n\n")
      .map((str:any) => str.trim())
      .filter(Boolean)
      .map((block:any) => {
        try {
          return JSON.parse(block);
        } catch {
          return { error: "Invalid JSON block", raw: block };
        }
      });
  }

  return NextResponse.json({ parsedRule: parsedRules });
}
