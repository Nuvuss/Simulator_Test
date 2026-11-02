export interface LeadQuestion {
  seq: number;
  type: 'question' | 'objection';
  text: string;
}

export interface Lead {
  id: string;
  name: string;
  age: number;
  profile: string;
  program: string;
  source: string;
  avatar: string;
  openingBM: string | ((candidateName: string) => string);
  openingLead: string;
  questions: LeadQuestion[];
  bookingRequest: string;
  bookingConfirm: string;
  timeLimitSec: number;
}

export interface ChatMessage {
  id: string;
  sender: 'bm' | 'lead';
  text: string;
  timestamp: string;
  leadName: string;
  sectionIndex: number;
  responseTimeSec?: number;
}

export interface ExamState {
  candidateName: string;
  candidateEmail: string;
  currentLeadIndex: number;
  sectionStartTime: string | null;
  messages: ChatMessage[];
  shuffledQuestionOrders: number[][];
  currentQuestionIndex: number;
  phase: 'greeting' | 'questions' | 'booking-request' | 'booking-confirm' | 'done';
  sectionEndReasons: ('booked' | 'timeout' | null)[];
  status: 'registered' | 'in-progress' | 'completed';
  lastLeadMessageTime: string | null;
}

export interface SheetRow {
  candidateName: string;
  candidateEmail: string;
  leadName: string;
  sectionNumber: number;
  sender: string;
  message: string;
  timestamp: string;
  responseTimeSec: number | string;
}
