'use client';

import { useEffect, useState } from 'react';
import { loadExamState, clearExamState } from '@/lib/storage';
import { leads } from '@/data/leads';

export default function ThankYouPage() {
  const [summary, setSummary] = useState<{
    name: string;
    sections: { leadName: string; reason: string; messageCount: number }[];
  } | null>(null);

  useEffect(() => {
    const state = loadExamState();
    if (state) {
      const sections = leads.map((lead, i) => ({
        leadName: lead.name,
        reason:
          state.sectionEndReasons[i] === 'booked'
            ? 'Booking Berhasil ✅'
            : state.sectionEndReasons[i] === 'timeout'
            ? 'Waktu Habis ⏱'
            : 'Selesai',
        messageCount: state.messages.filter((m) => m.sectionIndex === i).length,
      }));
      setSummary({ name: state.candidateName, sections });
      // Keep state for a while then clear
      setTimeout(() => clearExamState(), 10000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl shadow-gray-100 max-w-md w-full p-6 sm:p-8 text-center">
        {/* RevoU Logo */}
        <div className="w-16 h-16 mx-auto rounded-full bg-white p-1 shadow-md border border-gray-100 mb-3">
          <img
            src="/revou-logo.png"
            alt="RevoU Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Terima Kasih! 🎉
        </h1>
        {summary && (
          <>
            <p className="text-gray-600 text-sm mb-5">
              Kerja bagus, <span className="font-bold text-[#E7000B]">{summary.name}</span>! Hasil tes Anda telah berhasil dikirimkan.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5 text-left">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">
                Ringkasan Sesi Anda:
              </h3>
              <div className="space-y-2.5">
                {summary.sections.map((section, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3 shadow-2xs"
                  >
                    <div>
                      <p className="font-semibold text-xs text-gray-900">
                        Sesi {i + 1}: {section.leadName}
                      </p>
                      <p className="text-[11px] text-gray-500">{section.messageCount} pesan terkirim</p>
                    </div>
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                      {section.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="bg-[#FFF9E6] border border-[#FFE58F] rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-700 leading-relaxed">
            Tim Admission RevoU akan meninjau hasil tes Anda. Kami akan menghubungi Anda melalui email untuk tahapan selanjutnya.
          </p>
        </div>

        <button
          onClick={() => {
            clearExamState();
            window.location.href = '/';
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl text-xs transition-colors"
        >
          Selesai & Keluar
        </button>
      </div>
    </div>
  );
}
