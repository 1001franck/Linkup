/**
 * Page d'inscription LinkUp - Version Simplifiée
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'inscription
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";


import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, Building2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import logger from "@/lib/logger";
import { Country, City } from "country-state-city";
import { ProfessionAutocomplete } from "@/components/ui/profession-autocomplete";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../../phone-input.css";
import classNames from "classnames";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]); // Erreurs de validation du backend
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();
  
  // État initial du formulaire - toujours vide
  const initialFormData = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "33", // Code pays France par défaut
    password: "",
    confirmPassword: "",
    profession: "",
    city: "",
    country: "FR", // Code ISO pour France
    acceptTerms: false
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Gérer l'autocomplétion des villes
    if (field === "city" && typeof value === "string") {
      if (value.length >= 2 && formData.country) {
        const cities = City.getCitiesOfCountry(formData.country) || [];
        const filteredCities = cities
          .filter(city => city.name.toLowerCase().includes(value.toLowerCase()))
          .map(city => city.name)
          .slice(0, 8); // Limiter à 8 suggestions
        setCitySuggestions(filteredCities);
        setShowCitySuggestions(filteredCities.length > 0);
      } else {
        setCitySuggestions([]);
        setShowCitySuggestions(false);
      }
    }

    // Reset des suggestions de ville quand le pays change
    if (field === "country") {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  // Fonction pour sélectionner une ville depuis les suggestions
  const selectCity = (cityName: string) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    setShowCitySuggestions(false);
    setCitySuggestions([]);
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData(initialFormData);
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  // Réinitialiser le formulaire au montage du composant
  useEffect(() => {
    resetForm();
  }, []);

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
      // Récupérer le nom du pays
      const selectedCountry = Country.getCountryByCode(formData.country);
      
      const response = await apiClient.signupUser({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        bio_pro: formData.profession,
        city: formData.city,
        country: selectedCountry?.name || formData.country,
      });

      if (response.success) {
        // Réinitialiser les erreurs de validation en cas de succès
        setValidationErrors([]);
        
        toast({
          title: "Inscription réussie !",
          description: `Bienvenue ${formData.firstname} ! Redirection vers la page de connexion...`,
          variant: "default",
          duration: 3000,
        });
        
        // MODIFICATION FRONTEND: Redirection directe vers login au lieu de connexion automatique
        // Cela évite les problèmes de timing avec le token JWT
        setTimeout(() => {
          router.push('/login?email=' + encodeURIComponent(formData.email));
        }, 2000);
      } else {
        // Gestion spécifique des erreurs avec détails de validation
        let errorTitle = "Erreur d'inscription";
        let errorDescription = response.error || "Une erreur est survenue lors de l'inscription";
        
        // Stocker les erreurs de validation détaillées
        if (response.details && Array.isArray(response.details) && response.details.length > 0) {
          setValidationErrors(response.details);
        } else {
          setValidationErrors([]);
        }
        
        if (response.error?.includes("Email déjà utilisé")) {
          errorTitle = "Email déjà utilisé";
          errorDescription = "Cet email est déjà associé à un compte. Essayez de vous connecter ou utilisez un autre email.";
          setValidationErrors([]);
        } else if (response.error?.includes("duplicate")) {
          errorTitle = "Compte existant";
          errorDescription = "Un compte avec ces informations existe déjà. Essayez de vous connecter.";
          setValidationErrors([]);
        } else if (response.error?.includes("Données invalides") && response.details && response.details.length > 0) {
          errorTitle = "Erreurs de validation";
          errorDescription = "Veuillez corriger les erreurs ci-dessous";
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
          duration: 5000, // Afficher plus longtemps pour les erreurs
        });
      }
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation du mot de passe en temps réel
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };
  
  const isPasswordValid = Object.values(passwordRequirements).every(v => v);
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  
  // Réinitialiser les erreurs de validation quand l'utilisateur modifie le mot de passe
  useEffect(() => {
    if (formData.password && validationErrors.length > 0) {
      // Vérifier si les erreurs concernent le mot de passe
      const passwordErrors = validationErrors.filter(err => 
        err.toLowerCase().includes('mot de passe') || 
        err.toLowerCase().includes('password')
      );
      if (passwordErrors.length > 0 && isPasswordValid) {
        // Si le mot de passe est maintenant valide, retirer les erreurs de mot de passe
        setValidationErrors(prev => prev.filter(err => 
          !err.toLowerCase().includes('mot de passe') && 
          !err.toLowerCase().includes('password')
        ));
      }
    }
  }, [formData.password, isPasswordValid, validationErrors.length]);

  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
            <Typography variant="h2" className="mb-2">
              Créer un compte
            </Typography>
            <Typography variant="muted">
              Rejoignez LinkUp et découvrez de nouvelles opportunités
            </Typography>
          </div>

          {/* Registration Form */}
          <Card className="shadow-xl border border-border bg-card">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                Inscription rapide
              </CardTitle>
              <CardDescription>
                Quelques informations pour commencer votre aventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Affichage des erreurs de validation générales */}
              {validationErrors.length > 0 && validationErrors.filter(err => 
                !err.toLowerCase().includes('mot de passe') && !err.toLowerCase().includes('password')
              ).length > 0 && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                    Erreurs à corriger :
                  </h3>
                  <ul className="space-y-1">
                    {validationErrors
                      .filter(err => !err.toLowerCase().includes('mot de passe') && !err.toLowerCase().includes('password'))
                      .map((error, index) => (
                        <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                {/* Nom et Prénom */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstname" className="text-sm font-medium text-foreground">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="firstname"
                        type="text"
                        placeholder="Jean"
                        value={formData.firstname}
                        onChange={(e) => handleInputChange("firstname", e.target.value)}
                        className="pl-10"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastname" className="text-sm font-medium text-foreground">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="lastname"
                        type="text"
                        placeholder="Dupont"
                        value={formData.lastname}
                        onChange={(e) => handleInputChange("lastname", e.target.value)}
                        className="pl-10"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Phone Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Adresse e-mail *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Téléphone *
                    </label>
                    <PhoneInput
                      country="fr"
                      value={formData.phone}
                      onChange={(value) => handleInputChange("phone", value)}
                      placeholder="Entrez votre numéro"
                      containerClass="phone-input-wrapper"
                      inputClass="custom-phone-input"
                      buttonClass="custom-flag-dropdown"
                      dropdownClass="custom-country-list"
                      searchClass="custom-search-box"
                      enableSearch={true}
                      disableSearchIcon={false}
                      searchPlaceholder="Rechercher un pays..."
                      preferredCountries={['fr', 'be', 'ch', 'ca', 'us', 'gb']}
                    />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="profession" className="text-sm font-medium text-foreground">
                      Intitulé de poste
                    </label>
                    <ProfessionAutocomplete
                      value={formData.profession}
                      onChange={(value) => handleInputChange("profession", value)}
                      placeholder="Développeur, Designer, Manager..."
                    />
                  </div>
                  
                  {/* Localisation simplifiée : Pays et Ville seulement */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Localisation
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="country" className="text-xs text-muted-foreground">
                          Pays
                        </label>
                        <select
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        >
                          <option value="">Sélectionner un pays</option>
                          {Country.getAllCountries().map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-xs text-muted-foreground">
                          Ville
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="city"
                            type="text"
                            placeholder="Ex: Paris, Lyon, Marseille..."
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            onFocus={() => {
                              if (citySuggestions.length > 0) {
                                setShowCitySuggestions(true);
                              }
                            }}
                            onBlur={() => {
                              // Délai pour permettre le clic sur les suggestions
                              setTimeout(() => setShowCitySuggestions(false), 200);
                            }}
                            className="pl-10"
                          />
                          
                          {/* Suggestions de villes */}
                          {showCitySuggestions && citySuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {citySuggestions.map((city, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => selectCity(city)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 caractères"
                        value={formData.password}
                        onChange={(e) => {
                          handleInputChange("password", e.target.value);
                          // Réinitialiser les erreurs de validation quand l'utilisateur tape
                          if (validationErrors.length > 0) {
                            setValidationErrors([]);
                          }
                        }}
                        className={classNames(
                          "pl-10 pr-10",
                          formData.password && !isPasswordValid && "border-red-500 focus:border-red-500"
                        )}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Exigences du mot de passe en temps réel */}
                    {formData.password && (
                      <div className="mt-2 space-y-1 text-xs">
                        <div className={classNames("flex items-center gap-2", passwordRequirements.length ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={classNames("h-3 w-3", passwordRequirements.length ? "text-green-600" : "text-muted-foreground")} />
                          <span>Au moins 8 caractères</span>
                        </div>
                        <div className={classNames("flex items-center gap-2", passwordRequirements.uppercase ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={classNames("h-3 w-3", passwordRequirements.uppercase ? "text-green-600" : "text-muted-foreground")} />
                          <span>Une majuscule</span>
                        </div>
                        <div className={classNames("flex items-center gap-2", passwordRequirements.lowercase ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={classNames("h-3 w-3", passwordRequirements.lowercase ? "text-green-600" : "text-muted-foreground")} />
                          <span>Une minuscule</span>
                        </div>
                        <div className={classNames("flex items-center gap-2", passwordRequirements.number ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={classNames("h-3 w-3", passwordRequirements.number ? "text-green-600" : "text-muted-foreground")} />
                          <span>Un chiffre</span>
                        </div>
                        <div className={classNames("flex items-center gap-2", passwordRequirements.special ? "text-green-600" : "text-muted-foreground")}>
                          <Check className={classNames("h-3 w-3", passwordRequirements.special ? "text-green-600" : "text-muted-foreground")} />
                          <span>Un caractère spécial (!@#$%^&*)</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Afficher les erreurs de validation du backend */}
                    {validationErrors.length > 0 && validationErrors.some(err => 
                      err.toLowerCase().includes('mot de passe') || err.toLowerCase().includes('password')
                    ) && (
                      <div className="mt-2 space-y-1">
                        {validationErrors
                          .filter(err => err.toLowerCase().includes('mot de passe') || err.toLowerCase().includes('password'))
                          .map((error, index) => (
                            <p key={index} className="text-sm text-red-500 flex items-center gap-1">
                              <span className="text-red-500">•</span>
                              {error}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && !isPasswordMatch && (
                      <p className="text-sm text-red-500">Les mots de passe ne correspondent pas</p>
                    )}
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
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  disabled={!isPasswordValid || !isPasswordMatch || !formData.acceptTerms || isLoading}
                >
                  {isLoading ? "Création du compte..." : "Créer mon compte"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Business Registration Option */}
          <div className="mt-8">
            <div className="text-center mb-6">
              <Typography variant="h3" className="text-lg font-semibold mb-2">
                Vous êtes une entreprise ?
              </Typography>
              <Typography variant="muted" className="text-sm">
                Accédez à nos solutions dédiées pour optimiser votre recrutement
              </Typography>
            </div>
            
            <div className="flex justify-center">
              {/* Entreprise Button - Updated */}
              <Link href="/register-company">
                <Button 
                  variant="outline" 
                  className="w-full max-w-sm h-auto p-6 flex flex-col items-center space-y-3 hover:bg-primary/5 border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground mb-1">
                      Entreprise
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Solutions de recrutement pour les entreprises
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <Typography variant="muted">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </Typography>
          </div>
        </div>
      </Container>
      <Toaster />
    </div>
  );
}