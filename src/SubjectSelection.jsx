import React, { useState } from 'react';

export default function SubjectSelection({ onStartTest }) {
  const subjects = ['Aptitude Test', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [timeLimit, setTimeLimit] = useState(10);

  const handleSubjectToggle = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleStart = () => {
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject!');
      return;
    }

    onStartTest({
      subjects: selectedSubjects,
      duration: timeLimit * 60,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Practice Exam Setup</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Subject(s)
          </label>
          <div className="border border-gray-300 rounded-md p-3 space-y-2 bg-gray-50 max-h-48 overflow-y-auto">
            {subjects.map((subj) => (
              <label key={subj} className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subj)}
                  onChange={() => handleSubjectToggle(subj)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-800 text-sm">{subj}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Limit (Minutes)
          </label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2"
            min="1"
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 transition"
        >
          Start Practice Exam
        </button>
      </div>
    </div>
  );
}