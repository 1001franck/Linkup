/**
 * Page de gestion des entretiens - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des entretiens
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react";

export default function CompanyInterviewsPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("all");

  // Données simulées des entretiens
  const interviews = [
    {
      id: "int-1",
      candidateName: "Marie Dubois",
      candidateTitle: "Développeuse Frontend",
      jobTitle: "Développeur React Senior",
      date: "18-01-2025",
      time: "14:00",
      duration: "45 min",
      type: "Visioconférence",
      interviewer: "Jean Dupont",
      status: "scheduled",
      meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: "int-2",
      candidateName: "Thomas Martin", 
      candidateTitle: "Product Manager",
      jobTitle: "Product Manager Senior",
      date: "19-01-2025",
      time: "10:30",
      duration: "60 min",
      type: "Présentiel",
      interviewer: "Sophie Martin",
      status: "scheduled",
      location: "Bureau principal - Salle de réunion A"
    },
    {
      id: "int-3",
      candidateName: "Sarah Chen",
      candidateTitle: "UX Designer",
      jobTitle: "UX/UI Designer",
      date: "20-01-2025",
      time: "16:00",
      duration: "30 min",
      type: "Téléphone",
      interviewer: "Alexandre Moreau",
      status: "completed",
      result: "positive"
    },
    {
      id: "int-4",
      candidateName: "Pierre Durand",
      candidateTitle: "Data Scientist",
      jobTitle: "Data Scientist",
      date: "17-01-2025",
      time: "11:00",
      duration: "45 min",
      type: "Visioconférence",
      interviewer: "Marie Leclerc",
      status: "completed",
      result: "negative"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled": return "Programmé";
      case "completed": return "Terminé";
      case "cancelled": return "Annulé";
      default: return "Inconnu";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Visioconférence": return <Video className="h-4 w-4" />;
      case "Présentiel": return <MapPin className="h-4 w-4" />;
      case "Téléphone": return <Phone className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    if (selectedDate === "all") return true;
    if (selectedDate === "today") return interview.date === "18-01-2025"; // Simulé
    if (selectedDate === "upcoming") return interview.status === "scheduled";
    if (selectedDate === "completed") return interview.status === "completed";
    return true;
  });

  const handleInterviewAction = (interviewId: string, action: string) => {
    toast({
      title: "Action effectuée",
      description: `${action} pour l'entretien ${interviewId}`,
      duration: 2000,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container>
          {/* Header */}
          <div className="py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/company-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au dashboard
                </Button>
              </Link>
              <div>
                <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
                  Gestion des entretiens
                </Typography>
                <Typography variant="muted" className="text-lg">
                  Planifiez et suivez vos entretiens
                </Typography>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="muted" className="text-sm font-medium">
                        Entretiens programmés
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {interviews.filter(int => int.status === 'scheduled').length}
                      </Typography>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="muted" className="text-sm font-medium">
                        Entretiens terminés
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {interviews.filter(int => int.status === 'completed').length}
                      </Typography>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="muted" className="text-sm font-medium">
                        Aujourd'hui
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {interviews.filter(int => int.date === '18-01-2025').length}
                      </Typography>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="muted" className="text-sm font-medium">
                        Taux de réussite
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        75%
                      </Typography>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2">
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      <option value="all">Tous les entretiens</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="upcoming">À venir</option>
                      <option value="completed">Terminés</option>
                    </select>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier un entretien
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interviews List */}
          <div className="space-y-4">
            {filteredInterviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {interview.candidateName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <Typography variant="h4" className="font-semibold text-foreground">
                            {interview.candidateName}
                          </Typography>
                          <Typography variant="muted" className="text-sm">
                            {interview.candidateTitle} • {interview.jobTitle}
                          </Typography>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {interview.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {interview.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(interview.type)}
                              {interview.type}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Typography variant="muted" className="text-sm">
                            Avec {interview.interviewer}
                          </Typography>
                          <Badge className={getStatusColor(interview.status)}>
                            {getStatusLabel(interview.status)}
                          </Badge>
                          {interview.result && (
                            <div className="mt-1">
                              {interview.result === 'positive' ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Positif
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Négatif
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {interview.status === 'scheduled' && (
                            <>
                              {interview.meetingLink && (
                                <Button variant="outline" size="sm">
                                  <Video className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    {interview.location && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {interview.location}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredInterviews.length === 0 && (
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <Typography variant="h3" className="text-foreground mb-2">
                  Aucun entretien trouvé
                </Typography>
                <Typography variant="muted" className="mb-6">
                  Aucun entretien ne correspond à vos critères de recherche
                </Typography>
                <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier un entretien
                </Button>
              </CardContent>
            </Card>
          )}
        </Container>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
