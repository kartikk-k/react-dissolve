"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { HeroCard } from "./HeroCard";
import { SettingsPanel } from "./SettingsPanel";
import { getDefaults, type SettingsKey } from "./settings-config";

const LG_BREAKPOINT = 1024;

export function HomeClient({ docs }: { docs: ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState(getDefaults);
  const hasAutoOpened = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSettingChange = useCallback(
    (key: SettingsKey, value: number) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const openSettingsOnce = useCallback(() => {
    if (hasAutoOpened.current) return;
    hasAutoOpened.current = true;
    if (window.innerWidth >= LG_BREAKPOINT) {
      setDesktopOpen(true);
    } else {
      setMobileOpen(true);
    }
  }, []);

  const toggleSettings = useCallback(() => {
    if (window.innerWidth >= LG_BREAKPOINT) {
      setDesktopOpen((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  }, []);

  const closeMobileSettings = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center">
      <div className="w-full flex px-4 sm:px-10 justify-center">
        <div className="flex-1 flex flex-col items-center max-w-[860px] min-w-[100px]">
          <div className="pt-8 sm:pt-16 w-full">
            <HeroCard
              onOpenSettings={openSettingsOnce}
              onToggleSettings={toggleSettings}
              settings={settings}
            />
          </div>

          <div className="mt-12 sm:mt-20 w-full">
            {docs}
          </div>
        </div>

        {/* Desktop: settings panel */}
        <div
          className={`hidden lg:block transition-all duration-300 ease-out overflow-hidden pt-8 sm:pt-8 ${
            desktopOpen
              ? "max-w-[420px] opacity-100 ml-6"
              : "max-w-0 opacity-0 ml-0"
          }`}
        >
          <div className="sticky top-8">
            <SettingsPanel
              settings={settings}
              onChange={handleSettingChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-neutral-700/70"
            onClick={closeMobileSettings}
          />
          <div
            ref={panelRef}
            className="absolute bottom-0 left-0 right-0 animate-slide-up max-h-[85vh] overflow-y-auto"
          >
            <SettingsPanel
              settings={settings}
              onChange={handleSettingChange}
              className="w-full rounded-b-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
