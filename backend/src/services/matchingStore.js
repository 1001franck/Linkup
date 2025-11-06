import supabase from "../database/db.js";
import logger from "../utils/logger.js";

/**
 * Service de matching intelligent pour les offres d'emploi
 * Calcule un score de compatibilité entre un utilisateur et une offre
 */

/**
 * Calcule le score de matching entre un utilisateur et une offre d'emploi
 * @param {Object} user - Données utilisateur
 * @param {Object} jobOffer - Offre d'emploi
 * @returns {Object} - Score de matching et détails
 */
export async function calculateMatchingScore(user, jobOffer) {
  try {
    logger.debug(`[calculateMatchingScore] Calcul pour utilisateur ${user.id_user} et offre ${jobOffer.id_job_offer}`);
    
    // VÉRIFICATION CRITIQUE : Détection d'incompatibilité de domaine
    const domainIncompatibility = checkDomainIncompatibility(user, jobOffer);
    if (domainIncompatibility.isIncompatible) {
      logger.debug(`[calculateMatchingScore] Domaines incompatibles détectés: ${domainIncompatibility.reason}`);
      // Score très faible pour les domaines incompatibles (max 15%)
      return {
        score: Math.min(15, domainIncompatibility.penaltyScore || 10),
        details: {
          skills: 0,
          location: 0,
          experience: 0,
          title: 0,
          industry: 0,
          contract: 0,
          salary: 0,
          incompatibility: domainIncompatibility.reason
        },
        weights: {},
        recommendation: `Domaines incompatibles: ${domainIncompatibility.reason} ❌`
      };
    }
    
    const scores = {
      skills: 0,
      location: 0,
      experience: 0,
      title: 0,
      industry: 0,
      contract: 0,
      salary: 0,
      total: 0
    };
    
    const weights = {
      skills: 0.30,      // 30% - Le plus important (augmenté)
      title: 0.25,       // 25% - Très important (augmenté)
      industry: 0.20,    // 20% - Très important (augmenté)
      location: 0.10,    // 10% - Moyennement important (réduit)
      experience: 0.10,  // 10% - Moyennement important (réduit)
      contract: 0.03,   // 3% - Peu important
      salary: 0.02      // 2% - Peu important
    };
    
    // 1. MATCHING DES COMPÉTENCES (30%)
    scores.skills = calculateSkillsMatch(user.skills, jobOffer.description, jobOffer.title);
    
    // 2. MATCHING DU TITRE (25%)
    scores.title = calculateTitleMatch(user.job_title, user.bio_pro, jobOffer.title);
    
    // 3. MATCHING DU SECTEUR (20%)
    scores.industry = calculateIndustryMatch(user.skills, jobOffer.industry, user.job_title, user.bio_pro);
    
    // 4. MATCHING DE LA LOCALISATION (10%)
    scores.location = calculateLocationMatch(user.city, user.country, jobOffer.location, jobOffer.remote);
    
    // 5. MATCHING DE L'EXPÉRIENCE (10%)
    scores.experience = calculateExperienceMatch(user.experience_level, jobOffer.experience);
    
    // 6. MATCHING DU TYPE DE CONTRAT (3%)
    scores.contract = calculateContractMatch(user.availability, jobOffer.contract_type);
    
    // 7. MATCHING SALARIAL (2%)
    scores.salary = calculateSalaryMatch(user.experience_level, jobOffer.salary_min, jobOffer.salary_max);
    
    // Calcul du score total pondéré
    scores.total = Math.round(
      scores.skills * weights.skills +
      scores.title * weights.title +
      scores.industry * weights.industry +
      scores.location * weights.location +
      scores.experience * weights.experience +
      scores.contract * weights.contract +
      scores.salary * weights.salary
    );
    
    // S'assurer que le score est entre 0 et 100
    scores.total = Math.max(0, Math.min(100, scores.total));
    
    logger.debug(`[calculateMatchingScore] Scores calculés:`, scores);
    
    return {
      score: scores.total,
      details: scores,
      weights: weights,
      recommendation: getRecommendation(scores.total)
    };
    
  } catch (error) {
    logger.error("[calculateMatchingScore] Erreur:", error);
    return {
      score: 0,
      details: {},
      weights: {},
      recommendation: "Impossible de calculer le matching"
    };
  }
}

/**
 * Détecte les incompatibilités de domaine entre utilisateur et offre
 * @param {Object} user - Données utilisateur
 * @param {Object} jobOffer - Offre d'emploi
 * @returns {Object} - {isIncompatible: boolean, reason: string, penaltyScore: number}
 */
function checkDomainIncompatibility(user, jobOffer) {
  const userText = `${user.job_title || ''} ${user.bio_pro || ''} ${(user.skills || []).join(' ')}`.toLowerCase();
  const jobText = `${jobOffer.title || ''} ${jobOffer.description || ''} ${jobOffer.industry || ''}`.toLowerCase();
  
  // Domaines incompatibles bien définis
  const incompatibleDomains = {
    'medical': {
      keywords: ['médecin', 'docteur', 'médecine', 'medical', 'healthcare', 'hospital', 'clinique', 'patient', 'diagnostic', 'traitement', 'pharmacie', 'pharmaceutique', 'chirurgie', 'infirmier', 'infirmière'],
      incompatibleWith: ['tech', 'informatique', 'développement', 'programming', 'developer', 'coding', 'software', 'web', 'application', 'it', 'technologie', 'ingénieur logiciel']
    },
    'tech': {
      keywords: ['développeur', 'developer', 'programming', 'coding', 'software', 'web', 'application', 'it', 'technologie', 'ingénieur logiciel', 'javascript', 'python', 'java', 'react', 'node'],
      incompatibleWith: ['médecin', 'docteur', 'médecine', 'medical', 'healthcare', 'hospital', 'pharmacie', 'pharmaceutique', 'chirurgie', 'infirmier', 'infirmière']
    },
    'legal': {
      keywords: ['avocat', 'juriste', 'droit', 'legal', 'lawyer', 'attorney', 'justice', 'tribunal', 'juridique'],
      incompatibleWith: ['médecin', 'docteur', 'médecine', 'medical', 'healthcare', 'développeur', 'developer', 'programming', 'coding']
    },
    'education': {
      keywords: ['professeur', 'enseignant', 'teacher', 'education', 'enseignement', 'école', 'université', 'académique'],
      incompatibleWith: ['développeur', 'developer', 'programming', 'coding', 'médecin', 'docteur', 'médecine']
    }
  };
  
  // Vérifier chaque domaine
  for (const [domain, config] of Object.entries(incompatibleDomains)) {
    const userHasDomain = config.keywords.some(keyword => userText.includes(keyword));
    const jobHasIncompatible = config.incompatibleWith.some(incompatible => jobText.includes(incompatible));
    
    if (userHasDomain && jobHasIncompatible) {
      return {
        isIncompatible: true,
        reason: `Domaine ${domain} incompatible avec le secteur du poste`,
        penaltyScore: 5 // Score très faible
      };
    }
    
    // Vérifier l'inverse (job dans un domaine, user dans un domaine incompatible)
    const jobHasDomain = config.keywords.some(keyword => jobText.includes(keyword));
    const userHasIncompatible = config.incompatibleWith.some(incompatible => userText.includes(incompatible));
    
    if (jobHasDomain && userHasIncompatible) {
      return {
        isIncompatible: true,
        reason: `Domaine du poste incompatible avec le profil ${domain}`,
        penaltyScore: 5
      };
    }
  }
  
  return { isIncompatible: false, reason: '', penaltyScore: 0 };
}

/**
 * Calcule le matching des compétences
 * @param {Array} userSkills - Compétences de l'utilisateur
 * @param {String} jobDescription - Description du poste
 * @param {String} jobTitle - Titre du poste
 * @returns {Number} - Score de 0 à 100
 */
function calculateSkillsMatch(userSkills, jobDescription, jobTitle) {
  if (!userSkills || userSkills.length === 0) {
    return 0; // Pas de compétences = 0, pas de score par défaut
  }
  
  // Extraire les compétences mentionnées dans l'offre
  const jobText = `${jobTitle} ${jobDescription}`.toLowerCase();
  const commonSkills = [
    'javascript', 'react', 'node.js', 'python', 'java', 'php', 'sql', 'mongodb',
    'html', 'css', 'typescript', 'vue.js', 'angular', 'express', 'django',
    'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'windows',
    'figma', 'photoshop', 'illustrator', 'sketch', 'adobe', 'design',
    'marketing', 'seo', 'sem', 'analytics', 'google analytics', 'facebook',
    'salesforce', 'hubspot', 'mailchimp', 'wordpress', 'shopify',
    'project management', 'agile', 'scrum', 'kanban', 'jira', 'trello',
    'excel', 'powerpoint', 'word', 'office', 'google suite',
    'communication', 'leadership', 'teamwork', 'problem solving',
    'data analysis', 'statistics', 'machine learning', 'ai', 'blockchain',
    'medical', 'healthcare', 'clinical', 'pharmaceutical', 'diagnostic',
    'legal', 'law', 'juridique', 'droit', 'contract',
    'finance', 'accounting', 'banking', 'investment', 'trading'
  ];
  
  let matchedSkills = 0;
  let totalRelevantSkills = 0;
  
  // Compter les compétences de l'utilisateur qui correspondent
  userSkills.forEach(skill => {
    const skillLower = skill.toLowerCase().trim();
    if (!skillLower) return;
    
    // Vérifier si c'est une compétence technique commune
    const isRelevantSkill = commonSkills.some(commonSkill => 
      skillLower.includes(commonSkill) || commonSkill.includes(skillLower) ||
      skillLower === commonSkill
    );
    
    if (isRelevantSkill) {
      totalRelevantSkills++;
      
      // Vérifier si la compétence est mentionnée dans l'offre
      if (jobText.includes(skillLower) || 
          commonSkills.some(cs => cs.includes(skillLower) && jobText.includes(cs))) {
        matchedSkills++;
      }
    }
  });
  
  // Calculer le score basé sur le ratio de correspondance
  if (totalRelevantSkills === 0) return 0; // Pas de compétences pertinentes = 0
  
  const matchRatio = matchedSkills / totalRelevantSkills;
  return Math.round(matchRatio * 100);
}

/**
 * Calcule le matching de la localisation
 * @param {String} userCity - Ville de l'utilisateur
 * @param {String} userCountry - Pays de l'utilisateur
 * @param {String} jobLocation - Localisation du poste
 * @param {String} jobRemote - Possibilité de télétravail
 * @returns {Number} - Score de 0 à 100
 */
function calculateLocationMatch(userCity, userCountry, jobLocation, jobRemote) {
  // Si télétravail possible, score élevé
  if (jobRemote && (jobRemote.toLowerCase().includes('remote') || jobRemote.toLowerCase().includes('télétravail') || jobRemote.toLowerCase().includes('hybride'))) {
    return 90;
  }
  
  // Si pas de localisation utilisateur ET pas de télétravail, score faible
  if (!userCity && !userCountry) {
    return 0;
  }
  
  // Si pas de localisation job, score faible
  if (!jobLocation) {
    return 0;
  }
  
  const userLocation = `${userCity || ''} ${userCountry || ''}`.toLowerCase().trim();
  const jobLocationLower = jobLocation.toLowerCase();
  
  // Correspondance exacte
  if (userLocation.includes(jobLocationLower) || jobLocationLower.includes(userLocation)) {
    return 100;
  }
  
  // Correspondance partielle (même ville ou région)
  const userCityLower = (userCity || '').toLowerCase();
  const userCountryLower = (userCountry || '').toLowerCase();
  
  if (userCityLower && jobLocationLower.includes(userCityLower)) {
    return 85;
  }
  
  if (userCountryLower && jobLocationLower.includes(userCountryLower)) {
    return 70;
  }
  
  // Correspondance géographique (France, Europe, etc.)
  const regions = {
    'france': ['paris', 'lyon', 'marseille', 'toulouse', 'nantes', 'lille', 'strasbourg'],
    'europe': ['france', 'allemagne', 'espagne', 'italie', 'belgique', 'suisse']
  };
  
  for (const [region, cities] of Object.entries(regions)) {
    if (cities.some(city => jobLocationLower.includes(city))) {
      if (region === 'france' && userCountryLower && userCountryLower.includes('france')) {
        return 60;
      }
      if (region === 'europe' && userCountryLower && userCountryLower.includes('europe')) {
        return 40;
      }
    }
  }
  
  return 0; // Pas de correspondance = 0, pas de score minimal artificiel
}

/**
 * Calcule le matching de l'expérience
 * @param {String} userExperience - Niveau d'expérience utilisateur
 * @param {String} jobExperience - Expérience requise
 * @returns {Number} - Score de 0 à 100
 */
function calculateExperienceMatch(userExperience, jobExperience) {
  if (!userExperience || !jobExperience) {
    return 0; // Pas d'info = 0, pas de score neutre artificiel
  }
  
  const experienceLevels = {
    'débutant': 1,
    'junior': 2,
    'intermédiaire': 3,
    'senior': 4,
    'expert': 5,
    'lead': 6,
    'manager': 7
  };
  
  const userLevel = experienceLevels[userExperience.toLowerCase()] || 3;
  const jobLevel = experienceLevels[jobExperience.toLowerCase()] || 3;
  
  // Score basé sur la proximité des niveaux
  const difference = Math.abs(userLevel - jobLevel);
  
  if (difference === 0) return 100;      // Niveau exact
  if (difference === 1) return 80;       // Niveau proche
  if (difference === 2) return 60;       // Niveau acceptable
  if (difference === 3) return 40;       // Niveau éloigné
  return 10;                             // Niveau très éloigné (réduit de 20 à 10)
}

/**
 * Calcule le matching du titre
 * @param {String} userJobTitle - Titre de l'utilisateur
 * @param {String} userBio - Bio de l'utilisateur
 * @param {String} jobTitle - Titre du poste
 * @returns {Number} - Score de 0 à 100
 */
function calculateTitleMatch(userJobTitle, userBio, jobTitle) {
  if (!jobTitle) return 0; // Pas de titre de job = 0, pas de score par défaut
  
  const userText = `${userJobTitle || ''} ${userBio || ''}`.toLowerCase().trim();
  if (!userText) return 0; // Pas de profil utilisateur = 0
  
  const jobTitleLower = jobTitle.toLowerCase().trim();
  
  // Correspondance exacte
  if (userText.includes(jobTitleLower) || jobTitleLower.includes(userText)) {
    return 100;
  }
  
  // Correspondance partielle (mots-clés communs significatifs)
  const userWords = userText.split(/\s+/).filter(w => w.length > 2);
  const jobWords = jobTitleLower.split(/\s+/).filter(w => w.length > 2);
  
  // Mots communs significatifs (exclure les mots vides comme "de", "le", "la", etc.)
  const stopWords = ['de', 'le', 'la', 'les', 'un', 'une', 'du', 'des', 'et', 'ou', 'pour', 'avec', 'sur', 'dans'];
  const commonWords = userWords.filter(word => 
    jobWords.includes(word) && 
    word.length > 3 && 
    !stopWords.includes(word)
  );
  
  if (commonWords.length > 0) {
    const matchRatio = commonWords.length / Math.max(userWords.length, jobWords.length);
    // Score proportionnel au ratio, mais plafonné à 80%
    return Math.round(matchRatio * 80);
  }
  
  // Correspondance sémantique (groupes de domaines)
  const semanticGroups = {
    'développement': ['développeur', 'dev', 'programmer', 'developer', 'ingénieur logiciel', 'engineer', 'software', 'coding', 'programmation'],
    'design': ['designer', 'design', 'ux', 'ui', 'graphiste', 'graphic', 'creative'],
    'marketing': ['marketing', 'marketeur', 'communication', 'brand', 'publicité', 'advertising'],
    'vente': ['commercial', 'sales', 'business', 'account', 'business development'],
    'management': ['manager', 'lead', 'chef', 'directeur', 'head', 'director'],
    'medical': ['médecin', 'docteur', 'medical', 'healthcare', 'clinique', 'hospital', 'médecine'],
    'legal': ['avocat', 'juriste', 'legal', 'lawyer', 'droit', 'juridique'],
    'finance': ['finance', 'comptable', 'accounting', 'banking', 'investment', 'trading'],
    'education': ['professeur', 'enseignant', 'teacher', 'education', 'enseignement']
  };
  
  for (const [group, keywords] of Object.entries(semanticGroups)) {
    const userHasGroup = keywords.some(keyword => userText.includes(keyword));
    const jobHasGroup = keywords.some(keyword => jobTitleLower.includes(keyword));
    
    if (userHasGroup && jobHasGroup) {
      return 70; // Même domaine sémantique
    }
  }
  
  return 0; // Pas de correspondance = 0, pas de score minimal artificiel
}

/**
 * Calcule le matching du secteur
 * @param {Array} userSkills - Compétences utilisateur
 * @param {String} jobIndustry - Secteur du poste
 * @param {String} userJobTitle - Titre de l'utilisateur
 * @param {String} userBio - Bio de l'utilisateur
 * @returns {Number} - Score de 0 à 100
 */
function calculateIndustryMatch(userSkills, jobIndustry, userJobTitle, userBio) {
  if (!jobIndustry) return 0; // Pas de secteur = 0
  
  const userText = `${userJobTitle || ''} ${userBio || ''} ${(userSkills || []).join(' ')}`.toLowerCase();
  const jobIndustryLower = jobIndustry.toLowerCase();
  
  const industrySkills = {
    'tech': ['javascript', 'python', 'java', 'react', 'node.js', 'programming', 'development', 'développeur', 'developer', 'software', 'web', 'application', 'coding'],
    'informatique': ['javascript', 'python', 'java', 'react', 'node.js', 'programming', 'development', 'développeur', 'developer', 'software', 'web', 'application', 'coding', 'it', 'technologie'],
    'design': ['figma', 'photoshop', 'illustrator', 'design', 'ux', 'ui', 'graphic', 'graphiste', 'creative'],
    'marketing': ['marketing', 'seo', 'analytics', 'social media', 'advertising', 'brand', 'communication', 'publicité'],
    'finance': ['finance', 'accounting', 'banking', 'investment', 'trading', 'comptable', 'financier'],
    'healthcare': ['medical', 'health', 'pharmaceutical', 'clinical', 'research', 'médecin', 'docteur', 'médecine', 'healthcare', 'hospital', 'clinique'],
    'medical': ['medical', 'health', 'pharmaceutical', 'clinical', 'research', 'médecin', 'docteur', 'médecine', 'healthcare', 'hospital', 'clinique'],
    'éducation': ['teaching', 'education', 'training', 'learning', 'academic', 'professeur', 'enseignant', 'enseignement'],
    'education': ['teaching', 'education', 'training', 'learning', 'academic', 'professeur', 'enseignant', 'enseignement'],
    'legal': ['legal', 'law', 'juridique', 'droit', 'avocat', 'juriste', 'lawyer', 'contract'],
    'juridique': ['legal', 'law', 'juridique', 'droit', 'avocat', 'juriste', 'lawyer', 'contract']
  };
  
  // Chercher une correspondance dans les industries définies
  for (const [industry, skills] of Object.entries(industrySkills)) {
    if (jobIndustryLower.includes(industry) || industry.includes(jobIndustryLower)) {
      const matchingSkills = skills.filter(skill => userText.includes(skill));
      if (matchingSkills.length > 0) {
        // Score basé sur le ratio de compétences correspondantes
        return Math.round((matchingSkills.length / skills.length) * 100);
      } else {
        // Industrie correspond mais aucune compétence correspondante = score très faible
        return 10;
      }
    }
  }
  
  return 0; // Pas de correspondance = 0, pas de score neutre artificiel
}

/**
 * Calcule le matching du type de contrat
 * @param {Boolean} userAvailability - Disponibilité utilisateur
 * @param {String} jobContractType - Type de contrat
 * @returns {Number} - Score de 0 à 100
 */
function calculateContractMatch(userAvailability, jobContractType) {
  if (!jobContractType) return 0; // Pas de type de contrat = 0
  
  const contractTypeLower = jobContractType.toLowerCase();
  
  // Si utilisateur disponible, score élevé pour tous types
  if (userAvailability) {
    return 90;
  }
  
  // Score basé sur le type de contrat (mais moins important car c'est seulement 3%)
  if (contractTypeLower.includes('cdi')) return 80;
  if (contractTypeLower.includes('cdd')) return 70;
  if (contractTypeLower.includes('stage')) return 60;
  if (contractTypeLower.includes('freelance')) return 50;
  
  return 0; // Pas de correspondance = 0
}

/**
 * Calcule le matching salarial
 * @param {String} userExperience - Niveau d'expérience utilisateur
 * @param {Number} jobSalaryMin - Salaire minimum
 * @param {Number} jobSalaryMax - Salaire maximum
 * @returns {Number} - Score de 0 à 100
 */
function calculateSalaryMatch(userExperience, jobSalaryMin, jobSalaryMax) {
  if (!jobSalaryMin && !jobSalaryMax) return 0; // Pas d'info salariale = 0
  
  // Salaires moyens par niveau d'expérience (en France)
  const averageSalaries = {
    'débutant': 30000,
    'junior': 35000,
    'intermédiaire': 45000,
    'senior': 60000,
    'expert': 80000,
    'lead': 90000,
    'manager': 100000
  };
  
  const userExpectedSalary = averageSalaries[userExperience?.toLowerCase()] || 45000;
  const jobSalary = jobSalaryMax || jobSalaryMin || 45000;
  
  // Score basé sur la proximité du salaire
  const difference = Math.abs(userExpectedSalary - jobSalary);
  const percentageDifference = (difference / userExpectedSalary) * 100;
  
  if (percentageDifference <= 10) return 100;  // Très proche
  if (percentageDifference <= 20) return 80;   // Proche
  if (percentageDifference <= 30) return 60;   // Acceptable
  if (percentageDifference <= 50) return 40;   // Éloigné
  return 10;                                   // Très éloigné (réduit de 20 à 10)
}

/**
 * Génère une recommandation basée sur le score
 * @param {Number} score - Score de matching
 * @returns {String} - Recommandation
 */
function getRecommendation(score) {
  if (score >= 90) return "Correspondance parfaite ! 🎯";
  if (score >= 80) return "Excellente correspondance ! ⭐";
  if (score >= 70) return "Bonne correspondance ! 👍";
  if (score >= 60) return "Correspondance correcte ✅";
  if (score >= 50) return "Correspondance moyenne ⚖️";
  if (score >= 40) return "Correspondance faible ⚠️";
  return "Correspondance très faible ❌";
}

/**
 * Récupère les offres d'emploi avec scores de matching pour un utilisateur
 * @param {Number} userId - ID de l'utilisateur
 * @param {Object} options - Options de recherche
 * @returns {Array} - Liste des offres avec scores
 */
export async function getMatchingJobs(userId, options = {}) {
  try {
    logger.debug(`[getMatchingJobs] Recherche pour utilisateur ${userId}`);
    
    // Récupérer les données utilisateur
    const { data: user, error: userError } = await supabase
      .from('user_')
      .select('*')
      .eq('id_user', userId)
      .single();
    
    if (userError || !user) {
      logger.error("[getMatchingJobs] Utilisateur non trouvé:", userError);
      return [];
    }
    
    // Récupérer les offres d'emploi
    const { data: jobs, error: jobsError } = await supabase
      .from('job_offer')
      .select(`
        *,
        company (
          id_company,
          name,
          logo,
          industry,
          city,
          country,
          website
        )
      `)
      .order('published_at', { ascending: false })
      .limit(options.limit || 50);
    
    if (jobsError) {
      logger.error("[getMatchingJobs] Erreur récupération offres:", jobsError);
      return [];
    }
    
    // Calculer les scores de matching pour chaque offre
    const jobsWithScores = await Promise.all(
      jobs.map(async (job) => {
        const matchingResult = await calculateMatchingScore(user, job);
        return {
          ...job,
          matching: matchingResult
        };
      })
    );
    
    // Trier par score de matching (décroissant)
    jobsWithScores.sort((a, b) => b.matching.score - a.matching.score);
    
    logger.debug(`[getMatchingJobs] ${jobsWithScores.length} offres avec scores calculés`);
    
    return jobsWithScores;
    
  } catch (error) {
    logger.error("[getMatchingJobs] Erreur:", error);
    return [];
  }
}

/**
 * Récupère les utilisateurs avec scores de matching pour une offre
 * @param {Number} jobId - ID de l'offre
 * @param {Object} options - Options de recherche
 * @returns {Array} - Liste des utilisateurs avec scores
 */
export async function getMatchingUsers(jobId, options = {}) {
  try {
    logger.debug(`[getMatchingUsers] Recherche pour offre ${jobId}`);
    
    // Récupérer l'offre d'emploi
    const { data: job, error: jobError } = await supabase
      .from('job_offer')
      .select(`
        *,
        company (
          id_company,
          name,
          industry,
          city,
          country,
          website
        )
      `)
      .eq('id_job_offer', jobId)
      .single();
    
    if (jobError || !job) {
      logger.error("[getMatchingUsers] Offre non trouvée:", jobError);
      return [];
    }
    
    // Récupérer les utilisateurs
    const { data: users, error: usersError } = await supabase
      .from('user_')
      .select('*')
      .eq('role', 'user')
      .limit(options.limit || 100);
    
    if (usersError) {
      logger.error("[getMatchingUsers] Erreur récupération utilisateurs:", usersError);
      return [];
    }
    
    // Calculer les scores de matching pour chaque utilisateur
    const usersWithScores = await Promise.all(
      users.map(async (user) => {
        const matchingResult = await calculateMatchingScore(user, job);
        return {
          ...user,
          matching: matchingResult
        };
      })
    );
    
    // Trier par score de matching (décroissant)
    usersWithScores.sort((a, b) => b.matching.score - a.matching.score);
    
    logger.debug(`[getMatchingUsers] ${usersWithScores.length} utilisateurs avec scores calculés`);
    
    return usersWithScores;
    
  } catch (error) {
    logger.error("[getMatchingUsers] Erreur:", error);
    return [];
  }
}
