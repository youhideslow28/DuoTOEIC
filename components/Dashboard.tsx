import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { StudyLog, UserProfile, UserID } from '../types';

interface DashboardProps {
  logs: StudyLog[];
  users: Record<UserID, UserProfile>;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, users }) => {
  // Aggregate data for charts
  const skillData = [
    { name: 'Listening', user1: 0, user2: 0 },
    { name: 'Reading', user1: 0, user2: 0 },
    { name: 'Speaking', user1: 0, user2: 0 },
    { name: 'Writing', user1: 0, user2: 0 },
  ];

  logs.forEach(log => {
    const skillIndex = skillData.findIndex(s => s.name === log.skill);
    if (skillIndex !== -1) {
      if (log.userId === 'user1') skillData[skillIndex].user1 += log.durationMinutes / 60;
      else skillData[skillIndex].user2 += log.durationMinutes / 60;
    }
  });

  const mockTestLogs = logs.filter(l => l.score !== undefined).slice(-5);
  const scoreData = mockTestLogs.map((log, index) => ({
    name: `Test ${index + 1}`,
    score: log.score,
    user: users[log.userId].name,
    color: users[log.userId].color
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Hours Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Study Hours</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="user1" name={users.user1.name} fill={users.user1.color} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="user2" name={users.user2.name} fill={users.user2.color} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Mock Scores */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Scores</h3>
          <div className="h-64 w-full flex items-center justify-center text-gray-400">
             {scoreData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                         <XAxis dataKey="name"  axisLine={false} tickLine={false} />
                         <YAxis domain={[0, 990]}  axisLine={false} tickLine={false} />
                         <Tooltip />
                         <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
             ) : (
                 <div className="text-center">
                     <p>No mock test scores recorded yet.</p>
                     <p className="text-sm">Log a score in the Tracker tab.</p>
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-sm text-indigo-600 font-medium">Top Performer (This Week)</p>
            <p className="text-2xl font-bold text-indigo-900 mt-1">{users.user1.name}</p>
         </div>
         <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Daily Streak</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">4 Days 🔥</p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
