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
  isClientReady: boolean;
}

interface ClientProviderProps {
  children: ReactNode;
}

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: ClientProviderProps) {
  const [client] = useState(() => new Client());
  const [isClientReady, setIsClientReady] = useState(false); // 新增状态

  useEffect(() => {
    const claim = selectLocalStorageClaim();
    if (claim) {
      client.claim = claim;
      setIsClientReady(true); // 设置 client 已准备好
    } else {
      setIsClientReady(false); // 如果没有 claim，client 未准备好
    }
  }, [client]);

  return (
    <ClientContext.Provider value={{ client, isClientReady }}>
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

export function updateLocalStorageClaim(claim: string) {
  if (typeof window !== "undefined") {
    return localStorage.setItem("X-Access-Claim", claim);
  }

  return null;
}

export function selectLocalStorageClaim() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("X-Access-Claim");
  }

  return null;
}
