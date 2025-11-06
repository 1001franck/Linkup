/**
 * Utilitaire pour calculer le score de matching de manière cohérente
 * Utilisé dans toutes les pages pour garantir la cohérence du score
 */

/**
 * Calcule un score de match déterministe basé sur les données réelles
 * @param user - Données utilisateur
 * @param jobOffer - Données de l'offre d'emploi
 * @returns Score de match entre 50 et 100
 */
export function calculateMatchScore(user: any, jobOffer: any): number {
  let score = 50; // Score de base
  
  // 1. Match des compétences (40% du score)
  const userSkills = Array.isArray(user?.skills) 
    ? user.skills.map((s: string) => s.toLowerCase().trim())
    : (user?.skills ? user.skills.split(',').map((s: string) => s.toLowerCase().trim()) : []);
  
  const jobRequirements = Array.isArray(jobOffer?.requirements)
    ? jobOffer.requirements.map((r: string) => r.toLowerCase().trim())
    : (jobOffer?.requirements ? jobOffer.requirements.split(',').map((r: string) => r.toLowerCase().trim()) : []);
  
  if (jobRequirements.length > 0 && userSkills.length > 0) {
    const matchingSkills = userSkills.filter((skill: string) => 
      jobRequirements.some((req: string) => req.includes(skill) || skill.includes(req))
    );
    const skillMatchRatio = matchingSkills.length / jobRequirements.length;
    score += Math.min(skillMatchRatio * 40, 40); // Max 40 points pour les compétences
  }
  
  // 2. Match du titre du poste (20% du score)
  const userJobTitle = (user?.job_title || '').toLowerCase();
  const jobTitle = (jobOffer?.title || '').toLowerCase();
  if (userJobTitle && jobTitle) {
    // Vérifier si des mots-clés du titre correspondent
    const userTitleWords = userJobTitle.split(/\s+/);
    const jobTitleWords = jobTitle.split(/\s+/);
    const matchingWords = userTitleWords.filter((word: string) => 
      jobTitleWords.some((jobWord: string) => jobWord.includes(word) || word.includes(jobWord))
    );
    if (matchingWords.length > 0) {
      score += Math.min((matchingWords.length / Math.max(userTitleWords.length, jobTitleWords.length)) * 20, 20);
    }
  }
  
  // 3. Match de l'expérience (20% du score)
  const userExperience = (user?.experience_level || '').toLowerCase();
  const jobExperience = (jobOffer?.experience || '').toLowerCase();
  if (userExperience && jobExperience) {
    const experienceLevels = ['junior', 'débutant', 'intermédiaire', 'senior', 'expert'];
    const userLevel = experienceLevels.findIndex(level => userExperience.includes(level));
    const jobLevel = experienceLevels.findIndex(level => jobExperience.includes(level));
    
    if (userLevel >= 0 && jobLevel >= 0) {
      // Plus le niveau est proche, plus le score est élevé
      const levelDiff = Math.abs(userLevel - jobLevel);
      const experienceScore = (1 - levelDiff / experienceLevels.length) * 20;
      score += experienceScore;
    }
  }
  
  // 4. Présence de documents (10% du score)
  // Bonus de base pour avoir postulé
  score += 5; // Bonus de base pour avoir postulé
  
  // S'assurer que le score est entre 50 et 100
  return Math.min(Math.max(Math.round(score), 50), 100);
}

