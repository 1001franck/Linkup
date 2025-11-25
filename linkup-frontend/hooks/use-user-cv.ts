import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/lib/logger';

interface UserCVInfo {
  fileName: string;
  uploadDate: string;
  fileSize: number;
  url: string;
  fileId?: number; // ID du fichier dans la base de données
}

export function useUserCV() {
  const [hasCV, setHasCV] = useState(false);
  const [cvInfo, setCvInfo] = useState<UserCVInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Charger le CV au démarrage (depuis l'API backend)
  useEffect(() => {
    if (isAuthenticated) {
      loadUserCV();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadUserCV = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getMyFiles();
      
      if (response.success && response.data) {
        // Chercher le fichier CV (file_type === 'cv')
        const cvFile = (response.data as any[]).find((file: any) => file.file_type === 'cv');
        
        if (cvFile) {
          setHasCV(true);
          
          // Utiliser l'URL publique retournée par le backend, ou construire depuis file_url
          const publicUrl = cvFile.public_url || 
            (cvFile.file_url?.startsWith('http') 
              ? cvFile.file_url 
              : null);
          
          setCvInfo({
            fileName: cvFile.file_url?.split('/').pop() || 'CV.pdf',
            uploadDate: cvFile.uploaded_at ? new Date(cvFile.uploaded_at).toLocaleDateString('fr-FR') : '',
            fileSize: 0, // La taille n'est pas stockée dans la DB
            url: publicUrl || '', // L'URL sera construite côté backend
            fileId: cvFile.id_user_files
          });
        } else {
          setHasCV(false);
          setCvInfo(null);
        }
      } else {
        setHasCV(false);
        setCvInfo(null);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement du CV:', error);
      setHasCV(false);
      setCvInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadCV = async (file: File): Promise<boolean> => {
    try {
      setIsUploading(true);
      
      // Utiliser l'API backend pour uploader le CV
      const response = await apiClient.uploadFile(file, 'cv');
      
      if (response.success) {
        // Recharger la liste des fichiers pour obtenir les infos complètes
        await loadUserCV();
        
        toast({
          title: "CV uploadé avec succès",
          description: "Votre CV est maintenant disponible pour vos candidatures.",
        });
        
        return true;
      } else {
        toast({
          title: "Erreur d'upload",
          description: response.error || "Une erreur est survenue lors de l'upload de votre CV.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      logger.error('Erreur lors de l\'upload du CV:', error);
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'upload de votre CV.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCV = async () => {
    if (!cvInfo?.fileId) {
      toast({
        title: "Erreur",
        description: "Aucun CV à supprimer.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiClient.deleteFile(cvInfo.fileId);
      
      if (response.success !== false) {
        setHasCV(false);
        setCvInfo(null);
        
        toast({
          title: "CV supprimé",
          description: "Votre CV a été supprimé avec succès.",
        });
      } else {
        toast({
          title: "Erreur de suppression",
          description: "Une erreur est survenue lors de la suppression de votre CV.",
          variant: "destructive",
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la suppression du CV:', error);
      toast({
        title: "Erreur de suppression",
        description: "Une erreur est survenue lors de la suppression de votre CV.",
        variant: "destructive",
      });
    }
  };

  const downloadCV = () => {
    if (!cvInfo?.url) return;
    
    try {
      // Ouvrir le CV dans un nouvel onglet ou le télécharger
      const link = document.createElement('a');
      link.href = cvInfo.url;
      link.target = '_blank';
      link.download = cvInfo.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      logger.error('Erreur lors du téléchargement du CV:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement de votre CV.",
        variant: "destructive",
      });
    }
  };

  return {
    hasCV,
    cvInfo,
    isLoading,
    isUploading,
    uploadCV,
    deleteCV,
    downloadCV,
    loadUserCV
  };
}
