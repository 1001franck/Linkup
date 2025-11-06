/**
 * Hook personnalisé pour valider les documents de candidature
 * Gère la logique de validation des 2 documents requis (CV + Lettre de motivation)
 */

import { useMemo } from 'react';

export interface UploadedDocument {
  type: 'cv' | 'cover_letter';
  name: string;
  uploaded: boolean;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errorMessage?: string;
  uploadedCount: number;
  hasCV: boolean;
  hasCoverLetter: boolean;
  canSubmit: boolean;
}

/**
 * Hook pour valider les documents uploadés
 * @param uploadedDocuments - Liste des documents uploadés
 * @returns DocumentValidationResult
 */
export function useDocumentValidation(uploadedDocuments: UploadedDocument[]): DocumentValidationResult {
  return useMemo(() => {
    const uploadedCount = uploadedDocuments.filter(doc => doc.uploaded).length;
    const hasCV = uploadedDocuments.some(doc => doc.type === 'cv' && doc.uploaded);
    const hasCoverLetter = uploadedDocuments.some(doc => doc.type === 'cover_letter' && doc.uploaded);

    // Validation des documents
    if (uploadedCount === 0) {
      return {
        isValid: false,
        errorMessage: "Veuillez ajouter les 2 fichiers requis (CV et lettre de motivation).",
        uploadedCount,
        hasCV,
        hasCoverLetter,
        canSubmit: false
      };
    }

    if (uploadedCount < 2) {
      return {
        isValid: false,
        errorMessage: "Veuillez ajouter les 2 fichiers requis (CV et lettre de motivation).",
        uploadedCount,
        hasCV,
        hasCoverLetter,
        canSubmit: false
      };
    }

    if (uploadedCount > 2) {
      return {
        isValid: false,
        errorMessage: "Vous ne pouvez uploader que 2 documents maximum.",
        uploadedCount,
        hasCV,
        hasCoverLetter,
        canSubmit: false
      };
    }

    if (!hasCV) {
      return {
        isValid: false,
        errorMessage: "Vous devez uploader votre CV.",
        uploadedCount,
        hasCV,
        hasCoverLetter,
        canSubmit: false
      };
    }

    if (!hasCoverLetter) {
      return {
        isValid: false,
        errorMessage: "Vous devez uploader votre lettre de motivation.",
        uploadedCount,
        hasCV,
        hasCoverLetter,
        canSubmit: false
      };
    }

    // Tout est OK
    return {
      isValid: true,
      uploadedCount,
      hasCV,
      hasCoverLetter,
      canSubmit: true
    };
  }, [uploadedDocuments]);
}

/**
 * Fonction utilitaire pour créer l'état initial des documents
 * @returns UploadedDocument[]
 */
export function createInitialDocuments(): UploadedDocument[] {
  return [
    { type: 'cv', name: '', uploaded: false },
    { type: 'cover_letter', name: '', uploaded: false }
  ];
}

/**
 * Fonction utilitaire pour mettre à jour un document
 * @param documents - Liste actuelle des documents
 * @param type - Type de document à mettre à jour
 * @param fileName - Nom du fichier
 * @returns UploadedDocument[]
 */
export function updateDocument(
  documents: UploadedDocument[], 
  type: 'cv' | 'cover_letter', 
  fileName: string
): UploadedDocument[] {
  return documents.map(doc => 
    doc.type === type 
      ? { ...doc, name: fileName, uploaded: true }
      : doc
  );
}

/**
 * Fonction utilitaire pour supprimer un document
 * @param documents - Liste actuelle des documents
 * @param type - Type de document à supprimer
 * @returns UploadedDocument[]
 */
export function removeDocument(
  documents: UploadedDocument[], 
  type: 'cv' | 'cover_letter'
): UploadedDocument[] {
  return documents.map(doc => 
    doc.type === type 
      ? { ...doc, name: '', uploaded: false }
      : doc
  );
}
