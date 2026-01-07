import React from 'react';
import { UserProfile, UserID } from '../types';

interface LoginProps {
  users: Record<UserID, UserProfile>;
  onLogin: (userId: UserID) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white font-bold text-2xl mb-6 shadow-lg">
            DT
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DuoTOEIC Tracker</h1>
          <p className="text-gray-500">Welcome back! Please select your profile to continue.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {Object.values(users).map((user: UserProfile) => (
            <button
              key={user.id}
              onClick={() => onLogin(user.id)}
              className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-indigo-500 transition-all duration-200 flex flex-col items-center gap-4 text-center"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover group-hover:scale-105 transition-transform border-4 border-gray-50 group-hover:border-white shadow-sm"
                />
                <div 
                    className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                        user.color === '#6366f1' ? 'bg-blue-500' : 'bg-pink-500'
                    }`}
                ></div>
              </div>
              <div>
                <span className="block font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                    {user.name}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-gray-500">
                    {user.id === 'user1' ? 'Learner 1' : 'Learner 2'}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Goal: 990 TOEIC</p>
        </div>
      </div>
    </div>
  );
};

export default Login;