import React from 'react';

export default function ResultReview({ result, onRestart }) {
  if (!result) return null;

  const percentage = Math.round((result.score / (result.total || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-2">Exam Results</h2>
        <p className="text-gray-600 mb-4">{result.subject}</p>

        <div className="text-4xl font-extrabold text-emerald-600 mb-2">
          {result.score} / {result.total}
        </div>
        <p className="text-gray-700 font-semibold mb-6">Percentage: {percentage}%</p>

        <button
          onClick={onRestart}
          className="bg-emerald-600 text-white px-6 py-2 rounded font-bold hover:bg-emerald-700"
        >
          Take Another Practice Test
        </button>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Question Breakdown</h3>

        {result.questions.map((q, idx) => {
          const userAns = result.userAnswers[idx];
          const isCorrect = userAns === q.correct_option;

          return (
            <div key={q.id || idx} className="p-4 border rounded space-y-2">
              <p className="font-semibold text-gray-800">
                {idx + 1}. {q.question_text}
              </p>
              <div className="text-sm">
                <p>
                  Your Answer:{' '}
                  <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    Option {userAns || 'Not Answered'}
                  </span>
                </p>
                <p className="text-green-700 font-semibold">Correct Answer: Option {q.correct_option}</p>
              </div>
              {q.explanation && (
                <p className="text-xs bg-gray-50 p-2 rounded text-gray-600">
                  <span className="font-bold">Explanation:</span> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}