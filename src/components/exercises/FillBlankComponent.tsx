// src/components/exercises/FillBlankComponent.tsx
import { useState } from 'react';
import type {FillBlankExercise} from "../../models/types.ts";

interface Props {
  exercise: FillBlankExercise;
  onSubmit: (isCorrect: boolean, answer?: string) => void;
}

export default function FillBlankComponent({ exercise, onSubmit }: Props) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const checkAnswer = () => {
    const userAnswer = exercise.caseSensitive ? answer : answer.toLowerCase();
    const isCorrect = exercise.correctAnswers.some(correct => {
      const correctAnswer = exercise.caseSensitive ? correct : correct.toLowerCase();
      return userAnswer.trim() === correctAnswer.trim();
    });

    setSubmitted(true);
    onSubmit(isCorrect, answer);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{exercise.question}</h3>

      {exercise.hint && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">💡 Hint: {exercise.hint}</span>
        </div>
      )}

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
        placeholder="Type je antwoord..."
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none disabled:bg-gray-100"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && answer && !submitted) {
            checkAnswer();
          }
        }}
      />

      <button
        onClick={checkAnswer}
        disabled={!answer || submitted}
        className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Controleer
      </button>
    </div>
  );
}