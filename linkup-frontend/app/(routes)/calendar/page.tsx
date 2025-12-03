/**
 * Page Calendrier - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du calendrier
 * - Open/Closed : Extensible via props et composition
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
import { BackButton } from "@/components/ui/back-button";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Bell,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";

function CalendarContent() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState("month");

  // Initialiser les dates côté client pour éviter les erreurs d'hydratation
  React.useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  }, []);

  // Ne pas rendre le composant avant que les dates soient initialisées
  if (!currentDate || !selectedDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <Typography variant="muted">Chargement du calendrier...</Typography>
        </div>
      </div>
    );
  }

  // Événements du calendrier
  const events = [
    {
      id: 1,
      title: "Entretien TechCorp",
      type: "interview",
      date: new Date(2025, 0, 15, 14, 0), // 15 janvier 2025, 14h00
      duration: 60,
      location: "Paris, France",
      attendees: ["Marie Dubois", "Jean Dupont"],
      status: "confirmed",
      description: "Entretien technique pour le poste de Développeur Frontend React"
    },
    {
      id: 2,
      title: "Meetup Développeurs",
      type: "networking",
      date: new Date(2025, 0, 20, 18, 30), // 20 janvier 2025, 18h30
      duration: 120,
      location: "Lyon, France",
      attendees: ["Pierre Martin", "Sophie Chen"],
      status: "registered",
      description: "Rencontre avec d'autres développeurs de la région"
    },
    {
      id: 3,
      title: "Formation React",
      type: "training",
      date: new Date(2025, 0, 25, 9, 0), // 25 janvier 2025, 9h00
      duration: 480,
      location: "Online",
      attendees: ["Formateur Expert"],
      status: "pending",
      description: "Formation avancée sur React et les hooks"
    },
    {
      id: 4,
      title: "Appel de suivi StartupX",
      type: "call",
      date: new Date(2025, 0, 18, 10, 0), // 18 janvier 2025, 10h00
      duration: 30,
      location: "Online",
      attendees: ["Alexandre Rousseau"],
      status: "confirmed",
      description: "Discussion sur le projet et les prochaines étapes"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "interview": return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "networking": return "bg-teal-100 text-teal-800 border-teal-200";
      case "training": return "bg-purple-100 text-purple-800 border-purple-200";
      case "call": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "interview": return Users;
      case "networking": return Users;
      case "training": return Star;
      case "call": return Phone;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "registered": return "bg-cyan-100 text-cyan-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmé";
      case "registered": return "Inscrit";
      case "pending": return "En attente";
      default: return "Inconnu";
    }
  };

  // Générer les jours du mois
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <BackButton fallbackPath="/dashboard" />
              <div>
                <Typography variant="h2" className="text-2xl font-bold">
                  Calendrier
                </Typography>
                <Typography variant="muted" className="text-sm">
                  Gérez vos rendez-vous et événements
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel événement
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navigation du mois */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Aujourd'hui
                </Button>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Événements ce mois</span>
                  <span className="font-semibold text-cyan-600">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Entretiens</span>
                  <span className="font-semibold text-teal-600">{events.filter(e => e.type === 'interview').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Formations</span>
                  <span className="font-semibold text-purple-600">{events.filter(e => e.type === 'training').length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Légende */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Légende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded bg-cyan-500"></div>
                  <span className="text-sm">Entretiens</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded bg-teal-500"></div>
                  <span className="text-sm">Networking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded bg-purple-500"></div>
                  <span className="text-sm">Formations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded bg-blue-500"></div>
                  <span className="text-sm">Appels</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendrier principal */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                {/* En-têtes des jours */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grille du calendrier */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = currentDate ? day.getMonth() === currentDate.getMonth() : false;
                    const isToday = currentDate ? day.toDateString() === currentDate.toDateString() : false;
                    const isSelected = selectedDate ? day.toDateString() === selectedDate.toDateString() : false;

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`min-h-[100px] p-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all duration-200 ${
                          isCurrentMonth 
                            ? 'bg-white dark:bg-slate-800' 
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                        } ${
                          isToday 
                            ? 'ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' 
                            : ''
                        } ${
                          isSelected 
                            ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                            : ''
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${
                            isToday ? 'text-cyan-600' : isSelected ? 'text-teal-600' : ''
                          }`}>
                            {day.getDate()}
                          </span>
                          {dayEvents.length > 0 && (
                            <Badge variant="outline" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                              {dayEvents.length}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => {
                            const EventIcon = getEventTypeIcon(event.type);
                            return (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                              >
                                <div className="flex items-center space-x-1">
                                  <EventIcon className="h-2 w-2" />
                                  <span className="truncate">{event.title}</span>
                                </div>
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{dayEvents.length - 2} autres
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Événements du jour sélectionné */}
            {getEventsForDate(selectedDate).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getEventsForDate(selectedDate).map((event) => {
                        const EventIcon = getEventTypeIcon(event.type);
                        return (
                          <div key={event.id} className="flex items-start space-x-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                              <EventIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <Typography variant="h4" className="font-semibold">
                                  {event.title}
                                </Typography>
                                <Badge className={getStatusColor(event.status)}>
                                  {getStatusLabel(event.status)}
                                </Badge>
                              </div>
                              <Typography variant="muted" className="text-sm mb-3">
                                {event.description}
                              </Typography>
                              <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{event.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3" />
                                  <span>{event.attendees.length} participant(s)</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Bell className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Video className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <CalendarContent />
    </ProtectedRoute>
  );
}
