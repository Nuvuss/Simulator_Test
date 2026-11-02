'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInitialState } from '@/lib/examEngine';
import { saveExamState } from '@/lib/storage';

export default function RegistrationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Silakan masukkan nama Anda');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Silakan masukkan email yang valid');
      return;
    }

    // Always create a fresh state for the submitted candidate and proceed to instructions
    const state = createInitialState(name.trim(), email.trim());
    saveExamState(state);
    router.push('/instructions');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[460px] flex flex-col items-center">
        {/* RevoU Official Logo */}
        <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md border border-gray-100 mb-4">
          <img
            src="/revou-logo.png"
            alt="RevoU"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Greetings Masuk Tes Ujian BM */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-gray-800 bg-[#FFF3CD] border border-[#FFEEBA] mb-2 shadow-2xs">
            <span>🎓</span>
            <span>Ujian Masuk Booking Manager RevoU</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Halo, Calon Booking Manager! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
            Yuk kenalan & isi data dirimu sebelum memulai simulasi tes
          </p>
        </div>

        {/* Form Card with clean shadow and border */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xl shadow-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1.5">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFDE3D] focus:border-yellow-500 text-gray-900 placeholder:text-gray-400 text-sm transition-all bg-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1.5">
                Email saat mendaftar di RevoU
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFDE3D] focus:border-yellow-500 text-gray-900 placeholder:text-gray-400 text-sm transition-all bg-white"
              />
            </div>

            {error && (
              <p className="text-red-600 text-xs font-semibold">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setError('');
                }}
                title="Reset input"
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0 bg-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>

              <button
                type="submit"
                className="flex-1 h-12 bg-[#E7000B] hover:bg-[#C8000A] active:scale-[0.99] text-white font-bold px-6 rounded-xl transition-all shadow-md text-base flex items-center justify-center gap-2"
              >
                <span>Lanjut</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
