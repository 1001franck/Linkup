import { z } from 'zod';

/**
 * Utilitaires de validation pour les entrées utilisateur
 * Validation stricte des emails, mots de passe, etc.
 */

const phoneRegex = /^\+?[0-9]{10,15}$/;
const websiteRegex = /^https?:\/\/.+/i;
const currentYear = new Date().getFullYear();

// Schéma de mot de passe partagé (force + contraintes)
export const passwordSchema = z
	.string({ required_error: 'Le mot de passe est requis' })
	.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
	.max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
	.refine((value) => /[A-Z]/.test(value), 'Le mot de passe doit contenir au moins une majuscule')
	.refine((value) => /[a-z]/.test(value), 'Le mot de passe doit contenir au moins une minuscule')
	.refine((value) => /[0-9]/.test(value), 'Le mot de passe doit contenir au moins un chiffre')
	.refine(
		(value) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
		'Le mot de passe doit contenir au moins un caractère spécial'
	);

const emailSchema = z
	.string({ required_error: "L'email est requis" })
	.trim()
	.min(1, "L'email est requis")
	.max(320, "L'email ne peut pas dépasser 320 caractères")
	.email("Format d'email invalide")
	.transform((value) => value.toLowerCase());

const optionalString = (max, label) =>
	z.preprocess(
		(value) => {
			if (typeof value !== 'string') return undefined;
			const trimmed = value.trim();
			return trimmed.length ? trimmed : undefined;
		},
		z.string().max(max, `${label} ne peut pas dépasser ${max} caractères`).optional()
	);

const optionalPhoneSchema = z.preprocess((value) => {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	if (!trimmed) return undefined;
	return trimmed.replace(/[\s-()]/g, '');
}, z.string().regex(phoneRegex, 'Format de téléphone invalide').optional());

const foundedYearSchema = z.preprocess(
	(value) => {
		if (value === undefined || value === null || value === '') return undefined;
		const parsed = Number(value);
		return Number.isNaN(parsed) ? NaN : parsed;
	},
	z
		.number({
			invalid_type_error: "L'année de fondation doit être un nombre",
		})
		.int("L'année de fondation doit être un nombre entier")
		.min(1800, "L'année de fondation doit être entre 1800 et l'année actuelle")
		.max(currentYear, `L'année de fondation doit être entre 1800 et ${currentYear}`)
		.optional()
);

const userSignupSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	firstname: z
		.string({ required_error: 'Le prénom est requis' })
		.trim()
		.min(1, 'Le prénom est requis')
		.max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
	lastname: z
		.string({ required_error: 'Le nom est requis' })
		.trim()
		.min(1, 'Le nom est requis')
		.max(100, 'Le nom ne peut pas dépasser 100 caractères'),
	phone: optionalPhoneSchema,
	bio_pro: optionalString(1000, 'La bio professionnelle'),
	city: optionalString(100, 'La ville'),
	country: optionalString(100, 'Le pays'),
});

const companySignupSchema = z.object({
	name: z
		.string({ required_error: "Le nom de l'entreprise est requis" })
		.trim()
		.min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
		.max(200, "Le nom de l'entreprise ne peut pas dépasser 200 caractères"),
	description: z
		.string({ required_error: 'La description est requise' })
		.trim()
		.min(10, 'La description doit contenir au moins 10 caractères')
		.max(2000, 'La description ne peut pas dépasser 2000 caractères'),
	recruiter_mail: emailSchema,
	password: passwordSchema,
	website: z.preprocess(
		(value) => {
			if (typeof value !== 'string') return undefined;
			const trimmed = value.trim();
			return trimmed.length ? trimmed : undefined;
		},
		z
			.string()
			.max(500, "L'URL du site web ne peut pas dépasser 500 caractères")
			.refine(
				(value) => websiteRegex.test(value),
				"L'URL du site web doit commencer par http:// ou https://"
			)
			.optional()
	),
	recruiter_firstname: optionalString(100, 'Le prénom du recruteur'),
	recruiter_lastname: optionalString(100, 'Le nom du recruteur'),
	recruiter_phone: optionalPhoneSchema,
	industry: optionalString(100, "Le secteur d'activité"),
	city: optionalString(100, 'La ville'),
	zip_code: optionalString(20, 'Le code postal'),
	country: optionalString(100, 'Le pays'),
	employees_number: optionalString(50, "Le nombre d'employés"),
	founded_year: foundedYearSchema,
});

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
	const result = passwordSchema.safeParse(password);

	if (result.success) {
		return { valid: true, errors: [] };
	}

	return {
		valid: false,
		errors: formatZodErrors(result.error.issues),
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
	// eslint-disable-next-line no-control-regex
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
	const cleaned = phone.replace(/[\s-()]/g, '');

	// Vérifier que c'est uniquement des chiffres et + (pour l'international)
	return phoneRegex.test(cleaned);
}

/**
 * Valide et sanitize les données utilisateur pour l'inscription (Zod)
 * @param {object} data - Données utilisateur
 * @returns {{valid: boolean, errors: string[], sanitized: object}} - Résultat de la validation
 */
export function validateUserSignup(data) {
	const result = userSignupSchema.safeParse(data);

	if (!result.success) {
		return {
			valid: false,
			errors: formatZodErrors(result.error.issues),
			sanitized: {},
		};
	}

	const parsed = result.data;
	const sanitized = {
		email: sanitizeString(parsed.email, 320).toLowerCase(),
		firstname: sanitizeString(parsed.firstname, 100),
		lastname: sanitizeString(parsed.lastname, 100),
		role: 'user',
	};

	if (parsed.phone) sanitized.phone = sanitizeString(parsed.phone, 20);
	if (parsed.bio_pro) sanitized.bio_pro = sanitizeString(parsed.bio_pro, 1000);
	if (parsed.city) sanitized.city = sanitizeString(parsed.city, 100);
	if (parsed.country) sanitized.country = sanitizeString(parsed.country, 100);

	return {
		valid: true,
		errors: [],
		sanitized,
	};
}

/**
 * Valide et sanitize les données entreprise pour l'inscription (Zod)
 * @param {object} data - Données entreprise
 * @returns {{valid: boolean, errors: string[], sanitized: object}} - Résultat de la validation
 */
export function validateCompanySignup(data) {
	const result = companySignupSchema.safeParse(data);

	if (!result.success) {
		return {
			valid: false,
			errors: formatZodErrors(result.error.issues),
			sanitized: {},
		};
	}

	const parsed = result.data;
	const sanitized = {
		name: sanitizeString(parsed.name, 200),
		description: sanitizeString(parsed.description, 2000),
		recruiter_mail: sanitizeString(parsed.recruiter_mail, 320).toLowerCase(),
	};

	if (parsed.website) sanitized.website = sanitizeString(parsed.website, 500);
	if (parsed.recruiter_firstname)
		sanitized.recruiter_firstname = sanitizeString(parsed.recruiter_firstname, 100);
	if (parsed.recruiter_lastname)
		sanitized.recruiter_lastname = sanitizeString(parsed.recruiter_lastname, 100);
	if (parsed.recruiter_phone)
		sanitized.recruiter_phone = sanitizeString(parsed.recruiter_phone, 20);
	if (parsed.industry) sanitized.industry = sanitizeString(parsed.industry, 100);
	if (parsed.city) sanitized.city = sanitizeString(parsed.city, 100);
	if (parsed.zip_code) sanitized.zip_code = sanitizeString(parsed.zip_code, 20);
	if (parsed.country) sanitized.country = sanitizeString(parsed.country, 100);
	if (parsed.employees_number)
		sanitized.employees_number = sanitizeString(parsed.employees_number, 50);
	if (parsed.founded_year !== undefined) sanitized.founded_year = parsed.founded_year;

	return {
		valid: true,
		errors: [],
		sanitized,
	};
}

function formatZodErrors(issues = []) {
	return [...new Set(issues.map((issue) => issue.message))];
}

/**
 * Valide un nouveau mot de passe pour le reset
 * @param {string} newPassword - Nouveau mot de passe à valider
 * @returns {{valid: boolean, errors: string[]}} - Résultat de la validation
 */
export function validatePasswordReset(newPassword) {
	try {
		passwordSchema.parse(newPassword);
		return { valid: true, errors: [] };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				valid: false,
				errors: formatZodErrors(error.issues),
			};
		}
		return {
			valid: false,
			errors: ['Erreur de validation du mot de passe'],
		};
	}
}

/**
 * Sanitize un paramètre de recherche pour éviter les injections SQL
 * Échappe les caractères spéciaux utilisés par PostgREST/Supabase (%, _)
 * et limite la longueur pour éviter les attaques DoS
 * @param {string} searchParam - Paramètre de recherche à sanitizer
 * @param {number} maxLength - Longueur maximale (défaut: 200)
 * @returns {string} - Paramètre sanitizé
 */
export function sanitizeSearchParam(searchParam, maxLength = 200) {
	if (!searchParam || typeof searchParam !== 'string') {
		return '';
	}

	// Trim et limiter la longueur
	let sanitized = searchParam.trim().slice(0, maxLength);

	// Échapper les caractères spéciaux PostgREST/Supabase
	// % et _ sont des wildcards dans LIKE/ILIKE, il faut les échapper avec \
	sanitized = sanitized.replace(/[%_]/g, (match) => `\\${match}`);

	// Supprimer les caractères de contrôle dangereux
	// eslint-disable-next-line no-control-regex
	sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

	// Supprimer les caractères qui pourraient causer des problèmes
	sanitized = sanitized.replace(/[<>'"\\]/g, '');

	return sanitized;
}
