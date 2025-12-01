import supabase from '../database/db.js';
import logger from '../utils/logger.js';
import { sanitizeSearchParam } from '../utils/validators.js';

// Find user by email (pour authentification - inclut password)
async function findByEmailForAuth(email) {
	const normalizedEmail = email.trim().toLowerCase();
	logger.debug('[findByEmailForAuth] checking:', normalizedEmail);

	// Sélectionner uniquement les champs nécessaires pour l'authentification
	const { data, error } = await supabase
		.from('user_')
		.select('id_user, email, password, role, firstname, lastname, created_at')
		.eq('email', normalizedEmail)
		.single();

	if (error && error.code !== 'PGRST116') {
		logger.error('[findByEmailForAuth] error:', error);
		return null;
	}

	return data;
}

/**
 * Trouve un utilisateur par email (sans password - pour usage général)
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null
 */
async function findByEmail(email) {
	const normalizedEmail = email.trim().toLowerCase();
	logger.debug('[findByEmail] checking:', normalizedEmail);

	// Sélectionner tous les champs sauf le password pour la sécurité
	const { data, error } = await supabase
		.from('user_')
		.select(
			'id_user, email, firstname, lastname, phone, bio_pro, city, country, role, created_at, updated_at, job_title, experience_level, skills, portfolio_link, linkedin_link, availability, description'
		)
		.eq('email', normalizedEmail)
		.single();

	if (error) {
		// Ne pas logger les erreurs "not found" (PGRST116) comme des erreurs critiques
		// C'est un comportement attendu quand on cherche un utilisateur qui n'existe pas
		if (error.code === 'PGRST116') {
			logger.debug('[findByEmail] Aucun utilisateur trouvé avec cet email');
		} else {
			logger.error('[findByEmail] error:', error);
		}
		return null;
	}

	logger.debug('[findByEmail] found:', data);
	return data;
}

/**
 * Trouve un utilisateur par ID (sans password - pour usage général)
 * @param {number} id - ID de l'utilisateur
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null
 */
async function findById(id) {
	// Sélectionner tous les champs sauf le password pour la sécurité
	const { data, error } = await supabase
		.from('user_')
		.select(
			'id_user, email, firstname, lastname, phone, bio_pro, city, country, role, created_at, updated_at, job_title, experience_level, skills, portfolio_link, linkedin_link, availability, description'
		)
		.eq('id_user', id)
		.single();

	if (error && error.code !== 'PGRST116') {
		logger.error('[findById] error:', error);
		return null;
	}

	return data;
}

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @param {string} userData.email - Email de l'utilisateur
 * @param {string} userData.password_hash - Hash du mot de passe
 * @param {string} userData.firstname - Prénom
 * @param {string} userData.lastname - Nom
 * @param {string} [userData.role='user'] - Rôle de l'utilisateur
 * @param {string} [userData.phone] - Téléphone
 * @param {string} [userData.bio_pro] - Bio professionnelle
 * @param {string} [userData.city] - Ville
 * @param {string} [userData.country] - Pays
 * @returns {Promise<Object>} Utilisateur créé
 * @throws {Error} Si la création échoue
 */
async function createUser({
	email,
	password_hash,
	firstname,
	lastname,
	role = 'user',
	phone,
	bio_pro,
	city,
	country,
}) {
	logger.debug('[createUser] Données reçues:', {
		email,
		firstname,
		lastname,
		phone,
		bio_pro,
		city,
		country,
	});

	const insertData = {
		firstname: firstname || '',
		lastname: lastname || '',
		email: email.trim().toLowerCase(),
		password: password_hash,
		role,
		phone: phone || '',
		bio_pro: bio_pro || null,
		city: city || null,
		country: country || null,
	};

	logger.debug('[createUser] Données à insérer:', insertData);

	const { data, error } = await supabase.from('user_').insert(insertData).select().single();

	if (error) {
		logger.error('[createUser] Supabase error:', error);
		logger.error('[createUser] Error details:', {
			message: error.message,
			code: error.code,
			details: error.details,
			hint: error.hint,
		});
		throw error;
	}

	if (!data) {
		const error = new Error('Aucune donnée retournée après création utilisateur');
		logger.error('[createUser] No data returned');
		throw error;
	}

	return data;
}

/**
 * Récupère tous les utilisateurs avec pagination et recherche
 * @param {Object} options - Options de pagination et recherche
 * @param {number} [options.page=1] - Numéro de page
 * @param {number} [options.limit=20] - Nombre d'éléments par page
 * @param {string} [options.search] - Terme de recherche (nom, prénom, email)
 * @returns {Promise<Object>} Objet contenant les données et la pagination
 * @throws {Error} Si la récupération échoue
 */
async function getAllUsers({ page = 1, limit = 20, search = null } = {}) {
	try {
		let query = supabase.from('user_').select('*', { count: 'exact' });

		// Recherche par nom, prénom ou email
		if (search) {
			const sanitizedSearch = sanitizeSearchParam(search, 200);
			query = query.or(
				`firstname.ilike.%${sanitizedSearch}%,lastname.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%`
			);
		}

		// Pagination
		const from = (page - 1) * limit;
		const to = from + limit - 1;

		const { data, error, count } = await query
			.order('created_at', { ascending: false })
			.range(from, to);

		if (error) {
			logger.error('getAllUsers error:', error);
			throw error;
		}

		return {
			data: data || [],
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages: Math.ceil((count || 0) / limit),
			},
		};
	} catch (err) {
		logger.error('getAllUsers error:', err);
		throw err;
	}
}

/**
 * Met à jour un utilisateur
 * @param {number} id - ID de l'utilisateur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object|null>} Utilisateur mis à jour ou null si aucune modification
 * @throws {Error} Si la mise à jour échoue
 */
async function updateUser(id, updateData) {
	try {
		// MODIFICATION FRONTEND: Ajout de nouveaux champs pour la page settings ET profile/complete
		// Permet de mettre à jour tous les champs du profil utilisateur
		const allowedFields = [
			'firstname',
			'lastname',
			'phone',
			'bio_pro', // ← Bio professionnelle (settings)
			'website', // ← Site web personnel (settings)
			'city', // ← Ville (settings)
			'country', // ← Pays (settings)
			'description', // ← NOUVEAU: Description détaillée (profile/complete)
			'skills', // ← NOUVEAU: Compétences array (profile/complete)
			'job_title', // ← NOUVEAU: Titre du poste (profile/complete)
			'experience_level', // ← NOUVEAU: Niveau d'expérience (profile/complete)
			'availability', // ← NOUVEAU: Disponibilité (profile/complete)
			'portfolio_link', // ← NOUVEAU: Lien portfolio (profile/complete)
			'linkedin_link', // ← NOUVEAU: Lien LinkedIn (profile/complete)
		];
		const updateFields = {};

		Object.keys(updateData).forEach((key) => {
			if (allowedFields.includes(key) && updateData[key] !== undefined) {
				updateFields[key] = updateData[key];
			}
		});

		if (Object.keys(updateFields).length === 0) return null;

		const { data, error } = await supabase
			.from('user_')
			.update(updateFields)
			.eq('id_user', id)
			.select()
			.single();

		if (error) {
			logger.error('updateUser error:', error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error('updateUser error:', err);
		throw err;
	}
}

/**
 * Supprime un utilisateur
 * @param {number} id - ID de l'utilisateur
 * @returns {Promise<boolean>} True si la suppression a réussi
 * @throws {Error} Si la suppression échoue
 */
async function deleteUser(id) {
	try {
		const { error } = await supabase.from('user_').delete().eq('id_user', id);

		if (error) {
			logger.error('deleteUser error:', error);
			throw error;
		}

		return true;
	} catch (err) {
		logger.error('deleteUser error:', err);
		throw err;
	}
}

// Export
export {
	findByEmail,
	findByEmailForAuth,
	findById,
	createUser,
	getAllUsers,
	updateUser,
	deleteUser,
};
