/**
 * Composant Section Candidatures Récentes
 * Affiche les candidatures récentes de l'utilisateur
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { CompanyAvatar } from "@/components/ui/user-avatar";
import { Send, ArrowRight, Plus, MoreHorizontal } from "lucide-react";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  companyWebsite?: string;
  companyLogo?: string | null;
  location: string;
  type: string;
  salary: string;
  industry?: string;
  status: string;
  appliedDate: string;
  match: number;
}

interface RecentApplicationsSectionProps {
  applications: Application[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "En attente":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    case "En cours":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300";
    case "Refusé":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    case "Accepté":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function RecentApplicationsSection({
  applications,
}: RecentApplicationsSectionProps) {
  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mes candidatures</CardTitle>
            <CardDescription>Suivez l'état de vos candidatures</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Link href="/my-applications">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Voir plus
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle candidature
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.length > 0 ? (
            applications.map((application, index) => (
              <motion.div
                key={application.id || `application-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-6 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300"
              >
                <CompanyAvatar
                  src={application.companyLogo}
                  name={application.company}
                  website={application.companyWebsite}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="mb-3">
                    <Typography variant="small" className="font-semibold text-foreground mb-1">
                      {application.jobTitle}
                    </Typography>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {application.company}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {application.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {application.type}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      {application.salary}
                    </span>
                    {application.industry && (
                      <Badge variant="secondary" className="text-xs">
                        {application.industry}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Candidature: {application.appliedDate}</span>
                    <span>Match: {application.match}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <Typography variant="large" className="text-muted-foreground mb-2">
                Aucune candidature récente
              </Typography>
              <Typography variant="small" className="text-muted-foreground mb-4">
                Commencez à postuler pour suivre vos candidatures
              </Typography>
              <Link href="/jobs">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
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




