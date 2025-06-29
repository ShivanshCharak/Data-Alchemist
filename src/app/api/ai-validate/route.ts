
import { NextResponse } from "next/server";
import { context } from "@/components/Context";

export async function POST(req: Request) {
  const {data } = await req.json();


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
          content: `You are an expert data validator. The user will give you JSON tabular data (array of objects). 
Your job is to find any data issues according to the context provided context: ${context}
Return a JSON array of validation issues. Do not gimme python output Do NOT fix or correct the data. Only return problems, each with rowIndex, field, and error explanation.`
        },
        {
          role: "user",
          content: `Validate this data:\n\n${JSON.stringify(data, null, 2)}`
        }
      ],
      temperature: 0.2
    }),
  });
  const result = await response.json();

  const content = result.choices?.[0]?.message?.content || "";

  const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();

  try {
    const parsed = JSON.parse(jsonString);
    console.log(parsed)
    return NextResponse.json({ hints: parsed });
  } catch (err) {
    console.error(" Failed to parse AI validator JSON:\n", err, content);
    return NextResponse.json({ error: "Failed to parse validator response",err, raw: content }, { status: 500 });
  }
}