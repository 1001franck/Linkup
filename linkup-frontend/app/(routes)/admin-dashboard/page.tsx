/**
 * Dashboard Admin - LinkUp
 * Interface d'administration complète
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du dashboard admin
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { useUserType } from "@/hooks/use-user-type";
import { useAdminStats, useAdminActivity } from "@/hooks/use-admin";
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Activity,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Zap
} from "lucide-react";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  
  // Hooks admin
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { activity: recentActivity, isLoading: activityLoading, error: activityError, refetch: refetchActivity } = useAdminActivity();

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
          <div>
            <Typography variant="h1" className="font-bold mb-2">
              Dashboard Administrateur
            </Typography>
            <Typography variant="muted">
              Vue d'ensemble de la plateforme LinkUp
            </Typography>
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
          {/* Statistiques Principales */}
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
                        Utilisateurs
                      </Typography>
                      {isLoading ? (
                        <div className="animate-pulse">
                          <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-24"></div>
                        </div>
                      ) : (
                        <>
                          <Typography variant="h3" className="text-2xl font-bold text-foreground">
                            {stats?.totalUsers || 0}
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
                            {stats?.totalCompanies || 0}
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
                            {stats?.totalJobs || 0}
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
                            {stats?.totalApplications || 0}
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

          {/* Actions Rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Actions Rapides
                  </CardTitle>
                  <CardDescription>
                    Gestion rapide des entités principales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/admin-dashboard/users">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Gérer les utilisateurs
                      </Button>
                    </Link>
                    <Link href="/admin-dashboard/companies">
                      <Button variant="outline" className="w-full justify-start">
                        <Building2 className="h-4 w-4 mr-2" />
                        Gérer les entreprises
                      </Button>
                    </Link>
                    <Link href="/admin-dashboard/jobs">
                      <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Gérer les offres
                      </Button>
                    </Link>
                    <Link href="/admin-dashboard/applications">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Voir les candidatures
                      </Button>
                    </Link>
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
                    <Activity className="h-5 w-5 text-green-600" />
                    Activité Récente
                  </CardTitle>
                  <CardDescription>
                    Dernières actions sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-pulse">
                          <div className="h-8 w-8 bg-muted rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <Typography variant="small" className="font-medium">
                              {activity.description || 'Activité récente'}
                            </Typography>
                            <Typography variant="muted" className="text-xs">
                              {activity.timestamp || 'Récemment'}
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

          {/* Statistiques Avancées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Statistiques Avancées
                </CardTitle>
                <CardDescription>
                  Vue d'ensemble des performances de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Typography variant="h4" className="font-bold text-2xl text-green-600 mb-2">
                      {stats?.newUsers24h || 0}
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      Nouveaux utilisateurs (24h)
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography variant="h4" className="font-bold text-2xl text-blue-600 mb-2">
                      {stats?.newCompanies24h || 0}
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      Nouvelles entreprises (24h)
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography variant="h4" className="font-bold text-2xl text-purple-600 mb-2">
                      {stats?.newJobs24h || 0}
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      Nouvelles offres (24h)
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
