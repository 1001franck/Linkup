/**
 * Page de connexion LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la connexion
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { GuestRoute } from "@/components/auth/GuestRoute";
import logger from "@/lib/logger";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  // Validation en temps réel
  const isEmailValid = formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : false;
  const isPasswordValid = formData.password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;
  
  const { login, loginCompany, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // MODIFICATION FRONTEND: Pré-remplir l'email si fourni dans l'URL (après inscription)
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setFormData(prev => ({
        ...prev,
        email: emailFromUrl
      }));
    }
  }, [searchParams]);

  // Gérer le message personnalisé depuis l'URL
  const redirectPath = searchParams.get('redirect');
  const message = searchParams.get('message');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Détecter si on est sur mobile
    const isMobile = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth <= 768)
    );
    
    if (isMobile) {
      logger.debug('[LOGIN] 📱 Connexion depuis appareil mobile');
      logger.debug('[LOGIN] 📱 User-Agent:', navigator.userAgent);
      logger.debug('[LOGIN] 📱 Cookies avant login:', document.cookie);
    }

    try {
      // Essayer d'abord la connexion candidat (sans afficher d'erreur si ça échoue)
      const userSuccess = await login(formData.email, formData.password);
      
      if (isMobile) {
        logger.debug('[LOGIN] 📱 Cookies après login utilisateur:', document.cookie);
      }
      
      if (userSuccess) {
        // Sur mobile, attendre plus longtemps pour la propagation du cookie
        const waitTime = isMobile ? 2000 : 1500;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Recharger les infos utilisateur pour s'assurer que l'état est à jour
        try {
          await refreshUser();
          // Attendre un peu plus pour que l'état soit bien propagé
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (refreshError) {
          logger.error('Erreur lors du rechargement:', refreshError);
          // Continuer quand même, le useEffect dans AuthContext récupérera les infos
        }
        
        // Rediriger vers la page demandée ou le dashboard par défaut
        const redirectTo = redirectPath || '/dashboard';
        router.push(redirectTo);
        return;
      }
      
      // Si échec candidat, essayer entreprise (sans afficher d'erreur avant)
      const companySuccess = await loginCompany(formData.email, formData.password);
      
      if (isMobile) {
        logger.debug('[LOGIN] 📱 Cookies après login entreprise:', document.cookie);
      }
      
      if (companySuccess) {
        // Sur mobile, attendre plus longtemps pour la propagation du cookie
        const waitTime = isMobile ? 2000 : 1500;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Recharger les infos entreprise pour s'assurer que l'état est à jour
        try {
          await refreshUser();
          // Attendre un peu plus pour que l'état soit bien propagé
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (refreshError) {
          logger.error('Erreur lors du rechargement:', refreshError);
        }
        
        // Rediriger vers la page demandée ou le dashboard entreprise par défaut
        const redirectTo = redirectPath || '/company-dashboard';
        router.push(redirectTo);
        return;
      }
      
      // Aucune connexion n'a réussi - afficher un message clair
      setError("Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.");
    } catch (error) {
      logger.error('Erreur de connexion:', error);
      if (isMobile) {
        logger.error('[LOGIN] 📱 Erreur sur mobile - Cookies:', document.cookie);
      }
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-start justify-center pt-8 sm:pt-12 md:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-6 text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
            <Typography variant="h2" className="mb-2 text-2xl sm:text-3xl">
              Connexion
            </Typography>
            <Typography variant="muted" className="text-sm sm:text-base">
              Connectez-vous à votre compte pour accéder à vos opportunités
            </Typography>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Se connecter</CardTitle>
              <CardDescription>
                {searchParams.get('email') ? (
                  <>
                    Inscription réussie ! Entrez votre mot de passe pour vous connecter.
                  </>
                ) : message === 'postuler' ? (
                  <>
                    Trouvez le poste qui vous ressemble ! Connectez-vous pour postuler aux offres d'emploi.
                  </>
                ) : message === 'explorer' ? (
                  <>
                    Connectez-vous pour explorer une panoplie d'offres et trouver le poste qui vous ressemble !
                  </>
                ) : (
                  "Entrez vos identifiants pour accéder à votre compte"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${formData.email ? (isEmailValid ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500") : ""}`}
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
                    <p className="text-xs text-red-500">Format d'email invalide</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                      className="rounded border-input"
                    />
                    <span className="text-sm text-muted-foreground">
                      Se souvenir de moi
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-2 sm:mb-0">
                <Button variant="outline" className="w-full text-xs sm:text-sm">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center mt-4 sm:mt-6 pb-4 sm:pb-0">
            <Typography variant="muted" className="text-sm sm:text-base">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Créer un compte
              </Link>
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginContent />
    </GuestRoute>
  );
}
