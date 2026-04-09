'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
  id: number;
  technology: string;
  difficulty: string;
  score_avg: number | null;
  question_count: number;
  created_at: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => { setSessions(data.sessions); setLoading(false); });
  }, []);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'hoy';
    if (days === 1) return 'ayer';
    return `hace ${days} días`;
  }

  function scoreColor(score: number | null) {
    if (!score) return 'bg-gray-100 text-gray-500';
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  }

  return (
    <main className="min-h-screen bg-white max-w-xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium">Historial</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-800 transition-colors"
        >
          Nueva sesión →
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm mb-4">Todavía no hiciste ninguna sesión.</p>
          <button onClick={() => router.push('/')} className="text-violet-700 text-sm font-medium">
            Empezar ahora →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map(session => (
            <div key={session.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${scoreColor(session.score_avg)}`}>
                {session.score_avg ? Number(session.score_avg).toFixed(1) : '—'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full font-medium">
                    {session.technology}
                  </span>
                  <span className="text-xs text-gray-400">{session.difficulty} · {session.question_count} preguntas</span>
                </div>
                <p className="text-xs text-gray-400">{timeAgo(session.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}