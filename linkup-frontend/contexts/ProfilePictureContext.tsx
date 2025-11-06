"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfilePicture } from '@/hooks/use-api';

interface ProfilePictureContextType {
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
  loading: boolean;
}

const ProfilePictureContext = createContext<ProfilePictureContextType | undefined>(undefined);

export function ProfilePictureProvider({ children }: { children: React.ReactNode }) {
  const { data: profilePictureData, loading } = useProfilePicture();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Mettre à jour la photo depuis l'API
  useEffect(() => {
    if (profilePictureData?.data?.profile_picture) {
      setProfilePicture(profilePictureData.data.profile_picture);
    } else {
      setProfilePicture(null);
    }
  }, [profilePictureData]);

  return (
    <ProfilePictureContext.Provider value={{
      profilePicture,
      setProfilePicture,
      loading
    }}>
      {children}
    </ProfilePictureContext.Provider>
  );
}

export function useProfilePictureContext() {
  const context = useContext(ProfilePictureContext);
  if (context === undefined) {
    throw new Error('useProfilePictureContext must be used within a ProfilePictureProvider');
  }
  return context;
}
