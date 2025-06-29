import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, data } = await req.json();

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
You are an assistant that converts natural language queries into JavaScript filter functions.


Respond with ONLY a valid JavaScript function like:
(data) => data.filter(item => /* your logic */)

Guidelines:
- Use property names exactly as seen in the sample.
- For arrays like skills or preferredPhases, use .includes(...)
- Use numeric comparisons (e.g. >, <, ===) as needed
- Do NOT include any explanation, markdown, or comments.
          `.trim(),
        },
        {
          role: "user",
          content: `Prompt: "${prompt}"\n\nSample item: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    }),
  });

  const resJson = await response.json();
  const code = resJson.choices?.[0]?.message?.content ?? "";
  try {
    const filterFn = eval(`(${code})`);
    const filteredData = filterFn(data);
    return NextResponse.json({ filteredData});
  } catch (e) {
    console.error("Error executing filter:", e);
    return NextResponse.json({ error: "Failed to evaluate filter logic", code }, { status: 500 });
  }
}
