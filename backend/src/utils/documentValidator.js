/**
 * Utilitaire de validation des documents de candidature
 * Vérifie que l'utilisateur a uploadé exactement 2 documents requis
 */

import supabase from "../database/db.js";
import logger from "../utils/logger.js";

/**
 * Valide que l'utilisateur a uploadé les documents requis pour une candidature
 * @param {number} userId - ID de l'utilisateur
 * @param {number} jobId - ID de l'offre d'emploi
 * @returns {Promise<{isValid: boolean, error?: string, documents?: Array}>}
 */
export async function validateApplicationDocuments(userId, jobId) {
  try {
    // Récupérer les documents uploadés pour cette candidature
    const { data: documents, error } = await supabase
      .from('application_documents')
      .select('document_type, file_name, uploaded_at')
      .eq('id_user', userId)
      .eq('id_job_offer', parseInt(jobId));

    if (error) {
      logger.error('[validateApplicationDocuments] Erreur Supabase:', error);
      return {
        isValid: false,
        error: "Erreur lors de la vérification des documents"
      };
    }

    const documentTypes = documents?.map(doc => doc.document_type) || [];
    const hasCV = documentTypes.includes('cv');
    const hasCoverLetter = documentTypes.includes('cover_letter');
    
    // Vérifier si le CV est marqué comme "existing_cv" (CV existant de l'utilisateur)
    const hasExistingCV = documents?.some(doc => doc.document_type === 'cv' && doc.file_url === 'existing_cv') || false;

    // Vérifications
    if (documents.length === 0) {
      return {
        isValid: false,
        error: "Aucun document uploadé. Vous devez uploader un CV et une lettre de motivation."
      };
    }

    // Pour le CV existant, on compte comme 1 document même si file_url = 'existing_cv'
    const effectiveDocumentCount = documents.length;
    
    if (effectiveDocumentCount < 2) {
      return {
        isValid: false,
        error: "Documents manquants. Vous devez uploader un CV ET une lettre de motivation."
      };
    }

    if (documents.length > 2) {
      return {
        isValid: false,
        error: "Trop de documents uploadés. Vous ne pouvez uploader que 2 documents maximum."
      };
    }

    if (!hasCV && !hasExistingCV) {
      return {
        isValid: false,
        error: "CV manquant. Vous devez uploader votre CV ou utiliser votre CV existant."
      };
    }

    if (!hasCoverLetter) {
      return {
        isValid: false,
        error: "Lettre de motivation manquante. Vous devez uploader votre lettre de motivation."
      };
    }

    // Tout est OK
    return {
      isValid: true,
      documents: documents
    };

  } catch (err) {
    console.error('[validateApplicationDocuments] Erreur:', err);
    return {
      isValid: false,
      error: "Erreur lors de la validation des documents"
    };
  }
}

/**
 * Vérifie si un type de document est déjà uploadé
 * @param {number} userId - ID de l'utilisateur
 * @param {number} jobId - ID de l'offre d'emploi
 * @param {string} documentType - Type de document ('cv' ou 'cover_letter')
 * @returns {Promise<boolean>}
 */
export async function isDocumentTypeUploaded(userId, jobId, documentType) {
  try {
    const { data, error } = await supabase
      .from('application_documents')
      .select('id_document')
      .eq('id_user', userId)
      .eq('id_job_offer', parseInt(jobId))
      .eq('document_type', documentType)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      logger.error('[isDocumentTypeUploaded] Erreur Supabase:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('[isDocumentTypeUploaded] Erreur:', err);
    return false;
  }
}
