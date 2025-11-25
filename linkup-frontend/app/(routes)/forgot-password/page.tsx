"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { apiClient } from "@/lib/api-client";
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  XCircle
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  
  // Validation en temps réel
  const isEmailValid = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation de l'email
      if (!email || !isEmailValid) {
        setError("Veuillez entrer une adresse email valide.");
        setIsLoading(false);
        return;
      }

      // Appel API réel pour la réinitialisation de mot de passe
      const response = await apiClient.forgotPassword(email);
      
      if (response.success) {
        setIsEmailSent(true);
        toast({
          title: "Email envoyé !",
          description: "Vérifiez votre boîte de réception pour les instructions de réinitialisation.",
          variant: "default",
        });
      } else {
        throw new Error(response.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Erreur mot de passe oublié:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Appel API réel pour le renvoi d'email
      const response = await apiClient.forgotPassword(email);
      
      if (response.success) {
        toast({
          title: "Email renvoyé !",
          description: "Un nouvel email de réinitialisation a été envoyé.",
          variant: "default",
        });
      } else {
        throw new Error(response.error || "Erreur lors du renvoi de l'email");
      }
    } catch (error) {
      console.error("Erreur renvoi email:", error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de renvoyer l'email. Veuillez réessayer.";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 dark:from-blue-950/20 via-white dark:via-background to-indigo-50 dark:to-indigo-950/20 flex items-center justify-center p-4">
        <Container className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="backdrop-blur-sm border border-border shadow-xl">
              <CardHeader className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Email envoyé !
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    Nous avons envoyé un lien de réinitialisation à
                  </CardDescription>
                  <Typography variant="small" className="font-medium text-primary mt-1 break-all">
                    {email}
                  </Typography>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-2">
                      <Typography variant="small" className="font-medium text-blue-900 dark:text-blue-100">
                        Prochaines étapes :
                      </Typography>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Vérifiez votre boîte de réception</li>
                        <li>• Cliquez sur le lien de réinitialisation</li>
                        <li>• Créez un nouveau mot de passe</li>
                        <li>• Connectez-vous avec vos nouveaux identifiants</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Renvoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Renvoyer l'email
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setIsEmailSent(false);
                      setEmail("");
                    }}
                    variant="ghost"
                    className="w-full"
                  >
                    Utiliser une autre adresse email
                  </Button>
                </div>

                <div className="text-center">
                  <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Retour à la connexion
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 dark:from-blue-950/20 via-white dark:via-background to-indigo-50 dark:to-indigo-950/20 flex items-center justify-center p-4">
      <Container className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm border border-border shadow-xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
              >
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Mot de passe oublié ?
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Pas de problème ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${email ? (isEmailValid ? "border-green-500 dark:border-green-400 focus-visible:ring-green-500" : "border-red-500 dark:border-red-400 focus-visible:ring-red-500") : ""}`}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isEmailValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {email && !isEmailValid && (
                    <p className="text-xs text-red-500 dark:text-red-400">Format d'email invalide</p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !isEmailValid}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer le lien de réinitialisation
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Retour à la connexion
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
      <Toaster />
    </div>
  );
}
