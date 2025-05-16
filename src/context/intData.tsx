"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;
  lastRefresh: number;
  setLastRefresh: (timestamp: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, selectedThreadId: initialThreadId }: { children: ReactNode; selectedThreadId?: string | null }) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreadId || null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  // Set default thread ID after mounting (if needed)
  useEffect(() => {
    if (!selectedThreadId) {
      setSelectedThreadId(""); // Change this as per your logic
    }
  }, []);

  return (
    <UserContext.Provider value={{ selectedThreadId, setSelectedThreadId, lastRefresh,setLastRefresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}



