import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { Company, ContactForm } from '@/types/company';

export interface CompaniesInteractionsState {
  selectedCompany: Company | null;
  showCompanyModal: boolean;
  showContactModal: boolean;
  contactForm: ContactForm;
  isSubmittingContact: boolean;
}

export interface CompaniesInteractionsActions {
  showContactForm: (company: Company) => void;
  closeModal: () => void;
  updateContactForm: (field: keyof ContactForm, value: string) => void;
  submitContactForm: (e: React.FormEvent) => Promise<void>;
  shareCompany: (company: Company) => void;
  viewOffers: (company: Company) => void;
}

export function useCompaniesInteractions() {
  const { toast } = useToast();
  
  // États des interactions
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Actions des interactions


  const showContactForm = useCallback((company: Company) => {
    setSelectedCompany(company);
    setShowContactModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowCompanyModal(false);
    setShowContactModal(false);
    setSelectedCompany(null);
    setContactForm({ name: "", email: "", message: "" });
  }, []);

  const updateContactForm = useCallback((field: keyof ContactForm, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const submitContactForm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setIsSubmittingContact(true);
    
    try {
      // Simuler l'envoi du message (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message envoyé",
        description: `Votre message a été envoyé à ${selectedCompany?.name}`,
        variant: "default",
        duration: 3000,
      });
      closeModal();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSubmittingContact(false);
    }
  }, [contactForm, selectedCompany, toast, closeModal]);

  const shareCompany = useCallback((company: Company) => {
    try {
      const shareUrl = `${window.location.origin}/companies/${company.id}`;
      const shareText = `Découvrez ${company.name} sur LinkUp - ${company.industry}`;
      
      if (navigator.share) {
        navigator.share({
          title: `${company.name} - LinkUp`,
          text: shareText,
          url: shareUrl
        }).catch((error) => {
          console.warn('Erreur lors du partage:', error);
          // Fallback vers la copie
          navigator.clipboard.writeText(shareUrl).then(() => {
            toast({
              title: "Lien copié",
              description: "Le lien de l'entreprise a été copié dans le presse-papiers",
              variant: "default",
              duration: 3000,
            });
          }).catch(() => {
            toast({
              title: "Erreur",
              description: "Impossible de copier le lien",
              variant: "destructive",
            });
          });
        });
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: "Lien copié",
            description: "Le lien de l'entreprise a été copié dans le presse-papiers",
            variant: "default",
            duration: 3000,
          });
        }).catch(() => {
          toast({
            title: "Erreur",
            description: "Impossible de copier le lien",
            variant: "destructive",
          });
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de partager cette entreprise",
        variant: "destructive",
      });
    }
  }, [toast]);

  const viewOffers = useCallback((company: Company) => {
    // Redirection vers la page jobs avec filtrage par entreprise
    // On passe l'ID pour le filtrage backend et le nom pour la recherche frontend
    const companyName = encodeURIComponent(company.name);
    // CORRECTION: Utiliser id_company qui correspond à la base de données
    const companyId = company.id_company || company.id;
    window.location.href = `/jobs?company=${companyId}&search=${companyName}`;
  }, []);

  // État complet
  const state: CompaniesInteractionsState = {
    selectedCompany,
    showCompanyModal,
    showContactModal,
    contactForm,
    isSubmittingContact
  };

  // Actions
  const actions: CompaniesInteractionsActions = {
    showContactForm,
    closeModal,
    updateContactForm,
    submitContactForm,
    shareCompany,
    viewOffers
  };

  return {
    state,
    actions
  };
}
