"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { clinics, adminUsers } from "@/data/seed";
import type { Clinic, AdminUser, UserRole } from "@/data/types";
import { isNecoRole, canEditClinic } from "@/data/types";

interface AuthContextValue {
  currentUser: AdminUser;
  setCurrentUser: (user: AdminUser) => void;
  allUsers: AdminUser[];

  currentClinic: Clinic;
  setClinicById: (id: string) => void;
  accessibleClinics: Clinic[];

  isNeco: boolean;
  canEdit: boolean;
  userRole: UserRole;

  isLoggedIn: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem("nexos_demo_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = adminUsers.find((u) => u.id === parsed.id);
      return found || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AdminUser>(adminUsers[0]);
  const [currentClinic, setCurrentClinic] = useState<Clinic>(clinics[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCurrentUserState(stored);
      setIsLoggedIn(true);
      // Set appropriate default clinic
      if (stored.role === "neco_admin") {
        setCurrentClinic(clinics[0]);
      } else {
        const userClinic = clinics.find((c) => stored.clinicIds.includes(c.id));
        if (userClinic) setCurrentClinic(userClinic);
      }
    }
    setInitialized(true);
  }, []);

  const setCurrentUser = useCallback((user: AdminUser) => {
    setCurrentUserState(user);
    sessionStorage.setItem("nexos_demo_user", JSON.stringify(user));
    // Auto-select first accessible clinic for non-neco users
    if (user.role !== "neco_admin" && user.clinicIds.length > 0) {
      const userClinic = clinics.find((c) => user.clinicIds.includes(c.id));
      if (userClinic) setCurrentClinic(userClinic);
    }
  }, []);

  const login = useCallback((user: AdminUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  }, [setCurrentUser]);

  const logout = useCallback(() => {
    sessionStorage.removeItem("nexos_demo_user");
    setIsLoggedIn(false);
    setCurrentUserState(adminUsers[0]);
    setCurrentClinic(clinics[0]);
  }, []);

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

  // Show nothing until hydrated to avoid mismatch
  if (!initialized) {
    return null;
  }

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
        isLoggedIn,
        login,
        logout,
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

export function useClinic() {
  const { currentClinic, setClinicById, accessibleClinics } = useAuth();
  return {
    currentClinic,
    setClinicById,
    allClinics: accessibleClinics,
  };
}
