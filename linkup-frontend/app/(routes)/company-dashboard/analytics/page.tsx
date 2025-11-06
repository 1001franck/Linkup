/**
 * Page Analytics Entreprise - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des analytics
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Briefcase,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter
} from "lucide-react";

export default function CompanyAnalyticsPage() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Données simulées des analytics
  const analytics = {
    overview: {
      totalViews: 2847,
      totalApplications: 156,
      conversionRate: 5.5,
      avgTimeToHire: 12
    },
    topJobs: [
      { title: "Développeur React Senior", applications: 24, views: 156, conversion: 15.4 },
      { title: "Product Manager Senior", applications: 18, views: 98, conversion: 18.4 },
      { title: "UX/UI Designer", applications: 32, views: 203, conversion: 15.8 },
      { title: "Data Scientist", applications: 15, views: 89, conversion: 16.9 }
    ],
    sources: [
      { name: "LinkUp", applications: 45, percentage: 28.8 },
      { name: "LinkedIn", applications: 32, percentage: 20.5 },
      { name: "Indeed", applications: 28, percentage: 17.9 },
      { name: "Welcome to the Jungle", applications: 25, percentage: 16.0 },
      { name: "Autres", applications: 26, percentage: 16.7 }
    ],
    trends: {
      applications: [
        { month: "Oct", value: 45 },
        { month: "Nov", value: 52 },
        { month: "Déc", value: 38 },
        { month: "Jan", value: 56 }
      ],
      views: [
        { month: "Oct", value: 1200 },
        { month: "Nov", value: 1450 },
        { month: "Déc", value: 1100 },
        { month: "Jan", value: 1600 }
      ]
    }
  };

  const periodOptions = [
    { id: "7d", label: "7 derniers jours" },
    { id: "30d", label: "30 derniers jours" },
    { id: "90d", label: "90 derniers jours" },
    { id: "1y", label: "1 an" }
  ];

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Vos données analytics sont en cours d'export...",
      duration: 2000,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container>
          {/* Header */}
          <div className="py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/company-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au dashboard
                </Button>
              </Link>
              <div>
                <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
                  Analytics
                </Typography>
                <Typography variant="muted" className="text-lg">
                  Analysez les performances de vos offres d'emploi
                </Typography>
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="mb-8">
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2">
                    {periodOptions.map(option => (
                      <Button
                        key={option.id}
                        variant={selectedPeriod === option.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(option.id)}
                        className={selectedPeriod === option.id ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overview Stats */}
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
                        Total vues
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {analytics.overview.totalViews.toLocaleString()}
                      </Typography>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">+12%</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
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
                        Candidatures
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {analytics.overview.totalApplications}
                      </Typography>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">+8%</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
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
                        Taux de conversion
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {analytics.overview.conversionRate}%
                      </Typography>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500">-2%</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
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
                        Temps moyen d'embauche
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {analytics.overview.avgTimeToHire}j
                      </Typography>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">-3j</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-600" />
                    Top des offres
                  </CardTitle>
                  <CardDescription>
                    Vos offres les plus performantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topJobs.map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <Typography variant="h4" className="font-semibold text-foreground text-sm">
                            {job.title}
                          </Typography>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{job.applications} candidatures</span>
                            <span>{job.views} vues</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography variant="h4" className="font-semibold text-foreground">
                            {job.conversion}%
                          </Typography>
                          <Typography variant="muted" className="text-xs">
                            conversion
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-cyan-600" />
                    Sources de candidatures
                  </CardTitle>
                  <CardDescription>
                    D'où viennent vos candidats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.sources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600"></div>
                          <Typography variant="h4" className="font-medium text-foreground">
                            {source.name}
                          </Typography>
                        </div>
                        <div className="text-right">
                          <Typography variant="h4" className="font-semibold text-foreground">
                            {source.applications}
                          </Typography>
                          <Typography variant="muted" className="text-xs">
                            {source.percentage}%
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-600" />
                  Évolution des performances
                </CardTitle>
                <CardDescription>
                  Tendances sur les 4 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Applications Trend */}
                  <div>
                    <Typography variant="h4" className="font-semibold text-foreground mb-4">
                      Candidatures
                    </Typography>
                    <div className="space-y-3">
                      {analytics.trends.applications.map((point, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{point.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full"
                                style={{ width: `${(point.value / 60) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-foreground w-8">{point.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Views Trend */}
                  <div>
                    <Typography variant="h4" className="font-semibold text-foreground mb-4">
                      Vues
                    </Typography>
                    <div className="space-y-3">
                      {analytics.trends.views.map((point, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{point.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                style={{ width: `${(point.value / 1800) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-foreground w-12">{point.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
