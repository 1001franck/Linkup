/**
 * Analytics - Admin Dashboard
 * Statistiques avancées et tableaux de bord
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAdminStats, useAdminActivity } from "@/hooks/use-admin";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  Activity,
  Calendar,
  DollarSign,
  Target,
  Zap,
  RefreshCw
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  
  // Hooks admin
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { activity, isLoading: activityLoading, error: activityError, refetch: refetchActivity } = useAdminActivity();
  
  // Typage des stats pour éviter les erreurs TypeScript
  const statsTyped = stats as any;

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchStats(), refetchActivity()]);
      toast({
        title: "Actualisé",
        description: "Les données ont été mises à jour",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données",
        variant: "destructive",
      });
    }
  };

  const isLoading = statsLoading || activityLoading;
  const error = statsError || activityError;

  return (
    <div className="py-8">
      {/* Header de la page */}
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <Typography variant="h1" className="font-bold text-gray-900">
                  Analytics Avancées
                </Typography>
                <Typography variant="muted">
                  Statistiques détaillées et insights de la plateforme
                </Typography>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </Container>

      <Container>
        {/* Métriques clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="muted" className="text-sm font-medium">
                      Utilisateurs Actifs
                    </Typography>
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                    ) : (
                      <>
                        <Typography variant="h3" className="text-2xl font-bold text-foreground">
                          {statsTyped?.users?.totalUsers || statsTyped?.totalUsers || 0}
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          Total inscrits
                        </Typography>
                      </>
                    )}
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="muted" className="text-sm font-medium">
                      Entreprises
                    </Typography>
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                    ) : (
                      <>
                        <Typography variant="h3" className="text-2xl font-bold text-foreground">
                          {statsTyped?.companies?.totalCompanies || statsTyped?.totalCompanies || 0}
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          Entreprises actives
                        </Typography>
                      </>
                    )}
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="muted" className="text-sm font-medium">
                      Offres d'emploi
                    </Typography>
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                    ) : (
                      <>
                        <Typography variant="h3" className="text-2xl font-bold text-foreground">
                          {statsTyped?.jobs?.totalJobs || statsTyped?.totalJobs || 0}
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          Offres publiées
                        </Typography>
                      </>
                    )}
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="muted" className="text-sm font-medium">
                      Candidatures
                    </Typography>
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                    ) : (
                      <>
                        <Typography variant="h3" className="text-2xl font-bold text-foreground">
                          {statsTyped?.applications?.totalApplications || statsTyped?.totalApplications || 0}
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          Candidatures reçues
                        </Typography>
                      </>
                    )}
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Croissance (24h)
                </CardTitle>
                <CardDescription>
                  Nouveaux utilisateurs et activités récentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <Typography variant="sm" className="font-medium">
                          Nouveaux utilisateurs
                        </Typography>
                        <Typography variant="xs" className="text-muted-foreground">
                          Dernières 24h
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="h4" className="font-bold text-green-600">
                      {statsTyped?.recentActivity?.newUsers || statsTyped?.newUsers24h || 0}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <Typography variant="sm" className="font-medium">
                          Nouvelles entreprises
                        </Typography>
                        <Typography variant="xs" className="text-muted-foreground">
                          Dernières 24h
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="h4" className="font-bold text-blue-600">
                      {statsTyped?.recentActivity?.newCompanies || statsTyped?.newCompanies24h || 0}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      <div>
                        <Typography variant="sm" className="font-medium">
                          Nouvelles offres
                        </Typography>
                        <Typography variant="xs" className="text-muted-foreground">
                          Dernières 24h
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="h4" className="font-bold text-purple-600">
                      {statsTyped?.recentActivity?.newJobs || statsTyped?.newJobs24h || 0}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <div>
                        <Typography variant="sm" className="font-medium">
                          Nouvelles candidatures
                        </Typography>
                        <Typography variant="xs" className="text-muted-foreground">
                          Dernières 24h
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="h4" className="font-bold text-orange-600">
                      {statsTyped?.recentActivity?.newApplications || statsTyped?.newApplications24h || 0}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Activité Récente
                </CardTitle>
                <CardDescription>
                  Dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-pulse">
                        <div className="h-8 w-8 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activity.length > 0 ? (
                  <div className="space-y-3">
                    {activity.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <Typography variant="sm" className="font-medium">
                            {item.description || 'Activité récente'}
                          </Typography>
                          <Typography variant="xs" className="text-muted-foreground">
                            {item.timestamp || 'Récemment'}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <Typography variant="muted">
                      Aucune activité récente
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Métriques de performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Métriques de Performance
              </CardTitle>
              <CardDescription>
                Indicateurs clés de performance de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <Typography variant="h4" className="font-bold text-2xl text-green-600 mb-2">
                    {statsTyped?.applications?.totalApplications && statsTyped?.users?.totalUsers 
                      ? Math.round((statsTyped.applications.totalApplications / statsTyped.users.totalUsers) * 100) 
                      : (statsTyped?.totalApplications && statsTyped?.totalUsers
                        ? Math.round((statsTyped.totalApplications / statsTyped.totalUsers) * 100)
                        : 0)}%
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    Taux de candidature moyen
                  </Typography>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <Typography variant="h4" className="font-bold text-2xl text-blue-600 mb-2">
                    {statsTyped?.jobs?.totalJobs && statsTyped?.companies?.totalCompanies 
                      ? Math.round(statsTyped.jobs.totalJobs / statsTyped.companies.totalCompanies) 
                      : (statsTyped?.totalJobs && statsTyped?.totalCompanies
                        ? Math.round(statsTyped.totalJobs / statsTyped.totalCompanies)
                        : 0)}
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    Offres par entreprise
                  </Typography>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <Typography variant="h4" className="font-bold text-2xl text-purple-600 mb-2">
                    {statsTyped?.users?.totalUsers && statsTyped?.companies?.totalCompanies 
                      ? Math.round(statsTyped.users.totalUsers / statsTyped.companies.totalCompanies)
                      : (statsTyped?.totalUsers && statsTyped?.totalCompanies
                        ? Math.round(statsTyped.totalUsers / statsTyped.totalCompanies)
                        : 0)}
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    Utilisateurs par entreprise
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
      
      <Toaster />
    </div>
  );
}
