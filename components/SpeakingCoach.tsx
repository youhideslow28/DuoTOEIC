import React, { useState, useEffect, useRef } from 'react';
import { getSpeakingQuestion, checkSpeaking } from '../services/geminiService';
import { SpeakingFeedback } from '../types';

const SpeakingCoach: React.FC = () => {
  const [question, setQuestion] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  
  // Ref for speech recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
             setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };
    }
  }, []);

  const handleNewQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setTranscript('');
    const q = await getSpeakingQuestion();
    setQuestion(q);
    setLoading(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    if (!transcript || !question) return;
    setLoading(true);
    try {
      const result = await checkSpeaking(question, transcript);
      setFeedback(result);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🎤</span> AI Speaking Simulator
          </h2>

          {!question ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Practice TOEIC Part 2 & 3 questions.</p>
              <button 
                onClick={handleNewQuestion}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition shadow-lg"
              >
                {loading ? 'Generating...' : 'Start New Session'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs text-indigo-500 font-bold uppercase tracking-wide mb-2">Question</p>
                <p className="text-xl font-medium text-indigo-900">{question}</p>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-600">Your Answer (Transcript)</label>
                    {isRecording && <span className="text-red-500 text-xs animate-pulse font-bold">● Recording...</span>}
                 </div>
                 <textarea 
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                    placeholder="Press the mic button to record, or type your answer here..."
                 />
              </div>

              <div className="flex gap-3">
                 <button 
                    onClick={toggleRecording}
                    className={`flex-1 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all ${
                        isRecording ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                 >
                    {isRecording ? 'Stop Recording' : '🎤 Record Answer'}
                 </button>
                 <button 
                    onClick={handleSubmit}
                    disabled={loading || !transcript}
                    className="flex-1 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                 >
                    {loading ? 'Evaluating...' : 'Get Score'}
                 </button>
              </div>
            </div>
          )}
       </div>

       {feedback && (
         <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 animate-slide-up">
            <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-purple-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-purple-600 uppercase font-bold">Fluency</p>
                    <p className="text-3xl font-black text-purple-900">{feedback.fluencyScore}/10</p>
                </div>
                <div className="flex-1 bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-blue-600 uppercase font-bold">Relevance</p>
                    <p className="text-3xl font-black text-blue-900">{feedback.relevanceScore}/10</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-gray-800 mb-1">Feedback</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feedback.feedback}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-800 mb-1">Sample 10/10 Answer</h4>
                    <p className="text-green-700 text-sm italic">"{feedback.sampleAnswer}"</p>
                </div>
                <button 
                  onClick={handleNewQuestion}
                  className="w-full py-2 mt-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition"
                >
                  Try Another Question &rarr;
                </button>
            </div>
         </div>
       )}
    </div>
  );
};

export default SpeakingCoach;
