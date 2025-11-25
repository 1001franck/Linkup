/**
 * Utilitaires de validation pour les entrées utilisateur
 * Validation stricte des emails, mots de passe, etc.
 */

/**
 * Valide le format d'un email
 * @param {string} email - Email à valider
 * @returns {boolean} - true si l'email est valide
 */
export function isValidEmail(email) {
	if (!email || typeof email !== 'string') {
		return false;
	}
	
	// Regex pour validation email (RFC 5322 simplifié)
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	// Vérifier la longueur max (320 caractères selon RFC)
	if (email.length > 320) {
		return false;
	}
	
	return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Valide la force d'un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {{valid: boolean, errors: string[]}} - Résultat de la validation
 */
export function validatePasswordStrength(password) {
	const errors = [];
	
	if (!password || typeof password !== 'string') {
		return { valid: false, errors: ['Le mot de passe est requis'] };
	}
	
	// Longueur minimale
	if (password.length < 8) {
		errors.push('Le mot de passe doit contenir au moins 8 caractères');
	}
	
	// Longueur maximale (pour éviter les attaques DoS)
	if (password.length > 128) {
		errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
	}
	
	// Au moins une majuscule
	if (!/[A-Z]/.test(password)) {
		errors.push('Le mot de passe doit contenir au moins une majuscule');
	}
	
	// Au moins une minuscule
	if (!/[a-z]/.test(password)) {
		errors.push('Le mot de passe doit contenir au moins une minuscule');
	}
	
	// Au moins un chiffre
	if (!/[0-9]/.test(password)) {
		errors.push('Le mot de passe doit contenir au moins un chiffre');
	}
	
	// Au moins un caractère spécial
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		errors.push('Le mot de passe doit contenir au moins un caractère spécial');
	}
	
	return {
		valid: errors.length === 0,
		errors: errors
	};
}

/**
 * Sanitize une chaîne de caractères (supprime les caractères dangereux)
 * @param {string} str - Chaîne à sanitizer
 * @param {number} maxLength - Longueur maximale (optionnel)
 * @returns {string} - Chaîne sanitizée
 */
export function sanitizeString(str, maxLength = 255) {
	if (!str || typeof str !== 'string') {
		return '';
	}
	
	// Trim et limiter la longueur
	let sanitized = str.trim().slice(0, maxLength);
	
	// Supprimer les caractères de contrôle (sauf \n, \r, \t)
	sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
	
	return sanitized;
}

/**
 * Valide un numéro de téléphone (format simple)
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} - true si le numéro est valide
 */
export function isValidPhone(phone) {
	if (!phone || typeof phone !== 'string') {
		return false;
	}
	
	// Supprimer les espaces, tirets, parenthèses
	const cleaned = phone.replace(/[\s\-\(\)]/g, '');
	
	// Vérifier que c'est uniquement des chiffres et + (pour l'international)
	const phoneRegex = /^\+?[0-9]{10,15}$/;
	
	return phoneRegex.test(cleaned);
}

/**
 * Valide et sanitize les données utilisateur pour l'inscription
 * @param {object} data - Données utilisateur
 * @returns {{valid: boolean, errors: string[], sanitized: object}} - Résultat de la validation
 */
export function validateUserSignup(data) {
	const errors = [];
	const sanitized = {};
	
	// Email
	if (!data.email) {
		errors.push('L\'email est requis');
	} else if (!isValidEmail(data.email)) {
		errors.push('Format d\'email invalide');
	} else {
		sanitized.email = data.email.trim().toLowerCase();
	}
	
	// Password
	if (!data.password) {
		errors.push('Le mot de passe est requis');
	} else {
		const passwordValidation = validatePasswordStrength(data.password);
		if (!passwordValidation.valid) {
			errors.push(...passwordValidation.errors);
		}
		// Ne pas inclure le mot de passe dans sanitized (il sera hashé)
	}
	
	// Firstname
	if (data.firstname) {
		sanitized.firstname = sanitizeString(data.firstname, 100);
		if (sanitized.firstname.length < 1) {
			errors.push('Le prénom est requis');
		}
	} else {
		errors.push('Le prénom est requis');
	}
	
	// Lastname
	if (data.lastname) {
		sanitized.lastname = sanitizeString(data.lastname, 100);
		if (sanitized.lastname.length < 1) {
			errors.push('Le nom est requis');
		}
	} else {
		errors.push('Le nom est requis');
	}
	
	// Phone (optionnel mais validé si fourni)
	if (data.phone) {
		if (!isValidPhone(data.phone)) {
			errors.push('Format de téléphone invalide');
		} else {
			sanitized.phone = sanitizeString(data.phone, 20);
		}
	}
	
	// Bio_pro (optionnel)
	if (data.bio_pro) {
		sanitized.bio_pro = sanitizeString(data.bio_pro, 1000);
	}
	
	// City (optionnel)
	if (data.city) {
		sanitized.city = sanitizeString(data.city, 100);
	}
	
	// Country (optionnel)
	if (data.country) {
		sanitized.country = sanitizeString(data.country, 100);
	}
	
	// Role - NE PAS PERMETTRE L'INJECTION DE ROLE
	// Le rôle doit toujours être défini par le serveur
	sanitized.role = 'user'; // Par défaut, toujours 'user'
	
	return {
		valid: errors.length === 0,
		errors: errors,
		sanitized: sanitized
	};
}

/**
 * Valide et sanitize les données entreprise pour l'inscription
 * @param {object} data - Données entreprise
 * @returns {{valid: boolean, errors: string[], sanitized: object}} - Résultat de la validation
 */
export function validateCompanySignup(data) {
	const errors = [];
	const sanitized = {};
	
	// Name (obligatoire)
	if (!data.name) {
		errors.push('Le nom de l\'entreprise est requis');
	} else {
		sanitized.name = sanitizeString(data.name, 200);
		if (sanitized.name.length < 2) {
			errors.push('Le nom de l\'entreprise doit contenir au moins 2 caractères');
		}
	}
	
	// Description (obligatoire)
	if (!data.description) {
		errors.push('La description est requise');
	} else {
		sanitized.description = sanitizeString(data.description, 2000);
		if (sanitized.description.length < 10) {
			errors.push('La description doit contenir au moins 10 caractères');
		}
	}
	
	// Recruiter mail (obligatoire)
	if (!data.recruiter_mail) {
		errors.push('L\'email du recruteur est requis');
	} else if (!isValidEmail(data.recruiter_mail)) {
		errors.push('Format d\'email du recruteur invalide');
	} else {
		sanitized.recruiter_mail = data.recruiter_mail.trim().toLowerCase();
	}
	
	// Password (obligatoire avec validation de force)
	if (!data.password) {
		errors.push('Le mot de passe est requis');
	} else {
		const passwordValidation = validatePasswordStrength(data.password);
		if (!passwordValidation.valid) {
			errors.push(...passwordValidation.errors);
		}
		// Ne pas inclure le mot de passe dans sanitized (il sera hashé)
	}
	
	// Website (optionnel mais validé si fourni)
	if (data.website) {
		const websiteRegex = /^https?:\/\/.+/i;
		if (!websiteRegex.test(data.website)) {
			errors.push('L\'URL du site web doit commencer par http:// ou https://');
		} else {
			sanitized.website = sanitizeString(data.website, 500);
		}
	}
	
	// Recruiter firstname (optionnel)
	if (data.recruiter_firstname) {
		sanitized.recruiter_firstname = sanitizeString(data.recruiter_firstname, 100);
	}
	
	// Recruiter lastname (optionnel)
	if (data.recruiter_lastname) {
		sanitized.recruiter_lastname = sanitizeString(data.recruiter_lastname, 100);
	}
	
	// Recruiter phone (optionnel mais validé si fourni)
	if (data.recruiter_phone) {
		if (!isValidPhone(data.recruiter_phone)) {
			errors.push('Format de téléphone du recruteur invalide');
		} else {
			sanitized.recruiter_phone = sanitizeString(data.recruiter_phone, 20);
		}
	}
	
	// Industry (optionnel)
	if (data.industry) {
		sanitized.industry = sanitizeString(data.industry, 100);
	}
	
	// City (optionnel)
	if (data.city) {
		sanitized.city = sanitizeString(data.city, 100);
	}
	
	// Zip code (optionnel)
	if (data.zip_code) {
		sanitized.zip_code = sanitizeString(data.zip_code, 20);
	}
	
	// Country (optionnel)
	if (data.country) {
		sanitized.country = sanitizeString(data.country, 100);
	}
	
	// Employees number (optionnel)
	if (data.employees_number) {
		sanitized.employees_number = sanitizeString(data.employees_number, 50);
	}
	
	// Founded year (optionnel mais validé si fourni)
	if (data.founded_year !== undefined && data.founded_year !== null) {
		const year = parseInt(data.founded_year);
		const currentYear = new Date().getFullYear();
		if (isNaN(year) || year < 1800 || year > currentYear) {
			errors.push(`L'année de fondation doit être entre 1800 et ${currentYear}`);
		} else {
			sanitized.founded_year = year;
		}
	}
	
	return {
		valid: errors.length === 0,
		errors: errors,
		sanitized: sanitized
	};
}

