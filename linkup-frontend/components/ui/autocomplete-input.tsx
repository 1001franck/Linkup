/**
 * Composant d'autocomplétion pour les champs de recherche
 * Utilisé pour les suggestions de postes et localisations
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';
// Note: On utilise fetch directement car les endpoints de suggestions sont publics

interface AutocompleteInputProps {
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	onSelect?: (value: string) => void;
	type: 'title' | 'location';
	icon?: React.ReactNode;
	className?: string;
}

export function AutocompleteInput({
	placeholder,
	value,
	onChange,
	onSelect,
	type,
	icon,
	className = ""
}: AutocompleteInputProps) {
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const [cityDataset, setCityDataset] = useState<string[]>([]);
	const cityDatasetLoaded = useRef(false);

	const loadCityDataset = useCallback(async () => {
		if (cityDatasetLoaded.current) return;
		cityDatasetLoaded.current = true;

		try {
			const { City, Country } = await import('country-state-city');
			const franceCities = City.getCitiesOfCountry('FR') || [];
			const europeanCountries = ['BE', 'CH', 'DE', 'ES', 'IT', 'NL', 'GB', 'PT', 'AT', 'IE'];
			const europeanCities = europeanCountries.flatMap((countryCode) => {
				const cities = City.getCitiesOfCountry(countryCode) || [];
				return cities.map((city) => {
					const countryName = Country.getCountryByCode(countryCode)?.name || '';
					return countryCode === 'FR' ? city.name : `${city.name}${countryName ? `, ${countryName}` : ''}`;
				});
			});

			const formattedCities = [
				'Remote',
				'Télétravail',
				'Hybride',
				'Télétravail partiel',
				...franceCities.map((city) => city.name),
				...europeanCities,
			];

			setCityDataset([...new Set(formattedCities)]);
		} catch (error) {
			console.error('Erreur lors du chargement des villes:', error);
			setCityDataset([
				'Remote',
				'Télétravail',
				'Hybride',
				'Paris',
				'Lyon',
				'Marseille',
				'Toulouse',
				'Nice',
				'Nantes',
				'Strasbourg',
				'Montpellier',
				'Bordeaux',
				'Lille',
				'Rennes',
				'Reims',
			]);
		}
	}, []);

	useEffect(() => {
		if (type === 'location' && !cityDatasetLoaded.current) {
			loadCityDataset();
		}
	}, [type, loadCityDataset]);

	// Fonction pour récupérer les suggestions depuis l'API
	const fetchSuggestions = useCallback(async (query: string) => {
		if (query.length < 2) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		setIsLoading(true);
		try {
			if (abortRef.current) {
				abortRef.current.abort();
			}
			const controller = new AbortController();
			abortRef.current = controller;

			if (type === 'location') {
				if (!cityDatasetLoaded.current && !cityDataset.length) {
					await loadCityDataset();
				}
				const queryLower = query.toLowerCase();
				
				const cityMatches = cityDataset.filter(city => 
					city.toLowerCase().includes(queryLower)
				);
				
				try {
					const endpoint = `/jobs/suggestions/locations?q=${encodeURIComponent(query)}`;
					const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
					
					const response = await fetch(`${baseURL}${endpoint}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
						signal: controller.signal,
					});
					
					if (response.ok) {
						const data = await response.json();
						if (data && data.data && Array.isArray(data.data)) {
							// Combiner les villes du package avec celles de la DB
							const dbLocations = data.data.filter((loc: string) => 
								!cityMatches.some(city => city.toLowerCase() === loc.toLowerCase())
							);
							const combined = [...cityMatches, ...dbLocations];
							
							// Prioriser les villes qui commencent par la recherche
							const sorted = combined.sort((a, b) => {
								const aLower = a.toLowerCase();
								const bLower = b.toLowerCase();
								const aStarts = aLower.startsWith(queryLower);
								const bStarts = bLower.startsWith(queryLower);
								
								if (aStarts && !bStarts) return -1;
								if (!aStarts && bStarts) return 1;
								return aLower.localeCompare(bLower);
							});
							
							setSuggestions(sorted.slice(0, 10));
							setShowSuggestions(sorted.length > 0);
							return;
						}
					}
				} catch (apiError) {
					if (!(apiError instanceof DOMException && apiError.name === 'AbortError')) {
						console.warn('Erreur API localisations (utilisation du package uniquement):', apiError);
					}
				}
				
				const sorted = cityMatches.sort((a, b) => {
					const aLower = a.toLowerCase();
					const bLower = b.toLowerCase();
					const aStarts = aLower.startsWith(queryLower);
					const bStarts = bLower.startsWith(queryLower);
					
					if (aStarts && !bStarts) return -1;
					if (!aStarts && bStarts) return 1;
					return aLower.localeCompare(bLower);
				});
				
				setSuggestions(sorted.slice(0, 10));
				setShowSuggestions(sorted.length > 0);
			} else {
				// Pour les titres, on utilise uniquement l'API backend
				const endpoint = `/jobs/suggestions/titles?q=${encodeURIComponent(query)}`;
				const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
				
				const response = await fetch(`${baseURL}${endpoint}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});
				
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				
				const data = await response.json();
				
				if (data && data.data) {
					setSuggestions(data.data);
					setShowSuggestions(data.data.length > 0);
				} else {
					setSuggestions([]);
					setShowSuggestions(false);
				}
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des suggestions:', error);
			setSuggestions([]);
			setShowSuggestions(false);
		} finally {
			setIsLoading(false);
			abortRef.current = null;
		}
	}, [type, cityDataset, loadCityDataset]);

	// Debounce pour éviter trop de requêtes
	useEffect(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			fetchSuggestions(value);
		}, 300); // Attendre 300ms après la dernière frappe

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
			if (abortRef.current) {
				abortRef.current.abort();
				abortRef.current = null;
			}
		};
	}, [value, fetchSuggestions]);

	// Fermer les suggestions quand on clique en dehors
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				inputRef.current &&
				suggestionsRef.current &&
				!inputRef.current.contains(event.target as Node) &&
				!suggestionsRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			if (abortRef.current) {
				abortRef.current.abort();
				abortRef.current = null;
			}
		};
	}, []);

	// Gérer la sélection d'une suggestion
	const handleSelectSuggestion = (suggestion: string) => {
		onChange(suggestion);
		if (onSelect) {
			onSelect(suggestion);
		}
		setShowSuggestions(false);
		setSelectedIndex(-1);
	};

	// Gérer les touches du clavier
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!showSuggestions || suggestions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex(prev => 
					prev < suggestions.length - 1 ? prev + 1 : prev
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
					handleSelectSuggestion(suggestions[selectedIndex]);
				}
				break;
			case 'Escape':
				setShowSuggestions(false);
				setSelectedIndex(-1);
				break;
		}
	};

	const defaultIcon = type === 'title' ? <Search className="h-4 w-4 sm:h-5 sm:w-5" /> : <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />;

	return (
		<div className="relative flex-1">
			<div className="relative">
				{icon && (
					<div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
						{icon}
					</div>
				)}
				{!icon && (
					<div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
						{defaultIcon}
					</div>
				)}
				<Input
					ref={inputRef}
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (suggestions.length > 0) {
							setShowSuggestions(true);
						}
					}}
					className={`${icon ? 'pl-10 sm:pl-12' : 'pl-10 sm:pl-12'} h-12 sm:h-14 border-0 focus:ring-0 text-sm sm:text-lg bg-muted/50 rounded-xl ${className}`}
				/>
				{isLoading && (
					<div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
						<Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground animate-spin" />
					</div>
				)}
			</div>

			{/* Liste des suggestions */}
			{showSuggestions && suggestions.length > 0 && (
				<div
					ref={suggestionsRef}
					className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
				>
					{suggestions.map((suggestion, index) => (
						<button
							key={index}
							type="button"
							onClick={() => handleSelectSuggestion(suggestion)}
							className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
								index === selectedIndex ? 'bg-muted' : ''
							} ${index === 0 ? 'rounded-t-lg' : ''} ${
								index === suggestions.length - 1 ? 'rounded-b-lg' : ''
							}`}
						>
							<div className="flex items-center gap-2">
								{type === 'title' ? (
									<Search className="h-4 w-4 text-muted-foreground" />
								) : (
									<MapPin className="h-4 w-4 text-muted-foreground" />
								)}
								<span className="text-sm">{suggestion}</span>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

