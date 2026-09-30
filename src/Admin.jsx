import React, { useState } from 'react';
import { supabase } from './supabase';

export default function Admin() {
  const [subject, setSubject] = useState('English');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [status, setStatus] = useState('');

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setStatus('Saving...');

    const { error } = await supabase.from('questions').insert([
      {
        subject,
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctOption,
        explanation,
      },
    ]);

    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus('Question added successfully!');
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setExplanation('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard - Add Questions</h2>
      {status && <p className="mb-4 text-sm text-blue-600 font-semibold">{status}</p>}

      <form onSubmit={handleAddQuestion} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded p-2 text-sm"
          >
            <option value="English">English</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Question Text</label>
          <textarea
            required
            rows="3"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            placeholder="Type the question here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Option A</label>
            <input
              type="text"
              required
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Option B</label>
            <input
              type="text"
              required
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Option C</label>
            <input
              type="text"
              required
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Option D</label>
            <input
              type="text"
              required
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Correct Option</label>
            <select
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Explanation (Optional)</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700"
        >
          Add Question
        </button>
      </form>
    </div>
  );
}