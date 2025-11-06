import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  X,
  Send,
  MapPin,
  Users,
  Briefcase,
  MessageCircle,
} from 'lucide-react';
import { Company, ContactForm } from '@/types/company';

interface CompanyModalProps {
  isOpen: boolean;
  company: Company | null;
  isSubmittingContact: boolean;
  contactForm: ContactForm;
  onClose: () => void;
  onContactSubmit: (e: React.FormEvent) => void;
  onContactFormChange: (field: keyof ContactForm, value: string) => void;
  onViewOffers: (company: Company) => void;
}

export const CompanyModal = React.memo<CompanyModalProps>(({
  isOpen,
  company,
  isSubmittingContact,
  contactForm,
  onClose,
  onContactSubmit,
  onContactFormChange,
  onViewOffers,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Gestion de l'accessibilité - focus et escape
  useEffect(() => {
    if (isOpen) {
      // Focus sur le modal quand il s'ouvre
      modalRef.current?.focus();
      
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
      
      // Gestion de la touche Escape
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Gestion du focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  // Mémoriser les handlers

  const handleViewOffers = useCallback(() => {
    if (company) {
      onViewOffers(company);
    }
  }, [company, onViewOffers]);

  const handleContactFormChange = useCallback((field: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onContactFormChange(field, e.target.value);
  }, [onContactFormChange]);

  if (!company) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-background/95 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            tabIndex={-1}
          >
            <div className="p-6">
              {/* Header du modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center">
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h2 id="modal-title" className="text-2xl font-bold text-foreground">
                      {company.name}
                    </h2>
                    <p id="modal-description" className="text-muted-foreground">
                      {company.industry}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  aria-label="Fermer le modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Contenu du modal */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    À propos
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {company.description}
                  </p>
                </div>

                {/* Informations détaillées */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Localisation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {company.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Taille
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {company.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Offres disponibles
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {company.jobsAvailable} postes
                      </p>
                    </div>
                  </div>

                </div>

                {/* Avantages */}
                {company.benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Avantages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {company.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulaire de contact */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Contacter {company.name}
                  </h3>
                  <form onSubmit={onContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2">
                        Votre nom
                      </label>
                      <Input
                        id="contact-name"
                        type="text"
                        value={contactForm.name}
                        onChange={handleContactFormChange('name')}
                        placeholder="Votre nom complet"
                        required
                        disabled={isSubmittingContact}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-2">
                        Votre email
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange('email')}
                        placeholder="votre@email.com"
                        required
                        disabled={isSubmittingContact}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        value={contactForm.message}
                        onChange={handleContactFormChange('message')}
                        placeholder="Votre message..."
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50"
                        rows={4}
                        required
                        disabled={isSubmittingContact}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                        disabled={isSubmittingContact}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                      >
                        {isSubmittingContact ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={handleViewOffers}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    {company.jobsAvailable > 1 ? 'Voir les offres' : 'Voir l\'offre'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

CompanyModal.displayName = 'CompanyModal';
