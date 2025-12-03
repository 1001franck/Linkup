/**
 * Page d'inscription Entreprise - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'inscription entreprise
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, Building2, Users, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { apiClient } from "@/lib/api-client";
import logger from "@/lib/logger";
import { useAuth } from "@/contexts/AuthContext";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { PasswordStrength } from "@/components/ui/password-strength";

export default function RegisterCompanyPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  // Plus besoin de loginCompany car pas de connexion automatique
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    companySize: "",
    industry: "",
    website: "",
    foundedYear: "",
    acceptTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    // Validation des termes
    if (!formData.acceptTerms) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.signupCompany({
        name: formData.companyName,
        description: `Entreprise ${formData.companyName} dans le secteur ${formData.industry || 'non spécifié'}. ${formData.companyName} est une entreprise spécialisée dans ${formData.industry || 'divers secteurs'} et recherche des talents pour rejoindre son équipe.`,
        industry: formData.industry || null,
        password: formData.password,
        recruiter_mail: formData.email,
        recruiter_firstname: formData.firstName || null,
        recruiter_lastname: formData.lastName || null,
        recruiter_phone: formData.phone || null,
        website: formData.website || null,
        employees_number: formData.companySize || null,
        founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
      });

      if (response.success) {
        toast({
          title: "Inscription réussie !",
          description: `Bienvenue ${formData.companyName} ! Redirection vers la page de connexion...`,
          variant: "default",
          duration: 3000,
        });
        
        // MODIFICATION FRONTEND: Redirection directe vers login avec email pré-rempli
        // Même logique que pour les utilisateurs
        setTimeout(() => {
          router.push('/login?email=' + encodeURIComponent(formData.email));
        }, 2000);
      } else {
        // Gestion spécifique des erreurs
        let errorTitle = "Erreur d'inscription";
        let errorDescription = response.error || "Une erreur est survenue lors de l'inscription";
        
        if (response.error?.includes("Email déjà utilisé") || response.error?.includes("recruiter_mail")) {
          errorTitle = "Email déjà utilisé";
          errorDescription = "Cet email est déjà associé à un compte entreprise. Essayez de vous connecter ou utilisez un autre email.";
        } else if (response.error?.includes("duplicate")) {
          errorTitle = "Compte existant";
          errorDescription = "Une entreprise avec ces informations existe déjà. Essayez de vous connecter.";
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
      }
    } catch (error) {
      logger.error('Erreur lors de l\'inscription entreprise:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation en temps réel
  const isPasswordValid = formData.password.length >= 8;
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const isEmailValid = formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : false;
  const isCompanyNameValid = formData.companyName.trim().length >= 2;
  const isWebsiteValid = !formData.website || /^https?:\/\/.+/.test(formData.website);
  
  // Calcul du pourcentage de complétion du formulaire
  const requiredFields = {
    companyName: isCompanyNameValid,
    email: isEmailValid,
    industry: formData.industry !== '',
    companySize: formData.companySize !== '',
    firstName: formData.firstName.trim().length > 0,
    lastName: formData.lastName.trim().length > 0,
    password: isPasswordValid,
    confirmPassword: isPasswordMatch,
    acceptTerms: formData.acceptTerms
  };
  
  const completedFields = Object.values(requiredFields).filter(Boolean).length;
  const totalFields = Object.keys(requiredFields).length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);
  
  // Vérifier si le formulaire est prêt à être soumis
  const isFormValid = Object.values(requiredFields).every(Boolean) && isWebsiteValid;

  return (
    <GuestRoute>
      <div className="min-h-screen bg-background flex items-start justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/register" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'inscription postulant
            </Link>
            <Typography variant="h2" className="mb-2">
              Inscription Entreprise
            </Typography>
            <Typography variant="muted" className="text-center">
              Créez votre compte entreprise et accédez à nos solutions de recrutement intelligentes
            </Typography>
          </div>

          {/* Registration Form */}
          <Card className="shadow-xl border border-border bg-card">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                Informations de l'entreprise
              </CardTitle>
              <CardDescription>
                Remplissez les informations de votre entreprise et de votre responsable recrutement
              </CardDescription>
              
              {/* Barre de progression */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progression du formulaire</span>
                  <span className="text-xs font-medium text-primary">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <Typography variant="h4" className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Informations de l'entreprise
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nom de l'entreprise *
                      </label>
                      <div className="relative">
                      <Input
                        type="text"
                        placeholder="Nom de votre entreprise"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                          className={formData.companyName ? (isCompanyNameValid ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500") : ""}
                        required
                      />
                        {formData.companyName && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isCompanyNameValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {formData.companyName && !isCompanyNameValid && (
                        <p className="text-xs text-red-500 mt-1">Le nom doit contenir au moins 2 caractères</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Site web
                      </label>
                      <div className="relative">
                      <Input
                        type="url"
                        placeholder="https://votre-entreprise.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                          className={formData.website ? (isWebsiteValid ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500") : ""}
                        />
                        {formData.website && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isWebsiteValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {formData.website && !isWebsiteValid && (
                        <p className="text-xs text-red-500 mt-1">L'URL doit commencer par http:// ou https://</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Secteur d'activité *
                      </label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        required
                      >
                        <option value="">Sélectionnez un secteur</option>
                        <option value="tech">Technologie & Logiciel</option>
                        <option value="finance">Finance & Assurance</option>
                        <option value="healthcare">Santé & Médical</option>
                        <option value="education">Éducation & Formation</option>
                        <option value="retail">Commerce & E-commerce</option>
                        <option value="manufacturing">Industrie & Production</option>
                        <option value="consulting">Conseil & Services</option>
                        <option value="media">Média & Communication</option>
                        <option value="energy">Énergie & Environnement</option>
                        <option value="transport">Transport & Logistique</option>
                        <option value="real-estate">Immobilier & Construction</option>
                        <option value="hospitality">Hôtellerie & Restauration</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Taille de l'entreprise *
                      </label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.companySize}
                        onChange={(e) => handleInputChange("companySize", e.target.value)}
                        required
                      >
                        <option value="">Sélectionnez la taille</option>
                        <option value="1-10">1-10 employés (Startup)</option>
                        <option value="11-50">11-50 employés (PME)</option>
                        <option value="51-200">51-200 employés (Entreprise moyenne)</option>
                        <option value="201-500">201-500 employés (Grande entreprise)</option>
                        <option value="501-1000">501-1000 employés (Grand groupe)</option>
                        <option value="1000+">1000+ employés (Multinationale)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Année de fondation
                    </label>
                    <Input
                      type="number"
                      placeholder="Ex: 2025"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.foundedYear}
                      onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Année de création réelle de l'entreprise (optionnel)
                    </p>
                  </div>
                </div>

                {/* Contact Person Information */}
                <div className="space-y-4">
                  <Typography variant="h4" className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Responsable du recrutement
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Prénom *
                      </label>
                      <Input
                        type="text"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nom *
                      </label>
                      <Input
                        type="text"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email professionnel *
                      </label>
                      <div className="relative">
                      <Input
                        type="email"
                        placeholder="votre.email@entreprise.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                          className={formData.email ? (isEmailValid ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500") : ""}
                        required
                      />
                        {formData.email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isEmailValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {formData.email && !isEmailValid && (
                        <p className="text-xs text-red-500 mt-1">Format d'email invalide</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Téléphone
                      </label>
                      <PhoneInputComponent
                        value={formData.phone}
                        onChange={(value) => handleInputChange("phone", value || "")}
                        placeholder="Numéro de téléphone"
                      />
                    </div>
                  </div>
                </div>


                {/* Password Section */}
                <div className="space-y-4">
                  <Typography variant="h4" className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Mot de passe
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mot de passe *
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 8 caractères"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={formData.password ? (isPasswordValid ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500") : ""}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        {formData.password && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isPasswordValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {formData.password && (
                        <PasswordStrength password={formData.password} />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirmer le mot de passe *
                      </label>
                      <div className="relative">
                      <Input
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={formData.confirmPassword ? (isPasswordMatch ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500") : ""}
                        required
                      />
                        {formData.confirmPassword && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isPasswordMatch ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {formData.confirmPassword && !isPasswordMatch && (
                        <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                      )}
                      {formData.confirmPassword && isPasswordMatch && (
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Les mots de passe correspondent
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      required
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                      J'accepte les{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        politique de confidentialité
                      </Link>
                    </label>
                  </div>

                </div>

                {/* Submit Button */}
                <div className="space-y-2">
                <Button 
                  type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Création du compte...
                      </span>
                    ) : (
                      "Créer le compte entreprise"
                    )}
                </Button>
                  {!isFormValid && (
                    <p className="text-xs text-center text-muted-foreground">
                      Veuillez remplir tous les champs obligatoires pour continuer
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <Typography variant="muted">
              Déjà un compte entreprise ?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </Typography>
          </div>
        </div>
      </Container>
      <Toaster />
      </div>
    </GuestRoute>
  );
}
