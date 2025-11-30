/**
 * Composant Carte de Candidature
 * Affiche les informations d'une candidature avec détails expandables
 */

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Star,
  ChevronDown,
  ChevronRight,
  FileText,
  Eye,
  Download,
  File,
  ExternalLink,
  CheckCircle,
  Calendar,
  XCircle,
  Clock3,
} from "lucide-react";
import { ApplicationCardDetails } from "./application-card-details";

interface Application {
  id: string;
  candidateName: string;
  candidateTitle: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  appliedDate: string;
  status: string;
  experience: string;
  location: string;
  matchScore: number;
  avatar: string;
  skills: string[];
  coverLetter: string;
  coverLetterUrl: string | null;
  coverLetterFileName: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  portfolioUrl: string | null;
  portfolioFileName: string | null;
  hasDocuments: {
    cv: boolean;
    coverLetter: boolean;
    portfolio: boolean;
  };
}

interface ApplicationCardProps {
  application: Application;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDocument: (type: "cv" | "cover_letter" | "portfolio", url: string, fileName: string) => void;
  onContactCandidate: (email: string) => void;
  onStatusChange: (applicationId: string, newStatus: string) => void;
  onScheduleInterview: (application: Application) => void;
  onRescheduleInterview: (application: Application) => void;
  formatPhone: (phone: string | null | undefined) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  isUpdatingStatus: boolean;
}

export function ApplicationCard({
  application,
  index,
  isExpanded,
  onToggleExpand,
  onViewDocument,
  onContactCandidate,
  onStatusChange,
  onScheduleInterview,
  onRescheduleInterview,
  formatPhone,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
  isUpdatingStatus,
}: ApplicationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                {application.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <Typography variant="h4" className="font-semibold text-foreground">
                  {application.candidateName}
                </Typography>
                <Typography variant="muted" className="text-sm">
                  {application.candidateTitle} • {application.experience} • {application.location}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  Candidature pour {application.jobTitle} • {application.appliedDate}
                </Typography>

                {/* Informations de contact directement visibles */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate max-w-[150px]">{application.candidateEmail}</span>
                  </div>
                  {application.candidatePhone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{formatPhone(application.candidatePhone)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    {application.matchScore}% match
                  </span>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {getStatusIcon(application.status)}
                  <span className="ml-1">{getStatusLabel(application.status)}</span>
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleExpand}
                  className="min-w-[100px]"
                >
                  {isExpanded ? (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Réduire
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Voir détails
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (application.hasDocuments.cv && application.cvUrl) {
                      onViewDocument("cv", application.cvUrl, application.cvFileName || "CV.pdf");
                    } else {
                      onToggleExpand();
                    }
                  }}
                  className="min-w-[100px]"
                  disabled={!application.hasDocuments.cv && !application.coverLetter}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Voir le CV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContactCandidate(application.candidateEmail)}
                  className="min-w-[100px]"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Contacter
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <ApplicationCardDetails
              application={application}
              formatPhone={formatPhone}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              getStatusIcon={getStatusIcon}
              onViewDocument={onViewDocument}
              onContactCandidate={onContactCandidate}
              onStatusChange={onStatusChange}
              onScheduleInterview={(app) => onScheduleInterview(app as any)}
              onRescheduleInterview={(app) => onRescheduleInterview(app as any)}
              isUpdatingStatus={isUpdatingStatus}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

