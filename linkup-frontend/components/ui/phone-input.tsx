/**
 * ========================================
 * COMPOSANT PHONE INPUT - SAISIE TÉLÉPHONE
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Composant de saisie téléphonique avec sélection de pays et drapeaux
 * Utilise react-phone-input-2 pour une expérience utilisateur moderne
 * 
 * 🏗️ ARCHITECTURE :
 * - Single Responsibility : Gestion unique de la saisie téléphonique
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * 
 * 🎨 DESIGN :
 * - Card unifiée : Drapeau + Input fusionnés en une seule interface
 * - Style cohérent : Même apparence que les autres inputs du formulaire
 * - Dark mode : Support automatique via les variables CSS Tailwind
 * 
 * 📱 FONCTIONNALITÉS :
 * - Sélection de pays avec drapeaux
 * - Validation automatique des numéros
 * - Pays préférés : France, Belgique, Suisse, Canada, USA, UK, Allemagne, Italie, Espagne, Pays-Bas
 * - Dropdown de recherche pour les pays
 */

"use client";

import React, { useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// ========================================
// INTERFACE TYPESCRIPT
// ========================================

/**
 * Props du composant PhoneInput
 * @interface PhoneInputProps
 */
interface PhoneInputProps {
  /** Valeur actuelle du numéro de téléphone */
  value: string;
  /** Fonction appelée lors du changement de valeur */
  onChange: (value: string) => void;
  /** Texte d'aide affiché dans le champ */
  placeholder?: string;
  /** Classes CSS additionnelles pour le container */
  className?: string;
  /** Champ obligatoire ou non */
  required?: boolean;
  /** Champ désactivé ou non */
  disabled?: boolean;
}

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

/**
 * Composant de saisie téléphonique avec sélection de pays
 * 
 * @param props - Props du composant
 * @returns JSX.Element
 */
export function PhoneInputComponent({ 
  value, 
  onChange, 
  placeholder = "Numéro de téléphone", 
  className = "",
  required = false,
  disabled = false
}: PhoneInputProps) {
  
  // ========================================
  // INJECTION CSS POUR DARK MODE
  // ========================================
  
  useEffect(() => {
    // Créer un style pour le dark mode
    const style = document.createElement('style');
    style.textContent = `
      /* Dark mode pour react-phone-input-2 */
      .dark .react-tel-input {
        background-color: hsl(var(--card)) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.375rem !important;
      }
      
      .dark .react-tel-input .form-control {
        background-color: hsl(var(--card)) !important;
        color: hsl(var(--foreground)) !important;
        border: none !important;
        border-radius: 0.375rem !important;
        height: 2.5rem !important;
        font-size: 0.875rem !important;
        padding-left: 3.5rem !important;
      }
      
      .dark .react-tel-input .form-control:focus {
        background-color: hsl(var(--card)) !important;
        color: hsl(var(--foreground)) !important;
        border: none !important;
        box-shadow: 0 0 0 2px hsl(var(--ring)) !important;
      }
      
      .dark .react-tel-input .form-control::placeholder {
        color: hsl(var(--muted-foreground)) !important;
      }
      
      .dark .react-tel-input .flag-dropdown {
        background-color: hsl(var(--card)) !important;
        border: none !important;
        border-right: 1px solid hsl(var(--border)) !important;
        border-radius: 0.375rem 0 0 0.375rem !important;
      }
      
      .dark .react-tel-input .flag-dropdown:hover {
        background-color: hsl(var(--muted)) !important;
      }
      
      .dark .react-tel-input .country-list {
        background-color: hsl(var(--card)) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.375rem !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
      }
      
      .dark .react-tel-input .country-list .country {
        background-color: transparent !important;
        color: hsl(var(--foreground)) !important;
      }
      
      .dark .react-tel-input .country-list .country:hover {
        background-color: hsl(var(--muted)) !important;
      }
      
      .dark .react-tel-input .country-list .country.highlight {
        background-color: hsl(var(--primary) / 0.15) !important;
        color: hsl(var(--primary)) !important;
      }
      
      .dark .react-tel-input .country-list .search-box {
        background-color: hsl(var(--background)) !important;
        border: 1px solid hsl(var(--border)) !important;
        color: hsl(var(--foreground)) !important;
        border-radius: 0.375rem !important;
      }
      
      .dark .react-tel-input .country-list .search-box::placeholder {
        color: hsl(var(--muted-foreground)) !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Nettoyage
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // ========================================
  // RENDU DU COMPOSANT
  // ========================================
  
  return (
    <div className={`w-full ${className}`}>
      <PhoneInput
        // ========================================
        // CONFIGURATION DE BASE
        // ========================================
        
        /** Pays par défaut : France */
        country="fr"
        
        /** Valeur actuelle du numéro */
        value={value}
        
        /** Fonction de callback pour les changements */
        onChange={onChange}
        
        /** Texte d'aide */
        placeholder={placeholder}
        
        /** État désactivé */
        disabled={disabled}
        
        // ========================================
        // CONFIGURATION DU DROPDOWN
        // ========================================
        
        /** Afficher le dropdown de sélection de pays */
        enableSearch={true}
        
        /** Pays préférés (affichés en premier) */
        preferredCountries={['fr', 'be', 'ch', 'ca', 'us', 'gb', 'de', 'it', 'es', 'nl']}
        
        /** Style personnalisé */
        containerStyle={{
          width: '100%'
        }}
        
        inputStyle={{
          width: '100%',
          height: '2.5rem',
          fontSize: '0.875rem',
          paddingLeft: '3.5rem'
        }}
        
        buttonStyle={{
          backgroundColor: 'transparent',
          border: 'none',
          borderRight: '1px solid hsl(var(--border))',
          borderRadius: '0.375rem 0 0 0.375rem'
        }}
      />
    </div>
  );
}