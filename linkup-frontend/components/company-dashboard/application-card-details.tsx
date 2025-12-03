/**
 * Composant Détails d'une Candidature (section expandable)
 * Affiche les informations détaillées, documents et actions
 */

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Eye,
  Download,
  File,
  ExternalLink,
  CheckCircle,
  Calendar,
  XCircle,
  Clock3,
} from "lucide-react";

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  location: string;
  experience: string;
  skills: string[];
  coverLetter: string;
  coverLetterUrl: string | null;
  coverLetterFileName: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  portfolioUrl: string | null;
  status: string;
  hasDocuments: {
    cv: boolean;
    coverLetter: boolean;
    portfolio: boolean;
  };
}

interface ApplicationCardDetailsProps {
  application: Application;
  formatPhone: (phone: string | null | undefined) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onViewDocument: (type: "cv" | "cover_letter" | "portfolio", url: string, fileName: string) => void;
  onContactCandidate: (email: string) => void;
  onStatusChange: (applicationId: string, newStatus: string) => void;
  onScheduleInterview: (application: Application) => void;
  onRescheduleInterview: (application: Application) => void;
  isUpdatingStatus: boolean;
}

export function ApplicationCardDetails({
  application,
  formatPhone,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
  onViewDocument,
  onContactCandidate,
  onStatusChange,
  onScheduleInterview,
  onRescheduleInterview,
  isUpdatingStatus,
}: ApplicationCardDetailsProps) {
  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 pt-6 border-t border-border"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Info & Documents */}
        <div className="space-y-4">
          {/* Informations du candidat */}
          <div>
            <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
              Informations du candidat
            </Typography>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{application.candidateEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{formatPhone(application.candidatePhone)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{application.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{application.experience}</span>
              </div>
            </div>
          </div>

          {/* Compétences */}
          {application.skills.length > 0 && (
            <div>
              <Typography variant="h4" className="font-semibold text-foreground mb-2 text-base">
                Compétences
              </Typography>
              <div className="flex flex-wrap gap-1">
                {application.skills.slice(0, 6).map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {application.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{application.skills.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
              Documents
            </Typography>
            <div className="space-y-2">
              {/* CV */}
              {application.hasDocuments.cv && application.cvUrl ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onViewDocument("cv", application.cvUrl!, application.cvFileName || "CV.pdf")
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le CV
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(application.cvUrl!, application.cvFileName || "CV.pdf")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <File className="h-4 w-4 mr-2" />
                  CV non disponible
                </Button>
              )}

              {/* Lettre de motivation */}
              {application.hasDocuments.coverLetter && application.coverLetterUrl ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onViewDocument(
                        "cover_letter",
                        application.coverLetterUrl!,
                        application.coverLetterFileName || "Lettre.pdf"
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir la lettre
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDownload(
                        application.coverLetterUrl!,
                        application.coverLetterFileName || "Lettre.pdf"
                      )
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <File className="h-4 w-4 mr-2" />
                  Lettre non disponible
                </Button>
              )}

              {/* Portfolio */}
              {application.portfolioUrl && application.portfolioUrl !== "#" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (application.portfolioUrl) {
                      window.open(application.portfolioUrl, "_blank");
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir le portfolio
                </Button>
              )}
            </div>

            {/* Contact */}
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onContactCandidate(application.candidateEmail)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacter le candidat
              </Button>
            </div>
          </div>
        </div>

        {/* Lettre de motivation & Décision */}
        <div className="space-y-4">
          {/* Lettre de motivation */}
          <div>
            <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
              Lettre de motivation
            </Typography>
            <div className="bg-muted/30 p-3 rounded-lg border border-border">
              {application.coverLetter &&
              application.coverLetter !== "Aucune lettre de motivation fournie" ? (
                <div className="max-h-48 overflow-y-auto mb-3">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic mb-3">
                  Aucune lettre de motivation fournie
                </p>
              )}

              {application.hasDocuments.coverLetter && application.coverLetterUrl && (
                <div className="pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      onViewDocument(
                        "cover_letter",
                        application.coverLetterUrl!,
                        application.coverLetterFileName || "Lettre.pdf"
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le document complet
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Décision */}
          <div>
            <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
              Décision
            </Typography>

            {/* Statut actuel */}
            <div className="mb-3 p-2 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                {getStatusIcon(application.status)}
                <span className="text-xs font-medium text-foreground">
                  {getStatusLabel(application.status)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                onClick={() => onStatusChange(application.id, "accepted")}
                disabled={
                  application.status === "accepted" ||
                  application.status === "rejected" ||
                  isUpdatingStatus
                }
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Accepter
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                onClick={() =>
                  application.status === "interview"
                    ? onRescheduleInterview(application)
                    : onScheduleInterview(application)
                }
                disabled={
                  application.status === "accepted" ||
                  application.status === "rejected" ||
                  isUpdatingStatus
                }
              >
                <Calendar className="h-3 w-3 mr-1" />
                Entretien
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                onClick={() => onStatusChange(application.id, "rejected")}
                disabled={
                  application.status === "accepted" ||
                  application.status === "rejected" ||
                  isUpdatingStatus
                }
              >
                <XCircle className="h-3 w-3 mr-1" />
                Refuser
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => onStatusChange(application.id, "pending")}
                disabled={
                  application.status === "pending" ||
                  application.status === "accepted" ||
                  application.status === "rejected" ||
                  isUpdatingStatus
                }
              >
                <Clock3 className="h-3 w-3 mr-1" />
                Attente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}




