/**
 * Hook pour gérer la logique de complétion du profil
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la logique de profil
 * - Open/Closed : Extensible via nouvelles propriétés
 * - Interface Segregation : Retourne seulement ce qui est nécessaire
 */

import { useState, useEffect } from 'react';
import { useUpdateUser } from './use-api';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileData {
  // Informations de base
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  title?: string;
  
  // Photos
  profile_picture?: string;
  banner_picture?: string;
  
  // Compétences
  skills?: string[];
  
  // Expérience
  experience?: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }>;
  
  // Éducation
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }>;
  
  // Liens
  website?: string;
  linkedin?: string;
  github?: string;
  
  // NOUVEAUX CHAMPS de /profile/complete
  description?: string;           // Description détaillée
  job_title?: string;            // Titre du poste
  experience_level?: string;     // Niveau d'expérience
  portfolio_link?: string;       // Lien portfolio
  linkedin_link?: string;        // Lien LinkedIn
  
  // Disponibilité
  availability?: boolean;
}

export interface ProfileCompletion {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  isComplete: boolean;
  nextSteps: string[];
}

export function useProfileCompletion() {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [completion, setCompletion] = useState<ProfileCompletion>({
    percentage: 0,
    completedFields: [],
    missingFields: [],
    isComplete: false,
    nextSteps: []
  });
  
  // MODIFICATION FRONTEND: Ajout du hook pour sauvegarder en backend
  const updateUser = useUpdateUser();
  const { user: authUser, refreshUser, isAuthenticated } = useAuth();

  // Charger les données du profil depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Récupérer les données utilisateur de base (inscription)
        const savedUser = localStorage.getItem('user');
        const savedProfile = localStorage.getItem('userProfile');
        const savedSkills = localStorage.getItem('userSkills');
        const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
        
        let initialProfile: ProfileData = {};
        
        // Charger les données utilisateur de base si disponibles
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          initialProfile = {
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
          };
        }
        
        // Charger le profil étendu si disponible
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          initialProfile = { ...initialProfile, ...parsedProfile };
        }
        
        // MODIFICATION FRONTEND: Charger les nouveaux champs depuis les données utilisateur connecté
        if (authUser && 'id_user' in authUser) {
          initialProfile = {
            ...initialProfile,
            // Champs existants
            firstName: authUser.firstname,
            lastName: authUser.lastname,
            email: authUser.email,
            phone: authUser.phone,
            bio: authUser.bio_pro,
            location: authUser.city && authUser.country ? `${authUser.city}, ${authUser.country}` : authUser.city || authUser.country || '',
            website: authUser.website,
            // NOUVEAUX CHAMPS de /profile/complete
            description: authUser.description,
            job_title: authUser.job_title,
            experience_level: authUser.experience_level,
            portfolio_link: authUser.portfolio_link,
            linkedin_link: authUser.linkedin_link,
            availability: authUser.availability
          };
        }
        
        // Charger les compétences si disponibles
        if (savedSkills) {
          const skills = JSON.parse(savedSkills);
          initialProfile.skills = skills;
        }
        
        setProfileData(initialProfile);
        
        // Marquer comme complété si c'est le cas
        if (profileCompleted) {
          setProfileData(prev => ({ ...prev, isCompleted: true }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    }
  }, [authUser]);

  // Calculer le pourcentage de complétion
  const calculateCompletion = (data: ProfileData): ProfileCompletion => {
    // MODIFICATION FRONTEND: Mise à jour des champs pour inclure /profile/complete
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'location', 'bio', 'title',
      'profile_picture', 'skills', 'experience', 'education',
      // NOUVEAUX CHAMPS de /profile/complete
      'description', 'job_title', 'experience_level'
    ];
    
    const optionalFields = [
      'banner_picture', 'website', 'linkedin', 'github', 'availability',
      // NOUVEAUX CHAMPS optionnels de /profile/complete
      'portfolio_link', 'linkedin_link'
    ];
    
    const allFields = [...requiredFields, ...optionalFields];
    const completedFields: string[] = [];
    const missingFields: string[] = [];
    const nextSteps: string[] = [];
    
    // Vérifier les champs requis
    requiredFields.forEach(field => {
      const value = data[field as keyof ProfileData];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            completedFields.push(field);
          } else {
            missingFields.push(field);
          }
        } else {
          completedFields.push(field);
        }
      } else {
        missingFields.push(field);
      }
    });
    
    // Vérifier les champs optionnels
    optionalFields.forEach(field => {
      const value = data[field as keyof ProfileData];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            completedFields.push(field);
          }
        } else {
          completedFields.push(field);
        }
      }
    });
    
    // Calculer le pourcentage (seulement les champs requis)
    const percentage = Math.round((completedFields.filter(f => requiredFields.includes(f)).length / requiredFields.length) * 100);
    
    // Déterminer les prochaines étapes
    if (missingFields.includes('firstName') || missingFields.includes('lastName')) {
      nextSteps.push('Ajoutez votre nom complet');
    }
    if (missingFields.includes('title')) {
      nextSteps.push('Définissez votre titre professionnel');
    }
    if (missingFields.includes('bio')) {
      nextSteps.push('Rédigez votre biographie');
    }
    if (missingFields.includes('profile_picture')) {
      nextSteps.push('Ajoutez une photo de profil');
    }
    if (missingFields.includes('skills')) {
      nextSteps.push('Ajoutez vos compétences');
    }
    if (missingFields.includes('experience')) {
      nextSteps.push('Ajoutez votre expérience professionnelle');
    }
    if (missingFields.includes('education')) {
      nextSteps.push('Ajoutez votre formation');
    }
    // NOUVELLES ÉTAPES pour /profile/complete
    if (missingFields.includes('description')) {
      nextSteps.push('Ajoutez une description détaillée');
    }
    if (missingFields.includes('job_title')) {
      nextSteps.push('Définissez votre titre de poste');
    }
    if (missingFields.includes('experience_level')) {
      nextSteps.push('Sélectionnez votre niveau d\'expérience');
    }
    
    return {
      percentage,
      completedFields,
      missingFields: missingFields.filter(f => requiredFields.includes(f)),
      isComplete: percentage === 100,
      nextSteps: nextSteps.slice(0, 3) // Limiter à 3 prochaines étapes
    };
  };

  // MODIFICATION FRONTEND: Mettre à jour le profil avec sauvegarde backend
  const updateProfile = async (newData: Partial<ProfileData>) => {
    const updatedData = { ...profileData, ...newData };
    
    // Mettre à jour l'état local immédiatement
    setProfileData(updatedData);
    
    // Sauvegarder dans localStorage (pour compatibilité)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('userProfile', JSON.stringify(updatedData));
        
        // Marquer comme complété si 100%
        const newCompletion = calculateCompletion(updatedData);
        if (newCompletion.isComplete) {
          localStorage.setItem('profileCompleted', 'true');
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du profil:', error);
      }
    }
    
    // MODIFICATION FRONTEND: Sauvegarder en backend (en arrière-plan)
    // Ne pas attendre la réponse pour éviter les blocages
    updateUser.mutate({
      bio_pro: updatedData.bio,
      description: updatedData.description,
      skills: updatedData.skills,
      job_title: updatedData.job_title,
      experience_level: updatedData.experience_level,
      availability: updatedData.availability,
      portfolio_link: updatedData.portfolio_link,
      linkedin_link: updatedData.linkedin_link,
      website: updatedData.website,
      // Extraire city et country de location si nécessaire
      city: updatedData.location?.split(',')[0]?.trim() || '',
      country: updatedData.location?.split(',')[1]?.trim() || ''
    }, {
      onSuccess: () => {
        // MODIFICATION FRONTEND: Rafraîchir les données utilisateur après sauvegarde
        refreshUser().catch((error) => {
          console.error('❌ Erreur lors du rafraîchissement:', error);
        });
      },
      onError: (error) => {
        console.error('❌ Erreur sauvegarde backend:', error);
      }
    });
  };

  // Recalculer la complétion quand les données changent
  useEffect(() => {
    const newCompletion = calculateCompletion(profileData);
    setCompletion(newCompletion);
  }, [profileData]);

  // MODIFICATION FRONTEND: Forcer la mise à jour quand authUser change
  useEffect(() => {
    if (authUser && 'id_user' in authUser) {
      const updatedProfileData = {
        firstName: authUser.firstname,
        lastName: authUser.lastname,
        email: authUser.email,
        phone: authUser.phone,
        bio: authUser.bio_pro,
        location: authUser.city && authUser.country ? `${authUser.city}, ${authUser.country}` : authUser.city || authUser.country || '',
        website: authUser.website,
        description: authUser.description,
        job_title: authUser.job_title,
        experience_level: authUser.experience_level,
        portfolio_link: authUser.portfolio_link,
        linkedin_link: authUser.linkedin_link,
        availability: authUser.availability,
        profile_picture: authUser.profile_picture,
        skills: authUser.skills || []
      };
      
      // Mettre à jour les données du profil
      setProfileData(updatedProfileData);
    }
  }, [authUser]);

  // MODIFICATION FRONTEND: Fonction pour forcer la mise à jour du pourcentage
  const refreshCompletion = async () => {
    try {
      // Vérifier si l'utilisateur est connecté avant de rafraîchir
      if (authUser && isAuthenticated) {
        await refreshUser();
      }
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
    }
  };

  return {
    profileData,
    completion,
    updateProfile,
    refreshCompletion, // NOUVEAU: Fonction pour rafraîchir le pourcentage
    isProfileComplete: completion.isComplete,
    profileCompletionPercentage: completion.percentage,
    nextSteps: completion.nextSteps,
    missingRequiredFields: completion.missingFields
  };
}
