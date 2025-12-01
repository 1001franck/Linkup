/**
 * Composant Statistiques du Dashboard
 * Affiche les cartes de statistiques (candidatures, messages, etc.)
 */

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { RefreshCw, TrendingUp, LucideIcon } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: LucideIcon;
  color: string;
  loading: boolean;
  error?: string | null;
}

interface DashboardStatsProps {
  stats: Stat[];
  trendsLoading: boolean;
  trendsError: string | null;
}

export function DashboardStats({
  stats,
  trendsLoading,
  trendsError,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Indicateur de chargement des tendances */}
      {trendsLoading && (
        <div className="col-span-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <Typography variant="muted" className="text-blue-600 dark:text-blue-400">
              Calcul des tendances en cours...
            </Typography>
          </div>
        </div>
      )}

      {/* Erreur des tendances */}
      {trendsError && (
        <div className="col-span-2">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <Typography variant="muted" className="text-red-600 dark:text-red-400">
              ⚠️ Erreur lors du calcul des tendances. Utilisation des données simulées.
            </Typography>
            <Typography variant="small" className="text-red-500 mt-2">
              Détails: {trendsError}
            </Typography>
          </div>
        </div>
      )}

      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="muted" className="text-sm mb-1">
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" className="text-2xl font-bold mb-2">
                    {stat.loading ? (
                      <div className="flex items-center">
                        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                        Chargement...
                      </div>
                    ) : stat.error ? (
                      <span className="text-red-500">Erreur</span>
                    ) : (
                      stat.value
                    )}
                  </Typography>
                  <div className="flex items-center">
                    {stat.loading ? (
                      <span className="text-sm text-muted-foreground">
                        Calcul en cours...
                      </span>
                    ) : stat.error ? (
                      <span className="text-sm text-red-500">
                        Données indisponibles
                      </span>
                    ) : (
                      <>
                        <TrendingUp className={`h-4 w-4 mr-1 ${stat.color}`} />
                        <span className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500/10 to-teal-600/10 flex items-center justify-center`}
                >
                  {stat.loading ? (
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}


