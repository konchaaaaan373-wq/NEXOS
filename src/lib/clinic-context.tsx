"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { clinics } from "@/data/seed";
import type { Clinic } from "@/data/types";

interface ClinicContextValue {
  currentClinic: Clinic;
  setClinicById: (id: string) => void;
  allClinics: Clinic[];
}

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [currentClinic, setCurrentClinic] = useState<Clinic>(clinics[0]);

  const setClinicById = useCallback((id: string) => {
    const clinic = clinics.find((c) => c.id === id);
    if (clinic) setCurrentClinic(clinic);
  }, []);

  return (
    <ClinicContext.Provider
      value={{ currentClinic, setClinicById, allClinics: clinics }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider");
  return ctx;
}
