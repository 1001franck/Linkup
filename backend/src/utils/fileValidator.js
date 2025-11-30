/**
 * Utilitaires de validation pour les fichiers uploadés
 * Validation de taille, type MIME, et sécurité
 */

// Configuration des limites
import { MAX_FILE_SIZE_BYTES } from './constants.js';

const MAX_FILE_SIZE = MAX_FILE_SIZE_BYTES;
const ALLOWED_MIME_TYPES = {
	'application/pdf': ['.pdf'],
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/webp': ['.webp'],
};

const ALLOWED_FILE_TYPES = ['pdf', 'photo', 'cv', 'cover_letter'];

/**
 * Valide la taille d'un fichier
 * @param {number} size - Taille du fichier en bytes
 * @returns {{valid: boolean, error?: string}}
 */
export function validateFileSize(size) {
	if (!size || size === 0) {
		return { valid: false, error: 'Le fichier est vide' };
	}

	if (size > MAX_FILE_SIZE) {
		const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
		return {
			valid: false,
			error: `Le fichier est trop volumineux. Taille maximum: ${maxSizeMB} MB`,
		};
	}

	return { valid: true };
}

/**
 * Valide le type MIME d'un fichier
 * @param {string} mimeType - Type MIME du fichier
 * @param {string} fileType - Type de fichier attendu (pdf, photo, cv, cover_letter)
 * @returns {{valid: boolean, error?: string}}
 */
export function validateFileType(mimeType, fileType) {
	if (!mimeType) {
		return { valid: false, error: 'Type de fichier non détecté' };
	}

	// Vérifier que le file_type est valide
	if (!ALLOWED_FILE_TYPES.includes(fileType)) {
		return {
			valid: false,
			error: `Type de fichier non autorisé: ${fileType}. Types autorisés: ${ALLOWED_FILE_TYPES.join(', ')}`,
		};
	}

	// Vérifier le type MIME selon le type de fichier attendu
	if (fileType === 'pdf' || fileType === 'cv' || fileType === 'cover_letter') {
		if (mimeType !== 'application/pdf') {
			return {
				valid: false,
				error: 'Le fichier doit être un PDF',
			};
		}
	} else if (fileType === 'photo') {
		if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
			return {
				valid: false,
				error: 'Le fichier doit être une image (JPEG, PNG ou WebP)',
			};
		}
	}

	// Vérifier que le type MIME est dans la liste autorisée
	if (!ALLOWED_MIME_TYPES[mimeType]) {
		return {
			valid: false,
			error: `Type de fichier non autorisé: ${mimeType}`,
		};
	}

	return { valid: true };
}

/**
 * Valide un fichier complet (taille + type)
 * @param {object} file - Objet fichier avec size et mimetype
 * @param {string} fileType - Type de fichier attendu
 * @returns {{valid: boolean, error?: string}}
 */
export function validateFile(file, fileType) {
	if (!file) {
		return { valid: false, error: 'Aucun fichier fourni' };
	}

	// Valider la taille
	const sizeValidation = validateFileSize(file.size);
	if (!sizeValidation.valid) {
		return sizeValidation;
	}

	// Valider le type
	const typeValidation = validateFileType(file.mimetype, fileType);
	if (!typeValidation.valid) {
		return typeValidation;
	}

	return { valid: true };
}

/**
 * Vérifie le nombre de fichiers par utilisateur
 * @param {number} currentFileCount - Nombre actuel de fichiers
 * @param {number} maxFiles - Nombre maximum autorisé
 * @returns {{valid: boolean, error?: string}}
 */
export function validateFileCount(currentFileCount, maxFiles = 10) {
	if (currentFileCount >= maxFiles) {
		return {
			valid: false,
			error: `Limite de fichiers atteinte. Maximum: ${maxFiles} fichiers`,
		};
	}

	return { valid: true };
}
