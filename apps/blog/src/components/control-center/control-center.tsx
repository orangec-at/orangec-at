"use client";

import { useEffect } from "react";
import { X, Wifi, Bluetooth, Moon, Sun, Monitor, Volume2, Battery, Lightbulb } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ControlCenter({ isOpen, onClose }: ControlCenterProps) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun className="h-8 w-8" />;
      case "dark": return <Moon className="h-8 w-8" />;
      default: return <Monitor className="h-8 w-8" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light": return "라이트 모드";
      case "dark": return "다크 모드";
      default: return "시스템 모드";
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Control Center Panel */}
      <div
        className={`fixed right-6 top-6 w-96 bg-background/95 backdrop-blur-md rounded-3xl shadow-2xl border z-50 transition-all duration-500 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-foreground">Control Center</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-4 gap-3 h-80">
            {/* Theme Control - Large Card */}
            <div className="col-span-2 row-span-2 bg-gradient-to-br from-accent/80 to-accent/40 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-muted-foreground/50">
                {getThemeIcon()}
              </div>
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">테마</h3>
                  <p className="text-sm text-muted-foreground">{getThemeLabel()}</p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant={theme === "light" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="flex-1 h-10"
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="flex-1 h-10"
                  >
                    <Monitor className="h-4 w-4 mr-1" />
                    Auto
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="flex-1 h-10"
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Dark
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Toggle Cards */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <Wifi className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-xs text-muted-foreground font-medium">Wi-Fi</span>
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer">
              <Bluetooth className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-xs text-muted-foreground font-medium">Bluetooth</span>
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-1"></div>
            </div>

            {/* Battery Card */}
            <div className="col-span-2 bg-gradient-to-r from-green-500/20 to-emerald-500/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Battery className="h-6 w-6 text-green-500" />
                <div>
                  <div className="text-sm font-semibold text-foreground">87%</div>
                  <div className="text-xs text-muted-foreground">배터리</div>
                </div>
              </div>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-[87%] h-full bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Volume Control */}
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl p-4 flex flex-col justify-center">
              <Volume2 className="h-6 w-6 text-orange-500 mb-2" />
              <div className="text-xs text-muted-foreground font-medium mb-2">Volume</div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-orange-500 rounded-full"></div>
              </div>
            </div>

            {/* Brightness Control */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-2xl p-4 flex flex-col justify-center">
              <Lightbulb className="h-6 w-6 text-yellow-500 mb-2" />
              <div className="text-xs text-muted-foreground font-medium mb-2">Brightness</div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Shortcuts Info */}
          <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border/50">
            <div className="text-xs text-muted-foreground text-center">
              ⌘⇧C로 열기 • ESC로 닫기
            </div>
          </div>
        </div>
      </div>
    </>
  );
}