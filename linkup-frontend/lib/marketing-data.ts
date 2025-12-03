import defaultFeaturedCompanies from '@/data/defaultFeaturedCompanies';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	process.env.NEXT_PUBLIC_INTERNAL_API_URL ||
	typeof window === 'undefined'
		? process.env.NEXT_PUBLIC_API_URL
		: '';

export interface MarketingCompany {
	id: string;
	name: string;
	sector: string;
	locations: string;
	employees: string;
	offers: number;
	logo: string;
	logoColor: string;
	image: string;
}

function mapApiCompany(company: any): MarketingCompany {
	const locationParts = [company.city, company.country].filter(Boolean).join(', ');
	return {
		id: String(company.id_company || company.Id_company || company.id || crypto.randomUUID()),
		name: company.name || 'Entreprise confidentielle',
		sector: company.industry || 'Secteur non spécifié',
		locations: locationParts || 'Localisation non communiquée',
		employees: company.employees_number || 'Taille non précisée',
		offers: company.jobsAvailable || 0,
		logo: company.logo || 'FaBuilding',
		logoColor: 'text-cyan-500',
		image:
			company.cover_image ||
			company.image ||
			'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
	};
}

export async function fetchFeaturedCompanies(): Promise<MarketingCompany[]> {
	if (!API_BASE_URL) {
		return defaultFeaturedCompanies;
	}

	try {
		const response = await fetch(`${API_BASE_URL}/companies?limit=12&page=1`, {
			next: { revalidate: 300 },
			cache: 'force-cache',
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const payload = await response.json();
		const companies = payload?.data?.data || payload?.data || [];

		if (!Array.isArray(companies) || companies.length === 0) {
			return defaultFeaturedCompanies;
		}

		return companies.map(mapApiCompany);
	} catch (error) {
		console.warn('[marketing-data] Impossible de récupérer les entreprises:', error);
		return defaultFeaturedCompanies;
	}
}




