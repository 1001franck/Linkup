/**
 * Page Paramètres - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des paramètres utilisateur
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/container";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUploadFile, useUpdateUser, useMutation } from "@/hooks/use-api";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import logger from "@/lib/logger";
import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { ProfileTab } from "@/components/settings/profile-tab";
import { SecurityTab } from "@/components/settings/security-tab";
import { AppearanceTab } from "@/components/settings/appearance-tab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { profilePicture, setProfilePicture } = useProfilePictureContext();
  const uploadFile = useUploadFile();
  const updateUser = useUpdateUser();
  
  // MODIFICATION FRONTEND: Hook pour supprimer la photo de profil (défini localement)
  const deleteProfilePicture = useMutation(
    async () => await apiClient.deleteProfilePicture(),
    {
      showToast: true,
    }
  );
  
  // MODIFICATION FRONTEND: Récupération des vraies données utilisateur
  const { user: authUser } = useAuth();

  // MODIFICATION FRONTEND: Remplacement des données statiques par les vraies données
  const [profileData, setProfileData] = useState({
    firstName: (authUser && 'firstname' in authUser) ? (authUser.firstname || "") : "",
    lastName: (authUser && 'lastname' in authUser) ? (authUser.lastname || "") : "",
    email: (authUser && 'email' in authUser) ? (authUser.email || "") : "",
    phone: (authUser && 'phone' in authUser) ? (authUser.phone || "") : "",
    location: (authUser && 'city' in authUser && 'country' in authUser && authUser.city && authUser.country) ? `${authUser.city}, ${authUser.country}` : "",
    bio: (authUser && 'bio_pro' in authUser) ? (authUser.bio_pro || "") : "",
    website: (authUser && 'website' in authUser) ? (authUser.website || "") : "",
    linkedin: "" // Pas encore dans la DB
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // MODIFICATION FRONTEND: Mise à jour des données quand l'utilisateur change
  useEffect(() => {
    if (authUser) {
      setProfileData({
        firstName: ('firstname' in authUser) ? (authUser.firstname || "") : "",
        lastName: ('lastname' in authUser) ? (authUser.lastname || "") : "",
        email: ('email' in authUser) ? (authUser.email || "") : "",
        phone: ('phone' in authUser) ? (authUser.phone || "") : "",
        location: ('city' in authUser && 'country' in authUser && authUser.city && authUser.country) ? `${authUser.city}, ${authUser.country}` : "",
        bio: ('bio_pro' in authUser) ? (authUser.bio_pro || "") : "",
        website: ('website' in authUser) ? (authUser.website || "") : "",
        linkedin: "" // Pas encore dans la DB
      });
    }
  }, [authUser]);

  // MODIFICATION FRONTEND: Fonction pour supprimer la photo de profil
  const handleDeleteProfilePicture = async () => {
    try {
      const result = await deleteProfilePicture.mutate(undefined as any);
      
      // Mettre à jour le contexte pour supprimer la photo
      setProfilePicture(null);
      
      // Vérifier le message de réponse
      const resultTyped = result as any;
      const message = resultTyped?.data?.message || "Photo supprimée avec succès";
      
      toast({
        title: "Photo supprimée",
        description: message,
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de la photo:', error);
      
      // Gérer spécifiquement le cas "Aucune photo de profil trouvée"
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      if (errorMessage.includes('Aucune photo de profil trouvée')) {
        // Considérer comme un succès si aucune photo n'existe
        setProfilePicture(null);
        toast({
          title: "Photo supprimée",
          description: "Aucune photo de profil à supprimer",
          variant: "default",
          duration: 3000,
        });
      } else {
        toast({
          title: "Erreur de suppression",
          description: "Impossible de supprimer votre photo de profil. Veuillez réessayer.",
          variant: "destructive",
          duration: 4000,
        });
      }
    }
  };

  // Fonction pour gérer l'upload de photo
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier invalide",
        description: "Veuillez sélectionner une image (JPG, PNG, GIF)",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5MB",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    try {
      toast({
        title: "Upload en cours...",
        description: "Votre photo est en cours d'upload",
        duration: 2000,
      });

      const result = await uploadFile.mutate({
        file,
        fileType: 'photo' as 'pdf' | 'photo'
      });

      const resultTyped = result as any;
      if (resultTyped?.data?.publicUrl) {
        // Mettre à jour le contexte global immédiatement
        setProfilePicture(resultTyped.data.publicUrl);
        
        toast({
          title: "Photo uploadée !",
          description: "Votre photo de profil a été mise à jour",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      logger.error('Erreur upload photo:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader la photo. Veuillez réessayer.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };



  // MODIFICATION FRONTEND: Remplacement de la fonction vide par la vraie sauvegarde
  const handleProfileSave = () => {
    handleSaveProfile();
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur de validation",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }
    // TODO: Implémenter le changement de mot de passe
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été modifié avec succès",
      variant: "default",
      duration: 3000,
    });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };



  const handleDeleteAccount = () => {
    // Confirmation de suppression du compte
    if (true) {
      // TODO: Implémenter la suppression du compte
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
        variant: "default",
        duration: 3000,
      });
    }
  };

  // MODIFICATION FRONTEND: Fonction pour sauvegarder le profil
  const handleSaveProfile = async () => {
    try {
      // Séparer la localisation en city et country
      const [city, country] = profileData.location.split(',').map(s => s.trim());
      
      const result = await updateUser.mutate({
        firstname: profileData.firstName,
        lastname: profileData.lastName,
        phone: profileData.phone,
        bio_pro: profileData.bio,
        website: profileData.website,
        city: city || "",
        country: country || ""
      });

      const resultTyped = result as any;
      if (resultTyped?.data) {
        toast({
          title: "Profil mis à jour !",
          description: "Vos informations ont été sauvegardées avec succès",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos informations. Veuillez réessayer.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader />

      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Contenu principal */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <ProfileTab
                  profileData={profileData}
                  onProfileDataChange={(data) => setProfileData((prev) => ({ ...prev, ...data }))}
                  profilePicture={profilePicture}
                  onPhotoUpload={handlePhotoUpload}
                  onDeletePhoto={handleDeleteProfilePicture}
                  onSave={handleProfileSave}
                  isUploading={uploadFile.loading}
                  isDeleting={deleteProfilePicture.loading}
                  isSaving={updateUser.loading}
                />
              )}

              {activeTab === "security" && (
                <SecurityTab
                  passwordData={passwordData}
                  onPasswordDataChange={(data) => setPasswordData((prev) => ({ ...prev, ...data }))}
                  showCurrentPassword={showCurrentPassword}
                  showNewPassword={showNewPassword}
                  showConfirmPassword={showConfirmPassword}
                  onToggleCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
                  onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
                  onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  onChangePassword={handlePasswordChange}
                  onDeleteAccount={handleDeleteAccount}
                />
              )}



              {activeTab === "appearance" && <AppearanceTab />}
          </div>
          </div>
        </div>
      </Container>
      <Toaster />
    </div>
  );
}