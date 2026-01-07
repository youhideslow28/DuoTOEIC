import React, { useState } from 'react';
import { checkWriting } from '../services/geminiService';
import { WritingFeedback } from '../types';

const WritingCoach: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  const handleAnalyze = async () => {
    if (!text || !topic) return;
    setLoading(true);
    setFeedback(null);
    try {
      const result = await checkWriting(text, topic);
      setFeedback(result);
    } catch (e) {
      alert("Failed to analyze writing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>✍️</span> AI Writing Coach
        </h2>
        <p className="text-gray-600 mb-6">Submit an email or essay. The AI examiner will grade it and fix your mistakes.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Question</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Write an email to reschedule a meeting..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
            <textarea
              className="w-full h-48 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
              placeholder="Dear Mr. Smith..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !text || !topic}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading || !text ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            {loading ? 'Analyzing...' : 'Analyze My Writing'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Feedback Report</h3>
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full font-bold">
              Score: {feedback.estimatedScore}/200
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-2">Examiner Critique</h4>
                  <p className="text-red-700 text-sm leading-relaxed">{feedback.critique}</p>
               </div>
               
               <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <h4 className="font-semibold text-yellow-800 mb-2">Vocabulary Upgrades</h4>
                  <ul className="list-disc list-inside text-yellow-800 text-sm">
                    {feedback.betterVocab.map((word, i) => (
                      <li key={i}>{word}</li>
                    ))}
                  </ul>
               </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Corrected Version</h4>
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                {feedback.correctedText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingCoach;
