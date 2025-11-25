/**
 * Page de profil LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du profil utilisateur
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState } from "react";
import { useProfileCompletion } from "@/hooks/use-profile-completion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { 
  Edit, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  Star,
  Building,
  Clock
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const { profileData, updateProfile, completion } = useProfileCompletion();

  // Données statiques pour le profil
  const user = {
    name: "Jean Dupont",
    title: "Développeur Frontend Senior",
    company: "TechCorp",
    location: "Paris, France",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    website: "jeandupont.dev",
    bio: "Développeur Frontend passionné par React et les technologies modernes. J'aime créer des expériences utilisateur exceptionnelles et partager mes connaissances avec la communauté.",
    avatar: "/api/placeholder/150/150",
    coverImage: "/api/placeholder/800/200",
    connections: 1250,
    followers: 890,
    experience: [
      {
        id: 1,
        title: "Développeur Frontend Senior",
        company: "TechCorp",
        location: "Paris, France",
        startDate: "2022",
        endDate: "Présent",
        current: true,
        description: "Développement d'applications React/TypeScript, mentoring d'équipe junior, architecture frontend."
      },
      {
        id: 2,
        title: "Développeur Frontend",
        company: "StartupX",
        location: "Lyon, France",
        startDate: "2020",
        endDate: "2022",
        current: false,
        description: "Développement d'interfaces utilisateur, intégration d'APIs, optimisation des performances."
      },
      {
        id: 3,
        title: "Développeur Junior",
        company: "WebAgency",
        location: "Marseille, France",
        startDate: "2019",
        endDate: "2020",
        current: false,
        description: "Développement de sites web, maintenance, support client."
      }
    ],
    education: [
      {
        id: 1,
        school: "École Supérieure d'Informatique",
        degree: "Master en Développement Web",
        field: "Informatique",
        startDate: "2017",
        endDate: "2019",
        current: false
      },
      {
        id: 2,
        school: "Université de Technologie",
        degree: "Licence en Informatique",
        field: "Informatique",
        startDate: "2014",
        endDate: "2017",
        current: false
      }
    ],
    skills: [
      "React", "TypeScript", "JavaScript", "HTML/CSS", "Node.js", "Git", "Figma", "Agile", "Scrum", "MongoDB", "PostgreSQL", "Docker"
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023"
      },
      {
        id: 2,
        name: "React Professional Certificate",
        issuer: "Meta",
        date: "2022"
      }
    ]
  };

  const tabs = [
    { id: "about", label: "À propos" },
    { id: "experience", label: "Expérience" },
    { id: "education", label: "Formation" },
    { id: "skills", label: "Compétences" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="absolute inset-0 bg-black/20"></div>
        <Container className="relative h-full flex items-end pb-8">
          <div className="flex items-end space-x-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-muted border-4 border-background flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">JD</span>
              </div>
              <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <Typography variant="h1" className="text-white mb-2">
                {user.name}
              </Typography>
              <Typography variant="lead" className="text-white/90 mb-2">
                {user.title} chez {user.company}
              </Typography>
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{user.connections} connexions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>À propos</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Typography variant="muted" className="mb-4">
                  {user.bio}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.website}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Expérience professionnelle</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {user.experience.map((exp) => (
                    <div key={exp.id} className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Typography variant="small" className="font-medium">
                              {exp.title}
                            </Typography>
                            <Typography variant="muted" className="text-sm">
                              {exp.company} • {exp.location}
                            </Typography>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {exp.startDate} - {exp.endDate}
                              </span>
                              {exp.current && (
                                <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                                  Actuel
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <Typography variant="muted" className="text-sm mt-2">
                          {exp.description}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Formation</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {user.education.map((edu) => (
                    <div key={edu.id} className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" className="font-medium">
                          {edu.degree}
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          {edu.school} • {edu.field}
                        </Typography>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compétences</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" className="font-medium">
                          {cert.name}
                        </Typography>
                        <Typography variant="muted" className="text-xs">
                          {cert.issuer} • {cert.date}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ajouter une certification
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profil consulté</span>
                    <span className="text-sm font-medium">1,234 fois</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connexions</span>
                    <span className="text-sm font-medium">{user.connections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Followers</span>
                    <span className="text-sm font-medium">{user.followers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Posts</span>
                    <span className="text-sm font-medium">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <Typography variant="muted" className="text-sm">
                      Aucune recommandation pour le moment
                    </Typography>
                    <Button variant="outline" className="mt-4">
                      Demander une recommandation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
