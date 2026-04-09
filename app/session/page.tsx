'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const TOTAL_QUESTIONS = 5;

interface FeedbackData {
  score: number;
  feedback: string;
}

function SessionContent() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('id');
  const tech = params.get('tech');
  const diff = params.get('diff');

  const [questionId, setQuestionId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [currentQ, setCurrentQ] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => { loadQuestion(); }, []);

  async function loadQuestion() {
    setLoading(true);
    setFeedback(null);
    setAnswer('');

    const res = await fetch('/api/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, technology: tech, difficulty: diff, questionNumber: currentQ })
    });

    const data = await res.json();
    setQuestionId(data.questionId);
    setQuestion(data.question);
    setLoading(false);
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setSubmitting(true);

    const res = await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, sessionId, question, answer, technology: tech })
    });

    const data = await res.json();
    setFeedback(data);
    setScores(prev => [...prev, data.score]);
    setSubmitting(false);
  }

  function nextQuestion() {
    if (currentQ >= TOTAL_QUESTIONS) {
      router.push('/history');
      return;
    }
    setCurrentQ(prev => prev + 1);
    loadQuestion();
  }

  const scoreColor = (s: number) =>
    s >= 8 ? 'bg-green-100 text-green-800' : s >= 6 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';

  const avgScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : null;

  return (
    <main className="min-h-screen bg-white max-w-xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium bg-violet-100 text-violet-800 px-3 py-1 rounded-full">
          {tech} · {diff}
        </span>
        <span className="text-xs text-gray-400">Pregunta {currentQ} de {TOTAL_QUESTIONS}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1 mb-8">
        <div
          className="bg-violet-700 h-1 rounded-full transition-all duration-500"
          style={{ width: `${((currentQ - 1) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-violet-700 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-sm text-gray-400">Claude está generando una pregunta...</p>
        </div>
      ) : (
        <>
          <div className="border border-gray-100 rounded-xl p-5 mb-6">
            <p className="text-xs text-gray-400 mb-2">Pregunta</p>
            <p className="text-base leading-relaxed">{question}</p>
          </div>

          {!feedback ? (
            <>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Escribí tu respuesta acá..."
                className="w-full border border-gray-200 rounded-xl p-4 text-sm min-h-32 resize-none focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || submitting}
                  className="bg-violet-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-violet-800 transition-colors"
                >
                  {submitting ? 'Evaluando...' : 'Enviar respuesta'}
                </button>
                <button
                  onClick={nextQuestion}
                  className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Saltar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium ${scoreColor(feedback.score)}`}>
                  {feedback.score}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Puntaje</p>
                  <p className="text-2xl font-medium">{feedback.score} / 10</p>
                </div>
                {avgScore && (
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400">Promedio</p>
                    <p className="text-lg font-medium text-gray-700">{avgScore}</p>
                  </div>
                )}
              </div>

              <div className="border-l-2 border-violet-300 pl-4 py-1 text-sm text-gray-600 leading-relaxed mb-6">
                {feedback.feedback}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={nextQuestion}
                  className="bg-violet-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-800 transition-colors"
                >
                  {currentQ >= TOTAL_QUESTIONS ? 'Ver historial →' : 'Siguiente pregunta →'}
                </button>
                <button
                  onClick={() => router.push('/history')}
                  className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Terminar
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionContent />
    </Suspense>
  );
}