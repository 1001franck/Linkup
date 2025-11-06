/**
 * Composant Skeleton pour les cartes d'emploi
 * Améliore l'expérience utilisateur pendant le chargement
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const JobSkeleton = () => {
  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-lg bg-muted animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-14 bg-muted animate-pulse rounded"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const JobSkeletonList = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <JobSkeleton key={index} />
      ))}
    </div>
  );
};
