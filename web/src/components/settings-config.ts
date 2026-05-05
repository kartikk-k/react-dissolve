export const SETTINGS_CONFIG = [
  { key: "duration", min: 200, max: 4000, step: 50, default: 1150 },
  { key: "maxDisplacement", min: 0.5, max: 10, step: 0.1, default: 3.2 },
  { key: "bigNoiseFreq", min: 0.001, max: 0.02, step: 0.001, default: 0.004 },
  { key: "fineNoiseFreq", min: 0.1, max: 10, step: 0.1, default: 2.7 },
  { key: "noiseMix", min: 0, max: 1, step: 0.05, default: 0.55 },
  { key: "easingPower", min: 0.5, max: 5, step: 0.1, default: 2.0 },
  { key: "endScale", min: 1.0, max: 1.5, step: 0.01, default: 1.05 },
  { key: "opacityFadeStart", min: 0, max: 0.8, step: 0.05, default: 0.1 },
] as const;

export type SettingsKey = (typeof SETTINGS_CONFIG)[number]["key"];

export const PRESETS: Record<string, Partial<Record<SettingsKey, number>>> = {
  Default: {},
  Gentle: {
    duration: 2000,
    maxDisplacement: 1.5,
    easingPower: 1.5,
    endScale: 1.02,
  },
  Short: {
    duration: 400,
    maxDisplacement: 5.0,
    easingPower: 3.0,
  },
  "Wide spread": {
    duration: 1800,
    maxDisplacement: 8.0,
    bigNoiseFreq: 0.002,
    noiseMix: 0.3,
  },
};

export function getDefaults(): Record<SettingsKey, number> {
  const d: Record<string, number> = {};
  for (const s of SETTINGS_CONFIG) d[s.key] = s.default;
  return d as Record<SettingsKey, number>;
}
