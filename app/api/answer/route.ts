import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { questionId, sessionId, question, answer, technology } = await req.json();

    const prompt = `Sos un entrevistador técnico evaluando una respuesta de entrevista de ${technology}.

Pregunta: ${question}
Respuesta del candidato: ${answer}

Evaluá la respuesta y respondé SOLO con un JSON así, sin markdown ni texto extra:
{"score": 7, "feedback": "Tu feedback acá en español, 2-3 oraciones explicando qué estuvo bien y qué mejorar."}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const raw = data.content[0].text.trim().replace(/```json|```/g, '').trim();
    const { score, feedback } = JSON.parse(raw);

    await sql`
      UPDATE questions SET answer = ${answer}, score = ${score}, feedback = ${feedback}
      WHERE id = ${questionId}
    `;

    await sql`
      UPDATE sessions SET
        score_avg = (SELECT AVG(score) FROM questions WHERE session_id = ${sessionId} AND score IS NOT NULL),
        question_count = (SELECT COUNT(*) FROM questions WHERE session_id = ${sessionId})
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ score, feedback });
  } catch (error) {
    console.error('Error en /api/answer:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}