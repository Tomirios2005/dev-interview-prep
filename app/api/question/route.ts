import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: Request) {
  const { sessionId, technology, difficulty, questionNumber } = await req.json();

  const prompt = `Sos un entrevistador técnico senior. Generá UNA sola pregunta de entrevista de ${technology} para un candidato ${difficulty}. 
La pregunta debe ser concreta, técnica y sin respuesta obvia.
Respondé SOLO con la pregunta, sin numeración, sin explicación, sin comillas.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
console.log('Anthropic response:', JSON.stringify(data, null, 2));

if (!data.content || !data.content[0]) {
  return NextResponse.json({ error: 'Anthropic error', detail: data }, { status: 500 });
}

const question = data.content[0].text.trim();

  const result = await sql`
    INSERT INTO questions (session_id, question)
    VALUES (${sessionId}, ${question})
    RETURNING id
  `;

  return NextResponse.json({ questionId: result[0].id, question });
}