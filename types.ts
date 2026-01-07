export type UserID = 'user1' | 'user2';

export interface UserProfile {
  id: UserID;
  name: string;
  avatar: string; // URL
  color: string;
}

export enum SkillType {
  LISTENING = 'Listening',
  READING = 'Reading',
  SPEAKING = 'Speaking',
  WRITING = 'Writing'
}

export interface StudyLog {
  id: string;
  userId: UserID;
  date: string;
  skill: SkillType;
  durationMinutes: number;
  score?: number; // Optional mock test score
  notes?: string;
}

export interface WritingFeedback {
  estimatedScore: number; // 0-200 scale
  correctedText: string;
  critique: string;
  betterVocab: string[];
}

export interface SpeakingFeedback {
  fluencyScore: number; // 1-10
  relevanceScore: number; // 1-10
  feedback: string;
  sampleAnswer: string;
}

// New Types for Weekly Planner
export interface Task {
  id: string;
  text: string;
  isCompleted: boolean; // Marked by doer
  isVerified: boolean; // Marked by partner
}

export interface WeeklyPlan {
  id: string;
  weekStart: string;
  penalty: string; // The punishment text
  tasks: Record<UserID, Task[]>;
}
