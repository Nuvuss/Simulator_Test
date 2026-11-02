'use client';

import { useRouter } from 'next/navigation';
import { loadExamState } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function InstructionsPage() {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    const state = loadExamState();
    if (!state) {
      router.push('/');
      return;
    }
    setCandidateName(state.candidateName);
  }, [router]);

  const handleStart = () => {
    router.push('/exam');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl shadow-gray-100 max-w-lg w-full p-6 sm:p-8">
        {/* Header with RevoU logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-white p-1 shadow-md border border-gray-100 mb-3">
            <img
              src="/revou-logo.png"
              alt="RevoU Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-gray-800 bg-[#FFF3CD] border border-[#FFEEBA] mb-2 shadow-2xs">
            <span>📋</span>
            <span>Panduan Peserta</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
            Informasi Sebelum Mengerjakan Tes
          </h1>
          {candidateName && (
            <p className="text-sm text-gray-600 mt-1">
              Halo, <span className="font-bold text-[#E7000B]">{candidateName}</span>! Harap baca informasi berikut sebelum memulai ujian.
            </p>
          )}
        </div>

        {/* Content points */}
        <div className="space-y-3.5 mb-6 text-sm text-gray-700">
          <div className="bg-[#FFF9E6] border border-[#FFE58F] rounded-2xl p-4">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <span>🎯</span> Peran Anda
            </h3>
            <p className="text-xs leading-relaxed text-gray-700">
              Anda berperan sebagai <strong>Booking Manager (Admission Executive)</strong> RevoU.
              Tugas Anda adalah merespon pertanyaan dan keberatan calon siswa melalui chat WhatsApp, lalu mengajak mereka booking sesi konsultasi dengan Admission Counselor (AC).
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 text-xs">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-sm">
              <span>⏱</span> Aturan Sesi
            </h3>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">1.</span>
              <span>Terdiri dari <strong>3 calon siswa (lead)</strong> yang berbeda secara berurutan.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">2.</span>
              <span>Batas waktu tiap lead adalah <strong>15 menit</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">3.</span>
              <span>Gunakan bahasa Indonesia yang ramah, profesional, dan persuasif.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">4.</span>
              <span>Hasil tes akan otomatis dikirimkan setelah seluruh sesi selesai.</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStart}
          className="w-full bg-[#E7000B] hover:bg-[#C8000A] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-base flex items-center justify-center gap-2"
        >
          <span>Mulai Simulasi Tes</span>
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}
