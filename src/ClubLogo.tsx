import React from 'react';

interface ClubLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const ClubLogo: React.FC<ClubLogoProps> = ({
  className = '',
  size = 48,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src="/yssc-logo.png"
        width={size}
        height={size}
        alt="YSSC Young Star Sports Club Gamudawa logo"
        className="shrink-0 object-contain drop-shadow-sm select-none rounded-full border border-amber-400/40"
        style={{ width: size, height: size }}
        onError={(e) => {
          // If local logo is missing, fallback to replit CDN logo
          (e.currentTarget as HTMLImageElement).src =
            'https://young-star-sports-club-gamudawa--hasithamars.replit.app/assets/yssc-logo-CvKLkh1m.png';
        }}
        draggable={false}
      />
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight leading-none text-base">
            YOUNG STAR SC
          </span>
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mt-1">
            GAMUDAWA · ESTD 1998
          </span>
        </div>
      )}
    </div>
  );
};
