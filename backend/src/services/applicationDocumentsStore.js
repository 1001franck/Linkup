import supabase from '../database/db.js';
import logger from '../utils/logger.js';

// Ajouter un document à une candidature (UPSERT pour remplacer l'existant)
export async function addApplicationDocument(
	id_user,
	id_job_offer,
	document_type,
	file_name,
	file_url
) {
	try {
		const { data, error } = await supabase
			.from('application_documents')
			.upsert(
				{
					id_user,
					id_job_offer: parseInt(id_job_offer),
					document_type,
					file_name,
					file_url,
					uploaded_at: new Date().toISOString(),
				},
				{
					onConflict: 'id_user,id_job_offer,document_type',
				}
			)
			.select()
			.single();

		if (error) {
			logger.error('[addApplicationDocument] error:', error);
			return { success: false, error: error.message };
		}

		return { success: true, document: data };
	} catch (err) {
		logger.error('addApplicationDocument error:', err);
		return { success: false, error: "Erreur lors de l'ajout du document" };
	}
}

// Récupérer les documents d'une candidature
export async function getApplicationDocumentsForApplication(id_user, id_job_offer) {
	try {
		const { data, error } = await supabase
			.from('application_documents')
			.select('*')
			.eq('id_user', id_user)
			.eq('id_job_offer', parseInt(id_job_offer))
			.order('uploaded_at', { ascending: false });

		if (error) {
			logger.error('[getApplicationDocumentsForApplication] error:', error);
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error('getApplicationDocumentsForApplication error:', err);
		throw err;
	}
}

// Supprimer un document
export async function deleteApplicationDocument(id_document, requestingUserId) {
	try {
		// Vérifier que l'utilisateur est propriétaire du document
		const { data: document, error: fetchError } = await supabase
			.from('application_documents')
			.select('id_user')
			.eq('id_document', id_document)
			.single();

		if (fetchError) {
			logger.error('[deleteApplicationDocument] fetch error:', fetchError);
			return { success: false, error: 'Document introuvable' };
		}

		if (document.id_user !== requestingUserId) {
			return { success: false, error: 'Non autorisé' };
		}

		const { error } = await supabase
			.from('application_documents')
			.delete()
			.eq('id_document', id_document);

		if (error) {
			logger.error('[deleteApplicationDocument] delete error:', error);
			return { success: false, error: 'Erreur lors de la suppression' };
		}

		return { success: true };
	} catch (err) {
		logger.error('deleteApplicationDocument error:', err);
		return { success: false, error: 'Erreur serveur' };
	}
}
