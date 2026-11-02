'use client';

import { Timer } from './Timer';

interface ChatHeaderProps {
  leadName: string;
  leadAvatar: string;
  leadProfile: string;
  remainingTime: number;
  onTimeout: () => void;
  sectionLabel: string;
}

export function ChatHeader({
  leadName,
  leadProfile,
  remainingTime,
  onTimeout,
  sectionLabel,
}: ChatHeaderProps) {
  return (
    <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shadow-md z-20 flex-shrink-0 select-none">
      {/* Left side: Back arrow, Profile Picture, Name & Status */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          className="text-white hover:opacity-80 p-0.5 rounded-full"
          title="Kembali"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* RevoU Profile Photo */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/20 bg-[#FFDE3D] shadow-sm">
          <img
            src="/revou-logo.png"
            alt="RevoU"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-[#075E54] rounded-full" />
        </div>

        {/* Name and Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-sm sm:text-base leading-tight truncate">
              {leadName}
            </h2>
            <span className="text-[10px] bg-[#128C7E] text-white px-1.5 py-0.5 rounded font-medium flex-shrink-0">
              RevoU
            </span>
          </div>
          <p className="text-[11px] text-green-100/90 leading-tight truncate">
            online • <span className="text-green-200">{leadProfile}</span>
          </p>
        </div>
      </div>

      {/* Right side: Session badge & Timer */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="text-[11px] font-semibold bg-[#128C7E] text-white px-2 py-0.5 rounded-full">
          {sectionLabel}
        </span>
        <Timer remainingTime={remainingTime} onTimeout={onTimeout} />
      </div>
    </div>
  );
}
