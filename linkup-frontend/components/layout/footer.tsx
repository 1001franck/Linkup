/**
 * Composant Footer - Organism
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du pied de page
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";
import { 
  Linkedin, 
  Twitter, 
  Github, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Entreprise",
      links: [
        { label: "À propos", href: "/about" },
        { label: "Carrières", href: "/careers" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'aide", href: "/help" },
        { label: "Contact", href: "/contact" },
        { label: "Statut", href: "/status" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Confidentialité", href: "/privacy" },
        { label: "Conditions", href: "/terms" },
        { label: "Cookies", href: "/cookies" },
        { label: "RGPD", href: "/gdpr" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/linkup", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/linkup", label: "Twitter" },
    { icon: Github, href: "https://github.com/linkup", label: "GitHub" },
  ];

  return (
    <footer className={`bg-muted/50 border-t ${className}`}>
      <Container>
        <div className="py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="h-24 w-24 flex items-center justify-center">
                  <img 
                    src="/assets/reallogo.png" 
                    alt="LinkUp Logo" 
                    className="h-20 w-20 object-contain"
                  />
                </div>
              </div>
              <Typography variant="muted" className="mb-6 leading-relaxed">
                La plateforme qui connecte les talents aux opportunités. 
                Trouvez votre prochain emploi ou recrutez les meilleurs profils.
              </Typography>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>contact@linkup.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+33 6 95 49 35 23</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Toulouse, France</span>
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <Typography variant="h6" className="font-semibold text-foreground">
                  {section.title}
                </Typography>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Footer */}
          <div className="mt-16 pt-8 border-t border-border space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <Typography variant="small" className="text-muted-foreground">
                © {currentYear} LinkUp. Tous droits réservés.
              </Typography>
              
              {/* Social Icons */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <div
                    key={social.label}
                    className="text-muted-foreground"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Développeurs - Placement stratégique et visible */}
            <div className="flex flex-col items-center md:items-start pt-4 border-t border-border/50">
              <Typography variant="small" className="text-muted-foreground text-sm mb-2 font-medium">
                Développé par
              </Typography>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-foreground font-medium">
                <span>Harel Franck FOTSI</span>
                <span className="hidden md:inline text-muted-foreground">•</span>
                <span>Yousra ARROUI</span>
                <span className="hidden md:inline text-muted-foreground">•</span>
                <span>Sara COLOMBEL</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
