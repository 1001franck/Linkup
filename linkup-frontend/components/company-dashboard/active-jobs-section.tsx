/**
 * Composant Section Offres Actives
 * Affiche les offres d'emploi actives de l'entreprise
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, Eye, Edit, Trash2, Briefcase, Users } from "lucide-react";

interface ActiveJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  status: string;
  applications: number;
}

interface ActiveJobsSectionProps {
  jobs: ActiveJob[];
  isLoading: boolean;
  error: string | null;
  onViewJob: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onDeleteJob: (jobId: string, jobTitle: string) => void;
}

export function ActiveJobsSection({
  jobs,
  isLoading,
  error,
  onViewJob,
  onEditJob,
  onDeleteJob,
}: ActiveJobsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Offres actives</CardTitle>
              <CardDescription>Vos offres d'emploi en cours</CardDescription>
            </div>
            <Link href="/company-dashboard/jobs">
              <Button variant="outline" size="sm">
                Gérer toutes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-muted rounded w-28"></div>
                    <div className="flex gap-4">
                      <div className="h-3 bg-muted rounded w-20"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded flex-1"></div>
                    <div className="h-8 bg-muted rounded flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Typography variant="muted" className="text-red-500">
                Erreur lors du chargement des offres: {error}
              </Typography>
            </div>
          ) : !Array.isArray(jobs) || jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Typography variant="h4" className="font-semibold text-foreground">
                    Aucune offre active
                  </Typography>
                  <Typography variant="muted" className="text-sm max-w-sm">
                    Créez votre première offre d'emploi pour commencer à recevoir des candidatures.
                  </Typography>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
                    size="sm"
                    asChild
                  >
                    <Link href="/company-dashboard/create-job">
                      <Plus className="h-4 w-4 mr-2" />
                      Publier une offre
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/company-dashboard/jobs">
                      <Eye className="h-4 w-4 mr-2" />
                      Gérer toutes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Typography variant="h4" className="font-semibold text-foreground mb-1">
                        {job.title}
                      </Typography>
                      <Typography variant="muted" className="text-sm">
                        {job.department} • {job.location}
                      </Typography>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {job.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {job.type} • {job.salary}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-cyan-500" />
                        {job.applications} candidatures
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onViewJob(job.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onEditJob(job.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteJob(job.id, job.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}






