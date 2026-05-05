"use client";

import { GlassCard } from "./GlassCard";
import {
  SETTINGS_CONFIG,
  PRESETS,
  getDefaults,
  type SettingsKey,
} from "./settings-config";

export function SettingsPanel({
  settings,
  onChange,
  className = "",
}: {
  settings: Record<SettingsKey, number>;
  onChange: (key: SettingsKey, value: number) => void;
  className?: string;
}) {
  const applyPreset = (name: string) => {
    const defaults = getDefaults();
    const preset = { ...defaults, ...PRESETS[name] };
    for (const [k, v] of Object.entries(preset)) {
      onChange(k as SettingsKey, v);
    }
  };

  const copyValues = () => {
    const code = `settings={${JSON.stringify(settings, null, 2)}}`;
    navigator.clipboard.writeText(code);
  };

  return (
    <GlassCard className={`flex flex-col gap-[27px] p-6 w-[420px] ${className}`}>
      {/* Presets */}
      <div className="relative flex flex-col gap-4">
        <div>
          <p className="text-[14px] font-medium text-white">Presets</p>
          <p
            className="text-[12px] font-medium bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgb(172,185,249) 2%, rgb(201,173,236) 64%, rgb(231,186,175) 100%)",
            }}
          >
            Complete control
          </p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="flex gap-[9px]">
            {["Default", "Gentle"].map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className="flex-1 h-[34px] flex items-center justify-center rounded-[8px] border border-white/15 text-[12px] font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {name}
              </button>
            ))}
          </div>
          <div className="flex gap-[9px]">
            {["Short", "Wide spread"].map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className="flex-1 h-[34px] flex items-center justify-center rounded-[8px] border border-white/15 text-[12px] font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings sliders */}
      <div className="relative flex flex-col gap-4">
        <p className="text-[14px] font-medium text-white">Settings</p>
        <div className="flex flex-col gap-[10px]">
          {SETTINGS_CONFIG.map(({ key, min, max, step }) => (
            <div key={key} className="flex items-center gap-2">
              <p className="w-[120px] sm:w-[140px] text-[13px] sm:text-[14px] font-medium text-white/70 shrink-0">
                {key}
              </p>
              <div className="flex-1 relative h-4 flex items-center">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={settings[key]}
                  onChange={(e) => onChange(key, parseFloat(e.target.value))}
                  className="w-full h-1 appearance-none bg-white/20 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[2px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white/80 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-[2px] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white/80 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              <div className="w-12 h-[25px] flex items-center justify-center rounded-[6px] border border-white/15 shrink-0">
                <span className="text-[12px] font-mono text-white/70">
                  {settings[key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy values */}
      <button
        onClick={copyValues}
        className="relative w-full h-9 flex items-center justify-center rounded-[10px] bg-white/30 border border-white/15 text-[12px] font-medium text-white hover:bg-white/40 transition-colors cursor-pointer"
      >
        Copy values
      </button>
    </GlassCard>
  );
}
