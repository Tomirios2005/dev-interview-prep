'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TECHNOLOGIES = ['Java', 'Spring Boot', 'SQL', 'React', 'Git', 'TypeScript'];
const DIFFICULTIES = ['Junior', 'Semi-senior'];

export default function Home() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function startSession() {
    if (!selectedTech || !selectedDiff) return;
    setLoading(true);

    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ technology: selectedTech, difficulty: selectedDiff })
    });

    const { sessionId } = await res.json();
    router.push(`/session?id=${sessionId}&tech=${selectedTech}&diff=${selectedDiff}`);
  }

  return (
    <main className="min-h-screen bg-white max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-medium mb-1">Dev Interview Prep</h1>
      <p className="text-gray-500 text-sm mb-8">Practicá preguntas técnicas reales con feedback de IA.</p>

      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Tecnología</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {TECHNOLOGIES.map(tech => (
          <button
            key={tech}
            onClick={() => setSelectedTech(tech)}
            className={`px-4 py-2 rounded-full text-sm border transition-all ${
              selectedTech === tech
                ? 'bg-violet-700 text-white border-violet-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Dificultad</p>
      <div className="flex gap-2 mb-10">
        {DIFFICULTIES.map(diff => (
          <button
            key={diff}
            onClick={() => setSelectedDiff(diff)}
            className={`px-4 py-2 rounded-full text-sm border transition-all ${
              selectedDiff === diff
                ? 'bg-violet-700 text-white border-violet-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={startSession}
          disabled={!selectedTech || !selectedDiff || loading}
          className="bg-violet-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-violet-800 transition-colors"
        >
          {loading ? 'Iniciando...' : 'Empezar sesión →'}
        </button>
        <button
          onClick={() => router.push('/history')}
          className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Historial
        </button>
      </div>
    </main>
  );
}