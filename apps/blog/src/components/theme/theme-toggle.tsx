"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="h-8 w-8 p-0"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light mode</span>
      </Button>
      
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        className="h-8 w-8 p-0"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">System mode</span>
      </Button>
      
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="h-8 w-8 p-0"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark mode</span>
      </Button>
    </div>
  );
}

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}