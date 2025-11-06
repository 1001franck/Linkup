import supabase from "../database/db.js";
import logger from "../utils/logger.js";

async function createFilter(filter_name) {
	try {
		// Vérifier si le filtre existe déjà
		const existing = await findByName(filter_name);
		if (existing) {
			return { error: "Ce filtre existe déjà" };
		}

		// Insérer le nouveau filtre
		const { data, error } = await supabase
			.from('filter_')
			.insert({
				filter_name: String(filter_name).trim()
			})
			.select()
			.single();

		if (error) {
			logger.error("createFilter error:", error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error("createFilter error:", err);
		throw err;
	}
}

async function getAllFilters() {
	try {
		const { data, error } = await supabase
			.from('filter_')
			.select('*')
			.order('filter_name', { ascending: true });

		if (error) {
			logger.error("getAllFilters error:", error);
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error("getAllFilters error:", err);
		throw err;
	}
}

async function findById(id) {
	try {
		const { data, error } = await supabase
			.from('filter_')
			.select('*')
			.eq('id_filter', id)
			.single();

		if (error && error.code !== 'PGRST116') {
			logger.error("findById error:", error);
			throw error;
		}

		return data || null;
	} catch (err) {
		logger.error("findById error:", err);
		throw err;
	}
}

async function findByName(name) {
	try {
		const searchName = String(name).toLowerCase();
		const { data, error } = await supabase
			.from('filter_')
			.select('*')
			.ilike('filter_name', searchName)
			.single();

		if (error && error.code !== 'PGRST116') {
			logger.error("findByName error:", error);
			throw error;
		}

		return data || null;
	} catch (err) {
		logger.error("findByName error:", err);
		throw err;
	}
}

async function updateFilter(id, newName) {
	try {
		const filter = await findById(id);
		if (!filter) return null;

		// Vérifier si le nouveau nom existe déjà
		const existing = await findByName(newName);
		if (existing && existing.id_filter !== id) {
			return { error: "Ce nom de filtre existe déjà" };
		}

		const { data, error } = await supabase
			.from('filter_')
			.update({
				filter_name: String(newName).trim()
			})
			.eq('id_filter', id)
			.select()
			.single();

		if (error) {
			logger.error("updateFilter error:", error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error("updateFilter error:", err);
		throw err;
	}
}

async function removeFilter(id) {
	try {
		const { error } = await supabase
			.from('filter_')
			.delete()
			.eq('id_filter', id);

		if (error) {
			logger.error("removeFilter error:", error);
			throw error;
		}

		return true;
	} catch (err) {
		logger.error("removeFilter error:", err);
		throw err;
	}
}

// Filtres prédéfinis pour une plateforme de recrutement
async function createDefaultFilters() {
	const defaultFilters = [
		"CDI",
		"CDD",
		"Stage",
		"Freelance",
		"Temps partiel",
		"Temps plein",
		"Remote",
		"Présentiel",
		"Hybride",
		"Débutant",
		"Intermédiaire",
		"Senior",
		"Expert",
		"Tech",
		"Marketing",
		"Ventes",
		"RH",
		"Finance",
		"Design",
		"Paris",
		"Lyon",
		"Marseille",
		"Toulouse",
		"Nantes",
		"Lille",
		"0-2 ans",
		"2-5 ans",
		"5-10 ans",
		"10+ ans",
	];

	try {
		// Vérifier si la table filter_ existe dans la base
		const { error: tableError } = await supabase
			.from('filter_')
			.select('id_filter')
			.limit(1);

		if (tableError) {
			console.info("Table filter_ inexistante — seed des filtres ignoré");
			return;
		}

		for (const filterName of defaultFilters) {
			const existing = await findByName(filterName);
			if (!existing) {
				await createFilter(filterName);
			}
		}
	} catch (err) {
		logger.error("createDefaultFilters error (during check/seed):", err);
		throw err;
	}
}

// Note: createDefaultFilters() is intentionally NOT called automatically here.
// Calling it at module import time would force a DB connection during server
// startup and cause noisy errors (ENETUNREACH, etc.) when the DB is not yet
// available. Keep the function exported so a bootstrap script or manual step
// can run the seed explicitly when the DB is ready.
export { createFilter, getAllFilters, findById, findByName, updateFilter, removeFilter, createDefaultFilters };