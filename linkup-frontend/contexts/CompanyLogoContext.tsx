"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CompanyLogoContextType {
  logo: string | null;
  setLogo: (url: string | null) => void;
  loading: boolean;
}

const CompanyLogoContext = createContext<CompanyLogoContextType | undefined>(undefined);

export function CompanyLogoProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mettre à jour le logo depuis les données de l'entreprise
  useEffect(() => {
    if (isAuthenticated && user && 'logo' in user) {
      setLogo(user.logo || null);
    } else {
      setLogo(null);
    }
  }, [user, isAuthenticated]);

  return (
    <CompanyLogoContext.Provider value={{
      logo,
      setLogo,
      loading
    }}>
      {children}
    </CompanyLogoContext.Provider>
  );
}

export function useCompanyLogoContext() {
  const context = useContext(CompanyLogoContext);
  if (context === undefined) {
    throw new Error('useCompanyLogoContext must be used within a CompanyLogoProvider');
  }
  return context;
}
