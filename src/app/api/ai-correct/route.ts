import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { data, context} = await req.json();
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
          content:
            "You are an expert in data quality. make the correction according to the data i provide you with the key context and data find the errors and return the output like which field of which sheet has error and what is it no json data just the reason for every sheets and every field present for clients workers and tasks and include any aditioon object keys u get in detail and think as far as you can that theres no need to ask for u want u want to asks ",
        },
        {
          role: "user",
          content: `client: ${JSON.stringify(data.clients)} workers: ${JSON.stringify(data.workers)} tasks:${JSON.stringify(data.tasks)} this is the context:${context}`,
        },
      ],
    //   temperature: 0.2,
    }),
  });
  const result = await response.json();
  const message = result?.choices?.[0]?.message?.content?.trim();

  if (!message) {
    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  }


  try {

    return NextResponse.json({ correctedData: message });
  } catch (err) {
    console.error("❌ Failed to parse corrected data:", message,err);
    return NextResponse.json(
      { error: "Failed to parse JSON from AI response", err, raw: message },
      { status: 500 }
    );
  }
}
