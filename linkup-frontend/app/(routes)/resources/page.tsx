/**
 * Page Ressources - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'affichage des ressources
 * - Open/Closed : Extensible via props et composition
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { ResourceCard } from "@/components/resources/resource-card";
import { useAuth } from "@/contexts/AuthContext";
import logger from "@/lib/logger";
import { 
  Search,
  Filter,
  BookOpen,
  FileText,
  Star,
  Eye,
  User,
  Heart,
  ChevronDown,
  SortAsc,
  SortDesc,
  X,
  ArrowRight,
  ArrowLeft,
  Clock,
  ExternalLink
} from "lucide-react";

function ResourcesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favoriteResources, setFavoriteResources] = useState<number[]>([]);
  const [viewedResources, setViewedResources] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resourcesPerPage] = useState(9);
  const [previewResource, setPreviewResource] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Utiliser l'ID utilisateur pour créer des clés localStorage uniques
  const userId = user && 'id_user' in user ? user.id_user : 'anonymous';
  const favoritesKey = `favoriteResources_${userId}`;
  const viewedKey = `viewedResources_${userId}`;

  // Debounce pour la recherche (300ms de délai)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Charger les données depuis localStorage (associées à l'utilisateur)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem(favoritesKey);
        const savedViewed = localStorage.getItem(viewedKey);
        
        if (savedFavorites) {
          try {
            setFavoriteResources(JSON.parse(savedFavorites));
          } catch (e) {
            logger.error('Erreur parsing favoris:', e);
          }
        }
        if (savedViewed) {
          try {
            setViewedResources(JSON.parse(savedViewed));
          } catch (e) {
            logger.error('Erreur parsing vues:', e);
          }
        }
      } catch (error) {
        logger.error('Erreur lors du chargement des données:', error);
      }
    }
  }, [favoritesKey, viewedKey]);

  // Données des ressources (sans données mockées)
  const resources = [
    {
      id: 1,
      title: "Préparer entretien",
      type: "Guide",
      category: "Entretiens",
      description: "Techniques et conseils pour réussir vos entretiens avec des exemples",
      author: "Thomas Martin",
      publishedDate: "2024-01-12",
      format: "Article",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-100",
      tags: ["Entretien", "Préparation", "Conseils"],
      slug: "preparer-entretien"
    },
    {
      id: 2,
      title: "Networking efficace",
      type: "Article",
      category: "Réseau professionnel",
      description: "Comment développer votre réseau professionnel et créer des opportunités",
      author: "Sophie Leroy",
      publishedDate: "2024-01-10",
      format: "Article",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
      tags: ["Networking", "Réseau", "Opportunités"],
      slug: "networking-efficace"
    },
    {
      id: 3,
      title: "Négocier son salaire",
      type: "Guide",
      category: "Négociation",
      description: "Stratégies pour négocier efficacement votre rémunération et vos avantages",
      author: "Alexandre Petit",
      publishedDate: "2024-01-08",
      format: "Article",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      tags: ["Négociation", "Salaire", "Avantages"],
      slug: "negocier-salaire"
    },
    {
      id: 4,
      title: "Évolution de carrière",
      type: "Article",
      category: "Carrière",
      description: "Planifier et réussir votre évolution professionnelle avec des étapes concrètes",
      author: "Jean Dupont",
      publishedDate: "2024-01-03",
      format: "Article",
      icon: BookOpen,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      tags: ["Carrière", "Évolution", "Planification"],
      slug: "evolution-carriere"
    },
    {
      id: 5,
      title: "Guide CV parfait",
      type: "Guide",
      category: "CV & Lettre de motivation",
      description: "Créez un CV qui attire l'attention des recruteurs et maximise vos chances",
      author: "Marie Dubois",
      publishedDate: "2024-01-15",
      format: "Article",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      tags: ["CV", "Recrutement", "Conseils"],
      slug: "guide-cv-parfait"
    },
    {
      id: 6,
      title: "Optimiser profil",
      type: "Guide",
      category: "Réseau professionnel",
      description: "Créez un profil professionnel attractif qui attire les recruteurs",
      author: "Sarah Johnson",
      publishedDate: "2024-01-20",
      format: "Article",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      tags: ["Profil", "Optimisation", "Visibilité"],
      slug: "optimiser-profil"
    }
  ];

  const filters = [
    { id: "all", label: "Toutes les ressources" },
    { id: "guide", label: "Guides" },
    { id: "article", label: "Articles" }
  ];

  const categories = [
    { id: "all", label: "Toutes les catégories" },
    { id: "CV & Lettre de motivation", label: "CV & Lettre de motivation" },
    { id: "Entretiens", label: "Entretiens" },
    { id: "Réseau professionnel", label: "Réseau professionnel" },
    { id: "Négociation", label: "Négociation" },
    { id: "Télétravail", label: "Télétravail" },
    { id: "Carrière", label: "Carrière" },
    { id: "Bien-être", label: "Bien-être" },
    { id: "Management", label: "Management" },
    { id: "Entrepreneuriat", label: "Entrepreneuriat" }
  ];

  const sortOptions = [
    { id: "popularity", label: "Popularité" },
    { id: "rating", label: "Note" },
    { id: "date", label: "Date de publication" },
    { id: "title", label: "Titre" }
  ];


  // Fonctions de gestion des interactions optimisées avec useCallback
  const toggleFavorite = useCallback((resourceId: number) => {
    const wasFavorite = favoriteResources.includes(resourceId);
    const newFavorites = wasFavorite
      ? favoriteResources.filter(id => id !== resourceId)
      : [...favoriteResources, resourceId];
    
    setFavoriteResources(newFavorites);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
    }
    
    toast({
      title: wasFavorite ? "Favori supprimé" : "Ajouté aux favoris",
      description: `Ressource ${wasFavorite ? "retirée de" : "ajoutée à"} vos favoris`,
      variant: "default"
    });
  }, [favoriteResources, toast, favoritesKey]);


  const markAsViewed = useCallback((resourceId: number) => {
    if (!viewedResources.includes(resourceId)) {
      const newViewed = [...viewedResources, resourceId];
      setViewedResources(newViewed);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(viewedKey, JSON.stringify(newViewed));
      }
    }
  }, [viewedResources, viewedKey]);



  const viewResource = useCallback((resource: any) => {
    markAsViewed(resource.id);
    
    // Rediriger vers la page de contenu de la ressource
    window.location.href = `/resources/${resource.slug}`;
  }, [markAsViewed]);

  const handlePreviewResource = useCallback((resource: any) => {
    setPreviewResource(resource);
    setShowPreview(true);
    markAsViewed(resource.id);
    
    toast({
      title: "Aperçu de la ressource",
      description: `Affichage de l'aperçu de "${resource.title}"`,
      variant: "default"
    });
  }, [markAsViewed, toast]);

  // Filtrage optimisé avec useMemo et debouncedSearchTerm
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           resource.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           resource.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           resource.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      
      const matchesFilter = selectedFilter === "all" || 
                           resource.type.toLowerCase() === selectedFilter.toLowerCase();
      
      const matchesCategory = selectedCategory === "all" || 
                             resource.category === selectedCategory;
      
      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [resources, debouncedSearchTerm, selectedFilter, selectedCategory]);

  // Tri optimisé avec useMemo
  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "popularity":
          // Tri par date (plus récent = plus populaire)
          comparison = new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
          break;
        case "rating":
          // Tri alphabétique par titre (fallback)
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          comparison = new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredResources, sortBy, sortOrder]);

  // Pagination optimisée avec useMemo
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(sortedResources.length / resourcesPerPage);
    const startIndex = (currentPage - 1) * resourcesPerPage;
    const endIndex = startIndex + resourcesPerPage;
    const paginatedResources = sortedResources.slice(startIndex, endIndex);
    
    return { totalPages, paginatedResources };
  }, [sortedResources, currentPage, resourcesPerPage]);

  const { totalPages, paginatedResources } = paginationData;

  // Fonctions de pagination optimisées
  const goToPreviousPage = useCallback(() => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    toast({
      title: "Page précédente",
      description: `Page ${newPage} sur ${totalPages}`,
      variant: "default"
    });
  }, [currentPage, totalPages, toast]);

  const goToNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(newPage);
    toast({
      title: "Page suivante",
      description: `Page ${newPage} sur ${totalPages}`,
      variant: "default"
    });
  }, [currentPage, totalPages, toast]);

  const goToPage = useCallback((pageNum: number) => {
    setCurrentPage(pageNum);
    toast({
      title: "Changement de page",
      description: `Page ${pageNum} sur ${totalPages}`,
      variant: "default"
    });
  }, [totalPages, toast]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "guide":
        return FileText;
      case "article":
        return BookOpen;
      default:
        return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12">
        <Container>
          <div className="text-center mb-8">
            <Typography variant="h1" className="mb-4">
              Ressources
            </Typography>
            <Typography variant="lead" className="text-muted-foreground max-w-2xl mx-auto">
              Guides, conseils et outils pour votre carrière. Développez vos compétences et accélérez votre progression professionnelle.
            </Typography>
          </div>

        </Container>
      </section>

      <Container className="py-8">

        {/* Filtres et recherche */}
        <Card className="backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Ligne principale */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Recherche */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par titre, auteur, catégorie ou tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Filtres principaux */}
                <div className="flex gap-4">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background"
                  >
                    {filters.map(filter => (
                      <option key={filter.id} value={filter.id}>{filter.label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.label}</option>
                    ))}
                  </select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Plus de filtres
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {/* Filtres avancés */}
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border pt-4"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Trier par
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-input rounded-md bg-background"
                        >
                          {sortOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ordre
                        </label>
                        <Button
                          variant="outline"
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                          className="flex items-center gap-2"
                        >
                          {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                          {sortOrder === "asc" ? "Croissant" : "Décroissant"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1"></div>
                    
                    <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilter("all");
                      setSelectedCategory("all");
                      setSortBy("popularity");
                      setSortOrder("desc");
                      setCurrentPage(1);
                      
                      toast({
                        title: "Filtres réinitialisés",
                        description: "Tous les filtres ont été effacés",
                        variant: "default"
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Effacer les filtres
                  </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Résultats et pagination info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {sortedResources.length} ressource{sortedResources.length > 1 ? 's' : ''} disponible{sortedResources.length > 1 ? 's' : ''}
            {totalPages > 1 && (
              <span className="ml-2">
                (Page {currentPage} sur {totalPages})
              </span>
            )}
          </div>
          
          {favoriteResources.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              {favoriteResources.length} favori{favoriteResources.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Liste des ressources */}
        {paginatedResources.length === 0 && sortedResources.length === 0 ? (
          <Card className="backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <Typography variant="h3" className="mb-2">
                Aucune ressource trouvée
              </Typography>
              <Typography variant="muted" className="mb-6">
                Essayez de modifier vos critères de recherche ou vos filtres
              </Typography>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                  setSelectedCategory("all");
                  setSortBy("popularity");
                  setSortOrder("desc");
                  setCurrentPage(1);
                  
                  toast({
                    title: "Filtres réinitialisés",
                    description: "Tous les filtres ont été effacés",
                    variant: "default"
                  });
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Effacer tous les filtres
              </Button>
            </CardContent>
          </Card>
        ) : paginatedResources.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
                isFavorite={favoriteResources.includes(resource.id)}
                isViewed={viewedResources.includes(resource.id)}
                onToggleFavorite={toggleFavorite}
                onPreview={handlePreviewResource}
                onView={viewResource}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

      </Container>

      {/* Modal de prévisualisation */}
      {showPreview && previewResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-lg ${previewResource.bgColor} flex items-center justify-center`}>
                  <previewResource.icon className={`h-5 w-5 ${previewResource.color}`} />
                </div>
                <div>
                  <Typography variant="h3" className="text-lg font-semibold">
                    {previewResource.title}
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    {previewResource.category} • {previewResource.author}
                  </Typography>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <Typography variant="muted" className="text-sm">
                  {previewResource.description}
                </Typography>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Format:</span> {previewResource.format}
                  </div>
                  <div>
                    <span className="font-medium">Auteur:</span> {previewResource.author}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date(previewResource.publishedDate).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <span className="font-medium">Catégorie:</span> {previewResource.category}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewResource.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 border-t border-border">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Fermer
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setShowPreview(false);
                    viewResource(previewResource);
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir la ressource
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Section recommandations */}
      {favoriteResources.length > 0 && (
        <div className="bg-gradient-to-br from-muted/30 via-background to-primary/5 py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ressources recommandées
              </h2>
              <p className="text-lg text-muted-foreground">
                Basées sur vos favoris et votre activité
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources
                .filter(resource => !favoriteResources.includes(resource.id))
                .slice(0, 3)
                .map((resource, index) => {
                  const IconComponent = resource.icon;
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`h-10 w-10 rounded-lg ${resource.bgColor} flex items-center justify-center`}>
                              <IconComponent className={`h-5 w-5 ${resource.color}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm">
                                {resource.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {resource.category}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4">
                            {resource.description.substring(0, 100)}...
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(resource.publishedDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => toggleFavorite(resource.id)}
                              className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              Ajouter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <ProtectedRoute>
      <ResourcesContent />
    </ProtectedRoute>
  );
}
