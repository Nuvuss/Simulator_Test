import { ChatMessage, ExamState } from '@/types';
import { leads } from '@/data/leads';
import { shuffleQuestionOrder } from './shuffle';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function now(): string {
  return new Date().toISOString();
}

export function createInitialState(
  candidateName: string,
  candidateEmail: string
): ExamState {
  // Pre-generate shuffled question orders for all 3 leads
  const shuffledQuestionOrders = leads.map(() => shuffleQuestionOrder());

  return {
    candidateName,
    candidateEmail,
    currentLeadIndex: 0,
    sectionStartTime: null,
    messages: [],
    shuffledQuestionOrders,
    currentQuestionIndex: 0,
    phase: 'greeting',
    sectionEndReasons: [null, null, null],
    status: 'in-progress',
    lastLeadMessageTime: null,
  };
}

export function initSection(state: ExamState): ExamState {
  const leadIndex = state.currentLeadIndex;
  const lead = leads[leadIndex];
  const currentTime = now();

  // Create opening messages
  const bmText =
    typeof lead.openingBM === 'function'
      ? lead.openingBM(state.candidateName)
      : lead.openingBM;

  const bmGreeting: ChatMessage = {
    id: generateId(),
    sender: 'bm',
    text: bmText,
    timestamp: currentTime,
    leadName: lead.name,
    sectionIndex: leadIndex,
  };

  // Lead reply comes 1 second after
  const leadReply: ChatMessage = {
    id: generateId(),
    sender: 'lead',
    text: lead.openingLead,
    timestamp: new Date(Date.now() + 1000).toISOString(),
    leadName: lead.name,
    sectionIndex: leadIndex,
  };

  return {
    ...state,
    sectionStartTime: currentTime,
    messages: [...state.messages, bmGreeting, leadReply],
    currentQuestionIndex: 0,
    phase: 'questions',
    lastLeadMessageTime: leadReply.timestamp,
  };
}

export function processReply(
  state: ExamState,
  candidateText: string
): { state: ExamState; leadResponse: string | null; sectionComplete: boolean } {
  const leadIndex = state.currentLeadIndex;
  const lead = leads[leadIndex];
  const currentTime = now();

  // Calculate response time from last lead message
  const responseTimeSec = state.lastLeadMessageTime
    ? Math.round((Date.now() - new Date(state.lastLeadMessageTime).getTime()) / 1000)
    : undefined;

  // Add candidate message
  const candidateMsg: ChatMessage = {
    id: generateId(),
    sender: 'bm',
    text: candidateText,
    timestamp: currentTime,
    leadName: lead.name,
    sectionIndex: leadIndex,
    responseTimeSec,
  };

  const updatedMessages = [...state.messages, candidateMsg];

  if (state.phase === 'questions') {
    const questionOrder = state.shuffledQuestionOrders[leadIndex];
    const nextQuestionIdx = state.currentQuestionIndex;

    if (nextQuestionIdx < 5) {
      // Send next question
      const questionIndex = questionOrder[nextQuestionIdx];
      const question = lead.questions[questionIndex];
      const leadMsg: ChatMessage = {
        id: generateId(),
        sender: 'lead',
        text: question.text,
        timestamp: new Date(Date.now() + 2000).toISOString(),
        leadName: lead.name,
        sectionIndex: leadIndex,
      };

      return {
        state: {
          ...state,
          messages: [...updatedMessages, leadMsg],
          currentQuestionIndex: nextQuestionIdx + 1,
          phase: nextQuestionIdx + 1 >= 5 ? 'questions' : 'questions',
          lastLeadMessageTime: leadMsg.timestamp,
        },
        leadResponse: question.text,
        sectionComplete: false,
      };
    } else {
      // All 5 questions answered, send booking request
      const bookingMsg: ChatMessage = {
        id: generateId(),
        sender: 'lead',
        text: lead.bookingRequest,
        timestamp: new Date(Date.now() + 2000).toISOString(),
        leadName: lead.name,
        sectionIndex: leadIndex,
      };

      return {
        state: {
          ...state,
          messages: [...updatedMessages, bookingMsg],
          phase: 'booking-request',
          lastLeadMessageTime: bookingMsg.timestamp,
        },
        leadResponse: lead.bookingRequest,
        sectionComplete: false,
      };
    }
  }

  if (state.phase === 'booking-request') {
    // Candidate proposed a day/time, lead confirms
    const confirmMsg: ChatMessage = {
      id: generateId(),
      sender: 'lead',
      text: lead.bookingConfirm,
      timestamp: new Date(Date.now() + 2000).toISOString(),
      leadName: lead.name,
      sectionIndex: leadIndex,
    };

    const newEndReasons = [...state.sectionEndReasons];
    newEndReasons[leadIndex] = 'booked';

    return {
      state: {
        ...state,
        messages: [...updatedMessages, confirmMsg],
        phase: 'booking-confirm',
        sectionEndReasons: newEndReasons,
        lastLeadMessageTime: confirmMsg.timestamp,
      },
      leadResponse: lead.bookingConfirm,
      sectionComplete: true,
    };
  }

  // If phase is booking-confirm or done, ignore
  return {
    state: { ...state, messages: updatedMessages },
    leadResponse: null,
    sectionComplete: false,
  };
}

export function handleTimeout(state: ExamState): ExamState {
  const leadIndex = state.currentLeadIndex;
  const newEndReasons = [...state.sectionEndReasons];
  newEndReasons[leadIndex] = 'timeout';

  // Add a system message
  const timeoutMsg: ChatMessage = {
    id: generateId(),
    sender: 'lead',
    text: '⏱ Waktu habis. Sesi ini telah berakhir.',
    timestamp: now(),
    leadName: leads[leadIndex].name,
    sectionIndex: leadIndex,
  };

  return {
    ...state,
    messages: [...state.messages, timeoutMsg],
    phase: 'done',
    sectionEndReasons: newEndReasons,
  };
}

export function moveToNextLead(state: ExamState): ExamState {
  const nextIndex = state.currentLeadIndex + 1;

  if (nextIndex >= leads.length) {
    return {
      ...state,
      status: 'completed',
      phase: 'done',
    };
  }

  return {
    ...state,
    currentLeadIndex: nextIndex,
    sectionStartTime: null,
    currentQuestionIndex: 0,
    phase: 'greeting',
    lastLeadMessageTime: null,
  };
}

export function getRemainingTime(state: ExamState): number {
  if (!state.sectionStartTime) return leads[state.currentLeadIndex].timeLimitSec;
  const elapsed = (Date.now() - new Date(state.sectionStartTime).getTime()) / 1000;
  const lead = leads[state.currentLeadIndex];
  return Math.max(0, lead.timeLimitSec - elapsed);
}

export function isTimedOut(state: ExamState): boolean {
  return getRemainingTime(state) <= 0;
}
