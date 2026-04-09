import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: Request) {
    try {
  const { technology, difficulty } = await req.json();

  const result = await sql`
    INSERT INTO sessions (technology, difficulty)
    VALUES (${technology}, ${difficulty})
    RETURNING id
  `;

  return NextResponse.json({ sessionId: result[0].id });
    } catch (error) {
        console.error('Error completo:', JSON.stringify(error, null, 2));
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}