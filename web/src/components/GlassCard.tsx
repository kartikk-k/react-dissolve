import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] ${className}`}
      style={{ boxShadow: '0px 0.25px 0.25px rgba(255, 255, 255, 0.32) inset, 0px 0.75px 0.25px rgba(255, 255, 255, 0.12) inset, 0px 4px 16px rgba(255, 255, 255, 0.16) inset, 0px -12px 16px rgba(255, 255, 255, 0.06) inset, 0px 3px 6px rgba(0, 0, 0, 0.19), 0px 10px 10px rgba(0, 0, 0, 0.12), 0px 23px 14px rgba(0, 0, 0, 0.08), 0px 40px 24px rgba(0, 0, 0, 0.06)' }}
    >
      <div className="absolute top-0 left-0 inset-0 w-full h-full bg-[#F7F7F7]/60" />
      <div
        className="absolute inset-0 pointer-events-none rounded-[24px] backdrop-blur-[3px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(ellipse 65.62% 65.62% at 50.00% 50.00%, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0) 100%), rgba(0, 0, 0, 0.56)'
        }}
      />
      <div className="absolute inset-0 pointer-events-none rounded-[24px] shadow-[inset_0px_-12px_16px_0px_rgba(255,255,255,0.06),inset_0px_4px_16px_0px_rgba(255,255,255,0.16),inset_0px_0.75px_0.25px_0px_rgba(255,255,255,0.12),inset_0px_0.25px_0.25px_0px_rgba(255,255,255,0.32)] z-10" />
      {children}
    </div>
  );
}
