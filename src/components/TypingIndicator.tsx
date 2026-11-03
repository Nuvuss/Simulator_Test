'use client';

interface TypingIndicatorProps {
  leadName: string;
}

export function TypingIndicator({ leadName }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start mb-2 px-3 animate-fade-in">
      <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#667781] mr-2">{leadName}</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
