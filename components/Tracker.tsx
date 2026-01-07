import React, { useState } from 'react';
import { SkillType, UserID, StudyLog } from '../types';

interface TrackerProps {
  currentUserId: UserID;
  onAddLog: (log: StudyLog) => void;
}

const Tracker: React.FC<TrackerProps> = ({ currentUserId, onAddLog }) => {
  const [skill, setSkill] = useState<SkillType>(SkillType.LISTENING);
  const [minutes, setMinutes] = useState(30);
  const [score, setScore] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: StudyLog = {
      id: Date.now().toString(),
      userId: currentUserId,
      date,
      skill,
      durationMinutes: minutes,
      score: score ? parseInt(score) : undefined,
    };
    onAddLog(newLog);
    // Reset slightly
    setMinutes(30);
    setScore('');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Log Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
            <select 
              value={skill}
              onChange={(e) => setSkill(e.target.value as SkillType)}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 transition bg-white"
            >
              {Object.values(SkillType).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
            <input 
              type="number" 
              min="5"
              step="5"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mock Test Score (Opt)</label>
            <input 
              type="number" 
              min="0"
              max="990"
              placeholder="e.g. 750"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition transform active:scale-95"
        >
          Save Log
        </button>
      </form>
    </div>
  );
};

export default Tracker;
