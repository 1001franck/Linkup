import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  MapPin,
  Users,
  Calendar,
  Eye,
  MessageCircle,
  Share2,
  Briefcase,
  Building2,
} from 'lucide-react';
import { Company } from '@/types/company';

interface CompanyCardProps {
  company: Company;
  index: number;
  onContact: (company: Company) => void;
  onShare: (company: Company) => void;
  onViewOffers: (company: Company) => void;
}

export const CompanyCard = React.memo<CompanyCardProps>(({
  company,
  index,
  onContact,
  onShare,
  onViewOffers,
}) => {
  const [logoError, setLogoError] = useState(false);
  
  // Mémoriser les handlers pour éviter les re-renders
  const handleViewDetails = useCallback(() => {
    // Redirection vers la page de présentation de l'entreprise
    window.location.href = `/companies/${company.id}`;
  }, [company.id]);

  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Déterminer si le logo est une URL d'image valide
  const isImageUrl = company.logo && 
    (company.logo.startsWith('http://') || company.logo.startsWith('https://')) &&
    !logoError;

  const handleContact = useCallback(() => {
    // Vérifier l'authentification avant de contacter
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour contacter cette entreprise",
        variant: "default"
      });
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/companies';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    onContact(company);
  }, [company, onContact, isAuthenticated, authLoading, router, toast]);

  const handleShare = useCallback(() => {
    onShare(company);
  }, [company, onShare]);

  const handleViewOffers = useCallback(() => {
    onViewOffers(company);
  }, [company, onViewOffers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col min-h-[400px]">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header de la carte */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-muted/20 flex items-center justify-center overflow-hidden">
                {isImageUrl ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain p-1"
                    onError={() => {
                      // Fallback si l'image ne charge pas
                      setLogoError(true);
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {company.logo && !company.logo.startsWith('http') ? (
                      // Si c'est un nom d'icône (comme "SiGoogle"), on pourrait afficher une icône
                      // Mais pour l'instant, on affiche les initiales
                      <Typography variant="sm" className="font-bold text-primary">
                        {company.name.charAt(0).toUpperCase()}
                      </Typography>
                    ) : (
                      // Sinon, afficher les initiales ou une icône par défaut
                      <Building2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                )}
              </div>
              <div>
                <Typography variant="h4" className="font-semibold">
                  {company.name}
                </Typography>
                <Typography variant="muted" className="text-sm">
                  {company.industry}
                </Typography>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs">
                {company.jobsAvailable} offres
              </Badge>
            </div>
          </div>
          
          {/* Informations de base */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {company.location}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              {company.size}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Fondée en {company.founded}
            </div>
          </div>
          
          {/* Description */}
          <div className="flex-1 mb-4">
            <Typography variant="muted" className="text-sm line-clamp-3">
              {company.description}
            </Typography>
          </div>
          
          {/* Avantages */}
          {company.benefits.length > 0 && (
            <div className="mb-4">
              <Typography variant="muted" className="text-sm mb-2">Avantages</Typography>
              <div className="flex flex-wrap gap-1">
                {company.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                  <Badge key={benefitIndex} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
                {company.benefits.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{company.benefits.length - 2} autres
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="pt-4 border-t border-border mt-auto">
            <div className="space-y-3">
              
              {/* Actions principales */}
              <div className="flex gap-2">
                {company.jobsAvailable > 0 ? (
                  <Button 
                    onClick={handleViewOffers}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                    size="sm"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    {company.jobsAvailable > 1 ? 'Voir les offres' : 'Voir l\'offre'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleContact}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed"
                    size="sm"
                    disabled
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Aucune offre disponible
                  </Button>
                )}
              </div>
              
              {/* Actions secondaires */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleViewDetails}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Découvrir
                </Button>
                
                <Button 
                  onClick={handleContact}
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

CompanyCard.displayName = 'CompanyCard';
