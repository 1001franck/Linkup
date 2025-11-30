"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { DocumentUpload } from '@/components/applications/document-upload';
import { X, Briefcase, Building, MapPin, DollarSign, CheckCircle, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentValidation, createInitialDocuments, updateDocument, removeDocument, type UploadedDocument as DocumentValidationType } from '@/hooks/use-document-validation';
import { useUserCV } from '@/hooks/use-user-cv';
import { apiClient } from '@/lib/api-client';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salaryRange: string;
  };
  onApply: (jobId: number) => void;
  isApplying: boolean;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  job,
  onApply,
  isApplying
}) => {
  const { toast } = useToast();
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentValidationType[]>(createInitialDocuments());
  const [useExistingCV, setUseExistingCV] = useState(false);
  const { hasCV, cvInfo } = useUserCV();

  const handleDocumentUploaded = (type: 'cv' | 'cover_letter', fileName: string) => {
    setUploadedDocuments(prev => updateDocument(prev, type, fileName));
  };

  const handleDocumentRemoved = (type: 'cv' | 'cover_letter') => {
    setUploadedDocuments(prev => removeDocument(prev, type));
  };

  // Validation des documents
  const documentValidation = useDocumentValidation(uploadedDocuments);

  // Calculer si on peut soumettre (CV existant OU CV uploadé + lettre de motivation)
  const hasValidCV = useExistingCV && hasCV || uploadedDocuments.some(doc => doc.type === 'cv' && doc.uploaded);
  const hasCoverLetter = uploadedDocuments.some(doc => doc.type === 'cover_letter' && doc.uploaded);
  const canSubmit = hasValidCV && hasCoverLetter;

  const handleApply = async () => {
    if (!canSubmit) {
      toast({
        title: "Documents manquants",
        description: "Veuillez ajouter une lettre de motivation et utiliser votre CV existant ou en uploader un nouveau.",
        variant: "destructive",
      });
      return;
    }

    // Si on utilise le CV existant, créer l'enregistrement application_documents AVANT la candidature
    if (useExistingCV && hasCV && cvInfo) {
      try {
        console.log('Enregistrement du CV existant pour la candidature:', {
          jobId: job.id,
          fileName: cvInfo.fileName
        });

        // Pour le CV existant, on crée un enregistrement qui pointe vers le CV dans user_files
        // On utilise une URL fictive qui sera gérée par le backend
        await apiClient.addApplicationDocument(
          job.id,
          'cv',
          cvInfo.fileName,
          'existing_cv' // Marqueur spécial pour indiquer que c'est le CV existant
        );

        console.log('CV existant enregistré avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du CV existant:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre CV existant. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }
    }

    // Attendre un petit délai pour s'assurer que l'enregistrement est bien fait
    await new Promise(resolve => setTimeout(resolve, 100));

    // Si tout est OK, envoyer la candidature
    onApply(job.id);
    onClose();
  };

  // Utiliser les valeurs de validation
  const { uploadedCount } = documentValidation;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <Card className="relative w-full backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Candidature</CardTitle>
                      <Typography variant="muted" className="text-sm">
                        Postuler à cette offre d'emploi
                      </Typography>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-9 w-9 p-0 hover:bg-muted/50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-4">
                {/* Informations de l'offre */}
                <div className="bg-gradient-to-r from-muted/40 to-muted/20 rounded-lg p-3 space-y-2 border border-border/30">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Typography variant="h4" className="font-semibold text-base">
                      {job.title}
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Typography variant="muted">{job.company}</Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Typography variant="muted">{job.location}</Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Typography variant="muted">{job.salaryRange}</Typography>
                  </div>
                </div>

                {/* Upload de documents */}
                <div className="space-y-4">
                  <div className="text-center">
                    <Typography variant="h4" className="font-bold mb-2 text-base">
                      Documents requis
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {hasValidCV && hasCoverLetter ? '2' : hasValidCV || hasCoverLetter ? '1' : '0'}/2 documents requis
                    </Typography>
                  </div>

                  {/* Option CV existant */}
                  {hasCV && (
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="useExistingCV"
                          checked={useExistingCV}
                          onChange={(e) => {
                            setUseExistingCV(e.target.checked);
                            // Si on utilise le CV existant, on retire le CV uploadé
                            if (e.target.checked) {
                              setUploadedDocuments(prev => prev.filter(doc => doc.type !== 'cv'));
                            }
                          }}
                          className="h-4 w-4 text-primary"
                        />
                        <label htmlFor="useExistingCV" className="flex-1 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <Typography variant="small" className="font-medium">
                                Utiliser mon CV existant
                              </Typography>
                              <Typography variant="muted" className="text-xs">
                                {cvInfo?.fileName} (uploadé le {cvInfo?.uploadDate})
                              </Typography>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <DocumentUpload
                    jobId={job.id}
                    uploadedCount={uploadedCount}
                    uploadedDocuments={uploadedDocuments}
                    onDocumentAdded={(fileName, type) => {
                      handleDocumentUploaded(type, fileName);
                      // Si on upload un CV, on désactive l'option CV existant
                      if (type === 'cv') {
                        setUseExistingCV(false);
                      }
                    }}
                    onDocumentRemoved={handleDocumentRemoved}
                    disabledTypes={useExistingCV ? ['cv'] : []}
                  />

                  {/* Affichage des fichiers uploadés */}
                  {(uploadedCount > 0 || useExistingCV) && (
                    <div className="space-y-2">
                      <Typography variant="h5" className="font-semibold text-sm">
                        Documents sélectionnés
                      </Typography>
                      
                      {/* CV existant */}
                      {useExistingCV && hasCV && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <div>
                              <Typography variant="small" className="font-medium text-blue-800">
                                CV (existant)
                              </Typography>
                              <Typography variant="muted" className="text-xs text-blue-600">
                                {cvInfo?.fileName}
                              </Typography>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                            onClick={() => setUseExistingCV(false)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Documents uploadés */}
                      {uploadedDocuments.map((doc, index) => (
                        doc.uploaded && (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <div>
                                <Typography variant="small" className="font-medium text-green-800">
                                  {doc.type === 'cv' ? 'CV' : 'Lettre de motivation'}
                                </Typography>
                                <Typography variant="muted" className="text-xs text-green-600">
                                  {doc.name}
                                </Typography>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDocumentRemoved(doc.type)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isApplying}
                    className="px-4"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={isApplying || !canSubmit}
                    className={`${!canSubmit ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'} text-white px-6 shadow-lg`}
                  >
                    {isApplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Envoyer ma candidature ({hasValidCV && hasCoverLetter ? '2' : hasValidCV || hasCoverLetter ? '1' : '0'}/2)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
