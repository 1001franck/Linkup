"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Stars } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/layout/container';
import { CompanyCard } from '@/components/ui/company-card';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { useCompanyPagination } from '@/hooks/use-company-pagination';
import { MarketingCompany } from '@/lib/marketing-data';

interface MarketingHomeProps {
	featuredCompanies: MarketingCompany[];
}

export default function MarketingHome({ featuredCompanies }: MarketingHomeProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [location, setLocation] = useState('');
	const [activeFilter, setActiveFilter] = useState('Toutes');

	const filteredCompanies = useMemo(() => {
		return featuredCompanies.filter((company) => {
			const matchesFilter = activeFilter === 'Toutes' || company.sector.includes(activeFilter);
			const matchesSearch =
				!searchTerm ||
				company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				company.sector.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesLocation =
				!location || company.locations.toLowerCase().includes(location.toLowerCase());
			return matchesFilter && matchesSearch && matchesLocation;
		});
	}, [featuredCompanies, activeFilter, searchTerm, location]);

	const {
		currentItems,
		currentPage,
		totalPages,
		goToNext,
		goToPrevious,
	} = useCompanyPagination({
		companies: filteredCompanies,
		itemsPerPage: 4,
	});

	const handleSearch = () => {
		const params = new URLSearchParams();
		if (searchTerm.trim()) params.set('search', searchTerm.trim());
		if (location.trim()) params.set('location', location.trim());
		router.push(`/jobs${params.size ? `?${params.toString()}` : ''}`);
	};

	const industries = ['Toutes', 'Tech', 'Fintech', 'IA', 'Création'];

	return (
		<div className="flex flex-col gap-16">
			<section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
				<Container className="py-24 lg:py-32">
					<div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="space-y-8">
							<p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-cyan-300 ring-1 ring-white/20">
								<Stars className="h-4 w-4" />
								Plateforme n°1 pour les talents tech
							</p>
							<h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
								Connectez-vous aux{' '}
								<span className="text-cyan-300">entreprises qui innovent</span>
							</h1>
							<p className="text-lg text-slate-200">
								Trouvez votre prochain défi professionnel parmi des entreprises triées sur le
								volet. Recherche intelligente, matching par IA et accompagnement carrière.
							</p>

							<div className="rounded-3xl bg-white/10 p-6 backdrop-blur ring-1 ring-white/15">
								<div className="flex flex-col gap-4 md:flex-row">
									<div className="flex-1">
										<label className="mb-2 block text-sm font-medium text-slate-200">
											Poste recherché
										</label>
										<div className="relative">
											<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
											<Input
												value={searchTerm}
												onChange={(event) => setSearchTerm(event.target.value)}
												placeholder="Designer, Product Manager..."
												className="border-0 bg-white/90 pl-10 text-slate-900 placeholder:text-slate-400"
												onKeyDown={(event) => {
													if (event.key === 'Enter') handleSearch();
												}}
											/>
										</div>
									</div>
									<div className="flex-1">
										<label className="mb-2 block text-sm font-medium text-slate-200">
											Localisation
										</label>
										<div className="relative">
											<MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
											<Input
												value={location}
												onChange={(event) => setLocation(event.target.value)}
												placeholder="Paris, Remote..."
												className="border-0 bg-white/90 pl-10 text-slate-900 placeholder:text-slate-400"
												onKeyDown={(event) => {
													if (event.key === 'Enter') handleSearch();
												}}
											/>
										</div>
									</div>
								</div>
								<Button
									size="lg"
									className="mt-4 w-full bg-cyan-400 text-slate-900 hover:bg-cyan-300"
									onClick={handleSearch}
								>
									Rechercher une opportunité
								</Button>
							</div>
						</div>

						<div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
							<div className="grid gap-4">
								{featuredCompanies.slice(0, 3).map((company) => (
									<div key={company.id} className="rounded-2xl bg-white/10 p-4">
										<p className="text-sm text-cyan-200">{company.sector}</p>
										<p className="text-lg font-semibold text-white">{company.name}</p>
										<p className="text-sm text-slate-300">{company.locations}</p>
										<div className="mt-3 flex items-center justify-between text-sm text-slate-200">
											<span>{company.employees}</span>
											<span>{company.offers} offres</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</Container>
			</section>

			<section className="space-y-8">
				<Container>
					<div className="flex flex-wrap items-center gap-3">
						{industries.map((filter) => (
							<Button
								key={filter}
								variant={filter === activeFilter ? 'default' : 'secondary'}
								className="cursor-pointer rounded-full"
								onClick={() => setActiveFilter(filter)}
							>
								{filter}
							</Button>
						))}
					</div>
				</Container>

				<Container>
					<div className="grid gap-8 md:grid-cols-2">
						{currentItems.map((company, index) => (
							<motion.div key={company.id} layout>
								<CompanyCard
									company={company}
									index={index}
									onFollow={() => null}
									onViewOffers={() => router.push(`/jobs?company=${company.name}`)}
								/>
							</motion.div>
						))}
					</div>

					{totalPages > 1 && (
						<div className="mt-8">
							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								onNext={goToNext}
								onPrevious={goToPrevious}
							/>
						</div>
					)}
				</Container>
			</section>
		</div>
	);
}







