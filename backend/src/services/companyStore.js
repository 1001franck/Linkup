import supabase from '../database/db.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';
import { sanitizeSearchParam } from '../utils/validators.js';
import { BCRYPT_SALT_ROUNDS } from '../utils/constants.js';

/**
 * Trouve une entreprise par ID
 */
async function findById(id_company) {
	try {
		// Log pour déboguer
		logger.debug(
			'[findById Company] Recherche entreprise avec ID:',
			id_company,
			'Type:',
			typeof id_company
		);

		// Sélectionner uniquement les champs nécessaires (sans password)
		const { data, error } = await supabase
			.from('company')
			.select(
				'id_company, name, description, recruiter_mail, recruiter_firstname, recruiter_lastname, recruiter_phone, website, industry, employees_number, city, zip_code, country, founded_year, logo, created_at, updated_at'
			)
			.eq('id_company', id_company)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				// Pas d'entreprise trouvée - c'est normal
				logger.debug('[findById Company] Aucune entreprise trouvée avec ID:', id_company);
				return null;
			}
			logger.error('[findById Company] error:', {
				code: error.code,
				message: error.message,
				details: error.details,
				hint: error.hint,
				id: id_company,
				idType: typeof id_company,
			});
			return null;
		}

		logger.debug('[findById Company] Entreprise trouvée:', data?.id_company, data?.name);
		return data || null;
	} catch (error) {
		logger.error('[findById Company] Exception:', error);
		throw error;
	}
}

/**
 * Trouve une entreprise par nom
 */
async function findByName(name) {
	try {
		const searchName = String(name).trim().toLowerCase();
		// Sélectionner uniquement les champs nécessaires (sans password)
		const { data, error } = await supabase
			.from('company')
			.select(
				'id_company, name, description, recruiter_mail, recruiter_firstname, recruiter_lastname, recruiter_phone, website, industry, employees_number, city, zip_code, country, founded_year, logo, created_at, updated_at'
			)
			.ilike('name', searchName)
			.single();

		if (error && error.code !== 'PGRST116') {
			logger.error('findByName error:', error);
			return null;
		}

		return data || null;
	} catch (error) {
		logger.error('findByName error:', error);
		throw error;
	}
}

/**
 * Crée une nouvelle entreprise
 */
async function createCompany({
	name,
	description,
	password,
	recruiter_mail,
	recruiter_firstname = null,
	recruiter_lastname = null,
	recruiter_phone = null,
	website = null,
	industry = 'Technology',
	employees_number = null,
	city = null,
	zip_code = null,
	country = null,
	founded_year = null,
}) {
	try {
		// Vérifie les champs obligatoires
		if (!name || !description || !password || !recruiter_mail) {
			throw new Error('Champs obligatoires manquants');
		}

		const normalizedMail = String(recruiter_mail).trim().toLowerCase();
		const normalizedName = String(name).trim().toLowerCase();

		// ✅ Vérifie si un compte avec ce mail existe déjà
		const { data: existingMail, error: selectMailError } = await supabase
			.from('company')
			.select('id_company')
			.eq('recruiter_mail', normalizedMail)
			.maybeSingle();

		if (selectMailError) throw selectMailError;
		if (existingMail) throw new Error('Un compte avec cet email existe déjà.');

		// ✅ Vérifie si une entreprise avec le même nom existe déjà
		const { data: existingName, error: selectNameError } = await supabase
			.from('company')
			.select('id_company')
			.ilike('name', normalizedName) // insensible à la casse
			.maybeSingle();

		if (selectNameError) throw selectNameError;
		if (existingName) throw new Error('Une entreprise avec ce nom existe déjà.');

		// Hash du mot de passe
		const hashedPassword = await bcrypt.hash(String(password), BCRYPT_SALT_ROUNDS);

		// Validation de l'année de fondation si fournie
		let validatedFoundedYear = null;
		if (founded_year !== null && founded_year !== undefined) {
			const year = parseInt(founded_year);
			const currentYear = new Date().getFullYear();
			if (!isNaN(year) && year >= 1800 && year <= currentYear) {
				validatedFoundedYear = year;
			}
		}

		// Insertion dans Supabase
		const { data, error } = await supabase
			.from('company')
			.insert({
				name: String(name).trim(),
				description: String(description).trim(),
				password: hashedPassword,
				recruiter_mail: normalizedMail,
				recruiter_firstname: recruiter_firstname ? String(recruiter_firstname).trim() : null,
				recruiter_lastname: recruiter_lastname ? String(recruiter_lastname).trim() : null,
				recruiter_phone: recruiter_phone ? String(recruiter_phone).trim() : null,
				website: website ? String(website).trim() : null,
				industry: industry ? String(industry).trim() : null,
				employees_number: employees_number ? String(employees_number).trim() : null,
				city: city ? String(city).trim() : null,
				zip_code: zip_code ? String(zip_code).trim() : null,
				country: country ? String(country).trim() : null,
				founded_year: validatedFoundedYear,
			})
			.select('id_company, name, recruiter_mail, created_at')
			.single();

		if (error) throw error;

		return data;
	} catch (err) {
		logger.error('createCompany error:', err);
		throw err;
	}
}

/**
 * Vérifie les identifiants d'une entreprise (login via recruiter_mail)
 */
async function verifyCompanyCredentials(recruiter_mail, password) {
	try {
		const company = await findByMailForAuth(recruiter_mail);
		if (!company) return null;

		const ok = await bcrypt.compare(String(password), company.password);
		return ok ? company : null;
	} catch (err) {
		logger.error('verifyCompanyCredentials error:', err);
		throw err;
	}
}

/**
 * Trouve une entreprise par l'email du recruteur (pour authentification - inclut password)
 */
async function findByMailForAuth(recruiter_mail) {
	// Normaliser l'email avant le try pour qu'il soit accessible dans le catch
	const searchMail = String(recruiter_mail).trim().toLowerCase();

	try {
		// Sélectionner uniquement les champs nécessaires pour l'authentification
		// Utiliser .eq() pour une correspondance exacte (pas .ilike() qui est pour les patterns)
		// Note: La table company n'a pas de colonne 'role', le rôle sera ajouté dynamiquement dans le JWT
		const { data, error } = await supabase
			.from('company')
			.select('id_company, name, recruiter_mail, password, created_at')
			.eq('recruiter_mail', searchMail)
			.single();

		if (error) {
			// Ne pas logger les erreurs "not found" (PGRST116) comme des erreurs critiques
			// C'est un comportement attendu quand on cherche une entreprise qui n'existe pas
			if (error.code === 'PGRST116') {
				logger.debug('findByMailForAuth: Aucune entreprise trouvée avec cet email');
				return null;
			}
			// Pour les autres erreurs (ex: colonne inexistante), logger et lancer l'erreur
			logger.error(
				{
					err: error,
					code: error.code,
					message: error.message,
					details: error.details,
					hint: error.hint,
					recruiter_mail: searchMail,
					stack: error.stack,
				},
				'findByMailForAuth error'
			);
			throw error;
		}

		return data || null;
	} catch (error) {
		// Ne pas logger les erreurs "not found" comme des erreurs critiques
		if (error.code === 'PGRST116') {
			logger.debug('findByMailForAuth: Aucune entreprise trouvée avec cet email');
			return null;
		}
		// Pour les autres erreurs, logger et relancer
		logger.error(
			{
				err: error,
				code: error.code,
				message: error.message,
				details: error.details,
				hint: error.hint,
				recruiter_mail: searchMail,
				stack: error.stack,
			},
			'findByMailForAuth error (catch)'
		);
		throw error;
	}
}

/**
 * Trouve une entreprise par l'email du recruteur (sans password - pour usage général)
 * @param {string} recruiter_mail - Email du recruteur
 * @returns {Promise<Object|null>} Entreprise trouvée ou null
 */
async function findByMail(recruiter_mail) {
	try {
		const searchMail = String(recruiter_mail).trim().toLowerCase();

		// Sélectionner uniquement les champs nécessaires (sans password)
		// Utiliser .eq() pour une correspondance exacte (pas .ilike() qui est pour les patterns)
		const { data, error } = await supabase
			.from('company')
			.select(
				'id_company, name, description, recruiter_mail, recruiter_firstname, recruiter_lastname, recruiter_phone, website, industry, employees_number, city, zip_code, country, founded_year, logo, created_at, updated_at'
			)
			.eq('recruiter_mail', searchMail)
			.single();

		if (error) {
			// Ne pas logger les erreurs "not found" (PGRST116) comme des erreurs critiques
			// C'est un comportement attendu quand on cherche une entreprise qui n'existe pas
			if (error.code === 'PGRST116') {
				logger.debug('findByMail: Aucune entreprise trouvée avec cet email');
			} else {
				logger.error('findByMail error:', error);
			}
			return null;
		}

		return data || null;
	} catch (error) {
		// Ne pas logger les erreurs "not found" comme des erreurs critiques
		if (error.code === 'PGRST116') {
			logger.debug('findByMail: Aucune entreprise trouvée avec cet email');
			return null;
		}
		logger.error('findByMail error:', error);
		throw error;
	}
}

/**
 * Vérifie le mot de passe actuel d'une entreprise
 */
async function verifyCompanyPassword(id_company, currentPassword) {
	try {
		const { data: company, error } = await supabase
			.from('company')
			.select('password')
			.eq('id_company', id_company)
			.single();

		if (error || !company || !company.password) {
			return false;
		}

		const match = await bcrypt.compare(String(currentPassword), company.password);
		return match;
	} catch (err) {
		logger.error('verifyCompanyPassword error:', err);
		return false;
	}
}

/**
 * Met à jour le mot de passe d'une entreprise avec vérification
 */
async function updateCompanyPassword(id_company, currentPassword, newPassword) {
	try {
		// Vérifier le mot de passe actuel
		const isValid = await verifyCompanyPassword(id_company, currentPassword);
		if (!isValid) {
			const err = new Error('Mot de passe actuel incorrect');
			err.code = 'INVALID_CURRENT_PASSWORD';
			throw err;
		}

		// Hash du nouveau mot de passe
		const hashedPassword = await bcrypt.hash(String(newPassword), BCRYPT_SALT_ROUNDS);

		// Mettre à jour dans la base de données
		const { error } = await supabase
			.from('company')
			.update({ password: hashedPassword })
			.eq('id_company', id_company);

		if (error) {
			logger.error('updateCompanyPassword error:', error);
			throw new Error('Erreur lors de la mise à jour du mot de passe');
		}

		return true;
	} catch (err) {
		logger.error('updateCompanyPassword error:', err);
		throw err;
	}
}

/**
 * Met à jour une entreprise
 */
async function updateCompany(id_company, changes = {}) {
	try {
		const updateData = {};

		for (const [key, value] of Object.entries(changes)) {
			if (
				[
					'name',
					'description',
					'website',
					'password',
					'industry',
					'employees_number',
					'recruiter_firstname',
					'recruiter_lastname',
					'recruiter_phone',
					'recruiter_mail',
					'city',
					'zip_code',
					'country',
					'logo',
				].includes(key)
			) {
				if (key === 'password') {
					const hash = await bcrypt.hash(String(value), BCRYPT_SALT_ROUNDS);
					updateData[key] = hash;
				} else if (key === 'recruiter_mail') {
					updateData[key] = value !== null ? String(value).trim().toLowerCase() : null;
				} else {
					updateData[key] = value !== null ? String(value).trim() : null;
				}
			}
		}

		if (Object.keys(updateData).length === 0) return null;

		const { data, error } = await supabase
			.from('company')
			.update(updateData)
			.eq('id_company', id_company)
			.select()
			.single();

		if (error) {
			logger.error('updateCompany error:', error);
			return null;
		}

		return data || null;
	} catch (err) {
		logger.error('updateCompany error:', err);
		throw err;
	}
}

/**
 * Supprime une entreprise
 */
async function removeCompany(id_company) {
	try {
		const { error } = await supabase.from('company').delete().eq('id_company', id_company);

		if (error) {
			logger.error('removeCompany error:', error);
			return false;
		}

		return true;
	} catch (err) {
		logger.error('removeCompany error:', err);
		throw err;
	}
}

/**
 * Récupère toutes les entreprises avec pagination, recherche et filtres
 *
 * AMÉLIORATION : Ajout du support des filtres industry et city
 * - Filtre par secteur d'activité (industry)
 * - Filtre par ville (city)
 * - Recherche textuelle sur nom et description
 * - Pagination avec offset/limit
 *
 * @param {Object} options - Options de filtrage et pagination
 * @param {number} options.page - Numéro de page (défaut: 1)
 * @param {number} options.limit - Nombre d'éléments par page (défaut: 20)
 * @param {string} options.search - Recherche textuelle sur nom/description
 * @param {string} options.industry - Filtre par secteur d'activité
 * @param {string} options.city - Filtre par ville
 * @returns {Object} - { items: Array, page: number, limit: number, total: number }
 */
async function getAllCompanies({
	page = 1,
	limit = 20,
	search = null,
	industry = null,
	city = null,
} = {}) {
	try {
		// Validation et conversion des paramètres
		page = Number(page) || 1;
		limit = Number(limit) || 20;
		const offset = (page - 1) * limit;

		// Initialisation de la requête Supabase avec comptage et jointure pour les offres d'emploi
		// On joint la table job_offer pour compter le nombre d'offres actives par entreprise
		let query = supabase.from('company').select(
			`
			*,
			job_offers:job_offer(count)
		`,
			{ count: 'exact' }
		);

		// 🔍 FILTRE DE RECHERCHE TEXTUELLE
		// Recherche insensible à la casse sur le nom et la description
		if (search) {
			const sanitizedSearch = sanitizeSearchParam(search, 200);
			query = query.or(`name.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`);
		}

		// 🏭 FILTRE PAR SECTEUR D'ACTIVITÉ
		// Recherche insensible à la casse sur le champ industry
		if (industry) {
			const sanitizedIndustry = sanitizeSearchParam(industry, 100);
			query = query.ilike('industry', `%${sanitizedIndustry}%`);
		}

		// 🏙️ FILTRE PAR VILLE
		// Recherche insensible à la casse sur le champ city
		if (city) {
			const sanitizedCity = sanitizeSearchParam(city, 100);
			query = query.ilike('city', `%${sanitizedCity}%`);
		}

		// ⚠️ OPTIMISATION PERFORMANCE: Limiter le nombre d'entreprises chargées
		// Au lieu de charger 1000 entreprises, on charge seulement ce qui est nécessaire pour la page demandée
		// On charge un peu plus (3x la limite) pour avoir une marge pour le tri, mais beaucoup moins que 1000
		const LOAD_MULTIPLIER = 3; // Multiplicateur pour avoir une marge de tri
		const dynamicLimit = Math.min(limit * LOAD_MULTIPLIER, 200); // Max 200 au lieu de 1000

		logger.debug(
			`[getAllCompanies] Chargement optimisé: ${dynamicLimit} entreprises pour page ${page}, limite ${limit}`
		);

		// 📊 EXÉCUTION DE LA REQUÊTE avec limite dynamique optimisée
		const { data, error, count } = await query.limit(dynamicLimit);

		if (error) {
			if (process.env.NODE_ENV !== 'production') {
				logger.error('getAllCompanies error:', error);
			}
			throw error;
		}

		// Transformation des données pour inclure le nombre d'offres d'emploi
		const enrichedData = (data || []).map((company) => ({
			...company,
			jobsAvailable: company.job_offers?.[0]?.count || 0, // Nombre d'offres d'emploi actives
		}));

		// 🎯 TRI PAR NOMBRE D'OFFRES (du plus grand au plus petit)
		enrichedData.sort((a, b) => b.jobsAvailable - a.jobsAvailable);

		// 📊 PAGINATION APRÈS TRI
		const startIndex = offset;
		const endIndex = startIndex + limit;
		const paginatedData = enrichedData.slice(startIndex, endIndex);

		// Ajuster le total si on a limité le chargement
		// Si on a chargé moins que le total réel, on indique qu'il y a potentiellement plus de résultats
		const actualTotal = count || 0;

		return {
			data: paginatedData,
			pagination: {
				page,
				limit,
				total: actualTotal,
				totalPages: Math.ceil(actualTotal / limit),
			},
		};
	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			logger.error('getAllCompanies error:', err);
		}
		throw err;
	}
}

export {
	findById,
	findByName,
	createCompany,
	verifyCompanyCredentials,
	updateCompany,
	removeCompany,
	getAllCompanies,
	findByMail,
	findByMailForAuth,
	verifyCompanyPassword,
	updateCompanyPassword,
};
