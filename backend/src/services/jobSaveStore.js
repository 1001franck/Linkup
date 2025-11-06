import supabase from "../database/db.js";
const TABLE = "save";

/**
 * Sauvegarder une offre
 */
export async function saveJob(id_user, id_job_offer) {
	try {
		// normalize ids
		const uid = Number(id_user);
		const jid = Number(id_job_offer);
		if (!Number.isFinite(jid) || jid <= 0) {
			return { error: "id_job_offer invalide" };
		}

		// ensure job exists to satisfy FK
		const { data: job, error: jobErr } = await supabase.from("job_offer").select("id_job_offer").eq("id_job_offer", jid).maybeSingle();
		if (jobErr) throw jobErr;
		if (!job) {
			return { error: "Offre introuvable" };
		}

		// Ask Supabase to return the inserted row
		const { data, error } = await supabase
			.from(TABLE)
			.insert([{ id_user: uid, id_job_offer: jid }])
			.select()
			.single();

		if (error) {
			// Supabase wraps Postgres errors differently; check message/code
			const msg = error?.message || "";
			if (msg.toLowerCase().includes("duplicate") || msg.includes("23505")) {
				return { error: "Offre déjà sauvegardée" };
			}
			throw error;
		}

		return data || null;
	} catch (err) {
		throw new Error(err.message);
	}
}

/**
 * Récupérer toutes les offres sauvegardées d’un utilisateur
 */
export async function getSavedJobs(id_user) {
	try {
		const uid = Number(id_user);
		const { data, error } = await supabase
			.from(TABLE)
			.select(
				`
					id_user,
					id_job_offer,
					saved_at,
					job_offer (
						id_job_offer,
						title,
						description,
						location,
						contract_type,
						salary_min,
						salary_max,
						industry,
						experience,
						published_at,
						company (
							id_company,
							name,
							logo,
							website,
							industry
						)
					)
				`
			)
			.eq("id_user", uid);

		if (error) throw error;

		return data;
	} catch (err) {
		throw new Error(err.message);
	}
}

/**
 * Supprimer une offre sauvegardée
 */
export async function removeSavedJob(id_user, id_job_offer) {
	try {
		const { data, error } = await supabase.from(TABLE).delete().eq("id_user", id_user).eq("id_job_offer", id_job_offer).select();

		if (error) throw error;

		return data.length > 0;
	} catch (err) {
		throw new Error(err.message);
	}
}