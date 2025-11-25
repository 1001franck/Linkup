import supabase from "../database/db.js";
import logger from "../utils/logger.js";

// Convert to number or null
function numOrNull(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

// Calcule le temps écoulé depuis publication
function getTimeAgo(publishedAt) {
	if (!publishedAt) return "Date inconnue";
	
	const now = new Date();
	const publishDate = new Date(publishedAt);
	const diffInMs = now - publishDate;
	
	if (diffInMs < 0) return "Dans le futur";
	
	const diffInSeconds = Math.floor(diffInMs / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	const diffInWeeks = Math.floor(diffInDays / 7);
	const diffInMonths = Math.floor(diffInDays / 30);
	
	if (diffInSeconds < 60) {
		return diffInSeconds <= 1 ? "À l'instant" : `Il y a ${diffInSeconds} secondes`;
	}
	if (diffInMinutes < 60) {
		return diffInMinutes === 1 ? "Il y a 1 minute" : `Il y a ${diffInMinutes} minutes`;
	}
	if (diffInHours < 24) {
		return diffInHours === 1 ? "Il y a 1 heure" : `Il y a ${diffInHours} heures`;
	}
	if (diffInDays < 7) {
		return diffInDays === 1 ? "Il y a 1 jour" : `Il y a ${diffInDays} jours`;
	}
	if (diffInDays < 30) {
		return diffInWeeks === 1 ? "Il y a 1 semaine" : `Il y a ${diffInWeeks} semaines`;
	}
	if (diffInDays < 365) {
		return diffInMonths === 1 ? "Il y a 1 mois" : `Il y a ${diffInMonths} mois`;
	}
	
	const diffInYears = Math.floor(diffInDays / 365);
	return diffInYears === 1 ? "Il y a 1 an" : `Il y a ${diffInYears} ans`;
}

// Create job
async function createJob({
	title,
	description,
	location,
	contract_type,
	salary_min,
	salary_max,
	salary,
	remote,
	experience,
	industry,
	contract_duration,
	working_time,
	formation_required,
	requirements,
	benefits,
	urgency,
	education,
	id_company,
}) {
	// On accepte salaryRange OU (salaryMin + salaryMax)
	const min = salary !== undefined ? numOrNull(salary) : numOrNull(salary_min);
	const max = salary !== undefined ? numOrNull(salary) : numOrNull(salary_max);

	logger.debug("[createJob] Données reçues:", {
		title,
		description,
		location,
		contract_type,
		salary_min: min,
		salary_max: max,
		remote,
		experience,
		industry,
		contract_duration,
		working_time,
		formation_required,
		requirements,
		benefits,
		urgency,
		education,
		id_company,
	});

	const { data, error } = await supabase
		.from("job_offer")
		.insert({
			title: title?.trim(),
			description: description?.trim(),
			location: location?.trim(),
			contract_type,
			salary_min: min,
			salary_max: max,
			salary,
			remote,
			experience: experience || 'Non spécifié',
			industry: industry || 'Non spécifié',
			contract_duration: contract_duration || 'Non spécifié',
			working_time: working_time || 'Temps plein',
			formation_required: formation_required || 'Non spécifié',
			requirements: requirements || null,
			benefits: benefits || null,
			urgency: urgency || 'medium',
			education: education || 'Non spécifié',
			id_company,
		})
		.select()
		.single();

	if (error) {
		logger.error("[createJob] error:", error);
		logger.error("[createJob] Détails de l'erreur:", {
			message: error.message,
			details: error.details,
			hint: error.hint,
			code: error.code
		});
		throw error;
	}

	logger.debug("[createJob] Offre créée avec succès:", data);
	return data;
}

// Find job by id
async function findById(id) {
	const { data, error } = await supabase.from("job_offer").select(`
		*,
		company!inner(id_company, name, logo, industry, city, country)
	`).eq("id_job_offer", id).single();

	if (error && error.code !== "PGRST116") {
		logger.error("[findById] error:", error);
		return null;
	}

	if (data) {
		// Récupérer le nombre de candidatures pour cette offre
		let applicationsCount = 0;
		try {
			const { count, error: countError } = await supabase
				.from('apply')
				.select('id_user', { count: 'exact', head: true })
				.eq('id_job_offer', data.id_job_offer);
			
			if (!countError) {
				applicationsCount = count || 0;
			}
		} catch (countErr) {
			logger.debug("[findById] Erreur récupération nombre candidatures:", countErr);
		}

		// Utiliser le même format enrichi que searchJobs pour la compatibilité frontend
		const enrichedJob = {
			...data,
			id: data.id_job_offer, // Mapping explicite pour le frontend
			created_by: data.id_company, // L'entreprise qui a créé l'offre
			company: data.company?.name || 'Entreprise inconnue', // Nom de l'entreprise
			companyId: data.id_company, // ID de l'entreprise
			companyLogo: data.company?.logo || null, // Logo de l'entreprise
			company_logo: data.company?.logo || null, // Alias pour compatibilité
			type: data.contract_type || 'Non spécifié', // Mapping contract_type vers type pour le frontend
			// Construction de l'objet salary pour le frontend
			salary: (data.salary_min || data.salary_max) ? {
				min: data.salary_min || 0,
				max: data.salary_max || 0,
				currency: 'EUR'
			} : null,
			// Gestion des champs optionnels
			remote: data.remote || false,
			experience: data.experience || 'Non spécifié',
			industry: data.industry || 'Non spécifié',
			contract_duration: data.contract_duration || 'Non spécifié',
			working_time: data.working_time || 'Non spécifié',
			formation_required: data.formation_required || 'Non spécifié',
			education: data.education || 'Non spécifié',
			urgency: data.urgency || 'medium',
			benefits: data.benefits || [],
			requirements: data.requirements || [],
			skills: Array.isArray(data.requirements) ? data.requirements : (data.requirements ? data.requirements.split(',').map(s => s.trim()) : []),
			timeAgo: getTimeAgo(data.published_at),
			applications: applicationsCount, // Nombre de candidatures
			applications_count: applicationsCount, // Alias pour compatibilité
		};

		return enrichedJob;
	}

	return null;
}

// Search jobs
async function searchJobs({ q, location, contractType, minSalary, experience, industry, workMode, education, company, page = 1, limit = 20 }) {
	page = Number(page) || 1;
	limit = Number(limit) || 20;
	const offset = (page - 1) * limit;

	let query = supabase.from("job_offer").select(`
		*,
		company!inner(id_company, name, logo, industry, city, country)
	`, { count: "exact" });

	// Appliquer les filtres
	if (q) {
		query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
	}
	if (location) {
		// Recherche insensible à la casse et partielle pour la localisation
		// Permet de trouver "Paris" même si la DB contient "Paris, France" ou "paris"
		query = query.ilike("location", `%${location}%`);
	}
	if (contractType) {
		query = query.eq("contract_type", contractType);
	}
	if (minSalary) {
		query = query.gte("salary_min", Number(minSalary));
	}
	if (experience) {
		query = query.ilike("experience", `%${experience}%`);
	}
	if (industry) {
		query = query.ilike("industry", `%${industry}%`);
	}
	if (workMode) {
		// Pour le mode de travail, on peut filtrer sur remote ou d'autres champs
		if (workMode.toLowerCase().includes('remote')) {
			query = query.eq("remote", true);
		} else if (workMode.toLowerCase().includes('présentiel') || workMode.toLowerCase().includes('presentiel')) {
			query = query.eq("remote", false);
		}
	}
	if (education) {
		query = query.ilike("formation_required", `%${education}%`);
	}
	
	// 🏢 FILTRE PAR ENTREPRISE
	// Si un ID d'entreprise est fourni, filtrer par cet ID
	if (company) {
		logger.debug(`[searchJobs] Filtrage par entreprise: ${company} (type: ${typeof company})`);
		// Si c'est un nombre, filtrer par ID d'entreprise
		if (!isNaN(company)) {
			const companyId = parseInt(company);
			logger.debug(`[searchJobs] Filtrage par ID d'entreprise: ${companyId}`);
			query = query.eq("id_company", companyId);
		} else {
			// Si c'est une chaîne, filtrer par nom d'entreprise via la jointure
			logger.debug(`[searchJobs] Filtrage par nom d'entreprise: ${company}`);
			query = query.eq("company.name", company);
		}
	}

	// Pagination et tri
	query = query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);

	const { data, error, count } = await query;

	if (error) {
		logger.error("[searchJobs] error:", error);
		throw error;
	}

	// Ajouter les champs supplémentaires pour la compatibilité
	const items = (data || []).map((job) => ({
		...job,
		id: job.id_job_offer, // Mapping explicite pour le frontend
		created_by: job.id_company, // L'entreprise qui a créé l'offre
		company: job.company?.name || 'Entreprise inconnue', // Nom de l'entreprise
		companyId: job.id_company, // ID de l'entreprise
		companyLogo: job.company?.logo || null, // Logo de l'entreprise
		company_logo: job.company?.logo || null, // Alias pour compatibilité
		type: job.contract_type || 'Non spécifié', // Mapping contract_type vers type pour le frontend
		// Construction de l'objet salary pour le frontend
		salary: (job.salary_min || job.salary_max) ? {
			min: job.salary_min || 0,
			max: job.salary_max || 0,
			currency: 'EUR'
		} : null,
		// Gestion des champs optionnels
		remote: job.remote || false,
		experience: job.experience || 'Non spécifié',
		industry: job.industry || 'Non spécifié',
		contract_duration: job.contract_duration || 'Non spécifié',
		working_time: job.working_time || 'Non spécifié',
		formation_required: job.formation_required || 'Non spécifié',
		education: job.education || 'Non spécifié',
		urgency: job.urgency || 'medium',
		benefits: job.benefits || [],
		requirements: job.requirements || [],
		skills: Array.isArray(job.requirements) ? job.requirements : (job.requirements ? job.requirements.split(',').map(s => s.trim()) : []),
		timeAgo: getTimeAgo(job.published_at),
	}));

	return { items, page, limit, total: count || 0 };
}


// Update job
async function updateJob(id, changes = {}) {
	const allowedFields = [
		"title", "description", "location", "contract_type", "id_company",
		"salary_min", "salary_max", "salary", "remote", "experience", 
		"industry", "contract_duration", "working_time", "formation_required"
	];
	const updateData = {};

	// Filtrer les champs autorisés
	Object.keys(changes).forEach((key) => {
		if (allowedFields.includes(key) && changes[key] !== undefined) {
			// Traitement spécial pour les champs numériques
			if (["salary_min", "salary_max", "salary"].includes(key)) {
				updateData[key] = numOrNull(changes[key]);
			} else {
				updateData[key] = changes[key];
			}
		}
	});

	if (Object.keys(updateData).length === 0) return null;

	const { data, error } = await supabase.from("job_offer").update(updateData).eq("id_job_offer", id).select().single();

	if (error) {
		logger.error("[updateJob] error:", error);
		return null;
	}

	if (data) {
		// Ajouter les champs supplémentaires pour la compatibilité
		data.id = data.id_job_offer; // Mapping explicite pour le frontend
		data.created_by = data.id_company; // L'entreprise qui a créé l'offre
		data.company = data.company?.name || 'Entreprise inconnue'; // Nom de l'entreprise
		data.companyId = data.id_company; // ID de l'entreprise
		data.type = data.contract_type || 'Non spécifié'; // Mapping contract_type vers type pour le frontend
		// Construction de l'objet salary pour le frontend
		data.salary = (data.salary_min || data.salary_max) ? {
			min: data.salary_min || 0,
			max: data.salary_max || 0,
			currency: 'EUR'
		} : null;
		// Gestion des champs optionnels
		data.remote = data.remote || false;
		data.experience = data.experience || 'Non spécifié';
		data.industry = data.industry || 'Non spécifié';
		data.contract_duration = data.contract_duration || 'Non spécifié';
		data.working_time = data.working_time || 'Non spécifié';
		data.formation_required = data.formation_required || 'Non spécifié';
		data.education = data.education || 'Non spécifié';
		data.urgency = data.urgency || 'medium';
		data.benefits = data.benefits || [];
		data.requirements = data.requirements || [];
		data.skills = data.requirements ? data.requirements.split(',').map(s => s.trim()) : [];
	}

	return data || null;
}

// Remove job
async function removeJob(id) {
	const { error } = await supabase.from("job_offer").delete().eq("id_job_offer", id);

	if (error) {
		logger.error("[removeJob] error:", error);
		return false;
	}

	return true;
}

async function getAllJobs({ page = 1, limit = 20, search = null } = {}) {
	try {
		page = Number(page) || 1;
		limit = Number(limit) || 20;
		const offset = (page - 1) * limit;

		let query = supabase.from("job_offer").select(`
			*,
			company!inner(id_company, name, logo, industry, city, country)
		`, { count: "exact" });

		if (search) {
			query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
		}

		query = query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);

		const { data, error, count } = await query;

		if (error) {
			logger.error("[getAllJobs] error:", error);
			throw error;
		}

		// Ajouter timeAgo à toutes les offres
		const items = (data || []).map((job) => ({
			...job,
			id: job.id_job_offer, // Mapping explicite pour le frontend
			company: job.company?.name || 'Entreprise inconnue', // Nom de l'entreprise
			companyId: job.id_company, // ID de l'entreprise
			companyLogo: job.company?.logo || null, // Logo de l'entreprise
			company_logo: job.company?.logo || null, // Alias pour compatibilité
			type: job.contract_type || 'Non spécifié', // Mapping contract_type vers type pour le frontend
			// Construction de l'objet salary pour le frontend
			salary: (job.salary_min || job.salary_max) ? {
				min: job.salary_min || 0,
				max: job.salary_max || 0,
				currency: 'EUR'
			} : null,
			// Gestion des champs optionnels
			remote: job.remote || false,
			experience: job.experience || 'Non spécifié',
			industry: job.industry || 'Non spécifié',
			contract_duration: job.contract_duration || 'Non spécifié',
			working_time: job.working_time || 'Non spécifié',
			formation_required: job.formation_required || 'Non spécifié',
			education: job.education || 'Non spécifié',
			urgency: job.urgency || 'medium',
			benefits: job.benefits || [],
			requirements: job.requirements || [],
			timeAgo: getTimeAgo(job.published_at),
		}));

	return { 
		data: items, 
		pagination: {
			page, 
			limit, 
			total: count || 0,
			totalPages: Math.ceil((count || 0) / limit)
		}
	};
	} catch (err) {
		logger.error("getAllJobs error:", err);
		throw err;
	}
}

/**
 * Récupère des suggestions de titres de postes basées sur les offres existantes
 * @param {string} query - Terme de recherche (optionnel, minimum 2 caractères)
 * @returns {Promise<string[]>} Liste des titres suggérés (max 10)
 */
async function getJobTitleSuggestions(query = "") {
	try {
		let queryBuilder = supabase
			.from("job_offer")
			.select("title", { count: "exact" })
			.not("title", "is", null);

		// Si un terme de recherche est fourni (minimum 2 caractères)
		if (query && query.length >= 2) {
			queryBuilder = queryBuilder.ilike("title", `%${query}%`);
		}

		// Récupérer les titres uniques, limités à 10, triés par ordre alphabétique
		const { data, error } = await queryBuilder
			.order("title", { ascending: true })
			.limit(100); // Récupérer plus pour avoir une bonne diversité

		if (error) {
			logger.error("[getJobTitleSuggestions] error:", error);
			return [];
		}

		// Extraire les titres uniques et limiter à 10
		const uniqueTitles = [...new Set((data || []).map(job => job.title.trim()))]
			.filter(title => title.length > 0)
			.slice(0, 10);

		return uniqueTitles;
	} catch (err) {
		logger.error("getJobTitleSuggestions error:", err);
		return [];
	}
}

/**
 * Récupère des suggestions de localisations
 * Combine les localisations de la base de données avec une liste complète de villes françaises/européennes
 * @param {string} query - Terme de recherche (optionnel, minimum 2 caractères)
 * @returns {Promise<string[]>} Liste des localisations suggérées (max 10)
 * 
 * AMÉLIORATION: Utilise une liste complète de villes françaises/européennes + localisations de la DB
 * pour garantir que TOUTES les localisations possibles sont disponibles, même sans offres associées
 */
async function getLocationSuggestions(query = "") {
	try {
		// Liste complète des villes françaises principales + "Remote" et variantes
		const commonLocations = [
			"Remote", "Télétravail", "Hybride",
			"Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier",
			"Bordeaux", "Lille", "Rennes", "Reims", "Saint-Étienne", "Toulon", "Le Havre", "Grenoble",
			"Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis", "Le Mans", "Aix-en-Provence",
			"Clermont-Ferrand", "Brest", "Limoges", "Tours", "Amiens", "Perpignan", "Metz", "Besançon",
			"Boulogne-Billancourt", "Orléans", "Mulhouse", "Caen", "Rouen", "Nancy", "Argenteuil",
			"Montreuil", "Saint-Paul", "Roubaix", "Tourcoing", "Nanterre", "Avignon", "Créteil",
			"Dunkirk", "Poitiers", "Asnières-sur-Seine", "Versailles", "Courbevoie", "Vitry-sur-Seine",
			"Colombes", "Aulnay-sous-Bois", "La Rochelle", "Champigny-sur-Marne", "Rueil-Malmaison",
			"Antibes", "Bourges", "Cannes", "Calais", "Béziers", "Mérignac", "Drancy", "Saint-Maur-des-Fossés",
			"Colmar", "Issy-les-Moulineaux", "Noisy-le-Grand", "Évry", "Villeneuve-d'Ascq", "Cergy",
			"Pessac", "Valence", "Antony", "La Seyne-sur-Mer", "Troyes", "Clichy", "Montauban",
			"Neuilly-sur-Seine", "Pantin", "Niort", "Sarcelles", "Le Blanc-Mesnil", "Fort-de-France",
			"Chambéry", "Lorient", "Beauvais", "Annecy", "Belfort", "Brive-la-Gaillarde", "Cholet",
			"Vannes", "Bayonne", "Épinay-sur-Seine", "Meaux", "Saint-Ouen", "Bondy", "Évry-Courcouronnes",
			"Chartres", "Gennevilliers", "Fréjus", "Massy", "Bourg-en-Bresse", "Sète", "Albi", "Gap",
			"Blois", "Châteauroux", "Mâcon", "Agen", "Laval", "Thionville", "Roanne", "Montbéliard",
			"Bourg-en-Bresse", "Annemasse", "Lons-le-Saunier", "Yerres", "Douai", "Haguenau", "Arles",
			"Saint-Brieuc", "Lunel", "Bergerac", "Montluçon", "Brignoles", "Castres", "Libourne",
			// Grandes villes européennes
			"Londres", "Berlin", "Madrid", "Rome", "Amsterdam", "Bruxelles", "Vienne", "Zurich",
			"Barcelone", "Milan", "Munich", "Lisbonne", "Dublin", "Copenhague", "Stockholm", "Oslo",
			"Helsinki", "Varsovie", "Prague", "Budapest", "Athènes", "Bucarest", "Sofia"
		];

		// Récupérer les localisations de la base de données
		let dbLocations = new Set();
		let offset = 0;
		const limit = 1000;
		const maxIterations = 5; // Limiter à 5 passes pour la performance
		let hasMore = true;
		let iteration = 0;

		// Récupérer les localisations de la DB en plusieurs passes
		while (hasMore && iteration < maxIterations) {
			let queryBuilder = supabase
				.from("job_offer")
				.select("location")
				.not("location", "is", null)
				.neq("location", "");

			if (query && query.length >= 2) {
				queryBuilder = queryBuilder.ilike("location", `%${query}%`);
			}

			const { data, error } = await queryBuilder
				.order("location", { ascending: true })
				.range(offset, offset + limit - 1);

			if (error) {
				logger.debug("[getLocationSuggestions] Erreur DB (non critique):", error.message);
				break;
			}

			if (data && data.length > 0) {
				data.forEach(job => {
					const location = job.location?.trim();
					if (location && location.length > 0) {
						dbLocations.add(location);
					}
				});

				if (data.length < limit) {
					hasMore = false;
				} else {
					offset += limit;
					iteration++;
				}
			} else {
				hasMore = false;
			}
		}

		// Combiner les localisations communes avec celles de la DB
		const allLocations = new Set([...commonLocations, ...Array.from(dbLocations)]);

		// Filtrer par terme de recherche si fourni
		let filteredLocations = Array.from(allLocations);
		if (query && query.length >= 2) {
			const queryLower = query.toLowerCase();
			filteredLocations = filteredLocations.filter(loc => 
				loc.toLowerCase().includes(queryLower)
			);
		}

		// Trier et limiter à 10
		// Prioriser les localisations qui commencent par la recherche
		const sortedLocations = filteredLocations.sort((a, b) => {
			const aLower = a.toLowerCase();
			const bLower = b.toLowerCase();
			const queryLower = query?.toLowerCase() || "";
			
			// Les localisations qui commencent par la recherche en premier
			const aStarts = aLower.startsWith(queryLower);
			const bStarts = bLower.startsWith(queryLower);
			
			if (aStarts && !bStarts) return -1;
			if (!aStarts && bStarts) return 1;
			
			// Sinon tri alphabétique
			return aLower.localeCompare(bLower);
		}).slice(0, 10);

		logger.debug(`[getLocationSuggestions] ${sortedLocations.length} localisations retournées (${dbLocations.size} de la DB + ${commonLocations.length} communes, recherche: "${query}")`);
		
		return sortedLocations;
	} catch (err) {
		logger.error("getLocationSuggestions error:", err);
		return [];
	}
}

export { createJob, findById, searchJobs, updateJob, removeJob, getAllJobs, getJobTitleSuggestions, getLocationSuggestions };