/**
 * Composant Section Candidatures Récentes
 * Affiche les dernières candidatures reçues
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, Eye, FileText, UserSearch } from "lucide-react";

interface Application {
  id: string;
  candidateName: string;
  candidateTitle: string;
  experience: string;
  location: string;
  jobTitle: string;
  appliedDate: string;
  status: string;
  matchScore: number;
  avatar: string;
  profilePicture?: string | null;
}

interface RecentApplicationsSectionProps {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function RecentApplicationsSection({
  applications,
  isLoading,
  error,
  getStatusColor,
  getStatusLabel,
}: RecentApplicationsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Candidatures récentes
              </CardTitle>
              <CardDescription>Les dernières candidatures reçues</CardDescription>
            </div>
            <Link href="/company-dashboard/applications">
              <Button variant="outline" size="sm">
                Voir toutes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                      <div className="h-3 bg-muted rounded w-40"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Typography variant="muted" className="text-red-500">
                Erreur lors du chargement des candidatures: {error}
              </Typography>
            </div>
          ) : !Array.isArray(applications) || applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                  <UserSearch className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Typography variant="h4" className="font-semibold text-foreground">
                    Aucune candidature récente
                  </Typography>
                  <Typography variant="muted" className="text-sm max-w-sm">
                    Les candidatures que vous recevrez apparaîtront ici. Assurez-vous que vos offres
                    d'emploi sont bien publiées et visibles.
                  </Typography>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/company-dashboard/create-job">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une offre
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/company-dashboard/applications">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir toutes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {application.profilePicture ? (
                      <img
                        src={application.profilePicture}
                        alt={`Photo de ${application.candidateName}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-cyan-500/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const nextSibling = target.nextSibling as HTMLElement;
                          if (nextSibling) nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-12 w-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold ${
                        application.profilePicture ? "hidden" : "flex"
                      }`}
                    >
                      {application.avatar || "??"}
                    </div>
                    <div>
                      <Typography variant="h4" className="font-semibold text-foreground">
                        {application.candidateName}
                      </Typography>
                      <Typography variant="muted" className="text-sm">
                        {application.candidateTitle} • {application.experience} •{" "}
                        {application.location}
                      </Typography>
                      <Typography variant="muted" className="text-xs">
                        Candidature pour {application.jobTitle} • {application.appliedDate}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(application.status)}>
                      {getStatusLabel(application.status)}
                    </Badge>
                    <div className="text-right">
                      <Typography variant="muted" className="text-sm">
                        Match: {application.matchScore}%
                      </Typography>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/company-dashboard/applications?candidate=${application.id.split("-")[0]}&job=${application.id.split("-")[1]}`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Voir le CV
                      </Link>
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






