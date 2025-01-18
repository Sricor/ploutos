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
      const claim = localStorage.getItem("X-Access-Claim");
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

export function updateClaim(claim: string) {
  if (typeof window !== "undefined") {
    return localStorage.setItem("X-Access-Claim", claim);
  }

  return null
}

export function selectClaim() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("X-Access-Claim");
  }

  return null
}