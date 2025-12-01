/**
 * Page Paramètres Entreprise - LinkUp
 * Gestion des paramètres de l'entreprise (mot de passe, préférences)
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import CompanyHeader from "@/components/layout/company-header";
import logger from "@/lib/logger";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { 
  Settings, 
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

export default function CompanySettingsPage() {
  const { user: company, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation du mot de passe
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une minuscule";
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    return "";
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validation en temps réel
    if (field === "newPassword") {
      const error = validatePassword(value);
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: error
      }));
    } else if (field === "confirmPassword") {
      if (value !== passwordData.newPassword) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmPassword: "Les mots de passe ne correspondent pas"
        }));
      } else {
        setPasswordErrors(prev => ({
          ...prev,
          confirmPassword: ""
        }));
      }
    }
  };

  const handlePasswordUpdate = async () => {
    // Réinitialiser les erreurs
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        currentPassword: "Le mot de passe actuel est requis"
      }));
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: "Le nouveau mot de passe est requis"
      }));
      return;
    }

    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: passwordError
      }));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: "Les mots de passe ne correspondent pas"
      }));
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiClient.request(`/companies/me/password`, {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.success) {
        toast({
          title: "Succès",
          description: "Mot de passe mis à jour avec succès",
        });
        // Réinitialiser tous les champs
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      logger.error("Erreur mise à jour mot de passe:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le mot de passe",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || !company) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <Typography variant="h2" className="font-bold mb-2">
              Accès Refusé
            </Typography>
            <Typography variant="muted">
              Vous devez être connecté pour accéder à cette page.
            </Typography>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        <main className="pt-20 pb-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                  <div>
                    <Typography variant="h1" className="font-bold">
                      Paramètres
                    </Typography>
                    <Typography variant="muted">
                      Gérez les paramètres de votre compte entreprise
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Section Mot de passe */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Changer le mot de passe
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe pour sécuriser votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="company-current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        placeholder="Entrez votre mot de passe actuel"
                        className={`pr-10 ${passwordErrors.currentPassword ? "border-red-500" : ""}`}
                        autoComplete="off"
                        autoFocus={false}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="company-new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        placeholder="Entrez votre nouveau mot de passe"
                        className={`pr-10 ${passwordErrors.newPassword ? "border-red-500" : passwordData.newPassword && !passwordErrors.newPassword ? "border-green-500" : ""}`}
                        autoComplete="new-password"
                        autoFocus={false}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>
                    )}
                    {passwordData.newPassword && !passwordErrors.newPassword && (
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Mot de passe valide</span>
                      </div>
                    )}
                    {passwordData.newPassword && (
                      <div className="text-xs text-muted-foreground">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="company-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        placeholder="Confirmez votre nouveau mot de passe"
                        className={`pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : passwordData.confirmPassword && !passwordErrors.confirmPassword && passwordData.newPassword === passwordData.confirmPassword ? "border-green-500" : ""}`}
                        autoComplete="new-password"
                        autoFocus={false}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-red-500">{passwordErrors.confirmPassword}</p>
                    )}
                    {passwordData.confirmPassword && !passwordErrors.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Les mots de passe correspondent</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handlePasswordUpdate} 
                      disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || !!passwordErrors.newPassword || !!passwordErrors.confirmPassword}
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 mr-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </motion.div>
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Mettre à jour le mot de passe
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Section Informations */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                  <CardDescription>
                    Les informations de votre compte entreprise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="muted" className="text-xs mb-1">
                        Nom de l'entreprise
                      </Typography>
                      <Typography variant="h4" className="font-semibold">
                        {(company && 'name' in company) ? company.name : "Non renseigné"}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="muted" className="text-xs mb-1">
                        Email du recruteur
                      </Typography>
                      <Typography variant="h4" className="font-semibold">
                        {(company && 'recruiter_mail' in company) ? company.recruiter_mail : "Non renseigné"}
                      </Typography>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Typography variant="muted" className="text-sm">
                      Pour modifier les informations de votre entreprise, veuillez vous rendre sur la page{" "}
                      <a href="/company-dashboard/profile" className="text-primary hover:underline">
                        Profil
                      </a>
                      .
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </main>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}

