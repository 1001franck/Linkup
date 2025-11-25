/**
 * Page CV - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du CV de l'utilisateur
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Building,
  MapPin,
  Award,
  Star,
  Plus,
  Edit3,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserCV } from "@/hooks/use-user-cv";

function CVContent() {
  const { hasCV, cvInfo, isLoading, isUploading, uploadCV, deleteCV, downloadCV } = useUserCV();
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Fichier requis",
          description: "Veuillez sélectionner un fichier PDF",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit (limite backend)
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 10MB",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }
      
      await uploadCV(file);
    }
  };

  const handleDownloadCV = () => {
    downloadCV();
  };

  const handleDeleteCV = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre CV ? Cette action est irréversible.")) {
      deleteCV();
    }
  };

  const handleShareCV = () => {
    const profileUrl = `${window.location.origin}/profile/cv`;
    const shareText = `Découvrez mon CV sur LinkUp`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mon CV LinkUp',
        text: shareText,
        url: profileUrl
      }).catch(() => {
        // Fallback si l'utilisateur annule
        navigator.clipboard.writeText(profileUrl);
        toast({
          title: "Lien copié",
          description: "Le lien de votre CV a été copié dans le presse-papiers",
          variant: "default",
          duration: 3000,
        });
      });
    } else {
      // Fallback : copier le lien
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de votre CV a été copié dans le presse-papiers",
        variant: "default",
        duration: 3000,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <BackButton fallbackPath="/dashboard" />
              <Typography variant="h2" className="text-2xl font-bold text-foreground">
                Mon CV
              </Typography>
            </div>
            {hasCV && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShareCV}
                  className="hover:bg-primary/10 hover:border-primary/20 hover:text-primary"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button 
                  size="sm"
                  onClick={handleDownloadCV}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section principale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              {isLoading ? (
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                    <Typography variant="muted" className="mb-6">
                      Chargement de votre CV...
                    </Typography>
                  </CardContent>
                </Card>
              ) : !hasCV ? (
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <Typography variant="h4" className="text-xl font-semibold mb-4">
                      Aucun CV importé
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                      Importez votre CV PDF pour le partager avec les recruteurs et augmenter vos chances d'être contacté.
                    </Typography>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Import en cours...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Importer mon CV PDF
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Formats acceptés : PDF • Taille maximale : 10MB
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">CV disponible</CardTitle>
                          <CardDescription>{cvInfo?.fileName || 'CV.pdf'}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Importé
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-muted-foreground">Importé le : {cvInfo?.uploadDate || 'Date inconnue'}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-muted-foreground">Format : PDF</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={handleDownloadCV}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleShareCV}
                          className="flex-1"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleDeleteCV}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isUploading}
                        />
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Remplacement en cours...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Remplacer le CV
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Conseils CV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <Typography variant="h5" className="text-sm font-semibold mb-1">
                          Format optimal
                        </Typography>
                        <Typography variant="muted" className="text-xs">
                          Utilisez un PDF pour garantir la compatibilité avec tous les systèmes.
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <Typography variant="h5" className="text-sm font-semibold mb-1">
                          Taille recommandée
                        </Typography>
                        <Typography variant="muted" className="text-xs">
                          Maximum 5MB pour un téléchargement rapide.
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <Typography variant="h5" className="text-sm font-semibold mb-1">
                          Mise à jour
                        </Typography>
                        <Typography variant="muted" className="text-xs">
                          Gardez votre CV à jour avec vos dernières expériences.
                        </Typography>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}

export default function CVPage() {
  return <CVContent />;
}
