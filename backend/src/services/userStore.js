import supabase from '../database/db.js';
import logger from '../utils/logger.js';

// Find user by email
async function findByEmail(email) {
	const e = email.trim().toLowerCase();
	logger.debug('[findByEmail] checking:', e);

	const { data, error } = await supabase.from('user_').select('*').eq('email', e).single();

	if (error && error.code !== 'PGRST116') {
		logger.error('[findByEmail] error:', error);
		return null;
	}

	logger.debug('[findByEmail] found:', data);
	return data;
}

// Find user by id
async function findById(id) {
	const { data, error } = await supabase.from('user_').select('*').eq('id_user', id).single();

	if (error && error.code !== 'PGRST116') {
		logger.error('[findById] error:', error);
		return null;
	}

	return data;
}

// Create user
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
		logger.error('[createUser] error:', error);
		throw error;
	}

	return data;
}

// NOTE: La création d'admin par défaut est gérée dans server.js
// avec des variables d'environnement pour la sécurité
// Get all users
async function getAllUsers({ page = 1, limit = 20, search = null } = {}) {
	try {
		let query = supabase.from('user_').select('*', { count: 'exact' });

		// Recherche par nom, prénom ou email
		if (search) {
			query = query.or(
				`firstname.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%`
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

// Update user
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

// Delete user
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
export { findByEmail, findById, createUser, getAllUsers, updateUser, deleteUser };
