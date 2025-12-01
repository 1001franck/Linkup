/**
 * Page d'accueil LinkUp - Landing Page
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page d'accueil
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code, MessageSquare, Palette } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { CompanyCard } from "@/components/ui/company-card";
import { useCompanyPagination } from "@/hooks/use-company-pagination";
import { Company, CompanyFilters } from "@/types/company";
import { 
  Search, 
  MapPin,
  Rocket,
  Play,
  Users,
  Briefcase,
  MessageCircle,
  Bell,
  Calendar,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
  Plus,
  Settings,
  User
} from "lucide-react";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { 
  SiGoogle, SiApple, SiAmazon, SiMeta, SiNetflix, SiTesla, SiSpotify,
  SiSap, SiOracle, SiSalesforce, SiAdobe, SiAtlassian,
  SiZalando, SiShopify, SiEbay, SiEtsy, SiWish,
  SiYoutube, SiTwitch, SiTiktok, SiPinterest, SiSnapchat,
  SiShell
} from "react-icons/si";
import { FaMicrosoft, FaBuilding, FaIndustry, FaBolt, FaOilCan } from "react-icons/fa";


// Composant pour la page d'accueil marketing (non authentifié)
function MarketingHomePage() {
  const [activeFilter, setActiveFilter] = useState("Toutes");
  return <MarketingHomePageContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />;
}

// Contenu commun de la page marketing
function MarketingHomePageContent({ activeFilter, setActiveFilter }: { 
  activeFilter: string; 
  setActiveFilter: (filter: string) => void;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  // Fonction pour gérer la recherche
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    if (location.trim()) {
      params.append('location', location.trim());
    }
    
    // Rediriger vers la page jobs avec les paramètres de recherche
    const queryString = params.toString();
    router.push(`/jobs${queryString ? `?${queryString}` : ''}`);
  };

  // Gérer la soumission avec Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Données des entreprises avec leurs catégories
  const companies = [
    // TECH (8+ entreprises)
    {
      id: "google",
      name: "Google",
      sector: "Technologie / Internet",
      category: "Tech",
      locations: "Paris, Dublin, Zurich",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiGoogle",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "microsoft",
      name: "Microsoft",
      sector: "Technologie / Logiciel",
      category: "Tech",
      locations: "Paris, Dublin, Amsterdam",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaMicrosoft",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "apple",
      name: "Apple",
      sector: "Technologie / Hardware",
      category: "Tech",
      locations: "Paris, Londres, Munich",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiApple",
      logoColor: "text-slate-800",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "meta",
      name: "Meta",
      sector: "Réseaux sociaux / VR",
      category: "Tech",
      locations: "Paris, Londres, Dublin",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiMeta",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "sap",
      name: "SAP",
      sector: "Logiciel d'entreprise",
      category: "Tech",
      locations: "Paris, Berlin, Zurich",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiSap",
      logoColor: "text-cyan-700",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "oracle",
      name: "Oracle",
      sector: "Base de données / Cloud",
      category: "Tech",
      locations: "Paris, Dublin, Amsterdam",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiOracle",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "salesforce",
      name: "Salesforce",
      sector: "CRM / Cloud",
      category: "Tech",
      locations: "Paris, Londres, Dublin",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiSalesforce",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "adobe",
      name: "Adobe",
      sector: "Logiciels créatifs",
      category: "Tech",
      locations: "Paris, Dublin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiAdobe",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "atlassian",
      name: "Atlassian",
      sector: "Outils de développement",
      category: "Tech",
      locations: "Paris, Amsterdam, Munich",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiAtlassian",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },

    // E-COMMERCE (8+ entreprises)
    {
      id: "amazon",
      name: "Amazon",
      sector: "E-commerce / Cloud",
      category: "E-commerce",
      locations: "Paris, Dublin, Luxembourg",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiAmazon",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "zalando",
      name: "Zalando",
      sector: "Mode en ligne",
      category: "E-commerce",
      locations: "Paris, Berlin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiZalando",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "alibaba",
      name: "Alibaba",
      sector: "E-commerce B2B",
      category: "E-commerce",
      locations: "Paris, Londres, Amsterdam",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaBuilding",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "shopify",
      name: "Shopify",
      sector: "Plateforme e-commerce",
      category: "E-commerce",
      locations: "Paris, Dublin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiShopify",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "ebay",
      name: "eBay",
      sector: "Marketplace en ligne",
      category: "E-commerce",
      locations: "Paris, Dublin, Berlin",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiEbay",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "etsy",
      name: "Etsy",
      sector: "Artisanat en ligne",
      category: "E-commerce",
      locations: "Paris, Dublin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiEtsy",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "wayfair",
      name: "Wayfair",
      sector: "Mobilier en ligne",
      category: "E-commerce",
      locations: "Paris, Londres, Berlin",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "FaBuilding",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "wish",
      name: "Wish",
      sector: "E-commerce mobile",
      category: "E-commerce",
      locations: "Paris, Dublin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiWish",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },

    // MÉDIA (8+ entreprises)
    {
      id: "netflix",
      name: "Netflix",
      sector: "Streaming / Média",
      category: "Média",
      locations: "Paris, Amsterdam, Madrid",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiNetflix",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "spotify",
      name: "Spotify",
      sector: "Musique / Streaming",
      category: "Média",
      locations: "Paris, Stockholm, Londres",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiSpotify",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "disney",
      name: "Disney",
      sector: "Divertissement / Média",
      category: "Média",
      locations: "Paris, Londres, Amsterdam",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaBuilding",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "youtube",
      name: "YouTube",
      sector: "Plateforme vidéo",
      category: "Média",
      locations: "Paris, Dublin, Zurich",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiYoutube",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "twitch",
      name: "Twitch",
      sector: "Streaming gaming",
      category: "Média",
      locations: "Paris, Dublin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiTwitch",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "tiktok",
      name: "TikTok",
      sector: "Réseaux sociaux / Vidéo",
      category: "Média",
      locations: "Paris, Londres, Dublin",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiTiktok",
      logoColor: "text-black",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "pinterest",
      name: "Pinterest",
      sector: "Réseaux sociaux visuels",
      category: "Média",
      locations: "Paris, Dublin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiPinterest",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "snapchat",
      name: "Snapchat",
      sector: "Réseaux sociaux / AR",
      category: "Média",
      locations: "Paris, Londres, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiSnapchat",
      logoColor: "text-yellow-500",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },

    // ÉNERGIE (8+ entreprises)
    {
      id: "tesla",
      name: "Tesla",
      sector: "Automobile / Énergie",
      category: "Énergie",
      locations: "Paris, Berlin, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "SiTesla",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "total",
      name: "TotalEnergies",
      sector: "Pétrole / Énergie",
      category: "Énergie",
      locations: "Paris, Londres, Anvers",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaOilCan",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "edf",
      name: "EDF",
      sector: "Électricité / Nucléaire",
      category: "Énergie",
      locations: "Paris, Londres, Bruxelles",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaBolt",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "engie",
      name: "Engie",
      sector: "Gaz / Énergies renouvelables",
      category: "Énergie",
      locations: "Paris, Bruxelles, Amsterdam",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaBolt",
      logoColor: "text-cyan-600",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "shell",
      name: "Shell",
      sector: "Pétrole / Gaz",
      category: "Énergie",
      locations: "Paris, Londres, La Haye",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "SiShell",
      logoColor: "text-yellow-500",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "bp",
      name: "BP",
      sector: "Pétrole / Énergie",
      category: "Énergie",
      locations: "Paris, Londres, Amsterdam",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaOilCan",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "rwe",
      name: "RWE",
      sector: "Électricité / Énergies renouvelables",
      category: "Énergie",
      locations: "Paris, Essen, Amsterdam",
      employees: "Entre 1000 et 5000 salariés",
      offers: 0,
      logo: "FaBolt",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "enel",
      name: "Enel",
      sector: "Électricité / Énergies vertes",
      category: "Énergie",
      locations: "Paris, Rome, Madrid",
      employees: "> 20000 salariés",
      offers: 0,
      logo: "FaBolt",
      logoColor: "text-cyan-500",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Filtres améliorés avec des noms plus cohérents
  const filters = [
    { id: "Toutes", label: "Toutes" },
    { id: "Tech", label: "Tech" },
    { id: "E-commerce", label: "E-commerce" },
    { id: "Média", label: "Média" },
    { id: "Énergie", label: "Énergie" }
  ];

  // Filtrer les entreprises selon le filtre actif
  const filteredCompanies = activeFilter === "Toutes" 
    ? companies 
    : companies.filter(company => company.category === activeFilter);

  // Hook de pagination
  const {
    currentPage,
    totalPages,
    currentItems,
    goToNext,
    goToPrevious
  } = useCompanyPagination({ companies: filteredCompanies });

  // Fonction pour obtenir le composant logo
  const getLogoComponent = (logoName: string, colorClass: string) => {
    const logoProps = { className: `w-6 h-6 ${colorClass}` };
    
    switch (logoName) {
      // Tech
      case "SiGoogle": return <SiGoogle {...logoProps} />;
      case "FaMicrosoft": return <FaMicrosoft {...logoProps} />;
      case "SiApple": return <SiApple {...logoProps} />;
      case "SiMeta": return <SiMeta {...logoProps} />;
      case "SiSap": return <SiSap {...logoProps} />;
      case "SiOracle": return <SiOracle {...logoProps} />;
      case "SiSalesforce": return <SiSalesforce {...logoProps} />;
      case "SiAdobe": return <SiAdobe {...logoProps} />;
      case "SiAtlassian": return <SiAtlassian {...logoProps} />;
      
      // E-commerce
      case "SiAmazon": return <SiAmazon {...logoProps} />;
      case "SiZalando": return <SiZalando {...logoProps} />;
      case "FaBuilding": return <FaBuilding {...logoProps} />; // Alibaba, Wayfair
      case "SiShopify": return <SiShopify {...logoProps} />;
      case "SiEbay": return <SiEbay {...logoProps} />;
      case "SiEtsy": return <SiEtsy {...logoProps} />;
      case "SiWish": return <SiWish {...logoProps} />;
      
      // Média
      case "SiNetflix": return <SiNetflix {...logoProps} />;
      case "SiSpotify": return <SiSpotify {...logoProps} />;
      case "SiYoutube": return <SiYoutube {...logoProps} />;
      case "SiTwitch": return <SiTwitch {...logoProps} />;
      case "SiTiktok": return <SiTiktok {...logoProps} />;
      case "SiPinterest": return <SiPinterest {...logoProps} />;
      case "SiSnapchat": return <SiSnapchat {...logoProps} />;
      
      // Énergie
      case "SiTesla": return <SiTesla {...logoProps} />;
      case "FaOilCan": return <FaOilCan {...logoProps} />; // Total, BP
      case "FaBolt": return <FaBolt {...logoProps} />; // EDF, Engie, RWE, Enel
      case "SiShell": return <SiShell {...logoProps} />;
      
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-4 pb-12 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20 lg:pt-12 lg:pb-24 bg-gradient-to-br from-background via-muted/30 to-primary/10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/2 via-transparent to-slate-500/2 -z-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/5 to-slate-400/5 rounded-full blur-3xl -z-10"></div>
        
        <Container>
          <div className="text-center max-w-5xl mx-auto w-full">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 bg-cyan-600 rounded-full mr-2 animate-pulse"></span>
              Nouvelle plateforme de recrutement
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-normal tracking-tight"
            >
              <span className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-teal-800 dark:from-cyan-500 dark:via-cyan-600 dark:to-teal-600 bg-clip-text text-transparent animate-pulse hover:animate-none transition-all duration-500 hover:from-cyan-700 hover:to-teal-800 dark:hover:from-cyan-600 dark:hover:to-teal-700 transform hover:scale-105 inline-block">
                Trouvez le poste qui vous ressemble
              </span>
            </motion.h1>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-muted-foreground mb-4 sm:mb-6 leading-relaxed"
            >
              Rencontrez les entreprises qui vous inspirent
            </motion.h2>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed font-light"
            >
              LinkUp connecte postulants et entreprises avec des profils riches, des offres de qualité et une messagerie fluide - pour une expérience claire, accueillante et efficace.
            </motion.p>

            {/* Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <Button 
                size="lg" 
                onClick={() => router.push('/jobs')}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <Rocket className="mr-2 sm:mr-3 h-5 w-5" />
                Explorer les offres
              </Button>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="bg-background/98 backdrop-blur-sm border border-border/40 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-5xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                <AutocompleteInput
                  type="title"
                  placeholder="Métier, intitulé de poste, mots-clés"
                  value={searchTerm}
                  onChange={setSearchTerm}
                  icon={<Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
                />
                <AutocompleteInput
                  type="location"
                  placeholder="Localisation (ville, région, remote)"
                  value={location}
                  onChange={setLocation}
                  icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
                />
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white h-12 sm:h-14 px-6 sm:px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Rechercher
              </Button>
            </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* Explorez les entreprises Section */}
      <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-small-foreground/[0.02] [mask-image:linear-gradient(to_b,white,transparent)]"></div>
        
        <Container className="relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></span>
              Entreprises partenaires
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-600 via-cyan-700 to-teal-800 dark:from-cyan-500 dark:via-cyan-600 dark:to-teal-600 bg-clip-text text-transparent mb-8 leading-normal tracking-tight">
              Explorez les entreprises
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Découvrez leur histoire, rencontrez leurs équipes, comprenez leur culture d'entreprise unique.
            </p>
          </div>
          
          {/* Navigation Tabs - Redesign */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                 className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-full cursor-pointer ${
                  activeFilter === filter.id
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/25 transform scale-105"
                    : "bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Company Cards Grid with Navigation */}
          <div className="relative max-w-7xl mx-auto mb-16">
            {/* Navigation Controls */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={goToPrevious}
              onNext={goToNext}
              className="mb-8"
            />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentItems.map((company, index) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  index={index}
                  onFollow={(companyId) => console.log('Follow company:', companyId)}
                  onViewOffers={(companyId) => console.log('View offers:', companyId)}
                />
              ))}
          </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Link href="/entreprises" className="cursor-pointer">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-cyan-600/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Explorer toutes les entreprises
              </Button>
                </Link>
          </div>
          
          {/* Footer Logos avec vrais logos SVG */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-lg">
                Vous <span className="font-bold underline">recrutez</span> ? Découvrez nos offres entreprise.
              </p>
            </div>
            {/* Container avec overflow pour l'animation de défilement */}
            <div className="relative overflow-hidden">
              <div className="flex items-center gap-16 animate-scroll whitespace-nowrap" style={{ width: '200%' }}>
                  {/* Atos */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/atos-origin-2011-logo.svg" alt="Atos" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* BNP Paribas */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/bnp-paribas-1.svg" alt="BNP Paribas" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Burger King */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/burger-king-4.svg" alt="Burger King" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* NVIDIA */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/nvidia.svg" alt="NVIDIA" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* PayPal */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/paypal-3.svg" alt="PayPal" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Spotify */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/spotify-2.svg" alt="Spotify" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Thales */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/thales-3.svg" alt="Thales" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Versace */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/versace.svg" alt="Versace" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Vinci */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/vinci-unternehmen-logo.svg" alt="Vinci" className="h-12 w-auto object-contain" />
                </div>
                
                {/* Duplication pour l'effet de boucle continue */}
                  {/* Atos */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/atos-origin-2011-logo.svg" alt="Atos" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* BNP Paribas */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/bnp-paribas-1.svg" alt="BNP Paribas" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Burger King */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/burger-king-4.svg" alt="Burger King" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* NVIDIA */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/nvidia.svg" alt="NVIDIA" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* PayPal */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/paypal-3.svg" alt="PayPal" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Spotify */}
                  <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/spotify-2.svg" alt="Spotify" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Thales */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/thales-3.svg" alt="Thales" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Versace */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/versace.svg" alt="Versace" className="h-12 w-auto object-contain" />
                  </div>
                  
                  {/* Vinci */}
                <div className="flex items-center justify-center w-40 h-16 flex-shrink-0">
                    <img src="/assets/vinci-unternehmen-logo.svg" alt="Vinci" className="h-12 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
          
        </Container>
      </section>

      {/* Section "Entrez dans les coulisses" */}
      <section className="py-16 bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenu visuel moderne et élégant */}
            <div className="relative">
              {/* Background décoratif */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-3xl"></div>
              
              {/* Interface moderne de recherche d'emploi */}
              <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-border/20">
                {/* Header avec stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-muted-foreground">Recherche active</span>
              </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">2,847</div>
                    <div className="text-xs text-muted-foreground">offres trouvées</div>
                  </div>
                </div>

                {/* Barre de recherche moderne */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 rounded-2xl blur-sm"></div>
                    <div className="relative bg-background rounded-2xl p-4 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Search className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Recherche intelligente</div>
                          <div className="text-foreground font-medium">Développeur React • Paris • Remote</div>
                        </div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filtres actifs */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-foreground mb-3">Filtres appliqués</div>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <span>React</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <span>Remote</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <span>60k+ €</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Résultats de recherche */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Google</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Développeur React Senior</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">85k€</div>
                        <div className="text-xs text-muted-foreground">Paris</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span className="text-xs text-slate-600 dark:text-slate-300">Publié il y a 2h</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Meta</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Frontend Engineer</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">90k€</div>
                        <div className="text-xs text-muted-foreground">Remote</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-slate-600 dark:text-slate-300">Publié il y a 5h</span>
                    </div>
                  </div>
                </div>

                {/* Indicateur de plus de résultats */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                    <span>+ 2,845 autres offres</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu texte */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Entrez dans les coulisses
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Arrêtez de scroller sans fin sur des offres impersonnelles. Consultez seulement celles qui répondent à vos besoins grâce à nos filtres. Entrez dans les coulisses des entreprises, découvrez leurs valeurs et rencontrez votre future équipe.
                </p>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Trouver un job
              </Button>
            </div>
          </div>
        </Container>
      </section>



      {/* Section "Gagnez en efficacité" */}
      <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenu texte */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Gagnez en efficacité
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Laisser votre job préféré vous passer sous le nez ? Plus jamais ! Dans votre espace personnel, gérez votre recherche et centralisez toutes vos candidatures. Grâce à nos alertes personnalisées, soyez le premier ou la première à postuler.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  Suivre mes candidatures
              </Button>
                <Button size="lg" variant="outline" className="border-border text-muted-foreground font-semibold py-4 px-8 rounded-full cursor-pointer">
                  En savoir plus
                      </Button>
                    </div>
                  </div>
            
            {/* Contenu visuel */}
            <div className="space-y-6">
              {/* Card "Gérer vos candidatures" */}
              <div className="bg-background rounded-2xl shadow-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Gérer vos candidatures</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Chef de projets</h4>
                      <p className="text-sm text-muted-foreground">TechCorp • Paris</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">En cours</span>
                    </div>
                  </div>
                </div>
          </div>
          
              {/* Card "Alertes" */}
              <div className="bg-background rounded-2xl shadow-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Alertes</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-primary/10 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm text-foreground">Chef de projets x3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section Média et Ressources */}
      <section className="py-24 bg-background">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Repensez le monde du travail grâce à nos <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">articles</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Articles et conseils : découvrez tous nos contenus pour vous épanouir au quotidien.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="group relative bg-background rounded-3xl shadow-lg overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Header avec vraie image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&h=400&fit=crop&crop=center" 
                  alt="Entretien vidéo professionnel" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
              </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">Article</span>
                    <span className="text-white/80 text-sm">5 min</span>
                  </div>
                </div>
            </div>
            
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  10 conseils pour réussir votre entretien vidéo
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Découvrez les meilleures pratiques pour briller lors de vos entretiens à distance et impressionner vos recruteurs.
                </p>
                
                {/* Auteur */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">M</span>
              </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Marie Dubois</div>
                    <div className="text-xs text-muted-foreground">Career Coach</div>
                  </div>
            </div>
            
                <a 
                  href="/articles/entretien-video-conseils" 
                    className="block w-full cursor-pointer"
                >
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    Lire l'article
                  </Button>
                </a>
              </div>
            </motion.div>

             {/* Article Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="group relative bg-background rounded-3xl shadow-lg overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
               {/* Header avec vraie image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                   src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&h=400&fit=crop&crop=center" 
                  alt="Négociation salaire professionnel" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
            </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">Article</span>
                     <span className="text-white/80 text-sm">6 min</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  Comment négocier son salaire en 2025
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Les stratégies gagnantes pour obtenir la rémunération que vous méritez et faire valoir votre expertise.
                </p>
                
                {/* Auteur */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Agathe Collinet</div>
                    <div className="text-xs text-muted-foreground">Consultante RH</div>
                  </div>
                </div>
            
                  <a href="/articles/negociation-salaire-2025" className="block w-full cursor-pointer">
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      Lire l'article
                  </Button>
                </a>
              </div>
            </motion.div>

             {/* Article Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="group relative bg-background rounded-3xl shadow-lg overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
               {/* Header avec vraie image */}
               <div className="relative h-40 overflow-hidden">
                 <img 
                   src="/assets/graphiste_testimonials.jpg" 
                   alt="CTO professionnelle" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">Article</span>
                     <span className="text-white/80 text-sm">7 min</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                   Témoignage : De photographe freelance à directeur créatif
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                   Alexandre nous raconte comment LinkUp l'a aidé à transformer sa carrière de photographe freelance en poste de direction créative.
                </p>
                
                {/* Auteur */}
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div>
                     <div className="text-sm font-medium text-foreground">Alexandre Chen</div>
                     <div className="text-xs text-muted-foreground">Directeur Créatif</div>
                  </div>
                </div>

                <a href="/articles/photographe-directeur-creatif" className="block w-full cursor-pointer">
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  Lire le témoignage
                </Button>
                </a>
            </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Section Témoignages Ultra-Moderne */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/3 via-transparent to-slate-500/3"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-slate-400/5 rounded-full blur-3xl"></div>
        <Container>
          {/* Header Ultra-Élégant */}
          <div className="text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-sm border border-primary/50 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Témoignages clients</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight"
            >
              Ils nous font{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                confiance
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Plus de <span className="font-semibold text-primary">50 000 professionnels</span> nous font confiance pour leur recherche d'emploi et leur recrutement
            </motion.p>
          </div>
          
          
          {/* Témoignages Ultra-Élégants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "En une semaine j'ai trouvé trois entretiens pertinents. La plateforme est vraiment efficace pour les développeurs comme moi.",
                author: "Yanis M.",
                role: "Développeur Front-end",
                icon: Code,
                color: "from-cyan-600 to-cyan-700",
                delay: 0.1
              },
              {
                quote: "La messagerie intégrée simplifie toute la collaboration avec les postulants. Un gain de temps énorme !",
                author: "Clara M.",
                role: "Talent Partner",
                icon: MessageSquare,
                color: "from-cyan-600 to-cyan-700",
                delay: 0.2
              },
              {
                quote: "Une expérience aussi soignée que Welcome to the Jungle. L'interface est intuitive et moderne pour tous les utilisateurs.",
                author: "Louis D.",
                role: "Product Designer",
                icon: Palette,
                color: "from-cyan-600 to-cyan-700",
                delay: 0.3
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={testimonial.author}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + testimonial.delay, ease: "easeOut" }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-muted/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-background/90 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-br from-muted to-muted/80 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V8a1 1 0 112 0v2.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg 
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + testimonial.delay + i * 0.1 }}
                        className="w-5 h-5 text-primary" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-muted-foreground mb-8 text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <testimonial.icon className="w-7 h-7" />
                    </div>
                  <div>
                      <div className="font-bold text-foreground text-lg">{testimonial.author}</div>
                      <div className="text-muted-foreground font-medium">{testimonial.role}</div>
                  </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section CTA Finale */}
      <section className="py-24 bg-gradient-to-br from-cyan-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <Container className="relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à accélérer votre carrière ?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui ont trouvé leur job idéal sur LinkUp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="cursor-pointer">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  Créer mon profil gratuitement
                </Button>
              </Link>
              <Link href="/register-company" className="cursor-pointer">
                <Button size="lg" variant="outline" className="border-white text-white dark:text-white hover:bg-white hover:text-cyan-700 font-semibold py-4 px-8 rounded-full bg-white/10 backdrop-blur-sm cursor-pointer">
                  Poster une offre
                </Button>
              </Link>
            </div>
        </div>
        </Container>
      </section>
    </div>
  );
}

// Composant principal qui choisit quelle page afficher
export default function LinkUpHomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Si l'utilisateur est authentifié, rediriger vers le dashboard approprié
  useEffect(() => {
    console.log('🔵 [HOME PAGE] useEffect déclenché:', { isLoading, isAuthenticated, hasUser: !!user, userEmail: user && ('email' in user ? user.email : user.recruiter_mail) });
    
    if (!isLoading && isAuthenticated && user) {
      const userRole = 'role' in user ? user.role : null;
      let redirectPath = '/dashboard';
      
      if (userRole === 'admin') {
        redirectPath = '/admin-dashboard';
      } else if ('id_company' in user || 'recruiter_mail' in user || userRole === 'company') {
        redirectPath = '/company-dashboard';
      }
      
      console.log('🔵 [HOME PAGE] Redirection vers:', redirectPath);
      router.push(redirectPath);
    } else {
      console.log('🔵 [HOME PAGE] Pas de redirection - affichage page marketing');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Afficher la page marketing
  return <MarketingHomePage />;
}
