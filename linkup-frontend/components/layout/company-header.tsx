/**
 * Composant Header Entreprise - Organism
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'en-tête entreprise
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Dependency Inversion : Dépend des abstractions (types)
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Settings, 
  LogOut, 
  ChevronDown,
  Building2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyLogoContext } from "@/contexts/CompanyLogoContext";
import type { Company } from "@/types/api";

interface CompanyHeaderProps {
  navigation?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ 
  navigation = [
    { label: "Tableau de bord", href: "/company-dashboard" },
    { label: "Mes offres", href: "/company-dashboard/jobs" },
    { label: "Candidatures", href: "/company-dashboard/applications" },
    { label: "Profil", href: "/company-dashboard/profile" },
  ]
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { logo } = useCompanyLogoContext();

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

  const handleLogout = () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter ?'
    );
    if (confirmed) {
      logout();
      setIsUserMenuOpen(false);
    }
  };

  // Vérifier si l'utilisateur est une entreprise
  const isCompany = user && ('Id_company' in user || 'recruiter_mail' in user);
  const company = user as Company | null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo LinkUp */}
          <div className="flex items-center -ml-4">
            <Link href="/company-dashboard" className="flex items-center group">
              <div className="h-16 w-48 flex items-center justify-center">
                  <img 
                  src="/assets/reallogo.png" 
                  alt="LinkUp Logo" 
                  className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Center Section: Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 mr-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary relative whitespace-nowrap",
                  pathname === item.href
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section: Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Rechercher des candidats..."
                  className="pl-10 pr-4 w-64 h-9 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-lg bg-white/80"
                  autoComplete="off"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>

            {/* Actions principales */}
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

              {/* Paramètres */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
                asChild
              >
                <Link href="/company-dashboard/settings">
                  <Settings className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </Link>
              </Button>

              {/* Menu utilisateur entreprise */}
              {isAuthenticated && isCompany && (
                <div className="relative" data-user-menu>
                  <Button 
                    variant="ghost" 
                    className="h-9 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    {logo ? (
                      <img 
                        src={logo} 
                        alt={company ? `${company.name} Logo` : 'Logo'} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-foreground">
                      {company?.name || 'Entreprise'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-foreground">{company?.name || 'Entreprise'}</p>
                        <p className="text-xs text-muted-foreground">{company?.recruiter_mail || ''}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/company-profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profil entreprise
                        </Link>
                        
                        <Link
                          href="/company-dashboard/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Paramètres
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Menu mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-3 text-sm font-medium transition-all duration-300 rounded-lg",
                    pathname === item.href
                      ? "text-primary bg-primary/10 border-l-4 border-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default CompanyHeader;
