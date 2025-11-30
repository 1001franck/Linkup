/**
 * Composant Modal de Visualisation de Documents
 * Affiche les documents (CV, lettre de motivation) dans une modal
 */

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { File, Download, X } from "lucide-react";

interface DocumentViewerProps {
  isOpen: boolean;
  document: {
    type: "cv" | "cover_letter" | "portfolio";
    url: string;
    fileName: string;
  } | null;
  onClose: () => void;
}

export function DocumentViewer({ isOpen, document: doc, onClose }: DocumentViewerProps) {
  if (!isOpen || !doc) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.fileName;
    link.click();
  };

  const getDocumentTitle = () => {
    switch (doc.type) {
      case "cv":
        return "CV";
      case "cover_letter":
        return "Lettre de motivation";
      case "portfolio":
        return "Portfolio";
      default:
        return "Document";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-primary" />
            <div>
              <Typography variant="h4" className="font-semibold text-foreground">
                {getDocumentTitle()}
              </Typography>
              <Typography variant="muted" className="text-xs">
                {doc.fileName}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-hidden">
          {doc.url && (
            <iframe
              src={doc.url}
              className="w-full h-full min-h-[600px] border-0"
              title={doc.fileName}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

