/**
 * Composant ResourceCard optimisé
 * Utilise React.memo et useCallback pour éviter les re-renders inutiles
 */

import React, { memo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { LazyImage } from '@/components/ui/lazy-image';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { 
  Star, 
  Eye, 
  User, 
  Heart, 
  FileText, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  type: string;
  category: string;
  description: string;
  author: string;
  publishedDate: string;
  format: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  tags: string[];
  slug: string;
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
  isFavorite: boolean;
  isViewed: boolean;
  onToggleFavorite: (id: number) => void;
  onPreview: (resource: Resource) => void;
  onView: (resource: Resource) => void;
}

export const ResourceCard = memo<ResourceCardProps>(({
  resource,
  index,
  isFavorite,
  isViewed,
  onToggleFavorite,
  onPreview,
  onView,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });
  
  const IconComponent = resource.icon;

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(resource.id);
  }, [resource.id, onToggleFavorite]);

  const handlePreview = useCallback(() => {
    onPreview(resource);
  }, [resource, onPreview]);

  const handleView = useCallback(() => {
    onView(resource);
  }, [resource, onView]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${isViewed ? 'ring-2 ring-primary/20' : ''}`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`h-12 w-12 rounded-lg ${resource.bgColor} flex items-center justify-center`}>
                <IconComponent className={`h-6 w-6 ${resource.color}`} />
              </div>
              <div className="flex-1">
                <Typography variant="h4" className="font-semibold mb-1">
                  {resource.title}
                </Typography>
                <Typography variant="muted" className="text-sm">
                  {resource.category}
                </Typography>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <Typography variant="muted" className="text-sm mb-4 line-clamp-2">
            {resource.description}
          </Typography>
          
          {/* Métadonnées */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span>{resource.author}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {resource.format}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(resource.publishedDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreview}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleView}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleToggleFavorite}
                  className={isFavorite ? "text-destructive" : ""}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>
              
              {isViewed && (
                <Badge variant="secondary" className="text-xs">
                  Consulté
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ResourceCard.displayName = 'ResourceCard';
