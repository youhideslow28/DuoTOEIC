import React, { useState, useEffect } from 'react';
import { UserID, UserProfile, StudyLog, SkillType, WeeklyPlan } from './types';
import Dashboard from './components/Dashboard';
import WritingCoach from './components/WritingCoach';
import SpeakingCoach from './components/SpeakingCoach';
import Tracker from './components/Tracker';
import Login from './components/Login';
import WeeklyPlanner from './components/WeeklyPlanner';
import { generateDailyTopic } from './services/geminiService';

const USERS: Record<UserID, UserProfile> = {
  user1: { 
    id: 'user1', 
    name: 'Nguyen', 
    avatar: 'https://ui-avatars.com/api/?name=Nguyen&background=6366f1&color=fff&size=128', 
    color: '#6366f1' // Indigo
  },
  user2: { 
    id: 'user2', 
    name: 'Huyen', 
    avatar: 'https://ui-avatars.com/api/?name=Huyen&background=ec4899&color=fff&size=128', 
    color: '#ec4899' // Pink
  },
};

// Seed Data
const INITIAL_LOGS: StudyLog[] = [
  { id: '1', userId: 'user1', date: '2023-10-25', skill: SkillType.LISTENING, durationMinutes: 60, score: 650 },
  { id: '2', userId: 'user2', date: '2023-10-25', skill: SkillType.READING, durationMinutes: 45 },
  { id: '3', userId: 'user1', date: '2023-10-26', skill: SkillType.SPEAKING, durationMinutes: 30 },
  { id: '4', userId: 'user2', date: '2023-10-26', skill: SkillType.WRITING, durationMinutes: 45 },
  { id: '5', userId: 'user1', date: '2023-10-27', skill: SkillType.READING, durationMinutes: 90, score: 700 },
];

const INITIAL_PLAN: WeeklyPlan = {
    id: 'week-1',
    weekStart: new Date().toISOString(),
    penalty: 'Buy Milk Tea 🧋',
    tasks: {
        user1: [
            { id: '101', text: 'Learn 20 Vocab words', isCompleted: false, isVerified: false },
            { id: '102', text: 'Do 1 Listening Test', isCompleted: true, isVerified: false },
        ],
        user2: [
            { id: '201', text: 'Write 1 Email', isCompleted: false, isVerified: false },
        ]
    }
}

enum Tab {
  DASHBOARD = 'Dashboard',
  PLANNER = 'Battle Plan',
  TRACKER = 'Tracker',
  WRITING = 'Writing',
  SPEAKING = 'Speaking',
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserID | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [logs, setLogs] = useState<StudyLog[]>(INITIAL_LOGS);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(INITIAL_PLAN);
  const [dailyTopic, setDailyTopic] = useState<string>('Loading...');

  useEffect(() => {
    generateDailyTopic().then(setDailyTopic);
  }, []);

  const handleAddLog = (log: StudyLog) => {
    setLogs([...logs, log]);
    alert("Activity Saved!");
    setActiveTab(Tab.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab(Tab.DASHBOARD);
  };

  if (!currentUser) {
    return <Login users={USERS} onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      
      {/* Mobile Header / Sidebar on Desktop */}
      <aside className="bg-white border-r border-gray-200 md:w-64 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between md:justify-start gap-3">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">DT</div>
           <h1 className="font-bold text-xl tracking-tight">DuoTOEIC</h1>
        </div>

        {/* User Profile / Logout */}
        <div className="p-4">
          <div className="bg-gray-100 p-3 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-3">
                <img src={USERS[currentUser].avatar} className="w-8 h-8 rounded-full" alt={USERS[currentUser].name}/>
                <div>
                    <p className="text-sm font-bold text-gray-900">{USERS[currentUser].name}</p>
                    <p className="text-xs text-gray-500">Online</p>
                </div>
             </div>
             <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
             </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto md:overflow-visible flex flex-row md:flex-col gap-1 md:gap-0 overflow-x-auto">
          {Object.values(Tab).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium flex-shrink-0 md:flex-shrink ${
                activeTab === tab 
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === Tab.PLANNER ? '⚔️ ' + tab : tab}
            </button>
          ))}
        </nav>

        {/* Daily Topic Widget */}
        <div className="p-4 mt-auto hidden md:block">
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
              <p className="text-xs font-medium opacity-80 uppercase mb-1">Topic of the Day</p>
              <p className="font-bold text-lg leading-tight">"{dailyTopic}"</p>
              <div className="mt-3 text-xs opacity-90">Discuss this with {currentUser === 'user1' ? USERS.user2.name : USERS.user1.name}!</div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{activeTab}</h2>
              <p className="text-gray-500 text-sm">Let's practice some English, {USERS[currentUser].name}!</p>
            </div>
            <div className="md:hidden block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
               Topic: {dailyTopic}
            </div>
        </header>

        {activeTab === Tab.DASHBOARD && <Dashboard logs={logs} users={USERS} />}
        {activeTab === Tab.PLANNER && (
            <WeeklyPlanner 
                currentUser={currentUser} 
                users={USERS} 
                plan={weeklyPlan} 
                onUpdatePlan={setWeeklyPlan} 
            />
        )}
        {activeTab === Tab.WRITING && <WritingCoach />}
        {activeTab === Tab.SPEAKING && <SpeakingCoach />}
        {activeTab === Tab.TRACKER && <Tracker currentUserId={currentUser} onAddLog={handleAddLog} />}
      </main>
    </div>
  );
};

export default App;
