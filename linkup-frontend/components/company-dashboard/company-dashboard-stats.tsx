/**
 * Composant Cartes de Statistiques du Dashboard Entreprise
 * Affiche les 4 cartes principales (Offres actives, Nouvelles candidatures, etc.)
 */

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Briefcase, UserPlus, Calendar, UserCheck } from "lucide-react";

interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  interviewsScheduled: number;
  hiredCandidates: number;
}

interface CompanyDashboardStatsProps {
  stats: CompanyStats;
  isLoading: boolean;
}

export function CompanyDashboardStats({ stats, isLoading }: CompanyDashboardStatsProps) {
  const statCards = [
    {
      title: "Offres actives",
      value: stats.activeJobs,
      subtitle: `sur ${stats.totalJobs} total`,
      icon: Briefcase,
      gradient: "from-cyan-500 to-cyan-600",
      delay: 0,
    },
    {
      title: "Nouvelles candidatures",
      value: stats.newApplications,
      subtitle: "cette semaine",
      icon: UserPlus,
      gradient: "from-green-500 to-green-600",
      delay: 0.1,
    },
    {
      title: "Entretiens programmés",
      value: stats.interviewsScheduled,
      subtitle: "total",
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600",
      delay: 0.2,
    },
    {
      title: "Candidats embauchés",
      value: stats.hiredCandidates,
      subtitle: "total",
      icon: UserCheck,
      gradient: "from-purple-500 to-purple-600",
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.delay }}
        >
          <Card className="backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="muted" className="text-sm font-medium">
                    {stat.title}
                  </Typography>
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  ) : (
                    <>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {stat.value ?? 0}
                      </Typography>
                      <Typography variant="muted" className="text-sm">
                        {stat.subtitle}
                      </Typography>
                    </>
                  )}
                </div>
                <div
                  className={`h-12 w-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}



