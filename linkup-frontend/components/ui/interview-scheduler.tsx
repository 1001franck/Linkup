"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Calendar, Clock, User, MapPin, Video, Phone } from "lucide-react";

interface InterviewSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: {
    date: string;
    time: string;
    type: string;
    location?: string;
    notes?: string;
  }) => void;
  candidateName: string;
  jobTitle: string;
  loading?: boolean;
  isRescheduling?: boolean;
}

export function InterviewScheduler({
  isOpen,
  onClose,
  onSchedule,
  candidateName,
  jobTitle,
  loading = false,
  isRescheduling = false
}: InterviewSchedulerProps) {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("Visioconférence");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Générer les options d'heure (9h à 18h, par créneaux de 30min)
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  // Date minimum : demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!interviewDate || !interviewTime) {
      return;
    }

    // Combiner date et heure
    const dateTime = new Date(`${interviewDate}T${interviewTime}`);
    
    onSchedule({
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined
    });
  };

  const handleClose = () => {
    // Reset form
    setInterviewDate("");
    setInterviewTime("");
    setInterviewType("Visioconférence");
    setLocation("");
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {isRescheduling ? "Reprogrammer l'entretien" : "Programmer un entretien"}
              </CardTitle>
              <CardDescription>
                {isRescheduling 
                  ? `Modifiez l'entretien avec ${candidateName} pour le poste ${jobTitle}`
                  : `Planifiez un entretien avec ${candidateName} pour le poste ${jobTitle}`
                }
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations du candidat */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <Typography variant="h4" className="font-semibold text-foreground">
                    {candidateName}
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    Candidat pour {jobTitle}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Date et heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de l'entretien
                </label>
                <Input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  min={minDate}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Heure de l'entretien
                </label>
                <select
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sélectionner une heure</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type d'entretien */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Type d'entretien
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: "Visioconférence", icon: Video, description: "En ligne" },
                  { value: "Présentiel", icon: MapPin, description: "Sur site" },
                  { value: "Téléphone", icon: Phone, description: "Appel téléphonique" }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setInterviewType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      interviewType === type.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-border hover:border-blue-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <type.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{type.value}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Localisation (si présentiel) */}
            {interviewType === "Présentiel" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Bureau principal - Salle de réunion A"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {/* Notes optionnelles */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Notes (optionnel)
              </label>
              <textarea
                placeholder="Ajoutez des notes sur l'entretien, les questions à poser, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading || !interviewDate || !interviewTime}
              >
                {loading 
                  ? (isRescheduling ? "Reprogrammation..." : "Programmation...") 
                  : (isRescheduling ? "Reprogrammer l'entretien" : "Programmer l'entretien")
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
