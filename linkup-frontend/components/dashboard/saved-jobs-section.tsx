/**
 * Composant Section Emplois Sauvegardés
 * Affiche les emplois sauvegardés par l'utilisateur
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { CompanyAvatar } from "@/components/ui/user-avatar";
import { Bookmark } from "lucide-react";

interface SavedJob {
  id: number;
  title: string;
  company: string;
  companyWebsite?: string;
  companyLogo?: string | null;
  location: string;
  type: string;
  salary: string;
  industry?: string;
  savedAt: string;
  publishedAt?: string | null;
}

interface SavedJobsSectionProps {
  jobs: SavedJob[];
}

export function SavedJobsSection({ jobs }: SavedJobsSectionProps) {
  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emplois sauvegardés</CardTitle>
            <CardDescription>Vos emplois favoris ({jobs.length})</CardDescription>
          </div>
          <Link href="/my-applications?filter=bookmarked">
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Voir tout
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <motion.div
                key={job.id || `saved-job-${index}`}
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
                  <div className="mb-3">
                    <Typography variant="small" className="font-semibold text-foreground mb-1">
                      {job.title}
                    </Typography>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {job.company}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{job.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{job.salary}</span>
                    {job.industry && (
                      <Badge variant="secondary" className="text-xs">
                        {job.industry}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Sauvegardé le {job.savedAt}</span>
                    {job.publishedAt && <span>Publié le {job.publishedAt}</span>}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <Typography variant="large" className="text-muted-foreground mb-2">
                Aucun emploi sauvegardé
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Sauvegardez des emplois pour les retrouver facilement
              </Typography>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

