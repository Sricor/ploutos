"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Client } from "@/lib/http/client";

interface ClientContextType {
  client: Client;
}

interface ClientProviderProps {
  children: ReactNode;
}

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: ClientProviderProps) {
  const [client] = useState(() => new Client());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const claim = localStorage.getItem("claim");
      if (claim) {
        client.claim = claim;
      }
    }
  }, [client]);

  return (
    <ClientContext.Provider value={{ client }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }

  return context;
}
