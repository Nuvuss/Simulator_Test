'use client';

interface SectionTransitionProps {
  completedLeadName: string;
  completedReason: 'booked' | 'timeout' | null;
  nextLeadName: string;
  nextLeadProfile: string;
  nextLeadProgram: string;
  nextLeadAvatar: string;
  sectionNumber: number;
  onStart: () => void;
}

export function SectionTransition({
  completedLeadName,
  completedReason,
  nextLeadName,
  nextLeadProfile,
  nextLeadProgram,
  sectionNumber,
  onStart,
}: SectionTransitionProps) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white overflow-y-auto">
      {/* Top Header */}
      <div className="text-center pt-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#FFDE3D] p-1 shadow-sm mb-3">
          <img
            src="/revou-logo.png"
            alt="RevoU"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h2 className="text-lg font-bold text-[#1E2939]">
          Sesi {sectionNumber - 1} Selesai
        </h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-2 bg-green-50 text-green-700 border border-green-200">
          <span>{completedReason === 'booked' ? '✅ Booking Berhasil' : '⏱ Waktu Habis'}</span>
        </div>
      </div>

      {/* Next Lead Card */}
      <div className="my-6 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-5 text-center shadow-xs">
        <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
          Lead Berikutnya (Sesi {sectionNumber}/3)
        </p>
        <div className="w-14 h-14 mx-auto rounded-full overflow-hidden mb-2 border-2 border-yellow-400 p-0.5 bg-yellow-100">
          <img
            src="/revou-logo.png"
            alt="RevoU Lead"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h3 className="text-base font-bold text-gray-900">{nextLeadName}</h3>
        <p className="text-xs text-gray-600 mt-0.5">{nextLeadProfile}</p>

        <div className="mt-3 pt-3 border-t border-gray-200/80 text-left space-y-1.5 text-xs">
          <div className="flex items-start justify-between">
            <span className="text-gray-500">Program:</span>
            <span className="font-semibold text-gray-800 text-right">{nextLeadProgram}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Waktu:</span>
            <span className="font-semibold text-gray-800">15 Menit</span>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pb-2">
        <button
          onClick={onStart}
          className="w-full bg-[#E7000B] hover:bg-[#C8000A] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
        >
          <span>Mulai Chat Sesi {sectionNumber}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
