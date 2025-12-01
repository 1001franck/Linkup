/**
 * Page de création d'offre d'emploi - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la création d'offres
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import CompanyHeader from "@/components/layout/company-header";
import logger from "@/lib/logger";
import { Country, City } from "country-state-city";
import { 
  ArrowLeft, 
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  FileText,
  Check,
  Plus,
  X
} from "lucide-react";

export default function CreateJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: company, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Informations de base
    title: "",
    location: "",
    contractType: "",
    contractDuration: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
    industry: "",
    
    // Détails
    description: "",
    requirements: "",
    benefits: "",
    
    // Options
    remoteWork: false,
    urgent: false,
    featured: false
  });

  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  
  // Refs pour les inputs
  const requirementsInputRef = useRef<HTMLInputElement>(null);
  const benefitsInputRef = useRef<HTMLInputElement>(null);
  
  // États pour la localisation
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("FR"); // France par défaut

  // Empêcher le rechargement de la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting]);

  const contractTypes = [
    "CDI",
    "CDD", 
    "Stage",
    "Freelance",
    "Alternance",
    "Temps partiel",
    "Contrat d'apprentissage",
    "Contrat de professionnalisation",
    "Intérim",
    "Portage salarial",
    "Consultant",
    "Prestation",
    "Mission",
    "Projet"
  ];

  const experienceLevels = [
    "Débutant (0-2 ans)",
    "Intermédiaire (2-5 ans)",
    "Senior (5-10 ans)",
    "Expert (10+ ans)"
  ];


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Gérer l'autocomplétion des villes
    if (field === "location" && typeof value === "string") {
      // Si l'utilisateur tape une ville sans virgule, chercher dans tous les pays
      if (value.length >= 2 && !value.includes(',')) {
        const allCities = [];
        
        // Chercher dans plusieurs pays européens principaux
        const countriesToSearch = ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'GB'];
        
        for (const countryCode of countriesToSearch) {
          const cities = City.getCitiesOfCountry(countryCode);
          if (cities) {
            const matchingCities = cities
              .filter(city => city.name.toLowerCase().includes(value.toLowerCase()))
              .map(city => ({
                name: city.name,
                country: Country.getCountryByCode(countryCode)?.name || countryCode
              }));
            allCities.push(...matchingCities);
          }
        }
        
        // Limiter à 8 suggestions et trier par pertinence
        const filteredCities = allCities
          .slice(0, 8)
          .map(city => `${city.name}, ${city.country}`);
        
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
  const selectCity = (cityLocation: string) => {
    // Si la suggestion contient déjà le pays (format "Ville, Pays"), l'utiliser directement
    // Sinon, ajouter le pays par défaut
    const formattedLocation = cityLocation.includes(',') 
      ? cityLocation 
      : `${cityLocation}, ${Country.getCountryByCode(selectedCountry)?.name || 'France'}`;
    
    setFormData(prev => ({ ...prev, location: formattedLocation }));
    setShowCitySuggestions(false);
    setCitySuggestions([]);
  };

  // Fonction pour formater les salaires avec séparateurs de milliers
  const formatSalary = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') return '';
    return parseInt(numericValue).toLocaleString('fr-FR');
  };

  // Fonction pour valider les salaires
  const validateSalaries = () => {
    if (formData.salaryMin && formData.salaryMax) {
      const minSalary = parseInt(formData.salaryMin.replace(/\s/g, ''));
      const maxSalary = parseInt(formData.salaryMax.replace(/\s/g, ''));
      
      if (minSalary > maxSalary) {
        toast({
          title: "Erreur de validation",
          description: "Le salaire minimum ne peut pas être supérieur au salaire maximum",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }
    }
    return true;
  };

  // Fonction pour vérifier si les salaires sont valides (pour l'affichage des erreurs)
  const getSalaryValidationError = () => {
    if (formData.salaryMin && formData.salaryMax) {
      const minSalary = parseInt(formData.salaryMin.replace(/\s/g, ''));
      const maxSalary = parseInt(formData.salaryMax.replace(/\s/g, ''));
      
      if (minSalary > maxSalary) {
        return "Le salaire minimum ne peut pas être supérieur au salaire maximum";
      }
    }
    return null;
  };

  // Fonction pour vérifier si les salaires sont valides pour la validation des étapes
  const areSalariesValid = () => {
    // Si aucun salaire n'est renseigné, c'est valide (les salaires sont optionnels)
    if (!formData.salaryMin && !formData.salaryMax) {
      return true;
    }
    
    // Si un seul salaire est renseigné, c'est valide
    if (!formData.salaryMin || !formData.salaryMax) {
      return true;
    }
    
    // Si les deux salaires sont renseignés, vérifier que min <= max
    const minSalary = parseInt(formData.salaryMin.replace(/\s/g, ''));
    const maxSalary = parseInt(formData.salaryMax.replace(/\s/g, ''));
    return minSalary <= maxSalary;
  };

  // Fonction pour gérer le changement de type de contrat
  const handleContractTypeChange = (value: string) => {
    let defaultDuration = '';
    
    switch (value) {
      case 'CDI':
        defaultDuration = 'Indéterminé';
        break;
      case 'CDD':
        defaultDuration = '6 mois';
        break;
      case 'Stage':
        defaultDuration = '3 mois';
        break;
      case 'Alternance':
        defaultDuration = '12 mois';
        break;
      case 'Contrat d\'apprentissage':
        defaultDuration = '24 mois';
        break;
      case 'Contrat de professionnalisation':
        defaultDuration = '12 mois';
        break;
      case 'Intérim':
        defaultDuration = '1 mois';
        break;
      default:
        defaultDuration = '';
    }
    
    setFormData(prev => ({
      ...prev,
      contractType: value,
      contractDuration: defaultDuration
    }));
  };

  const addListItem = (type: 'requirements' | 'benefits', value: string) => {
    // Vérifier que value existe et n'est pas vide après trim
    if (value && typeof value === 'string' && value.trim()) {
      const trimmedValue = value.trim();
      if (type === 'requirements') {
        setRequirements(prev => [...prev, trimmedValue]);
      } else if (type === 'benefits') {
        setBenefits(prev => [...prev, trimmedValue]);
      }
    }
  };

  // Fonctions helper pour ajouter des éléments
  const addRequirement = () => {
    if (requirementsInputRef.current && requirementsInputRef.current.value.trim()) {
      addListItem('requirements', requirementsInputRef.current.value);
      requirementsInputRef.current.value = '';
    }
  };

  const addBenefit = () => {
    if (benefitsInputRef.current && benefitsInputRef.current.value.trim()) {
      addListItem('benefits', benefitsInputRef.current.value);
      benefitsInputRef.current.value = '';
    }
  };

  const removeListItem = (type: 'requirements' | 'benefits', index: number) => {
    if (type === 'requirements') {
      setRequirements(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'benefits') {
      setBenefits(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Empêcher la soumission multiple
    if (isSubmitting) {
      return;
    }
    
         // Validation complète des champs obligatoires
         const requiredFields = {
           title: formData.title,
           description: formData.description,
           location: formData.location,
           contractType: formData.contractType
         };

         const missingFields = Object.entries(requiredFields)
           .filter(([key, value]) => !value || value.trim() === '')
           .map(([key]) => {
             const fieldNames = {
               title: 'Titre du poste',
               description: 'Description',
               location: 'Localisation',
               contractType: 'Type de contrat'
             };
             return fieldNames[key as keyof typeof fieldNames];
           });

         // Validation salaire min <= salaire max
         if (formData.salaryMin && formData.salaryMax) {
           const minSalary = parseInt(formData.salaryMin.replace(/\s/g, ''));
           const maxSalary = parseInt(formData.salaryMax.replace(/\s/g, ''));
           if (minSalary > maxSalary) {
             toast({
               title: "Erreur de validation",
               description: "Le salaire minimum ne peut pas être supérieur au salaire maximum",
               variant: "destructive",
               duration: 5000,
             });
             return;
           }
         }

    if (missingFields.length > 0) {
      toast({
        title: "Champs obligatoires manquants",
        description: `Veuillez remplir : ${missingFields.join(', ')}`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (!isAuthenticated || !company) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté en tant qu'entreprise pour publier une offre",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
       // Préparer les données pour l'API (correspondance exacte avec la BD)
       const jobData = {
         title: formData.title.trim(),
         description: formData.description.trim(),
         location: formData.location.trim(),
         contract_type: formData.contractType,
         salary_min: formData.salaryMin ? parseInt(formData.salaryMin.replace(/\s/g, '')) : undefined,
         salary_max: formData.salaryMax ? parseInt(formData.salaryMax.replace(/\s/g, '')) : undefined,
         remote: formData.remoteWork, // boolean pour l'API
         experience: formData.experience || 'Non spécifié',
         industry: formData.industry || 'Non spécifié',
         contract_duration: formData.contractDuration || (formData.contractType === 'CDD' ? '6 mois' : (formData.contractType === 'CDI' ? 'Indéterminé' : 'Non spécifié')),
         working_time: 'Temps plein',
         formation_required: 'Bac+3 minimum',
         // Champs arrays de la BD
         requirements: requirements.length > 0 ? requirements : null,
         benefits: benefits.length > 0 ? benefits : null,
         // Champs optionnels
         urgency: formData.urgent ? 'high' : 'medium',
         education: 'Bac+3 minimum',
         id_company: (company as any).id_company
       };

      logger.debug('Données envoyées à l\'API:', {
        hasTitle: !!jobData.title,
        hasDescription: !!jobData.description,
        hasLocation: !!jobData.location,
        contractType: jobData.contract_type
      });

      // Appel API pour créer l'offre
      const response = await apiClient.createJob(jobData);

      logger.debug('Réponse API:', { success: response.success, hasData: !!response.data });

      if (response.success && response.data) {
        toast({
          title: "🎉 Offre publiée avec succès !",
          description: `Votre offre "${formData.title}" a été publiée et est maintenant visible par les candidats`,
          duration: 5000,
        });

        // Attendre un peu pour que l'utilisateur voie le message de succès
        setTimeout(() => {
          // Rediriger vers le dashboard principal avec un paramètre de rafraîchissement
          router.replace('/company-dashboard?refresh=' + Date.now());
        }, 1500);
      } else {
        throw new Error(response.error || 'Erreur lors de la création de l\'offre');
      }
    } catch (error) {
      logger.error('Erreur lors de la création de l\'offre:', error);
      toast({
        title: "Erreur lors de la publication",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour vérifier si l'étape actuelle est valide
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        // Étape 1: Champs obligatoires (avec étoiles *) - SEULEMENT ceux visibles dans l'étape 1
        const titleValid = formData.title.trim() !== '';
        const locationValid = formData.location.trim() !== '';
        const contractTypeValid = formData.contractType !== '';
        const experienceValid = formData.experience !== '';
        const industryValid = formData.industry !== '';
        
        const requiredFieldsValid = titleValid && locationValid && contractTypeValid && experienceValid && industryValid;
        
        // Validation des salaires (optionnels mais doivent être cohérents si renseignés)
        const salaryValid = areSalariesValid();
        
        // Debug temporaire
        logger.debug('Validation étape 1:', {
            title: titleValid,
            location: locationValid,
            contractType: contractTypeValid,
            experience: experienceValid,
            industry: industryValid,
            requiredFieldsValid,
            salaryValid,
            final: requiredFieldsValid && salaryValid
          });
        }
        
        return requiredFieldsValid && salaryValid;
        
      case 2:
        // Étape 2: Champs obligatoires (avec étoiles *) - SEULEMENT ceux visibles dans l'étape 2
        return formData.description.trim() !== '';
        
      case 3:
        // Étape 3: Options et publication
        return true; // Pas de champs obligatoires à l'étape 3
        
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 3 && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        
        {/* Contenu principal avec padding pour le header fixe */}
        <div className="pt-20">
          <Container>
            
            {/* Header de la page */}
            <div className="py-8">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/company-dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tableau de bord
                  </Button>
                </Link>
                <div>
                  <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
                    Créer une offre d'emploi
                  </Typography>
                  <Typography variant="muted" className="text-lg">
                    Publiez votre offre et trouvez les meilleurs talents
                  </Typography>
                </div>
              </div>
            </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep >= step 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {currentStep > step ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{step}</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <Typography variant="h4" className={`text-sm font-medium ${
                          currentStep >= step ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step === 1 && "Informations de base"}
                          {step === 2 && "Détails de l'offre"}
                          {step === 3 && "Options et publication"}
                        </Typography>
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          currentStep > step ? 'bg-cyan-600' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

           {/* Form */}
           <form onSubmit={(e) => e.preventDefault()}>
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-cyan-600" />
                  {currentStep === 1 && "Informations de base"}
                  {currentStep === 2 && "Détails de l'offre"}
                  {currentStep === 3 && "Options et publication"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Définissez les informations essentielles de votre offre"}
                  {currentStep === 2 && "Décrivez le poste et les exigences"}
                  {currentStep === 3 && "Configurez les options et publiez votre offre"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Titre du poste *
                      </label>
                      <Input
                        placeholder="Ex: Développeur React Senior"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="relative">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Localisation *
                        </label>
                        <Input
                          placeholder="Ex: Paris ou Paris, France"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          onFocus={() => {
                            if (formData.location.length >= 2) {
                              setShowCitySuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            // Délai pour permettre le clic sur une suggestion
                            setTimeout(() => setShowCitySuggestions(false), 200);
                          }}
                          required
                        />
                        
                        {/* Suggestions de villes */}
                        {showCitySuggestions && citySuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {citySuggestions.map((cityLocation, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-muted cursor-pointer text-sm text-foreground transition-colors"
                                onClick={() => selectCity(cityLocation)}
                              >
                                {cityLocation}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Type de contrat *
                        </label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.contractType}
                          onChange={(e) => handleContractTypeChange(e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez un type</option>
                          {contractTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Durée du contrat
                        </label>
                        <Input
                          placeholder={
                            formData.contractType === 'CDI' ? 'Indéterminé' :
                            formData.contractType === 'CDD' ? 'Ex: 6 mois, 12 mois' :
                            formData.contractType === 'Stage' ? 'Ex: 3 mois, 6 mois' :
                            formData.contractType === 'Alternance' ? 'Ex: 12 mois, 24 mois' :
                            formData.contractType === 'Intérim' ? 'Ex: 1 mois, 3 mois' :
                            'Ex: 6 mois, 1 an, 2 ans'
                          }
                          value={formData.contractDuration}
                          onChange={(e) => handleInputChange("contractDuration", e.target.value)}
                          disabled={formData.contractType === 'CDI'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Niveau d'expérience *
                        </label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.experience}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                        >
                          <option value="">Sélectionnez un niveau</option>
                          {experienceLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Secteur d'activité *
                        </label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.industry}
                          onChange={(e) => handleInputChange("industry", e.target.value)}
                        >
                          <option value="">Sélectionnez un secteur</option>
                          <option value="Informatique">Informatique</option>
                          <option value="Finance">Finance</option>
                          <option value="Santé">Santé</option>
                          <option value="Éducation">Éducation</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Industrie">Industrie</option>
                          <option value="Services">Services</option>
                          <option value="Immobilier">Immobilier</option>
                          <option value="Transport">Transport</option>
                          <option value="Tourisme">Tourisme</option>
                          <option value="Média">Média</option>
                          <option value="Art">Art</option>
                          <option value="Sport">Sport</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Salaire minimum (€)
                        </label>
                        <Input
                          placeholder="Ex: 35 000"
                          value={formData.salaryMin}
                          onChange={(e) => handleInputChange("salaryMin", formatSalary(e.target.value))}
                          className={getSalaryValidationError() ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500" : ""}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Salaire maximum (€)
                        </label>
                        <Input
                          placeholder="Ex: 50 000"
                          value={formData.salaryMax}
                          onChange={(e) => handleInputChange("salaryMax", formatSalary(e.target.value))}
                          className={getSalaryValidationError() ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500" : ""}
                        />
                      </div>
                    </div>
                    
                    {/* Message d'erreur pour les salaires */}
                    {getSalaryValidationError() && (
                      <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                          <span className="mr-2">⚠️</span>
                          {getSalaryValidationError()}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description du poste *
                      </label>
                      <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Décrivez le poste, les missions principales, l'environnement de travail..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        required
                      />
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Exigences
                      </label>
                      <div className="space-y-2">
                        {requirements.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input value={item} readOnly />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeListItem('requirements', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            ref={requirementsInputRef}
                            placeholder="Ajouter une exigence"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addRequirement();
                              }
                            }}
                          />
                           <Button
                             type="button"
                             variant="outline"
                             onClick={addRequirement}
                           >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Avantages
                      </label>
                      <div className="space-y-2">
                        {benefits.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input value={item} readOnly />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeListItem('benefits', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            ref={benefitsInputRef}
                            placeholder="Ajouter un avantage"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addBenefit();
                              }
                            }}
                          />
                           <Button
                             type="button"
                             variant="outline"
                             onClick={addBenefit}
                           >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="remoteWork"
                          checked={formData.remoteWork}
                          onChange={(e) => handleInputChange("remoteWork", e.target.checked)}
                          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remoteWork" className="text-sm font-medium text-foreground">
                          Télétravail possible
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="urgent"
                          checked={formData.urgent}
                          onChange={(e) => handleInputChange("urgent", e.target.checked)}
                          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                        />
                        <label htmlFor="urgent" className="text-sm font-medium text-foreground">
                          Offre urgente
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange("featured", e.target.checked)}
                          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-foreground">
                          Mettre en avant cette offre
                        </label>
                      </div>
                    </div>

                    {/* Aperçu de l'offre */}
                    <div className="border-t pt-6">
                      <Typography variant="h4" className="font-semibold text-foreground mb-4">
                        Aperçu de votre offre
                      </Typography>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <Typography variant="h4" className="font-bold text-foreground mb-2">
                            {formData.title || "Titre du poste"}
                          </Typography>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {formData.contractType || "Type de contrat"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {formData.location || "Localisation"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formData.contractType || "Type de contrat"}
                            </span>
                          </div>
                          {formData.salaryMin && formData.salaryMax && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                              <DollarSign className="h-4 w-4" />
                              {formData.salaryMin === formData.salaryMax 
                                ? `${formData.salaryMin}€` 
                                : `${formData.salaryMin}€ - ${formData.salaryMax}€`
                              }
                            </div>
                          )}
                          <Typography variant="muted" className="text-sm">
                            {formData.description || "Description du poste..."}
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Précédent
                  </Button>

                  {currentStep < 3 ? (
                    <div className="flex flex-col items-end">
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isCurrentStepValid()}
                        className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </Button>
                      {!isCurrentStepValid() && (
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          {currentStep === 1 && "Veuillez remplir tous les champs marqués d'un *"}
                          {currentStep === 2 && "Veuillez remplir la description du poste"}
                        </p>
                      )}
                    </div>
                   ) : (
                     <div className="flex flex-col items-end">
                       <Button
                         type="button"
                         disabled={isSubmitting || !isCurrentStepValid()}
                         onClick={handleSubmit}
                         className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Publication en cours...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Publier l'offre
                          </>
                        )}
                      </Button>
                      {!isCurrentStepValid() && !isSubmitting && (
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          Veuillez remplir tous les champs marqués d'un *
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
          </Container>
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}