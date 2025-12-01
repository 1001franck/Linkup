/**
 * Composant Onglet Profil
 * Gère les informations personnelles et la photo de profil
 */

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { User, Camera, Upload, Trash2, Save } from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  website: string;
  linkedin: string;
}

interface ProfileTabProps {
  profileData: ProfileData;
  onProfileDataChange: (data: Partial<ProfileData>) => void;
  profilePicture: string | null;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePhoto: () => void;
  onSave: () => void;
  isUploading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}

export function ProfileTab({
  profileData,
  onProfileDataChange,
  profilePicture,
  onPhotoUpload,
  onDeletePhoto,
  onSave,
  isUploading,
  isDeleting,
  isSaving,
}: ProfileTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">Informations personnelles</CardTitle>
          <CardDescription className="text-muted-foreground">
            Gérez vos informations de profil publiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo de profil */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isUploading}
              />
              <div className="h-20 w-20 rounded-full overflow-hidden bg-muted">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Photo de profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 z-20"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-primary-foreground" />
                )}
              </Button>
            </div>
            <div>
              <Typography variant="h4" className="font-semibold mb-1 text-foreground">
                Photo de profil
              </Typography>
              <Typography variant="muted" className="text-sm mb-3 text-muted-foreground">
                JPG, PNG ou GIF. Max 5MB.
              </Typography>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button variant="outline" size="sm" disabled={isUploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Upload..." : "Changer"}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDeletePhoto}
                  disabled={isDeleting || !profilePicture}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
              <Input
                value={profileData.firstName}
                onChange={(e) =>
                  onProfileDataChange({ firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
              <Input
                value={profileData.lastName}
                onChange={(e) => onProfileDataChange({ lastName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => onProfileDataChange({ email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
              <Input
                value={profileData.phone}
                onChange={(e) => onProfileDataChange({ phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Localisation
              </label>
              <Input
                value={profileData.location}
                onChange={(e) => onProfileDataChange({ location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Site web</label>
              <Input
                value={profileData.website}
                onChange={(e) => onProfileDataChange({ website: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => onProfileDataChange({ bio: e.target.value })}
              className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Parlez de vous..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={onSave}
              className="bg-primary hover:bg-primary/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


