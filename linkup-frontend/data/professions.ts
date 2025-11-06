export const professions = [
  // Développement & IT
  "Développeur Frontend", "Développeur Backend", "Développeur Full Stack", "Développeur React", "Développeur Vue.js", "Développeur Angular",
  "Développeur Node.js", "Développeur Python", "Développeur Java", "Développeur PHP", "Développeur C#", "Développeur C++",
  "DevOps Engineer", "Ingénieur Cloud", "Architecte Logiciel", "Chef de Projet IT", "Scrum Master", "Product Owner",
  "Data Scientist", "Data Analyst", "Data Engineer", "Machine Learning Engineer", "Cybersécurité", "Administrateur Système",
  
  // Design & Créatif
  "UX Designer", "UI Designer", "Graphiste", "Web Designer", "Motion Designer", "Illustrateur", "Photographe",
  "Directeur Artistique", "Concepteur Rédacteur", "Community Manager", "Social Media Manager", "Influenceur",
  
  // Marketing & Communication
  "Chef de Projet Marketing", "Responsable Communication", "Chargé de Communication", "Attaché de Presse",
  "Marketing Digital", "SEO Manager", "SEM Manager", "Growth Hacker", "Analyste Marketing", "Brand Manager",
  "Product Manager", "Marketing Manager", "Digital Marketing Manager", "Content Manager", "Traffic Manager",
  
  // Commercial & Vente
  "Commercial", "Chargé de Clientèle", "Business Developer", "Account Manager", "Sales Manager", "Directeur Commercial",
  "Ingénieur Commercial", "Chargé d'Affaires", "Responsable Ventes", "Chef de Secteur", "Télévendeur",
  
  // RH & Management
  "Responsable RH", "Chargé de Recrutement", "Chargé de Formation", "Gestionnaire de Paie", "Assistant RH",
  "Directeur RH", "Consultant RH", "Coach Professionnel", "Formateur", "Chef de Projet RH",
  
  // Finance & Comptabilité
  "Comptable", "Contrôleur de Gestion", "Analyste Financier", "Auditeur", "Directeur Financier", "Trésorier",
  "Gestionnaire de Patrimoine", "Conseiller Financier", "Expert-Comptable", "Commissaire aux Comptes",
  
  // Juridique
  "Avocat", "Juriste", "Notaire", "Huissier", "Greffier", "Magistrat", "Conseiller Juridique",
  
  // Santé & Social
  "Médecin", "Infirmier", "Pharmacien", "Kinésithérapeute", "Psychologue", "Assistante Sociale", "Éducateur",
  "Aide-Soignant", "Sage-Femme", "Dentiste", "Vétérinaire", "Ostéopathe", "Podologue",
  
  // Éducation & Formation
  "Professeur", "Enseignant", "Formateur", "Éducateur", "Conseiller d'Orientation", "Directeur d'École",
  "Inspecteur d'Académie", "Chercheur", "Maître de Conférences", "Professeur des Écoles",
  
  // Ingénierie & Technique
  "Ingénieur", "Ingénieur Civil", "Ingénieur Mécanique", "Ingénieur Électrique", "Ingénieur Informatique",
  "Ingénieur Chimiste", "Ingénieur Aéronautique", "Ingénieur Automobile", "Ingénieur BTP", "Architecte",
  "Géomètre", "Technicien", "Chef de Chantier", "Conducteur de Travaux",
  
  // Hôtellerie & Restauration
  "Chef de Cuisine", "Cuisinier", "Serveur", "Barman", "Sommelier", "Directeur d'Hôtel", "Réceptionniste",
  "Chef de Rang", "Commis de Cuisine", "Pâtissier", "Boulanger", "Traiteur",
  
  // Transport & Logistique
  "Chauffeur", "Livreur", "Transporteur", "Logisticien", "Responsable Logistique", "Chef de Quai",
  "Magasinier", "Préparateur de Commandes", "Responsable Transport", "Dispatcher",
  
  // Vente & Commerce
  "Vendeur", "Conseiller de Vente", "Chef de Rayon", "Directeur de Magasin", "Responsable Merchandising",
  "Acheteur", "Responsable Achat", "Category Manager", "Visual Merchandiser", "Chef de Produit",
  
  // Autres
  "Consultant", "Freelance", "Entrepreneur", "Dirigeant", "Directeur Général", "PDG", "Gérant",
  "Secrétaire", "Assistant", "Agent d'Accueil", "Standardiste", "Réceptionniste", "Agent de Sécurité",
  "Nettoyeur", "Agent d'Entretien", "Jardinier", "Plombier", "Électricien", "Peintre", "Maçon",
  "Étudiant", "Stagiaire", "Apprenti", "Demandeur d'Emploi", "Retraité", "Indépendant", "Auto-entrepreneur"
];

export const getProfessionSuggestions = (query: string, limit: number = 10): string[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return professions
    .filter(profession => profession.toLowerCase().includes(lowerQuery))
    .slice(0, limit);
};
