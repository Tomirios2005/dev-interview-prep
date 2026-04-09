import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  const sessions = await sql`
    SELECT id, technology, difficulty, score_avg, question_count, created_at
    FROM sessions
    ORDER BY created_at DESC
    LIMIT 20
  `;

  return NextResponse.json({ sessions });
}