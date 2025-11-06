/**
 * Page de Complétion du Profil - Version 2 (Propre et Logique)
 * 
 * AMÉLIORATIONS :
 * - Logique simplifiée et claire
 * - Une seule source de données (authUser)
 * - Interface utilisateur intuitive
 * - Performance optimisée
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useProfileCompletion } from "@/hooks/use-profile-completion";
import { useUploadFile } from "@/hooks/use-api";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";
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
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function CompleteProfileV2Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    description: '',
    skills: [] as string[],
    job_title: '',
    experience_level: '',
    city: '',
    country: '',
    website: '',
    portfolio_link: '',
    linkedin_link: ''
  });
  
  const { toast } = useToast();
  const { completion, updateProfile, isLoading, user } = useProfileCompletion();
  const { profilePicture, setProfilePicture } = useProfilePictureContext();
  const uploadFile = useUploadFile();
  
  // Pré-remplir le formulaire avec les données utilisateur
  useEffect(() => {
    if (user && 'id_user' in user) {
      setFormData({
        bio: user.bio_pro || '',
        description: user.description || '',
        skills: user.skills || [],
        job_title: user.job_title || '',
        experience_level: user.experience_level || '',
        city: user.city || '',
        country: user.country || '',
        website: user.website || '',
        portfolio_link: user.portfolio_link || '',
        linkedin_link: user.linkedin_link || ''
      });
    }
  }, [user]);
  
  const steps = [
    { 
      id: 1, 
      title: "Photo & Bio", 
      description: "Ajoutez votre photo et une courte bio",
      icon: User
    },
    { 
      id: 2, 
      title: "Compétences", 
      description: "Listez vos compétences principales",
      icon: Star
    },
    { 
      id: 3, 
      title: "Expérience", 
      description: "Définissez votre niveau et spécialité",
      icon: Briefcase
    },
    { 
      id: 4, 
      title: "Contact", 
      description: "Ajoutez vos liens et localisation",
      icon: Globe
    }
  ];
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const addSkill = () => {
    const newSkill = (document.getElementById('newSkill') as HTMLInputElement)?.value?.trim();
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      (document.getElementById('newSkill') as HTMLInputElement).value = '';
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier invalide",
        description: "Veuillez sélectionner une image (JPG, PNG, GIF)",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5MB",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await uploadFile.mutate({
        file,
        fileType: 'photo' as 'pdf' | 'photo'
      });
      
      toast({
        title: "Photo uploadée !",
        description: "Votre photo de profil a été mise à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader la photo. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        bio_pro: formData.bio,
        description: formData.description,
        skills: formData.skills,
        job_title: formData.job_title,
        experience_level: formData.experience_level,
        city: formData.city,
        country: formData.country,
        website: formData.website,
        portfolio_link: formData.portfolio_link,
        linkedin_link: formData.linkedin_link
      });
      
      toast({
        title: "Profil sauvegardé",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      
      if (currentStep === steps.length) {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.bio.length > 0;
      case 2:
        return formData.skills.length > 0;
      case 3:
        return formData.job_title.length > 0 && formData.experience_level.length > 0;
      case 4:
        return formData.city.length > 0;
      default:
        return false;
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Photo de profil */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploadFile.loading}
                />
                <div className="h-32 w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
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
              <Typography variant="muted" className="text-sm">
                {uploadFile.loading ? "Upload en cours..." : "Cliquez sur l'image pour ajouter une photo"}
              </Typography>
            </div>
            
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Biographie *
              </label>
              <textarea
                placeholder="Développeur passionné par l'innovation..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                maxLength={200}
                className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Compétences *
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  id="newSkill"
                  placeholder="Ajouter une compétence..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button type="button" onClick={addSkill} size="sm">
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
                  Aucune compétence ajoutée
                </Typography>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Titre du poste *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
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
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Localisation *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Ville"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  placeholder="Pays"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Liens (optionnels)
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="https://votre-site.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="https://votre-portfolio.com"
                    value={formData.portfolio_link}
                    onChange={(e) => handleInputChange("portfolio_link", e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="https://linkedin.com/in/votre-profil"
                    value={formData.linkedin_link}
                    onChange={(e) => handleInputChange("linkedin_link", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête avec progression */}
        <div className="text-center mb-8">
          <Typography variant="h1" className="text-3xl font-bold mb-2">
            Complétez votre profil
          </Typography>
          <Typography variant="muted" className="mb-6">
            Rendez votre profil plus attractif pour les recruteurs
          </Typography>
          
          {/* Barre de progression */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          
          <Typography variant="muted" className="text-sm">
            Étape {currentStep} sur {steps.length} • {completion.essentialPercentage}% complété
          </Typography>
        </div>
        
        {/* Contenu de l'étape */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                {React.createElement(steps[currentStep - 1].icon, { className: "h-6 w-6 text-cyan-600" })}
              </div>
              <div>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
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
                      <>
                        Suivant
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
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
      
      <Toaster />
    </Container>
  );
}
