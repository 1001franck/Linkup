import supabase from '../database/db.js';
import logger from '../utils/logger.js';

const BUCKET = process.env.SUPABASE_BUCKET || 'user_files';

async function uploadFileToSupabase(id_user, file_type, file) {
	// Vérifications préliminaires
	if (!id_user) {
		throw new Error('ID utilisateur manquant');
	}
	if (!file || !file.buffer) {
		throw new Error('Fichier manquant ou invalide');
	}

	logger.debug(
		`[uploadFileToSupabase] Début upload - User: ${id_user}, Type: ${file_type}, Bucket: ${BUCKET}`
	);

	// file: { originalname, buffer, mimetype }
	let filename;

	// Pour les photos de profil et les CV, utiliser un nom fixe et supprimer l'ancien
	if (file_type === 'photo') {
		filename = `${id_user}/profile_picture.${file.originalname.split('.').pop()}`;

		// Supprimer l'ancienne photo de profil si elle existe
		try {
			await supabase.storage.from(BUCKET).remove([filename]);
			logger.debug(`[uploadFileToSupabase] Ancienne photo supprimée: ${filename}`);
		} catch (deleteError) {
			// Ignorer l'erreur si le fichier n'existe pas
			logger.debug(`[uploadFileToSupabase] Aucune ancienne photo à supprimer: ${filename}`);
		}
	} else if (file_type === 'cv') {
		// Pour les CV, supprimer tous les anciens CV de l'utilisateur avant d'uploader le nouveau
		// Générer le nom de fichier
		filename = `${id_user}/cv_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

		// Récupérer tous les CV de l'utilisateur
		const { data: existingCVs, error: findError } = await supabase
			.from('user_files')
			.select('id_user_files, file_url')
			.eq('id_user', id_user)
			.eq('file_type', 'cv');

		if (!findError && existingCVs && existingCVs.length > 0) {
			// Supprimer les fichiers du storage
			const filesToDelete = existingCVs.map((cv) => cv.file_url).filter(Boolean);
			if (filesToDelete.length > 0) {
				try {
					await supabase.storage.from(BUCKET).remove(filesToDelete);
					logger.debug(`[uploadFileToSupabase] ${filesToDelete.length} ancien(s) CV supprimé(s)`);
				} catch (deleteError) {
					logger.debug(
						`[uploadFileToSupabase] Erreur lors de la suppression des anciens CV: ${deleteError.message}`
					);
				}
			}

			// Supprimer les enregistrements de la base de données
			const cvIds = existingCVs.map((cv) => cv.id_user_files);
			await supabase.from('user_files').delete().in('id_user_files', cvIds);
			logger.debug(
				`[uploadFileToSupabase] ${cvIds.length} enregistrement(s) CV supprimé(s) de la DB`
			);
		}
	} else {
		// Pour les autres fichiers, utiliser le nom original avec timestamp pour éviter les conflits
		const timestamp = Date.now();
		filename = `${id_user}/${file_type}_${timestamp}_${file.originalname.replace(/\s+/g, '_')}`;
	}

	// Vérifier que le bucket existe
	try {
		const { data: buckets, error: listError } = await supabase.storage.listBuckets();
		if (listError) {
			logger.error('Erreur lors de la vérification des buckets:', listError);
			throw new Error('Impossible de vérifier les buckets de stockage');
		}

		const bucketExists = buckets.some((b) => b.name === BUCKET);
		if (!bucketExists) {
			logger.error(
				`Bucket '${BUCKET}' n'existe pas. Buckets disponibles:`,
				buckets.map((b) => b.name)
			);
			throw new Error(`Bucket de stockage '${BUCKET}' non configuré`);
		}

		logger.debug(`[uploadFileToSupabase] Bucket '${BUCKET}' vérifié avec succès`);
	} catch (bucketError) {
		logger.error('Erreur de vérification du bucket:', bucketError);
		throw bucketError;
	}

	// upload to storage
	logger.debug(`[uploadFileToSupabase] Upload vers ${BUCKET}/${filename}`);
	const { error: uploadError } = await supabase.storage
		.from(BUCKET)
		.upload(filename, file.buffer, { contentType: file.mimetype });

	if (uploadError) {
		logger.error('Supabase upload error:', uploadError);
		throw uploadError;
	}

	// get public url (depends on your bucket policy)
	const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
	const publicUrl = publicData && publicData.publicUrl ? publicData.publicUrl : null;

	// Pour les photos de profil, supprimer l'ancien enregistrement avant d'insérer le nouveau
	// (Note: Pour les CV, la suppression est déjà faite avant l'upload)
	if (file_type === 'photo') {
		try {
			await supabase.from('user_files').delete().eq('id_user', id_user).eq('file_type', 'photo');
			logger.debug(
				`[uploadFileToSupabase] Ancien enregistrement photo supprimé pour l'utilisateur ${id_user}`
			);
		} catch (deleteError) {
			logger.debug(
				`[uploadFileToSupabase] Aucun ancien enregistrement photo à supprimer pour l'utilisateur ${id_user}`
			);
		}
	}

	// Insert metadata into user_files table
	const { data: insertData, error: insertError } = await supabase
		.from('user_files')
		.insert([
			{
				file_type,
				file_url: filename, // store the path in DB (schema limits varchar length)
				uploaded_at: new Date().toISOString(),
				id_user,
			},
		])
		.select()
		.single();

	if (insertError) {
		logger.error('DB insert error:', insertError);
		// try to cleanup storage
		await supabase.storage
			.from(BUCKET)
			.remove([filename])
			.catch(() => {});
		throw insertError;
	}

	return { record: insertData, publicUrl };
}

/**
 * List files metadata for a user.
 * Retourne les fichiers avec leurs URLs publiques
 */
async function listFilesForUser(id_user) {
	const { data, error } = await supabase.from('user_files').select('*').eq('id_user', id_user);
	if (error) throw error;

	// Ajouter l'URL publique pour chaque fichier
	if (data && data.length > 0) {
		return data.map((file) => {
			const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(file.file_url);
			return {
				...file,
				public_url: publicData?.publicUrl || null,
			};
		});
	}

	return [];
}

async function findFileById(id_user_files) {
	const { data, error } = await supabase
		.from('user_files')
		.select('*')
		.eq('id_user_files', id_user_files)
		.maybeSingle();
	if (error) throw error;
	return data || null;
}

async function deleteFile(id_user_files, requestingUserId) {
	// verify ownership
	const file = await findFileById(id_user_files);
	if (!file) return { deleted: false, reason: 'not_found' };
	if (file.id_user !== requestingUserId) return { deleted: false, reason: 'forbidden' };

	// remove from storage (file.file_url stores the path/filename)
	const { error: removeError } = await supabase.storage.from(BUCKET).remove([file.file_url]);
	if (removeError) logger.warn('Supabase remove warning:', removeError);

	// remove DB record
	const { error } = await supabase.from('user_files').delete().eq('id_user_files', id_user_files);
	if (error) throw error;
	return { deleted: true };
}

/**
 * Get the profile picture URL for a user.
 * Returns the most recent photo uploaded by the user.
 */
async function getProfilePicture(id_user) {
	try {
		logger.debug(
			`[getProfilePicture] Recherche de la photo de profil pour l'utilisateur ${id_user}`
		);

		const { data, error } = await supabase
			.from('user_files')
			.select('file_url')
			.eq('id_user', id_user)
			.eq('file_type', 'photo')
			.order('uploaded_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			logger.error('getProfilePicture error:', error);
			return null;
		}

		// Si on trouve une photo, on retourne l'URL publique
		if (data && data.file_url) {
			const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(data.file_url);
			const publicUrl = publicData && publicData.publicUrl ? publicData.publicUrl : null;
			logger.debug(`[getProfilePicture] Photo trouvée: ${publicUrl}`);
			return publicUrl;
		}

		logger.debug(`[getProfilePicture] Aucune photo trouvée pour l'utilisateur ${id_user}`);
		return null;
	} catch (err) {
		logger.error('getProfilePicture error:', err);
		return null;
	}
}

/**
 * Upload du logo d'une entreprise vers Supabase Storage
 * @param {number} id_company - ID de l'entreprise
 * @param {Object} file - Fichier multer { originalname, buffer, mimetype }
 * @returns {Promise<Object>} - { url, filename }
 */
async function uploadCompanyLogoToSupabase(id_company, file) {
	// Vérifications préliminaires
	if (!id_company) {
		throw new Error('ID entreprise manquant');
	}
	if (!file || !file.buffer) {
		throw new Error('Fichier manquant ou invalide');
	}

	logger.debug(
		`[uploadCompanyLogoToSupabase] Début upload - Company: ${id_company}, Bucket: ${BUCKET}`
	);

	// Nom du fichier pour le logo d'entreprise - nettoyer le nom de fichier
	const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
	// Nettoyer l'extension pour éviter les caractères invalides
	const cleanExtension = fileExtension.replace(/[^a-z0-9]/gi, '') || 'jpg';
	// S'assurer que l'ID est un nombre valide
	const cleanCompanyId = String(id_company).replace(/[^0-9]/g, '');
	if (!cleanCompanyId) {
		throw new Error('ID entreprise invalide');
	}
	const filename = `companies/${cleanCompanyId}/logo.${cleanExtension}`;

	logger.debug(`[uploadCompanyLogoToSupabase] Filename: ${filename}`);

	// Vérifier que le bucket existe
	try {
		const { data: buckets, error: listError } = await supabase.storage.listBuckets();
		if (listError) {
			logger.error('Erreur lors de la vérification des buckets:', listError);
			throw new Error('Impossible de vérifier les buckets de stockage');
		}

		const bucketExists = buckets.some((b) => b.name === BUCKET);
		if (!bucketExists) {
			logger.error(
				`Bucket '${BUCKET}' n'existe pas. Buckets disponibles:`,
				buckets.map((b) => b.name)
			);
			throw new Error(`Bucket de stockage '${BUCKET}' non configuré`);
		}

		logger.debug(`[uploadCompanyLogoToSupabase] Bucket '${BUCKET}' trouvé`);
	} catch (error) {
		logger.error('[uploadCompanyLogoToSupabase] Erreur vérification bucket:', error);
		throw error;
	}

	// Supprimer l'ancien logo s'il existe (tous les formats possibles)
	try {
		// Lister tous les fichiers dans le dossier de l'entreprise
		const { data: existingFiles, error: listError } = await supabase.storage
			.from(BUCKET)
			.list(`companies/${cleanCompanyId}/`);

		if (!listError && existingFiles && existingFiles.length > 0) {
			// Supprimer tous les fichiers logo (peuvent avoir des extensions différentes)
			const logoFiles = existingFiles
				.filter((f) => f.name.startsWith('logo.'))
				.map((f) => `companies/${cleanCompanyId}/${f.name}`);

			if (logoFiles.length > 0) {
				const { error: removeError } = await supabase.storage.from(BUCKET).remove(logoFiles);

				if (removeError) {
					logger.debug(
						`[uploadCompanyLogoToSupabase] Erreur suppression anciens logos (non bloquant):`,
						removeError
					);
				} else {
					logger.debug(
						`[uploadCompanyLogoToSupabase] ${logoFiles.length} ancien(s) logo(s) supprimé(s)`
					);
				}
			}
		}
	} catch (deleteError) {
		// Ignorer l'erreur si le dossier n'existe pas encore
		logger.debug(
			`[uploadCompanyLogoToSupabase] Aucun ancien logo à supprimer (dossier peut ne pas exister)`
		);
	}

	// Upload du nouveau fichier
	try {
		const { data, error } = await supabase.storage.from(BUCKET).upload(filename, file.buffer, {
			contentType: file.mimetype,
			upsert: true, // Remplacer si existe déjà
		});

		if (error) {
			logger.error('[uploadCompanyLogoToSupabase] Erreur upload:', error);
			throw new Error(`Erreur lors de l'upload: ${error.message}`);
		}

		logger.debug(`[uploadCompanyLogoToSupabase] Upload réussi:`, data);

		// Construire l'URL publique
		const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

		const publicUrl = publicUrlData.publicUrl;
		logger.debug(`[uploadCompanyLogoToSupabase] URL publique: ${publicUrl}`);

		return {
			url: publicUrl,
			filename,
			path: data.path,
		};
	} catch (error) {
		logger.error('[uploadCompanyLogoToSupabase] Erreur finale:', error);
		throw error;
	}
}

export {
	uploadFileToSupabase,
	listFilesForUser,
	findFileById,
	deleteFile,
	getProfilePicture,
	uploadCompanyLogoToSupabase,
};
