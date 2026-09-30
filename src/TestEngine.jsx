import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Fisher-Yates array shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function TestEngine({ config, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(config?.duration || 600);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [config]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // 1. Fetch subject IDs mapping
      const { data: subjectsData } = await supabase.from('subjects').select('id, name');
      
      const selectedSubjects = config?.subjects || [];
      const subjectIds = subjectsData
        ?.filter((s) => selectedSubjects.includes(s.name))
        .map((s) => s.id) || [];

      let selectedQuestions = [];

      // 2. Fetch questions per selected subject & pick 10 random for each
      for (const subjId of subjectIds) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('subject_id', subjId);

        if (!error && data && data.length > 0) {
          const tenRandom = shuffleArray(data).slice(0, 10);
          selectedQuestions = [...selectedQuestions, ...tenRandom];
        }
      }

      setQuestions(selectedQuestions);
    } catch (err) {
      console.error('Error fetching test questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionLetter) => {
    setUserAnswers({ ...userAnswers, [currentIndex]: optionLetter });
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_option) {
        score++;
      }
    });

    onFinish({
      score,
      totalQuestions: questions.length,
      questions,
      userAnswers,
    });
  };

  if (loading) {
    return <div className="text-center p-8 font-semibold">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-red-500 font-medium mb-4">No questions found for selected subject(s).</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-600 text-white rounded">
          Back
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <span className="font-semibold text-gray-700">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="font-bold text-red-600">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-lg font-medium mb-4 text-gray-800">{currentQ.question_text}</h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {['A', 'B', 'C', 'D'].map((letter) => {
          const optionText = currentQ[`option_${letter.toLowerCase()}`];
          if (!optionText) return null;

          const isSelected = userAnswers[currentIndex] === letter;

          return (
            <label
              key={letter}
              onClick={() => handleOptionSelect(letter)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                isSelected ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`q-${currentIndex}`}
                checked={isSelected}
                onChange={() => {}}
                className="w-4 h-4 text-emerald-600"
              />
              <span className="font-bold text-gray-700">{letter}.</span>
              <span className="text-gray-800">{optionText}</span>
            </label>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded text-gray-600 disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
}