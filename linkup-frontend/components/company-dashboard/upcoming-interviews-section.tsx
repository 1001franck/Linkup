/**
 * Composant Section Entretiens à Venir
 * Affiche les prochains entretiens programmés
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Users } from "lucide-react";

interface Interview {
  id: string;
  candidateName: string;
  jobTitle: string;
  interviewer: string;
  date: string;
  time: string;
  type: string;
  avatar: string;
  profilePicture?: string | null;
}

interface UpcomingInterviewsSectionProps {
  interviews: Interview[];
  isLoading: boolean;
  error: string | null;
}

export function UpcomingInterviewsSection({
  interviews,
  isLoading,
  error,
}: UpcomingInterviewsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Entretiens à venir
              </CardTitle>
              <CardDescription>Vos prochains entretiens programmés</CardDescription>
            </div>
            <Link href="/company-dashboard/applications?status=interview">
              <Button variant="outline" size="sm">
                Voir le planning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-40"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Typography variant="muted" className="text-red-500">
                Erreur lors du chargement des entretiens: {error}
              </Typography>
            </div>
          ) : !Array.isArray(interviews) || interviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Typography variant="h4" className="font-semibold text-foreground">
                    Aucun entretien programmé
                  </Typography>
                  <Typography variant="muted" className="text-sm max-w-sm">
                    Les entretiens que vous programmerez apparaîtront ici. Planifiez vos entretiens
                    depuis la section candidatures.
                  </Typography>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/company-dashboard/applications">
                      <Users className="h-4 w-4 mr-2" />
                      Voir candidatures
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/company-dashboard/applications?status=interview">
                      <Calendar className="h-4 w-4 mr-2" />
                      Voir le planning
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {interview.profilePicture ? (
                      <img
                        src={interview.profilePicture}
                        alt={`Photo de ${interview.candidateName}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-500/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const nextSibling = target.nextSibling as HTMLElement;
                          if (nextSibling) nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold ${
                        interview.profilePicture ? "hidden" : "flex"
                      }`}
                    >
                      {interview.avatar || "??"}
                    </div>
                    <div>
                      <Typography variant="h4" className="font-semibold text-foreground">
                        {interview.candidateName}
                      </Typography>
                      <Typography variant="muted" className="text-sm">
                        {interview.jobTitle}
                      </Typography>
                      <Typography variant="muted" className="text-xs">
                        Avec {interview.interviewer}
                      </Typography>
                    </div>
                  </div>
                  <div className="text-right">
                    <Typography variant="h4" className="font-semibold text-foreground">
                      {interview.date}
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      {interview.time}
                    </Typography>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mt-1">
                      {interview.type}
                    </Badge>
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




