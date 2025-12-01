/**
 * Composant Onglet Sécurité
 * Gère le changement de mot de passe et la suppression de compte
 */

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Lock, Eye, EyeOff, Trash2 } from "lucide-react";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityTabProps {
  passwordData: PasswordData;
  onPasswordDataChange: (data: Partial<PasswordData>) => void;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  onToggleCurrentPassword: () => void;
  onToggleNewPassword: () => void;
  onToggleConfirmPassword: () => void;
  onChangePassword: () => void;
  onDeleteAccount: () => void;
}

export function SecurityTab({
  passwordData,
  onPasswordDataChange,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onToggleConfirmPassword,
  onChangePassword,
  onDeleteAccount,
}: SecurityTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">Changer le mot de passe</CardTitle>
          <CardDescription className="text-muted-foreground">
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  onPasswordDataChange({ currentPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={onToggleCurrentPassword}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => onPasswordDataChange({ newPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={onToggleNewPassword}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => onPasswordDataChange({ confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={onToggleConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onChangePassword} className="bg-primary hover:bg-primary/90">
              <Lock className="h-4 w-4 mr-2" />
              Changer le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription className="text-muted-foreground">
            Actions irréversibles pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <Typography variant="h4" className="font-semibold text-destructive mb-1">
                Supprimer le compte
              </Typography>
              <Typography variant="muted" className="text-destructive/80">
                Cette action est irréversible. Toutes vos données seront supprimées.
              </Typography>
            </div>
            <Button
              variant="outline"
              className="border-destructive/20 text-destructive hover:bg-destructive/10"
              onClick={onDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


