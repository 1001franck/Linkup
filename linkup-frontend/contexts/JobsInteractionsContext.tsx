/**
 * Contexte global pour partager l'état des interactions avec les jobs
 * Permet la synchronisation entre les pages /jobs et /my-applications
 */

"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useJobsInteractions } from '@/hooks/use-jobs-interactions';

interface JobsInteractionsContextType {
  state: ReturnType<typeof useJobsInteractions>['state'];
  actions: ReturnType<typeof useJobsInteractions>['actions'];
}

const JobsInteractionsContext = createContext<JobsInteractionsContextType | undefined>(undefined);

interface JobsInteractionsProviderProps {
  children: ReactNode;
}

export function JobsInteractionsProvider({ children }: JobsInteractionsProviderProps) {
  const { state, actions } = useJobsInteractions();

  return (
    <JobsInteractionsContext.Provider value={{ state, actions }}>
      {children}
    </JobsInteractionsContext.Provider>
  );
}

export function useJobsInteractionsContext() {
  const context = useContext(JobsInteractionsContext);
  if (context === undefined) {
    throw new Error('useJobsInteractionsContext must be used within a JobsInteractionsProvider');
  }
  return context;
}
