"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Alert from "@orangec-at/design/components/ui/alert";

interface AlertContextType {
  showAlert: (message: string, onConfirm?: () => void) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: React.ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<
    (() => void) | undefined
  >(undefined);

  const showAlert = useCallback(
    (alertMessage: string, onConfirm?: () => void) => {
      setMessage(alertMessage);
      setConfirmCallback(() => onConfirm);
      setIsOpen(true);
    },
    []
  );

  const hideAlert = useCallback(() => {
    setIsOpen(false);
    setMessage("");
    setConfirmCallback(undefined);
  }, []);

  const handleConfirm = useCallback(() => {
    confirmCallback?.();
    hideAlert();
  }, [confirmCallback, hideAlert]);

  const value: AlertContextType = {
    showAlert,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Alert
        open={isOpen}
        onOpenChange={setIsOpen}
        title={message}
        onConfirm={handleConfirm}
      />
    </AlertContext.Provider>
  );
}

/**
 * AlertContext 사용 훅
 * @throws {Error} AlertProvider 외부에서 사용 시
 */
export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);

  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }

  return context;
}
