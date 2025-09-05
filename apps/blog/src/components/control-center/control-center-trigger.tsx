"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { ControlCenter } from "./control-center";

export function ControlCenterTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === "c") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Control Center Trigger Button */}
      <div className="fixed top-4 right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-background/80 backdrop-blur-md shadow-lg border text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          title="Control Center (⌘⇧C)"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
      {/* Control Center Panel */}
      <ControlCenter 
        variant="popup"
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
