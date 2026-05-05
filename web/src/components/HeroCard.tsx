"use client";

import { useState, useRef } from "react";
import { Dissolve, type DissolveHandle, type DissolveSettings } from "dissolve-react";
import { GlassCard } from "./GlassCard";
import { SparkleIcon, SettingsIcon, CopyIcon } from "./icons";
import type { SettingsKey } from "./settings-config";

export function HeroCard({
  onOpenSettings,
  onToggleSettings,
  settings,
}: {
  onOpenSettings: () => void;
  onToggleSettings: () => void;
  settings: Record<SettingsKey, number>;
}) {
  const [copied, setCopied] = useState(false);
  const dissolveRef = useRef<DissolveHandle>(null);

  const copyInstall = () => {
    navigator.clipboard.writeText("bun add dissolve-react");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTryDemo = () => {
    dissolveRef.current?.dissolve();
  };

  const handleDissolveComplete = () => {
    onOpenSettings();
    setTimeout(() => {
      dissolveRef.current?.reset();
    }, 1000);
  };

  return (
    <Dissolve
      ref={dissolveRef}
      onComplete={handleDissolveComplete}
      settings={settings as Partial<DissolveSettings>}
    >
      <GlassCard className="w-full h-auto flex flex-col pb-8">
        {/* Settings gear icon — toggles */}
        <button
          onClick={onToggleSettings}
          className="absolute top-[23px] right-[31px] z-20 opacity-50 hover:opacity-80 transition-opacity text-white cursor-pointer"
        >
          <SettingsIcon />
        </button>

        {/* Content */}
        <div className="relative z-[5] flex flex-col items-center pt-[24px] px-4">
          <SparkleIcon />

          <p className="text-[18px] sm:text-[22px] font-normal text-white text-center mt-[8px]">
            Dissolve any React component
          </p>
          <p className="text-[18px] sm:text-[22px] font-medium text-center -mt-[4px]">
            <span className="text-white">with </span>
            <span
              className="bg-clip-text text-transparent uppercase"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgb(172,185,249) 2%, rgb(201,173,236) 64%, rgb(231,186,175) 100%)",
              }}
            >
              WebGL
            </span>
          </p>

          <div className="text-[11px] sm:text-[12px] font-medium text-white/70 text-center mt-[24px] leading-normal">
            <p>A tiny React component that wraps your UI and</p>
            <p>dissolves it into particles using WebGL shaders.</p>
            <p>Zero config, fully customizable.</p>
          </div>

          <button
            onClick={copyInstall}
            className="mt-[32px] sm:mt-[44px] w-full max-w-[347px] h-8 flex items-center justify-between px-3 rounded-[10px] border border-white/15 cursor-pointer hover:border-white/25 transition-colors bg-transparent"
          >
            <span className="text-[12px] font-medium font-mono text-white">
              bun add dissolve-react
            </span>
            {copied ? (
              <span className="text-[10px] text-green-400">Copied!</span>
            ) : (
              <CopyIcon className="text-white/50" />
            )}
          </button>

          <button
            onClick={handleTryDemo}
            className="mt-[10px] w-full max-w-[346px] h-[42px] flex items-center justify-center rounded-[10px] bg-white/30 border border-white/15 text-[12px] font-medium text-white hover:bg-white/40 transition-colors cursor-pointer"
          >
            Try the demo
          </button>
        </div>
      </GlassCard>
    </Dissolve>
  );
}
