/**
 * Composant Upload Logo Entreprise
 * Permet à une entreprise d'uploader son logo
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyLogoContext } from "@/contexts/CompanyLogoContext";
import { Upload, Camera, X, Check } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyLogoUploadProps {
  companyId: number;
  currentLogo?: string;
  onLogoUpdate?: (logoUrl: string) => void;
  className?: string;
}

export function CompanyLogoUpload({ 
  companyId, 
  currentLogo, 
  onLogoUpdate,
  className 
}: CompanyLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { updateUser } = useAuth();
  const { logo, setLogo } = useCompanyLogoContext();

  // Utiliser le logo du contexte comme preview initial
  useEffect(() => {
    if (logo || currentLogo) {
      setPreview(logo || currentLogo || null);
    }
  }, [logo, currentLogo]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "Le fichier ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Stocker le fichier sélectionné
    setSelectedFile(file);

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreview(result);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Erreur",
        description: "Impossible de lire le fichier",
        variant: "destructive",
      });
      setSelectedFile(null);
      setPreview(logo || currentLogo || null);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = selectedFile || fileInputRef.current?.files?.[0];
    if (!file) {
      toast({
        title: "Erreur",
        description: "Aucun fichier sélectionné",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await apiClient.uploadCompanyLogo(companyId, file);
      
      console.log("📤 Réponse upload logo:", response);
      
      if (response.success) {
        // Le backend retourne: { success: true, data: { logo_url: result.url, message: "..." } }
        // Le client API wrappe: { success: true, data: <réponse_serveur> }
        // Donc la structure finale est: response.data.data.logo_url
        const serverResponse = response.data as any;
        const newLogoUrl = serverResponse?.data?.logo_url 
          || serverResponse?.logo_url 
          || serverResponse?.logo 
          || serverResponse?.url
          || (response.data as any)?.logo_url;
        
        console.log("URL extraite:", newLogoUrl);
        console.log("Structure response.data:", response.data);
        console.log("Structure serverResponse.data:", serverResponse?.data);
        
        if (!newLogoUrl) {
          console.error("❌ Structure de réponse inattendue:", JSON.stringify(response, null, 2));
          throw new Error(`URL du logo non reçue du serveur. Réponse: ${JSON.stringify(response)}`);
        }
        
        // Mettre à jour le contexte d'authentification - Company peut avoir un logo
        updateUser({ logo: newLogoUrl } as any);
        
        // Mettre à jour le contexte du logo
        setLogo(newLogoUrl);
        
        // Mettre à jour le preview avec la nouvelle URL
        setPreview(newLogoUrl);
        
        // Réinitialiser le fichier sélectionné
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Callback optionnel
        onLogoUpdate?.(newLogoUrl);
        
        toast({
          title: "Succès",
          description: "Logo mis à jour avec succès",
        });
      } else {
        throw new Error(response.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload logo:", error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de mettre à jour le logo";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setLogo(null);
    updateUser({ logo: null } as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <Typography variant="h3" className="font-semibold">
              Logo de l'entreprise
            </Typography>
          </div>

          {/* Aperçu du logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/20">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Logo entreprise" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              
              {preview && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <Typography variant="sm" className="text-muted-foreground">
                Formats acceptés : JPG, PNG, GIF (max 5MB)
              </Typography>
              
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {preview ? 'Changer' : 'Sélectionner'}
                </Button>

                {preview && (
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 mr-2"
                        >
                          <Upload className="h-4 w-4" />
                        </motion.div>
                        Upload...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Uploader
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
