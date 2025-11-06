import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const CompanySkeleton = () => {
  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-muted animate-pulse rounded w-32"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-12"></div>
            <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-28"></div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
        </div>
        
        <div className="mb-4">
          <div className="h-4 bg-muted animate-pulse rounded w-20 mb-2"></div>
          <div className="flex flex-wrap gap-1">
            <div className="h-5 bg-muted animate-pulse rounded w-16"></div>
            <div className="h-5 bg-muted animate-pulse rounded w-20"></div>
            <div className="h-5 bg-muted animate-pulse rounded w-14"></div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
            
            <div className="flex gap-2">
              <div className="h-9 bg-muted animate-pulse rounded flex-1"></div>
              <div className="h-9 bg-muted animate-pulse rounded w-12"></div>
            </div>
            
            <div className="flex gap-2">
              <div className="h-9 bg-muted animate-pulse rounded flex-1"></div>
              <div className="h-9 bg-muted animate-pulse rounded w-12"></div>
              <div className="h-9 bg-muted animate-pulse rounded w-12"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CompanySkeletonList = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CompanySkeleton key={index} />
      ))}
    </div>
  );
};
