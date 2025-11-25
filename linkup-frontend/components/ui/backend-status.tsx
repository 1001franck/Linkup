/**
 * Composant pour afficher le statut de connexion au backend
 */

"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export function BackendStatus() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const isOnline = await apiClient.testConnection();
      setIsBackendOnline(isOnline);
    } catch (error) {
      setIsBackendOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  if (isBackendOnline === null) {
    return null; // Pas encore vérifié
  }

  if (isBackendOnline) {
    return null; // Backend en ligne, pas besoin d'afficher
  }

  return (
    <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong className="text-red-800 dark:text-red-200">Backend non accessible</strong>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            Le serveur backend n'est pas démarré. Veuillez démarrer le backend avec{' '}
            <code className="bg-red-100 dark:bg-red-800 px-1 rounded">npm run dev</code> dans le dossier backend.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkBackendStatus}
          disabled={isChecking}
          className="ml-4 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-800"
        >
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
