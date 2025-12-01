/**
 * Composant Bannière de Complétion du Profil
 * Affiche un message selon l'état de complétion du profil
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  Target,
  CheckCircle,
  Briefcase,
  Send,
  User,
  RefreshCw,
} from "lucide-react";

interface ProfileCompletionBannerProps {
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
  nextSteps: string[];
  onRefresh: () => void;
}

export function ProfileCompletionBanner({
  isProfileComplete,
  profileCompletionPercentage,
  nextSteps,
  onRefresh,
}: ProfileCompletionBannerProps) {
  if (isProfileComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-xl font-bold text-foreground mb-2">
                Profil complet ! ✅
              </Typography>
              <Typography variant="muted" className="text-muted-foreground mb-4">
                Votre profil est complété à 100%. Vous êtes maintenant visible par les recruteurs !
              </Typography>
              <div className="flex items-center space-x-4">
                <Link href="/jobs">
                  <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Rechercher des emplois
                  </Button>
                </Link>
                <Link href="/my-applications">
                  <Button
                    variant="outline"
                    className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Mes candidatures
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-xl font-bold text-foreground mb-2">
              Complétez votre profil ! 🎯
            </Typography>
            <div className="flex items-center space-x-2 mb-2">
              <Typography variant="muted" className="text-muted-foreground">
                Votre profil est complété à {profileCompletionPercentage}%
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="h-6 w-6 p-0 hover:bg-primary/10"
                title="Rafraîchir le pourcentage"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            {nextSteps.length > 0 && (
              <Typography variant="muted" className="text-muted-foreground mb-4">
                Prochaines étapes : {nextSteps.join(", ")}
              </Typography>
            )}
            <div className="flex items-center space-x-4">
              <Link href="/profile/complete?step=1">
                <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
                  <User className="h-4 w-4 mr-2" />
                  Compléter mon profil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


