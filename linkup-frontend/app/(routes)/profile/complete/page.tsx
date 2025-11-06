/**
 * Page de Complétion du Profil - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la complétion du profil
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useProfileCompletion } from "@/hooks/use-profile-completion";
import { useUploadFile, useMutation } from "@/hooks/use-api";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";
import { apiClient } from "@/lib/api-client";
import { 
  User, 
  MapPin, 
  Briefcase, 
  Link as LinkIcon, 
  Camera, 
  Upload,
  Plus,
  X,
  Check,
  Target,
  Star,
  Globe,
  FileText,
  Trash2
} from "lucide-react";

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const { profileData, updateProfile, completion } = useProfileCompletion();
  const { profilePicture, setProfilePicture } = useProfilePictureContext();
  const uploadFile = useUploadFile();
  
  // MODIFICATION FRONTEND: Hook pour supprimer la photo de profil (défini localement)
  const deleteProfilePicture = useMutation(
    () => apiClient.deleteProfilePicture(),
    {
      showToast: true,
    }
  );

  // Gérer le paramètre step depuis l'URL
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam);
      if (step >= 1 && step <= 4 && step !== currentStep) {
        setCurrentStep(step);
      }
    }
  }, [searchParams]); // Supprimer currentStep des dépendances pour éviter les boucles

  // Pré-remplir le formulaire avec les données existantes (une seule fois)
  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0 && !isInitialized) {
      setFormData(prev => {
        const newData = {
          ...prev,
          first_name: profileData.firstName || '',
          last_name: profileData.lastName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          bio: profileData.bio || '',
          title: profileData.title || '',
          profile_picture: profileData.profile_picture || '',
          banner_picture: profileData.banner_picture || '',
          skills: profileData.skills || [],
          experience: profileData.experience || [],
          education: profileData.education || [],
          website: profileData.website || '',
          linkedin: profileData.linkedin || '',
          github: profileData.github || '',
          availability: profileData.availability || false
        };
        
        setIsInitialized(true);
        return newData;
      });
    }
  }, [profileData, isInitialized]); // Contrôler l'initialisation

  // Charger les compétences existantes si l'utilisateur revient sur l'étape 2
  useEffect(() => {
    const savedSkills = localStorage.getItem('userSkills');
    if (savedSkills && currentStep === 2) {
      const skillsArray = JSON.parse(savedSkills);
      setFormData(prev => ({
        ...prev,
        skills: skillsArray
      }));
    }
  }, [currentStep]);


  // Fonction pour gérer l'upload de photo
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 handlePhotoUpload appelé', event.target.files);
    const file = event.target.files?.[0];
    if (!file) {
      console.log('❌ Aucun fichier sélectionné');
      return;
    }

    console.log('📁 Fichier sélectionné:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      console.log('❌ Type de fichier invalide:', file.type);
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
      console.log('❌ Fichier trop volumineux:', file.size);
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5MB",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    try {
      console.log('🚀 Début de l\'upload...');
      toast({
        title: "Upload en cours...",
        description: "Votre photo est en cours d'upload",
        duration: 2000,
      });

      const result = await uploadFile.mutate({
        file,
        fileType: 'photo' as 'pdf' | 'photo'
      });

      console.log('✅ Upload réussi:', result);

      if (result?.data?.publicUrl) {
        console.log('🖼️ URL publique:', result.data.publicUrl);
        
        // Mettre à jour le contexte global immédiatement
        setProfilePicture(result.data.publicUrl);
        setFormData(prev => ({
          ...prev,
          profile_picture: result.data.publicUrl
        }));

        // Mettre à jour le profil dans le hook
        updateProfile({
          profile_picture: result.data.publicUrl
        });

        toast({
          title: "Photo uploadée !",
          description: "Votre photo de profil a été mise à jour",
          variant: "default",
          duration: 3000,
        });
      } else {
        console.log('⚠️ Pas d\'URL publique dans la réponse');
      }
    } catch (error) {
      console.error('❌ Erreur upload photo:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader la photo. Veuillez réessayer.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  // MODIFICATION FRONTEND: Fonction pour supprimer la photo de profil
  const handleDeleteProfilePicture = async () => {
    try {
      const result = await deleteProfilePicture.mutate();
      
      // Mettre à jour le contexte pour supprimer la photo
      setProfilePicture(null);
      
      // Mettre à jour le formData local
      setFormData(prev => ({
        ...prev,
        profile_picture: ""
      }));
      
      // Mettre à jour le profil dans le hook
      updateProfile({
        profile_picture: ""
      });
      
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
        setFormData(prev => ({
          ...prev,
          profile_picture: ""
        }));
        updateProfile({
          profile_picture: ""
        });
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

  const [formData, setFormData] = useState({
    profile_picture: "",
    banner_picture: "",
    bio: "",
    description: "",
    skills: [] as string[],
    location: "",
    job_title: "",
    experience_level: "" as "Junior" | "Intermédiaire" | "Senior" | "",
    portfolio_link: "",
    linkedin_link: "",
    availability: true
  });

  // Mettre à jour la photo de profil dans le formulaire
  useEffect(() => {
    if (profilePicture && profilePicture !== formData.profile_picture) {
      setFormData(prev => ({
        ...prev,
        profile_picture: profilePicture
      }));
    }
  }, [profilePicture]); // Supprimer formData.profile_picture des dépendances

  const [newSkill, setNewSkill] = useState("");

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const addSkill = useCallback(() => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  }, [newSkill, formData.skills]);

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // MODIFICATION FRONTEND: Gestion de la soumission avec sauvegarde backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Empêcher les soumissions multiples
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Mettre à jour le profil avec les nouvelles données (inclut sauvegarde backend)
      await updateProfile(formData);
      
      toast({
        title: "Profil sauvegardé",
        description: "Vos informations ont été mises à jour avec succès.",
        duration: 3000,
      });
      
      // Si c'est la dernière étape, rediriger vers le dashboard
      if (currentStep === steps.length) {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        // Passer à l'étape suivante
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder votre profil. Veuillez réessayer.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = useMemo(() => [
    { id: 1, title: "Photo & Bio", description: "Ajoutez votre photo et une courte bio" },
    { id: 2, title: "Compétences", description: "Listez vos compétences principales" },
    { id: 3, title: "Expérience", description: "Définissez votre niveau et spécialité" },
    { id: 4, title: "Contact", description: "Ajoutez vos liens et localisation" }
  ], []);

  const isStepValid = useCallback((step: number) => {
    switch (step) {
      case 1:
        return formData.bio.length > 0;
      case 2:
        return formData.skills.length > 0;
      case 3:
        return formData.job_title.length > 0 && formData.experience_level.length > 0;
      case 4:
        return formData.location.length > 0;
      default:
        return false;
    }
  }, [formData.bio, formData.skills, formData.job_title, formData.experience_level, formData.location]);

  const getCompletionPercentage = useMemo(() => {
    const totalFields = 8;
    const completedFields = [
      formData.bio,
      formData.skills.length > 0,
      formData.job_title,
      formData.experience_level,
      formData.location,
      formData.portfolio_link,
      formData.linkedin_link,
      formData.description
    ].filter(Boolean).length;
    
    return Math.round((completedFields / totalFields) * 100);
  }, [formData.bio, formData.skills, formData.job_title, formData.experience_level, formData.location, formData.portfolio_link, formData.linkedin_link, formData.description]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        <Container>
          <div className="py-6">
            <BackButton fallbackPath="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-cyan-600 transition-colors mb-6" />
            
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6"
              >
                <Target className="h-5 w-5" />
                Complétez votre profil pour attirer les recruteurs
              </motion.div>

              <Typography variant="h1" className="text-4xl font-bold mb-4">
                Créons votre profil professionnel
              </Typography>
              <Typography variant="muted" className="text-lg max-w-2xl mx-auto">
                Un profil complet augmente vos chances d'être contacté par les recruteurs de 300%
              </Typography>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h3" className="text-lg font-semibold">
                Progression : {getCompletionPercentage}%
              </Typography>
              <Typography variant="muted" className="text-sm">
                Étape {currentStep} sur {steps.length}
              </Typography>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-cyan-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {steps.map((step) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.id * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  currentStep === step.id
                    ? "border-primary bg-primary/10"
                    : currentStep > step.id
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === step.id
                      ? "bg-cyan-500 text-white"
                      : currentStep > step.id
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <div>
                    <Typography variant="small" className="font-semibold">
                      {step.title}
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {step.description}
                    </Typography>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form Content */}
          <Card className="backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-center">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Photo & Bio */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Profile Picture */}
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploadFile.loading}
                          />
                          <div className="h-32 w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {profilePicture || formData.profile_picture ? (
                              <img 
                                src={profilePicture || formData.profile_picture} 
                                alt="Photo de profil"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-16 w-16 text-slate-400" />
                            )}
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 z-20"
                            disabled={uploadFile.loading}
                          >
                            {uploadFile.loading ? (
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Camera className="h-5 w-5 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Typography variant="muted" className="text-sm mb-3">
                        {uploadFile.loading ? "Upload en cours..." : "Cliquez sur l'image pour ajouter une photo"}
                      </Typography>
                      
                      {/* Bouton de suppression de la photo */}
                      {(profilePicture || formData.profile_picture) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteProfilePicture}
                          disabled={deleteProfilePicture.loading}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleteProfilePicture.loading ? "Suppression..." : "Supprimer la photo"}
                        </Button>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bio professionnelle *
                      </label>
                      <Input
                        type="text"
                        placeholder="Développeur passionné par l'innovation..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        maxLength={200}
                        className="text-center"
                      />
                      <div className="text-right text-xs text-slate-500 mt-1">
                        {formData.bio.length}/200 caractères
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description détaillée
                      </label>
                      <textarea
                        placeholder="Parlez de votre parcours, vos objectifs professionnels, vos passions..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Skills */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Compétences *
                      </label>
                      <div className="flex space-x-2 mb-4">
                        <Input
                          type="text"
                          placeholder="Ajouter une compétence (ex: React, Python, Design...)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} className="bg-cyan-500 hover:bg-cyan-600">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="flex items-center space-x-2">
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      {formData.skills.length === 0 && (
                        <Typography variant="muted" className="text-sm text-center py-4">
                          Ajoutez au moins une compétence pour continuer
                        </Typography>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Experience */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Titre professionnel *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Développeur Full Stack, Product Manager, Designer UX..."
                          value={formData.job_title}
                          onChange={(e) => handleInputChange("job_title", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Niveau d'expérience *
                      </label>
                      <select
                        value={formData.experience_level}
                        onChange={(e) => handleInputChange("experience_level", e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Sélectionnez votre niveau</option>
                        <option value="Junior">Junior (0-2 ans)</option>
                        <option value="Intermédiaire">Intermédiaire (3-5 ans)</option>
                        <option value="Senior">Senior (6+ ans)</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="availability"
                        checked={formData.availability}
                        onChange={(e) => handleInputChange("availability", e.target.checked)}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <label htmlFor="availability" className="text-sm text-foreground">
                        Je suis disponible pour de nouvelles opportunités
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Contact */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Localisation *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Paris, France"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Portfolio / Site web
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="url"
                          placeholder="https://votre-portfolio.com"
                          value={formData.portfolio_link}
                          onChange={(e) => handleInputChange("portfolio_link", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        LinkedIn
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/votre-profil"
                          value={formData.linkedin_link}
                          onChange={(e) => handleInputChange("linkedin_link", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Précédent
                  </Button>

                  {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!isStepValid(currentStep) || isSubmitting}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sauvegarde...
                      </>
                    ) : (
                      "Suivant"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Terminer et sauvegarder
                      </>
                    )}
                  </Button>
                )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
      <Toaster />
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <Typography variant="h3" className="text-xl font-semibold mb-2">
            Chargement...
          </Typography>
          <Typography variant="muted">
            Préparation de votre profil
          </Typography>
        </div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  );
}
