import { useCallback, useState, useEffect } from 'react';
import { Application, ApplicationDocuments, CompanyInfo, JobOfferInfo, ApplicationMetadata } from '@/types/application';
import { apiClient } from '@/lib/api-client';
import logger from '@/lib/logger';

/**
 * Hook personnalisé pour transformer les données API en format Application
 * Centralise la logique de transformation des données
 */
export function useApplicationTransformer(savedJobs?: Set<number>) {
  
  // État pour stocker les noms d'entreprises récupérés
  const [companyNames, setCompanyNames] = useState<{ [key: string]: string }>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Fonction pour récupérer dynamiquement le nom de l'entreprise
  const fetchCompanyName = useCallback(async (companyId: number): Promise<string> => {
    try {
      const response = await apiClient.publicRequest(`/companies/${companyId}`);
      
      // Gérer la structure imbriquée des données
      const responseData = response.data as any;
      const companyData = responseData?.data || responseData;
      
      if (response.success && companyData?.name) {
        // Mettre à jour l'état avec le nom récupéré
        const companyName = companyData.name;
        setCompanyNames(prev => ({
          ...prev,
          [companyId.toString()]: companyName
        }));
        // Forcer le re-render
        setRefreshTrigger(prev => prev + 1);
        return companyName;
      }
    } catch (error) {
      logger.warn(`Erreur récupération entreprise ${companyId}:`, error);
    }
    return `Entreprise ${companyId}`;
  }, []);
  
  // Fonction pour transformer les documents
  const transformDocuments = useCallback((apiDocuments: any[]): ApplicationDocuments => {
    const docs: ApplicationDocuments = {
      cv: null,
      coverLetter: null,
      portfolio: null
    };
    
    apiDocuments?.forEach((doc: any) => {
      const documentData = {
        name: doc.file_name,
        url: doc.file_url,
        uploadedAt: new Date(doc.uploaded_at).toLocaleDateString('fr-FR')
      };
      
      switch (doc.document_type) {
        case 'cv':
          docs.cv = documentData;
          break;
        case 'cover_letter':
          docs.coverLetter = documentData;
          break;
        case 'portfolio':
          docs.portfolio = documentData;
          break;
      }
    });
    
    return docs;
  }, []);

  // Fonction pour transformer les informations de l'entreprise
  const transformCompanyInfo = useCallback((company: any, companyId?: number): CompanyInfo => {
    const finalCompanyId = company?.id_company || companyId || "unknown";
    
    // Si on a les données de l'entreprise depuis le backend, les utiliser
    let companyName = company?.name;
    
    // Si pas de données d'entreprise, essayer de récupérer le nom dynamiquement
    if (!companyName && finalCompanyId !== "unknown") {
      // Vérifier si on a déjà le nom en cache
      if (companyNames[finalCompanyId.toString()]) {
        companyName = companyNames[finalCompanyId.toString()];
      } else {
        // Récupérer le nom de manière asynchrone
        fetchCompanyName(parseInt(finalCompanyId.toString()));
        // En attendant, utiliser un nom générique
        companyName = `Chargement...`;
      }
    }
    
    return {
      id: finalCompanyId.toString(),
      name: companyName || "Entreprise non disponible",
      logo: company?.logo || null, // null pour utiliser les initiales dans le composant
      website: company?.website || undefined,
      industry: company?.industry || undefined,
      city: company?.city || undefined,
      country: company?.country || undefined,
      recruiterName: company?.recruiter_name || undefined,
      recruiterEmail: company?.recruiter_email || undefined
    };
  }, [fetchCompanyName, companyNames, refreshTrigger]);

  // Fonction pour transformer les informations de l'offre d'emploi
  const transformJobOfferInfo = useCallback((jobOffer: any): JobOfferInfo => {
    // Calculer le salaryRange avec gestion de tous les cas possibles
    let salaryRange = "Salaire non spécifié";
    if (jobOffer?.salary_min && jobOffer?.salary_max) {
      salaryRange = `${jobOffer.salary_min}-${jobOffer.salary_max}k€`;
    } else if (jobOffer?.salary_min) {
      salaryRange = `${jobOffer.salary_min}k€+`;
    } else if (jobOffer?.salary_max) {
      salaryRange = `Jusqu'à ${jobOffer.salary_max}k€`;
    } else if (jobOffer?.salary) {
      // Si salary est un nombre unique
      if (typeof jobOffer.salary === 'number') {
        salaryRange = `${jobOffer.salary}k€`;
      } else if (typeof jobOffer.salary === 'object' && jobOffer.salary !== null) {
        // Si salary est un objet {min, max}
        if (jobOffer.salary.min && jobOffer.salary.max) {
          salaryRange = `${jobOffer.salary.min}-${jobOffer.salary.max}k€`;
        } else if (jobOffer.salary.min) {
          salaryRange = `${jobOffer.salary.min}k€+`;
        } else if (jobOffer.salary.max) {
          salaryRange = `Jusqu'à ${jobOffer.salary.max}k€`;
        }
      }
    }

    // Parser les requirements et benefits de manière sécurisée
    let requirements: string[] = [];
    if (jobOffer?.requirements) {
      if (Array.isArray(jobOffer.requirements)) {
        requirements = jobOffer.requirements;
      } else if (typeof jobOffer.requirements === 'string') {
        try {
          if (jobOffer.requirements.startsWith('[') || jobOffer.requirements.startsWith('{')) {
            requirements = JSON.parse(jobOffer.requirements);
          } else {
            requirements = jobOffer.requirements.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
          }
        } catch (e) {
          requirements = jobOffer.requirements.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
        }
      }
    }

    let benefits: string[] = [];
    if (jobOffer?.benefits) {
      if (Array.isArray(jobOffer.benefits)) {
        benefits = jobOffer.benefits;
      } else if (typeof jobOffer.benefits === 'string') {
        try {
          if (jobOffer.benefits.startsWith('[') || jobOffer.benefits.startsWith('{')) {
            benefits = JSON.parse(jobOffer.benefits);
          } else {
            benefits = jobOffer.benefits.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
          }
        } catch (e) {
          benefits = jobOffer.benefits.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
        }
      }
    }

    return {
      id: jobOffer?.id_job_offer?.toString() || jobOffer?.id?.toString() || "unknown",
      title: jobOffer?.title || "Titre non disponible",
      description: jobOffer?.description || "Description non disponible",
      location: jobOffer?.location || "Localisation non disponible",
      contractType: jobOffer?.contract_type || jobOffer?.type || "Type non spécifié",
      salaryRange: salaryRange,
      requirements: requirements,
      benefits: benefits,
      experience: jobOffer?.experience || "Non spécifié",
      education: jobOffer?.education || jobOffer?.formation_required || "Non spécifié",
      remote: jobOffer?.remote === true || jobOffer?.remote === "true" || false,
      urgency: jobOffer?.urgency || "low"
    };
  }, []);

  // Fonction pour transformer les métadonnées
  const transformMetadata = useCallback((apiApp: any, jobOfferId?: number): ApplicationMetadata => {
    // La table apply a une clé primaire composée (id_user, id_job_offer)
    // On utilise id_job_offer comme identifiant unique pour le frontend
    const id = apiApp.id_job_offer?.toString() || `${apiApp.id_user}-${apiApp.id_job_offer}`;
    
    return {
      id: id,
      status: apiApp.status || "pending",
      isArchived: apiApp.is_archived || false,
      isBookmarked: jobOfferId ? (savedJobs?.has(jobOfferId) || false) : false,
      appliedDate: apiApp.application_date 
        ? new Date(apiApp.application_date).toLocaleDateString('fr-FR')
        : "Date non disponible",
      interviewDate: apiApp.interview_date 
        ? new Date(apiApp.interview_date).toLocaleDateString('fr-FR')
        : undefined,
      notes: apiApp.notes || undefined
    };
  }, [savedJobs]);

  // Fonction principale de transformation
  const transformApiApplication = useCallback((apiApp: any): Application => {
    const jobOffer = apiApp.job_offer;
    const company = jobOffer?.company;
    const documents = apiApp.application_documents || [];
    
    return {
      metadata: transformMetadata(apiApp, jobOffer?.id_job_offer),
      company: transformCompanyInfo(company, jobOffer?.id_company),
      jobOffer: transformJobOfferInfo(jobOffer),
      documents: transformDocuments(documents)
    };
  }, [transformMetadata, transformCompanyInfo, transformJobOfferInfo, transformDocuments]);

  // Fonction pour transformer un tableau d'applications
  const transformApiApplications = useCallback((apiApplications: any[]): Application[] => {
    return apiApplications.map(transformApiApplication);
  }, [transformApiApplication]);

  return {
    transformApiApplication,
    transformApiApplications,
    transformDocuments,
    transformCompanyInfo,
    transformJobOfferInfo,
    transformMetadata
  };
}
