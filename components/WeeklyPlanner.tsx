import React, { useState } from 'react';
import { UserID, UserProfile, WeeklyPlan, Task } from '../types';

interface WeeklyPlannerProps {
  currentUser: UserID;
  users: Record<UserID, UserProfile>;
  plan: WeeklyPlan;
  onUpdatePlan: (plan: WeeklyPlan) => void;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ currentUser, users, plan, onUpdatePlan }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [penaltyInput, setPenaltyInput] = useState(plan.penalty);
  const [isEditingPenalty, setIsEditingPenalty] = useState(false);

  // Helper to save penalty
  const savePenalty = () => {
    onUpdatePlan({ ...plan, penalty: penaltyInput });
    setIsEditingPenalty(false);
  };

  // Add Task
  const addTask = (userId: UserID) => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      isCompleted: false,
      isVerified: false,
    };
    
    const updatedTasks = {
        ...plan.tasks,
        [userId]: [...(plan.tasks[userId] || []), newTask]
    };

    onUpdatePlan({ ...plan, tasks: updatedTasks });
    setNewTaskText('');
  };

  // Toggle Completion (Self)
  const toggleComplete = (userId: UserID, taskId: string) => {
    if (userId !== currentUser) return; // Can only mark own tasks as done

    const updatedUserTasks = plan.tasks[userId].map(t => 
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted, isVerified: false } : t
    );

    onUpdatePlan({
      ...plan,
      tasks: { ...plan.tasks, [userId]: updatedUserTasks }
    });
  };

  // Toggle Verification (Partner)
  const toggleVerify = (taskOwnerId: UserID, taskId: string) => {
    if (currentUser === taskOwnerId) return; // Cannot verify own tasks

    const updatedUserTasks = plan.tasks[taskOwnerId].map(t => 
      t.id === taskId ? { ...t, isVerified: !t.isVerified } : t
    );

    onUpdatePlan({
      ...plan,
      tasks: { ...plan.tasks, [taskOwnerId]: updatedUserTasks }
    });
  };

  // Delete Task
  const deleteTask = (userId: UserID, taskId: string) => {
      const updatedUserTasks = plan.tasks[userId].filter(t => t.id !== taskId);
      onUpdatePlan({
          ...plan,
          tasks: { ...plan.tasks, [userId]: updatedUserTasks }
      });
  }

  const renderTaskColumn = (targetUserId: UserID) => {
    const isOwner = currentUser === targetUserId;
    const tasks = plan.tasks[targetUserId] || [];
    const user = users[targetUserId];
    
    // Calculate progress based on VERIFIED tasks
    const completedCount = tasks.filter(t => t.isVerified).length;
    const totalCount = tasks.length;
    const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
    const isFail = totalCount > 0 && completedCount < totalCount;

    return (
      <div className={`flex-1 bg-white rounded-2xl border-2 overflow-hidden flex flex-col ${isOwner ? 'border-indigo-100 shadow-md' : 'border-gray-100 opacity-90'}`}>
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={user.name} />
             <div>
                 <h3 className="font-bold text-gray-800">{user.name}'s Goals</h3>
                 <p className="text-xs text-gray-500">{completedCount}/{totalCount} Verified</p>
             </div>
          </div>
          <div className="text-right">
             {isFail && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Potential Penalty!</span>}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 w-full">
            <div 
                className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : user.color === '#6366f1' ? 'bg-indigo-500' : 'bg-pink-500'}`} 
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        {/* Task List */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {tasks.length === 0 && (
            <p className="text-center text-gray-400 text-sm italic py-4">No goals set yet.</p>
          )}
          {tasks.map(task => (
            <div key={task.id} className={`p-3 rounded-xl border transition-all ${
                task.isVerified 
                    ? 'bg-green-50 border-green-200 opacity-70' 
                    : task.isCompleted 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-2">
                 <p className={`text-sm font-medium ${task.isVerified ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.text}
                 </p>
                 {isOwner && !task.isVerified && (
                     <button onClick={() => deleteTask(targetUserId, task.id)} className="text-gray-300 hover:text-red-500 px-1">×</button>
                 )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200/50 mt-2">
                 {/* Action Area */}
                 {isOwner ? (
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={task.isCompleted} 
                            onChange={() => toggleComplete(targetUserId, task.id)}
                            disabled={task.isVerified}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className={`text-xs ${task.isCompleted ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}>
                            {task.isCompleted ? 'Waiting for check' : 'Mark done'}
                        </span>
                     </label>
                 ) : (
                    <div className="flex items-center gap-2">
                        {task.isCompleted ? (
                             task.isVerified ? (
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                    ✓ Verified
                                    <button onClick={() => toggleVerify(targetUserId, task.id)} className="text-gray-400 hover:text-red-500 text-[10px] ml-1 underline">(undo)</button>
                                </span>
                             ) : (
                                <button 
                                    onClick={() => toggleVerify(targetUserId, task.id)}
                                    className="bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full font-bold transition"
                                >
                                    Verify Now
                                </button>
                             )
                        ) : (
                            <span className="text-xs text-gray-400 italic">Wait for {user.name} to finish</span>
                        )}
                    </div>
                 )}
                 
                 {/* Status Badge */}
                 <div className="text-[10px]">
                     {task.isVerified 
                        ? '✅' 
                        : task.isCompleted 
                            ? '⏳ Pending Check' 
                            : '🏃 In Progress'
                     }
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area (Only for Owner) */}
        {isOwner && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask(targetUserId)}
                        placeholder="Add a new goal..."
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
                    />
                    <button 
                        onClick={() => addTask(targetUserId)}
                        className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-700"
                    >
                        +
                    </button>
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* Penalty Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-1 shadow-lg text-white">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                  <div className="text-4xl">💀</div>
                  <div>
                      <h2 className="text-lg font-bold opacity-90 uppercase tracking-widest text-red-100">Weekly Penalty</h2>
                      {isEditingPenalty ? (
                          <div className="flex gap-2 mt-1">
                              <input 
                                className="text-gray-900 px-2 py-1 rounded text-sm w-48"
                                value={penaltyInput}
                                onChange={(e) => setPenaltyInput(e.target.value)}
                              />
                              <button onClick={savePenalty} className="bg-white text-red-600 px-3 py-1 rounded text-xs font-bold">Save</button>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsEditingPenalty(true)}>
                              <p className="text-2xl font-black">{plan.penalty || "No penalty set!"}</p>
                              <span className="opacity-0 group-hover:opacity-100 text-xs bg-white/20 px-2 py-1 rounded">Edit</span>
                          </div>
                      )}
                  </div>
              </div>
              <div className="text-right text-xs opacity-80 md:w-1/3">
                  <p>Rules: You must complete and get your partner to <strong>verify</strong> all tasks before Sunday night. Loser pays the penalty!</p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
          {renderTaskColumn('user1')}
          {renderTaskColumn('user2')}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
