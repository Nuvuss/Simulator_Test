'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { leads } from '@/data/leads';
import {
  initSection,
  processReply,
  handleTimeout,
  moveToNextLead,
  getRemainingTime,
  isTimedOut,
} from '@/lib/examEngine';
import { saveExamState, loadExamState } from '@/lib/storage';
import { ExamState, ChatMessage } from '@/types';

export default function ExamPage() {
  const router = useRouter();
  const [examState, setExamState] = useState<ExamState | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [screenTransition, setScreenTransition] = useState<'slide-out' | 'slide-in' | null>(null);
  const [transitionOverlay, setTransitionOverlay] = useState<{
    text: string;
    subtext?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Animate opening messages (show msg 1 immediately, msg 2 after delay)
  const animateOpeningMessages = useCallback((state: ExamState) => {
    const currentMessages = state.messages.filter(
      (m) => m.sectionIndex === state.currentLeadIndex
    );

    if (currentMessages.length >= 2) {
      // Show first message smoothly after slight pause for clean entrance
      setTimeout(() => {
        setDisplayMessages([currentMessages[0]]);
      }, 150);

      // Show typing indicator then second message
      setTimeout(() => {
        setIsTyping(true);
      }, 750);

      setTimeout(() => {
        setIsTyping(false);
        setDisplayMessages([currentMessages[0], currentMessages[1]]);
      }, 2250);
    }
  }, []);

  // Load or redirect
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const state = loadExamState();
    if (!state) {
      router.push('/');
      return;
    }

    if (state.status === 'completed') {
      router.push('/thankyou');
      return;
    }

    // If section hasn't started yet (phase === 'greeting' and no start time), show pop-up before starting!
    if (state.phase === 'greeting' && !state.sectionStartTime) {
      setExamState(state);
      setShowWelcomeModal(true);
    } else {
      setExamState(state);
      // Show all existing messages for current section
      const currentMessages = state.messages.filter(
        (m) => m.sectionIndex === state.currentLeadIndex
      );
      setDisplayMessages(currentMessages);
    }
  }, [router]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages, isTyping]);

  // Timer check
  useEffect(() => {
    if (
      !examState ||
      examState.phase === 'done' ||
      examState.phase === 'booking-confirm' ||
      showWelcomeModal ||
      Boolean(transitionOverlay) ||
      !examState.sectionStartTime
    )
      return;

    const interval = setInterval(() => {
      if (isTimedOut(examState)) {
        handleTimerExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [examState, showWelcomeModal, transitionOverlay]);

  const handleTimerExpired = useCallback(() => {
    if (!examState) return;

    const newState = handleTimeout(examState);

    // Add timeout message to display
    const timeoutMsg = newState.messages[newState.messages.length - 1];
    setDisplayMessages((prev) => [...prev, timeoutMsg]);

    // Move to next lead or complete
    setTimeout(() => {
      const nextIndex = newState.currentLeadIndex + 1;
      if (nextIndex >= leads.length) {
        const nextState = moveToNextLead(newState);
        setExamState(nextState);
        saveExamState(nextState);
        submitAndRedirect(nextState);
      } else {
        const nextLead = leads[nextIndex];

        // 1. Slide out current chat screen to the left
        setScreenTransition('slide-out');

        setTimeout(() => {
          setTransitionOverlay({
            text: `Waktu Sesi ${newState.currentLeadIndex + 1} Berakhir`,
            subtext: `Menyiapkan Sesi ${nextIndex + 1} (${nextLead.name})...`,
          });
        }, 100);

        setTimeout(() => {
          const nextState = moveToNextLead(newState);
          setExamState(nextState);
          saveExamState(nextState);
          setDisplayMessages([]);
          setIsTyping(false);
          setTransitionOverlay(null);
          setScreenTransition('slide-in');
          setShowWelcomeModal(true);

          setTimeout(() => {
            setScreenTransition(null);
          }, 400);
        }, 1200);
      }
    }, 1800);
  }, [examState]);

  const handleSend = useCallback(
    (text: string) => {
      if (
        !examState ||
        isTyping ||
        examState.phase === 'done' ||
        examState.phase === 'booking-confirm' ||
        showWelcomeModal
      )
        return;

      const { state: newState, leadResponse, sectionComplete } = processReply(examState, text);

      // Add candidate message to display immediately
      const currentSectionMessages = newState.messages.filter(
        (m) => m.sectionIndex === newState.currentLeadIndex
      );
      if (leadResponse) {
        setDisplayMessages(currentSectionMessages.slice(0, -1));
      } else {
        setDisplayMessages(currentSectionMessages);
      }

      setExamState(newState);
      saveExamState(newState);

      // Animate lead response with typing indicator
      if (leadResponse) {
        const delay = 1500 + Math.random() * 1500; // 1.5-3s delay

        setTimeout(() => {
          setIsTyping(true);
        }, 300);

        setTimeout(() => {
          setIsTyping(false);
          const updatedMessages = newState.messages.filter(
            (m) => m.sectionIndex === newState.currentLeadIndex
          );
          setDisplayMessages(updatedMessages);

          if (sectionComplete) {
            setTimeout(() => {
              const nextIndex = newState.currentLeadIndex + 1;
              if (nextIndex >= leads.length) {
                const nextState = moveToNextLead(newState);
                setExamState(nextState);
                saveExamState(nextState);
                submitAndRedirect(nextState);
              } else {
                const nextLead = leads[nextIndex];

                // 1. Slide out current chat screen to the left
                setScreenTransition('slide-out');

                setTimeout(() => {
                  setTransitionOverlay({
                    text: `Sesi ${newState.currentLeadIndex + 1} Selesai!`,
                    subtext: `Menyiapkan Sesi ${nextIndex + 1} (${nextLead.name})...`,
                  });
                }, 100);

                setTimeout(() => {
                  const nextState = moveToNextLead(newState);
                  setExamState(nextState);
                  saveExamState(nextState);
                  setDisplayMessages([]);
                  setIsTyping(false);
                  setTransitionOverlay(null);
                  setScreenTransition('slide-in');
                  setShowWelcomeModal(true);

                  setTimeout(() => {
                    setScreenTransition(null);
                  }, 400);
                }, 1200);
              }
            }, 1800);
          }
        }, delay);
      }
    },
    [examState, isTyping, showWelcomeModal, transitionOverlay]
  );

  const submitAndRedirect = async (state: ExamState) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.messages,
          candidateName: state.candidateName,
          candidateEmail: state.candidateEmail,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        console.warn('Google Sheets submission warning:', result.error);
      }
    } catch (error) {
      console.error('Failed to submit transcript:', error);
    }

    const completedState = { ...state, status: 'completed' as const };
    saveExamState(completedState);
    router.push('/thankyou');
  };

  const handleConfirmStart = () => {
    if (!examState || isModalClosing) return;
    setIsModalClosing(true);

    setTimeout(() => {
      setShowWelcomeModal(false);
      setIsModalClosing(false);
      const newState = initSection(examState);
      setExamState(newState);
      saveExamState(newState);
      animateOpeningMessages(newState);
    }, 240);
  };

  // Loading state
  if (!examState) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full sm:max-w-[420px] h-[600px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 text-center border border-gray-100">
          <div className="animate-spin w-10 h-10 border-4 border-[#25D366] border-t-transparent rounded-full mb-4" />
          <p className="text-gray-600 font-medium">Memuat simulasi ujian...</p>
        </div>
      </div>
    );
  }

  // Submitting state
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full sm:max-w-[420px] h-[600px] bg-[#075E54] text-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4" />
          <h2 className="text-xl font-bold mb-2">Mengirim Hasil...</h2>
          <p className="text-green-200 text-sm">Sedang memproses hasil tes Anda. Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  const currentLead = leads[examState.currentLeadIndex];
  const remaining = getRemainingTime(examState);
  const isSectionDone = examState.phase === 'done' || examState.phase === 'booking-confirm';

  return (
    <div className="min-h-screen bg-white sm:bg-gray-100 flex items-center justify-center p-0 sm:py-3 sm:px-4 font-sans relative">
      {/* Smooth Transition Overlay Between Sessions */}
      {transitionOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xs w-full text-center shadow-2xl border border-gray-100 flex flex-col items-center animate-slide-in-right">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3 shadow-xs">
              <div className="w-6 h-6 border-3 border-[#075E54] border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {transitionOverlay.text}
            </h3>
            {transitionOverlay.subtext && (
              <p className="text-xs text-gray-600 leading-relaxed">
                {transitionOverlay.subtext}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Pop Up: Selamat Mengerjakan */}
      {showWelcomeModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs ${
            isModalClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'
          }`}
        >
          <div
            className={`bg-white rounded-3xl p-5 sm:p-7 max-w-sm w-full text-center shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto ${
              isModalClosing ? 'animate-modal-slide-out-left' : 'animate-modal-slide-in-right'
            }`}
          >
            {/* Celebration Icon */}
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF3CD] border border-[#FFEEBA] flex items-center justify-center text-2xl mb-2.5 shadow-xs">
              🎉
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-gray-800 bg-gray-100 mb-2">
              <span>Sesi {examState.currentLeadIndex + 1} dari 3</span>
              <span>•</span>
              <span className="text-[#075E54]">{currentLead.name}</span>
            </div>

            {/* Pop Up Heading */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
              Selamat Mengerjakan!
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 mb-3.5 leading-relaxed">
              Halo <strong className="text-gray-900">{examState.candidateName}</strong>! kamu akan chat bersama <strong className="text-[#075E54]">{currentLead.name}</strong> (<strong className="font-bold text-gray-900">{currentLead.profile}</strong>) akan segera dimulai.
            </p>

            <div className="space-y-2 mb-5 text-left text-xs">
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-2.5 text-green-800">
                <p className="font-semibold mb-0.5">⏱ Waktu Sesi: 15 Menit</p>
                <p className="text-[11px] text-green-700 leading-tight">
                  Timer akan mulai berjalan saat Anda menekan tombol di bawah.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-amber-900">
                <p className="font-bold text-amber-950 flex items-center gap-1 mb-1">
                  <span>🚨</span> Ingat
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Kamu hanya bisa memberikan respon dengan <strong>1 bubble chat</strong>. Pastikan informasi, urgency, dan call to action yang ingin kamu sampaikan sudah tercantum langsung dalam 1 bubble chat sebelum kamu kirim.
                </p>
              </div>
            </div>

            <button
              onClick={handleConfirmStart}
              disabled={isModalClosing}
              className="w-full h-11 sm:h-12 bg-[#E7000B] hover:bg-[#C8000A] active:scale-[0.99] text-white font-bold px-6 rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
            >
              <span>Mulai Chat Sekarang</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Portrait Phone Frame */}
      <div className="w-full sm:max-w-[420px] h-screen sm:h-[94vh] sm:max-h-[860px] flex flex-col bg-[#ECE5DD] sm:rounded-[32px] sm:shadow-2xl overflow-hidden sm:border-[6px] sm:border-gray-800 relative">

        {/* Smartphone top speaker & camera notch (desktop only) */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1.5 bg-[#075E54] text-white text-[11px] font-medium z-30 select-none">
          <span>09:41</span>
          <div className="w-20 h-3.5 bg-gray-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 21l3.53-.93C9.37 20.66 10.65 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
            </svg>
            <div className="w-4 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Active Chat Screen with Lateral Horizontal Slide Transition */}
        <div
          className={`flex-1 flex flex-col min-h-0 overflow-hidden ${
            screenTransition === 'slide-out'
              ? 'animate-screen-slide-out-left'
              : screenTransition === 'slide-in'
              ? 'animate-screen-slide-in-right'
              : ''
          }`}
        >
          {/* WhatsApp Chat Header */}
          <ChatHeader
            leadName={currentLead.name}
            leadAvatar={currentLead.avatar}
            leadProfile={currentLead.profile}
            remainingTime={remaining}
            onTimeout={handleTimerExpired}
            sectionLabel={`${examState.currentLeadIndex + 1}/3`}
          />

          {/* Chat Messages Body */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto wa-chat-bg chat-scroll py-3"
          >
            {/* Date pill */}
            <div className="flex justify-center mb-3">
              <span className="bg-white/85 text-[#667781] text-[11px] px-3 py-1 rounded-lg shadow-xs select-none">
                Hari ini
              </span>
            </div>

            {/* Program context badge */}
            <div className="flex justify-center mb-3 px-4">
              <span className="bg-[#FFF3CD] border border-[#FFEEBA] text-[#856404] text-[11px] px-3 py-1.5 rounded-lg shadow-xs text-center leading-tight">
                🎓 <strong>Program:</strong> {currentLead.program} • <em>{currentLead.source}</em>
              </span>
            </div>

            {/* Messages */}
            {displayMessages.map((msg) => (
              <ChatBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
                leadName={msg.leadName}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator leadName={currentLead.name} />}

            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Input Bar */}
          <ChatInput
            onSend={handleSend}
            disabled={isTyping || isSectionDone || showWelcomeModal || Boolean(transitionOverlay)}
            placeholder={
              isSectionDone
                ? 'Sesi telah berakhir'
                : 'Ketik pesan...'
            }
          />
        </div>

        {/* Bottom home bar indicator for mobile portrait look */}
        <div className="hidden sm:flex justify-center pb-1 pt-1 bg-[#F0F0F0] select-none">
          <div className="w-28 h-1 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
