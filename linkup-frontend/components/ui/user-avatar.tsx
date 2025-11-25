/**
 * Composant Avatar Utilisateur - LinkUp
 * Gère l'affichage des photos de profil avec fallback intelligent
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  /** URL de la photo de profil */
  src?: string | null;
  /** Nom complet de l'utilisateur pour les initiales */
  name: string;
  /** Taille de l'avatar */
  size?: "sm" | "md" | "lg" | "xl";
  /** Classes CSS supplémentaires */
  className?: string;
  /** Alt text pour l'image */
  alt?: string;
  /** Fonction de clic */
  onClick?: () => void;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg"
};

export function UserAvatar({ 
  src, 
  name, 
  size = "md", 
  className,
  alt,
  onClick 
}: UserAvatarProps) {
  // Générer les initiales à partir du nom
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Générer une couleur de fond basée sur le nom (pour la cohérence)
  const getBackgroundColor = (fullName: string): string => {
    const colors = [
      "bg-gradient-to-br from-cyan-500 to-teal-600",
      "bg-gradient-to-br from-blue-500 to-indigo-600", 
      "bg-gradient-to-br from-purple-500 to-pink-600",
      "bg-gradient-to-br from-green-500 to-emerald-600",
      "bg-gradient-to-br from-orange-500 to-red-600",
      "bg-gradient-to-br from-pink-500 to-rose-600",
      "bg-gradient-to-br from-indigo-500 to-purple-600",
      "bg-gradient-to-br from-teal-500 to-cyan-600"
    ];
    
    // Utiliser le nom pour générer un index cohérent
    const hash = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);
  const sizeClass = sizeClasses[size];

  // Si une image est fournie, l'afficher
  if (src) {
    return (
      <div 
        className={cn(
          "relative rounded-full overflow-hidden",
          sizeClass,
          onClick && "cursor-pointer hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 transition-all duration-200",
          className
        )}
        onClick={onClick}
      >
        <img 
          src={src} 
          alt={alt || name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Si l'image ne charge pas, afficher les initiales
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="h-full w-full ${backgroundColor} flex items-center justify-center text-white font-semibold">
                  ${initials}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  }

  // Sinon, afficher les initiales avec un gradient
  return (
    <div 
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center text-white font-semibold",
        backgroundColor,
        sizeClass,
        onClick && "cursor-pointer hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      {initials}
    </div>
  );
}

/**
 * Composant Avatar d'Entreprise
 */
interface CompanyAvatarProps {
  /** URL du logo de l'entreprise */
  src?: string | null;
  /** Nom de l'entreprise */
  name: string;
  /** Site web de l'entreprise (pour Clearbit) */
  website?: string;
  /** Taille de l'avatar */
  size?: "sm" | "md" | "lg" | "xl";
  /** Classes CSS supplémentaires */
  className?: string;
  /** Fonction de clic */
  onClick?: () => void;
}

export function CompanyAvatar({ 
  src, 
  name, 
  website,
  size = "md", 
  className,
  onClick 
}: CompanyAvatarProps) {
  // Générer les initiales à partir du nom de l'entreprise
  const getInitials = (companyName: string): string => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Générer une couleur de fond basée sur le nom de l'entreprise
  const getBackgroundColor = (companyName: string): string => {
    const colors = [
      "bg-gradient-to-br from-slate-500 to-gray-600",
      "bg-gradient-to-br from-blue-500 to-indigo-600", 
      "bg-gradient-to-br from-purple-500 to-violet-600",
      "bg-gradient-to-br from-green-500 to-emerald-600",
      "bg-gradient-to-br from-orange-500 to-amber-600",
      "bg-gradient-to-br from-red-500 to-pink-600",
      "bg-gradient-to-br from-indigo-500 to-blue-600",
      "bg-gradient-to-br from-teal-500 to-green-600"
    ];
    
    const hash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Essayer d'obtenir le logo via Clearbit si un site web est fourni
  const getLogoUrl = (): string | null => {
    if (src) return src;
    if (website) {
      try {
        const hostname = new URL(website).hostname;
        return `https://logo.clearbit.com/${hostname}`;
      } catch {
        return null;
      }
    }
    return null;
  };

  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);
  const sizeClass = sizeClasses[size];
  const logoUrl = getLogoUrl();

  // Si un logo est disponible, l'afficher
  if (logoUrl) {
    return (
      <div 
        className={cn(
          "relative rounded-lg overflow-hidden bg-white flex items-center justify-center",
          sizeClass,
          onClick && "cursor-pointer hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 transition-all duration-200",
          className
        )}
        onClick={onClick}
      >
        <img 
          src={logoUrl} 
          alt={`Logo ${name}`}
          className="h-full w-full object-contain p-1"
          onError={(e) => {
            // Si le logo ne charge pas, afficher les initiales
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.className = parent.className.replace('bg-white', backgroundColor);
              parent.innerHTML = `
                <div class="h-full w-full flex items-center justify-center text-white font-semibold">
                  ${initials}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  }

  // Sinon, afficher les initiales avec un gradient
  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden flex items-center justify-center text-white font-semibold",
        backgroundColor,
        sizeClass,
        onClick && "cursor-pointer hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      {initials}
    </div>
  );
}
