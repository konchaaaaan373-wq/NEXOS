"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { clinics, adminUsers } from "@/data/seed";
import type { Clinic, AdminUser, UserRole } from "@/data/types";
import { isNecoRole, canEditClinic } from "@/data/types";

interface AuthContextValue {
  // Current user (mock auth — switchable for demo)
  currentUser: AdminUser;
  setCurrentUser: (user: AdminUser) => void;
  allUsers: AdminUser[];

  // Clinic selection
  currentClinic: Clinic;
  setClinicById: (id: string) => void;
  accessibleClinics: Clinic[];

  // Role helpers
  isNeco: boolean;
  canEdit: boolean;
  userRole: UserRole;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser>(adminUsers[0]); // default: Neco admin
  const [currentClinic, setCurrentClinic] = useState<Clinic>(clinics[0]);

  const accessibleClinics =
    currentUser.role === "neco_admin"
      ? clinics
      : clinics.filter((c) => currentUser.clinicIds.includes(c.id));

  const setClinicById = useCallback(
    (id: string) => {
      const clinic = clinics.find((c) => c.id === id);
      if (clinic) setCurrentClinic(clinic);
    },
    []
  );

  const isNeco = isNecoRole(currentUser.role);
  const canEdit = canEditClinic(currentUser, currentClinic.id);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers: adminUsers.filter((u) => u.isActive),
        currentClinic,
        setClinicById,
        accessibleClinics,
        isNeco,
        canEdit,
        userRole: currentUser.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Keep backward-compatible alias
export function useClinic() {
  const { currentClinic, setClinicById, accessibleClinics } = useAuth();
  return {
    currentClinic,
    setClinicById,
    allClinics: accessibleClinics,
  };
}
