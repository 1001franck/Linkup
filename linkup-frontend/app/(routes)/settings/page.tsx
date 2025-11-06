/**
 * Page Paramètres - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des paramètres utilisateur
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUploadFile, useUpdateUser, useMutation } from "@/hooks/use-api";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Settings, 
  User, 
  Shield, 
  Palette, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  Camera,
  Check,
  X,
  AlertTriangle,
  Info
} from "lucide-react";

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
    () => apiClient.deleteProfilePicture(),
    {
      showToast: true,
    }
  );
  
  // MODIFICATION FRONTEND: Récupération des vraies données utilisateur
  const { user: authUser } = useAuth();

  // MODIFICATION FRONTEND: Remplacement des données statiques par les vraies données
  const [profileData, setProfileData] = useState({
    firstName: authUser?.firstname || "",
    lastName: authUser?.lastname || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    location: authUser?.city && authUser?.country ? `${authUser.city}, ${authUser.country}` : "",
    bio: authUser?.bio_pro || "",
    website: authUser?.website || "",
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
        firstName: authUser.firstname || "",
        lastName: authUser.lastname || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        location: authUser.city && authUser.country ? `${authUser.city}, ${authUser.country}` : "",
        bio: authUser.bio_pro || "",
        website: authUser.website || "",
        linkedin: "" // Pas encore dans la DB
      });
    }
  }, [authUser]);

  // MODIFICATION FRONTEND: Fonction pour supprimer la photo de profil
  const handleDeleteProfilePicture = async () => {
    try {
      const result = await deleteProfilePicture.mutate();
      
      // Mettre à jour le contexte pour supprimer la photo
      setProfilePicture(null);
      
      // Vérifier le message de réponse
      const message = result?.data?.message || "Photo supprimée avec succès";
      
      toast({
        title: "Photo supprimée",
        description: message,
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      
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

      if (result?.data?.publicUrl) {
        // Mettre à jour le contexte global immédiatement
        setProfilePicture(result.data.publicUrl);
        
        toast({
          title: "Photo uploadée !",
          description: "Votre photo de profil a été mise à jour",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Erreur upload photo:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader la photo. Veuillez réessayer.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };



  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "appearance", label: "Apparence", icon: Palette }
  ];

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

      if (result?.data) {
        toast({
          title: "Profil mis à jour !",
          description: "Vos informations ont été sauvegardées avec succès",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BackButton fallbackPath="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors" />
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <Typography variant="h1" className="text-2xl font-bold text-foreground">
                      Paramètres
                    </Typography>
                    <Typography variant="muted" className="text-muted-foreground">
                      Gérez vos préférences et votre compte
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-card backdrop-blur-sm border border-border shadow-lg sticky top-8">
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3">
              {/* Onglet Profil */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
                      <CardTitle className="text-foreground">Informations personnelles</CardTitle>
          <CardDescription className="text-muted-foreground">
                        Gérez vos informations de profil publiques
          </CardDescription>
        </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Photo de profil */}
          <div className="flex items-center space-x-6">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploadFile.loading}
                          />
                          <div className="h-20 w-20 rounded-full overflow-hidden bg-muted">
                            {profilePicture ? (
                              <img 
                                src={profilePicture}
                                alt="Photo de profil"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                              </div>
                            )}
                          </div>
                          <Button
                            size="icon"
                            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 z-20"
                            disabled={uploadFile.loading}
                          >
                            {uploadFile.loading ? (
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Camera className="h-4 w-4 text-primary-foreground" />
                            )}
                          </Button>
            </div>
                        <div>
                          <Typography variant="h4" className="font-semibold mb-1 text-foreground">
                            Photo de profil
                          </Typography>
                          <Typography variant="muted" className="text-sm mb-3 text-muted-foreground">
                            JPG, PNG ou GIF. Max 5MB.
                          </Typography>
                          <div className="flex space-x-2">
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploadFile.loading}
                              />
                              <Button variant="outline" size="sm" disabled={uploadFile.loading}>
                                <Upload className="h-4 w-4 mr-2" />
                                {uploadFile.loading ? "Upload..." : "Changer"}
                              </Button>
                            </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeleteProfilePicture}
                disabled={deleteProfilePicture.loading || !profilePicture}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteProfilePicture.loading ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
                      </div>

                      {/* Formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Prénom
                          </label>
              <Input
                value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Nom
                          </label>
              <Input
                value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email
                          </label>
            <Input
              type="email"
              value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Téléphone
                          </label>
            <Input
              value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Localisation
                          </label>
            <Input
              value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Site web
                          </label>
            <Input
              value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Parlez de vous..."
            />
          </div>

                      <div className="flex justify-end">
                        <Button 
                          onClick={handleProfileSave} 
                          className="bg-primary hover:bg-primary/90"
                          disabled={updateUser.loading}
                        >
                          {updateUser.loading ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {updateUser.loading ? "Sauvegarde..." : "Sauvegarder"}
                        </Button>
          </div>
        </CardContent>
      </Card>
                </motion.div>
              )}

              {/* Onglet Sécurité */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">Changer le mot de passe</CardTitle>
          <CardDescription className="text-muted-foreground">
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Mot de passe actuel
                        </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              <button
                type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nouveau mot de passe
                        </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
              <button
                type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <button
                type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

                      <div className="flex justify-end">
                        <Button onClick={handlePasswordChange} className="bg-primary hover:bg-primary/90">
                          <Lock className="h-4 w-4 mr-2" />
                          Changer le mot de passe
          </Button>
                      </div>
        </CardContent>
      </Card>

                  <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
                      <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription className="text-muted-foreground">
                        Actions irréversibles pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
                      <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
                          <Typography variant="h4" className="font-semibold text-destructive mb-1">
                            Supprimer le compte
              </Typography>
                          <Typography variant="muted" className="text-destructive/80">
                            Cette action est irréversible. Toutes vos données seront supprimées.
              </Typography>
            </div>
                        <Button 
                          variant="outline" 
                          className="border-destructive/20 text-destructive hover:bg-destructive/10"
                          onClick={handleDeleteAccount}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
            </Button>
          </div>
        </CardContent>
      </Card>
                </motion.div>
              )}



              {/* Onglet Apparence */}
              {activeTab === "appearance" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
                      <CardTitle className="text-foreground">Thème et apparence</CardTitle>
          <CardDescription className="text-muted-foreground">
                        Personnalisez l'apparence de votre interface
          </CardDescription>
        </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Thème
                        </label>
          <div className="grid grid-cols-3 gap-4">
            {[
                            { id: "light", label: "Clair", icon: "☀️" },
                            { id: "dark", label: "Sombre", icon: "🌙" },
                            { id: "system", label: "Système", icon: "💻" }
            ].map((theme) => (
              <button
                              key={theme.id}
                              className="flex flex-col items-center space-y-2 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                              <span className="text-2xl">{theme.icon}</span>
                <span className="text-sm font-medium text-foreground">{theme.label}</span>
              </button>
            ))}
          </div>
          </div>

            <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Langue
                        </label>
                        <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="de">Deutsch</option>
                        </select>
        </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Densité d'affichage
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: "compact", label: "Compact" },
                            { id: "normal", label: "Normal" },
                            { id: "comfortable", label: "Confortable" }
                          ].map((density) => (
                    <button
                              key={density.id}
                              className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
                            >
                              {density.label}
                    </button>
                  ))}
                        </div>
                      </div>
              </CardContent>
            </Card>
                </motion.div>
              )}
          </div>
          </div>
        </div>
      </Container>
      <Toaster />
    </div>
  );
}