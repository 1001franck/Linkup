import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { useToast } from '@/hooks/use-toast';
import { useAddApplicationDocument } from '@/hooks/use-api';
import { apiClient } from '@/lib/api-client';
import { 
  Upload, 
  FileText, 
  X, 
  Check,
  AlertCircle
} from 'lucide-react';

interface DocumentUploadProps {
  jobId: number;
  uploadedCount?: number;
  uploadedDocuments?: Array<{ type: 'cv' | 'cover_letter'; uploaded: boolean }>;
  onDocumentAdded?: (fileName: string, type: 'cv' | 'cover_letter') => void;
  onDocumentRemoved?: (type: 'cv' | 'cover_letter') => void;
  disabledTypes?: ('cv' | 'cover_letter')[];
}

const DOCUMENT_TYPES = [
  { value: 'cv', label: 'CV', description: 'Votre curriculum vitae' },
  { value: 'cover_letter', label: 'Lettre de motivation', description: 'Lettre personnalisée pour ce poste' }
];

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  jobId, 
  uploadedCount = 0,
  uploadedDocuments = [],
  onDocumentAdded,
  onDocumentRemoved,
  disabledTypes = []
}) => {
  const { toast } = useToast();
  const addDocumentMutation = useAddApplicationDocument();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Seuls les fichiers PDF et Word sont acceptés.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner un fichier et un type de document.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedCount >= 2) {
      toast({
        title: "Limite atteinte",
        description: "Vous avez déjà uploadé le maximum de documents requis (2).",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Étape 1: Upload du fichier vers Supabase Storage
      console.log('Début upload:', { fileName: selectedFile.name, fileType: selectedType, fileSize: selectedFile.size });
      
      const uploadResult = await apiClient.uploadFile(selectedFile, selectedType);
      console.log('Upload réussi - Structure complète:', JSON.stringify(uploadResult, null, 2));
      
      // Le backend retourne { data: { record: insertData, publicUrl } }
      // L'API client wrappe dans { success: true, data: response }
      const fileUrl = uploadResult.data?.data?.publicUrl;
      console.log('URL extraite:', fileUrl);
      
      if (!fileUrl) {
        console.error('Structure de réponse inattendue:', uploadResult);
        throw new Error('URL du fichier non retournée par le serveur');
      }

      // Étape 2: Ajouter le document à la candidature
      console.log('Ajout du document à la candidature:', { jobId, documentType: selectedType, fileName: selectedFile.name, fileUrl });
      
      await addDocumentMutation.mutate({
        jobId,
        documentType: selectedType,
        fileName: selectedFile.name,
        fileUrl
      });

      toast({
        title: "Document ajouté avec succès",
        description: `Votre ${DOCUMENT_TYPES.find(t => t.value === selectedType)?.label} a été ajouté à votre candidature.`,
        variant: "default",
      });

      // Reset form pour permettre un nouvel upload
      setSelectedFile(null);
      setSelectedType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Callback pour rafraîchir les données
      onDocumentAdded?.(selectedFile.name, selectedType as 'cv' | 'cover_letter');

    } catch (error) {
      console.error('Erreur upload détaillée:', error);
      
      let errorMessage = "Impossible d'ajouter le document. Veuillez réessayer.";
      
      if (error.message.includes('Token manquant')) {
        errorMessage = "Session expirée. Veuillez vous reconnecter.";
      } else if (error.message.includes('bucket')) {
        errorMessage = "Erreur de configuration serveur. Contactez l'administrateur.";
      } else if (error.message.includes('500')) {
        errorMessage = "Erreur serveur. Vérifiez que le service de stockage est configuré.";
      }
      
      toast({
        title: "Erreur lors de l'upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setSelectedType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadedCount >= 2) {
    return (
      <Card className="backdrop-blur-sm border-0 shadow-lg opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-muted-foreground" />
            Documents complets
          </CardTitle>
          <Typography variant="muted" className="text-xs">
            Vous avez uploadé tous les documents requis (2/2)
          </Typography>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="space-y-4 p-4">
        {/* Type de document */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            {DOCUMENT_TYPES.map((type) => {
              const isAlreadyUploaded = uploadedDocuments.some(doc => doc.type === type.value && doc.uploaded);
              const isDisabled = disabledTypes.includes(type.value as 'cv' | 'cover_letter');
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  className="justify-center h-12"
                  disabled={isAlreadyUploaded || isDisabled}
                  onClick={() => setSelectedType(type.value)}
                >
                  {isAlreadyUploaded ? `✓ ${type.label}` : isDisabled ? `${type.label} (désactivé)` : type.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Sélection de fichier */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          {selectedFile ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choisir un fichier
            </Button>
          )}
        </div>

        {/* Actions */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedType || isUploading}
          className="w-full h-12"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Upload en cours...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter le document
            </>
          )}
        </Button>

      </CardContent>
    </Card>
  );
};
