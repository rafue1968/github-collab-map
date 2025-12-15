


export async function POST(req) {
  const { user, others } = await req.json();

  const prompt = `
Given this user:
${JSON.stringify(user)}

and these potential collaborators:
${JSON.stringify(others)}

Rank the top 5 collaborators by shared skills, languages, and proximity.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return Response.json(JSON.parse(completion.choices[0].message.content));
}
