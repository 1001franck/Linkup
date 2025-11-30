/**
 * Composant de carte d'entreprise
 * Respect des principes SOLID, KISS et DRY
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MarketingCompany } from '@/lib/marketing-data';
import { 
  SiGoogle, SiApple, SiMeta, SiSap, SiOracle, SiSalesforce, SiAdobe,
  SiNike, SiAdidas, SiSpotify, SiPaypal, SiStripe, SiNvidia, SiOpenai, SiShell
} from "react-icons/si";
import { FaMicrosoft, FaBuilding, FaIndustry, FaBolt, FaOilCan } from "react-icons/fa";

interface CompanyCardProps {
  company: MarketingCompany;
  index: number;
  onFollow: (companyId: string) => void;
  onViewOffers: (companyId: string) => void;
}

/**
 * Composant de carte d'entreprise réutilisable
 * Single Responsibility: Affichage d'une seule carte d'entreprise
 * Open/Closed: Extensible via props
 */
export function CompanyCard({ 
  company, 
  index, 
  onFollow, 
  onViewOffers 
}: CompanyCardProps) {
  const [logoError, setLogoError] = useState(false);
  
  // Fonction pour obtenir le composant logo
  const getLogoComponent = (logoName: string, colorClass: string) => {
    const logoProps = { className: `w-6 h-6 ${colorClass}` };
    
    const logoMap: { [key: string]: React.ComponentType<any> } = {
      SiGoogle, SiApple, SiMeta, SiSap, SiOracle, SiSalesforce, SiAdobe,
      SiNike, SiAdidas, SiSpotify, SiPaypal, SiStripe, SiNvidia, SiOpenai, SiShell,
      FaMicrosoft, FaBuilding, FaIndustry, FaBolt, FaOilCan
    };
    
    const LogoComponent = logoMap[logoName];
    return LogoComponent ? <LogoComponent {...logoProps} /> : <FaBuilding {...logoProps} />;
  };
  
  // Déterminer si le logo est une URL d'image
  const isImageUrl = company.logo && (company.logo.startsWith('http://') || company.logo.startsWith('https://'));
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative bg-background rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border hover:border-primary/50 hover:-translate-y-2 cursor-pointer"
    >
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url("${company.image}")` }}
        />
        
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Company Logo */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          {isImageUrl && !logoError ? (
            // Si c'est une URL d'image, afficher l'image
            <img 
              src={company.logo} 
              alt={`${company.name} logo`}
              className="w-full h-full object-contain p-1"
              onError={() => {
                // Fallback vers icône si l'image ne charge pas
                setLogoError(true);
              }}
            />
          ) : (
            // Sinon, utiliser les icônes React ou placeholder
            getLogoComponent(company.logo || 'FaBuilding', company.logoColor || 'text-primary')
          )}
        </div>
        
        {/* Follow Button */}
        <div className="absolute top-4 right-4">
          <Button 
            size="sm" 
            className="bg-white/95 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-slate-900 shadow-lg border-0 cursor-pointer"
            onClick={() => onFollow(company.id)}
          >
            <span className="text-xs font-medium">Suivre</span>
          </Button>
        </div>
        
        {/* Company Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {company.name}
          </h3>
          <p className="text-sm text-white/90 drop-shadow-md">
            {company.sector}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Location */}
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="w-1 h-1 bg-primary rounded-full"></div>
          <span className="text-sm">{company.locations}</span>
        </div>
        
        {/* Employees */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Taille de l'entreprise</span>
          <span className="font-medium">{company.employees}</span>
        </div>
        
        {/* Offers */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {company.offers > 0 ? (
              <>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-foreground">
                  {company.offers} offres actives
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Aucune offre active pour le moment
                </span>
              </>
            )}
          </div>
          {company.offers > 0 && (
            <Button 
              size="sm" 
              variant="outline" 
              className="border-primary/50 text-primary hover:bg-primary/10 cursor-pointer"
              onClick={() => onViewOffers(company.id)}
            >
              Voir les offres
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
