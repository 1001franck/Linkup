/**
 * Composant Section Emplois Recommandés
 * Affiche les offres d'emploi recommandées basées sur le matching
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { CompanyAvatar } from "@/components/ui/user-avatar";
import {
  Briefcase,
  Filter,
  Search,
  Heart,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecommendedJob {
  id: number;
  title: string;
  company: string;
  companyWebsite?: string;
  companyLogo?: string | null;
  location: string;
  type: string;
  salary: string;
  match: number;
  postedAt: string;
  skills: string[];
  isBookmarked: boolean;
}

interface RecommendedJobsSectionProps {
  jobs: RecommendedJob[];
  loading: boolean;
  error?: string | null;
}

export function RecommendedJobsSection({
  jobs,
  loading,
  error,
}: RecommendedJobsSectionProps) {
  const { toast } = useToast();

  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emplois recommandés</CardTitle>
            <CardDescription>
              Basés sur votre profil et vos préférences
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Link href="/jobs?filter=true">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <Typography variant="muted">Calcul des recommandations...</Typography>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <Typography variant="large" className="text-red-600 mb-2">
                Erreur de chargement
              </Typography>
              <Typography variant="small" className="text-muted-foreground mb-4">
                Impossible de charger les recommandations
              </Typography>
              <Link href="/jobs">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher des emplois
                </Button>
              </Link>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <motion.div
                key={job.id || `job-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-6 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300"
              >
                <CompanyAvatar
                  src={job.companyLogo}
                  name={job.company}
                  website={job.companyWebsite}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Typography variant="small" className="font-semibold">
                      {job.title}
                    </Typography>
                    <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300">
                      {job.match}% match
                    </Badge>
                  </div>
                  <Typography variant="muted" className="text-sm mb-2">
                    {job.company} • {job.location}
                  </Typography>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                    <span>{job.type}</span>
                    <span>{job.salary}</span>
                    <span>{job.postedAt}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, skillIndex) => (
                      <Badge
                        key={`${job.id}-skill-${skill}-${skillIndex}`}
                        variant="outline"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toast({
                        title: job.isBookmarked ? "Favori retiré" : "Favori ajouté",
                        description: job.isBookmarked
                          ? "L'offre a été retirée de vos favoris"
                          : "L'offre a été ajoutée à vos favoris",
                        variant: "default",
                        duration: 3000,
                      });
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        job.isBookmarked
                          ? "text-red-500 fill-current"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                  <Link href={`/jobs/${job.id}`}>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                    >
                      Voir l'offre
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <Typography variant="large" className="text-muted-foreground mb-2">
                Aucune offre recommandée
              </Typography>
              <Typography variant="small" className="text-muted-foreground mb-4">
                Complétez votre profil pour recevoir des recommandations personnalisées
              </Typography>
              <Link href="/jobs">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher des emplois
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



