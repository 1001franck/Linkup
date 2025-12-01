/**
 * Composant Header - Organism
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'en-tête
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Dependency Inversion : Dépend des abstractions (types)
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, User, Menu, X, Sun, Moon, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";
import type { NavItem } from "@/types";

interface HeaderProps {
  navigation?: NavItem[];
}

const Header: React.FC<HeaderProps> = ({ 
  navigation = [
    { label: "Mes candidatures", href: "/my-applications" },
    { label: "Entreprises", href: "/companies" },
    { label: "Offres", href: "/jobs" },
    { label: "Ressources", href: "/resources" },
  ]
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Déterminer le bon dashboard selon le type d'utilisateur
  const getDashboardPath = () => {
    if (user && ('id_company' in user || 'recruiter_mail' in user)) {
      return '/company-dashboard';
    }
    return '/dashboard';
  };
  
  const dashboardPath = getDashboardPath();
  const { profilePicture } = useProfilePictureContext();

  // Éviter l'erreur d'hydratation
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fermer le menu utilisateur quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-user-menu]')) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo */}
          <div className="flex items-center -ml-4">
            <Link href="/" className="flex items-center group">
              <div className="h-48 w-48 flex items-center justify-center">
                <img 
                  src="/assets/reallogo.png" 
                  alt="LinkUp Logo" 
                  className="h-42 w-42 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Center Section: Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 mr-8">
            {/* Lien Tableau de bord pour les utilisateurs authentifiés */}
            {isAuthenticated && (
              <Link
                href={dashboardPath}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-cyan-600 dark:hover:text-cyan-400 relative whitespace-nowrap",
                  pathname === dashboardPath
                    ? "text-cyan-600 dark:text-cyan-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Tableau de bord
                {pathname === dashboardPath && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full"></span>
                )}
              </Link>
            )}
            
            {navigation.map((item) => {
              // Pour les pages protégées, rediriger vers login si non authentifié avec paramètre de redirection
              const protectedPages = ["/my-applications", "/companies", "/jobs", "/resources"];
              const href = protectedPages.includes(item.href) && !isAuthenticated 
                ? `/login?redirect=${item.href}` 
                : item.href;
              
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 hover:text-cyan-600 dark:hover:text-cyan-400 relative whitespace-nowrap",
                      pathname === item.href
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des emplois..."
                   className="pl-10 pr-4 w-64 h-9 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg bg-white/80"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </Button>
              )}

              {isAuthenticated && user && ('id_user' in user ? user.id_user : user.Id_company) ? (
                <>
                  {/* Paramètres */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
                    asChild
                  >
                    <Link href="/settings">
                      <Settings className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </Link>
                  </Button>

                  {/* Menu utilisateur */}
                  <div className="relative" data-user-menu>
                    <Button 
                      variant="ghost" 
                      className="h-9 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt={('id_user' in user) ? `${user.firstname} ${user.lastname}` : user.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {('id_user' in user) ? `${user.firstname.charAt(0)}${user.lastname.charAt(0)}` : user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {('id_user' in user) ? user.firstname : user.name}
                      </span>
                      <ChevronDown className="h-3 w-3 text-slate-500" />
                    </Button>

                    {/* Menu déroulant */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                        {/* En-tête du profil */}
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            {profilePicture ? (
                              <img
                                src={profilePicture}
                                alt={('id_user' in user) ? `${user.firstname} ${user.lastname}` : user.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {('id_user' in user) ? `${user.firstname.charAt(0)}${user.lastname.charAt(0)}` : user.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {('id_user' in user) ? `${user.firstname} ${user.lastname}` : user.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {('id_user' in user) ? user.email : user.recruiter_mail}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Options du menu */}
                        <div className="py-2">
                          <Link 
                            href={dashboardPath}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Mon tableau de bord
                          </Link>
                          <Link 
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Mon profil
                          </Link>
                          <Link 
                            href="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Paramètres
                          </Link>
                          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                          <button
                            onClick={() => {
                              const confirmed = window.confirm(
                                'Êtes-vous sûr de vouloir vous déconnecter ?'
                              );
                              if (confirmed) {
                                logout();
                                setIsUserMenuOpen(false);
                              }
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    asChild
                    className="h-9 px-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <Link href="/login">Se connecter</Link>
                  </Button>
                  <Button 
                    asChild
                    className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/register">Créer un compte</Link>
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/40 bg-white/95 backdrop-blur-md">
            <div className="py-4 space-y-4">
              {/* Mobile Search */}
              <div className="px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher des emplois..."
                     className="pl-10 h-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg bg-white/80"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-3 text-sm font-medium transition-all duration-300 rounded-lg",
                        pathname === item.href
                          ? "text-cyan-600 bg-cyan-50 border-l-4 border-cyan-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Actions */}
              {!user && (
                <div className="px-4 pt-4 border-t border-gray-200/40 space-y-2">
                  <Button 
                    variant="ghost" 
                    asChild
                    className="w-full justify-start h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Se connecter
                    </Link>
                  </Button>
                    <Button 
                      asChild
                      className="w-full h-10 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
                    >
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        Créer un compte
                      </Link>
                    </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export { Header };
