/**
 * Hook personnalisé pour la pagination des entreprises
 * Respect des principes SOLID, KISS et DRY
 */

import { useState, useEffect } from 'react';

interface UseCompanyPaginationProps<T> {
	companies: T[];
	itemsPerPage?: number;
}

interface UseCompanyPaginationReturn<T> {
	currentPage: number;
	totalPages: number;
	currentItems: T[];
	goToPage: (page: number) => void;
	goToNext: () => void;
	goToPrevious: () => void;
	resetPagination: () => void;
}

/**
 * Hook pour gérer la pagination des entreprises
 * Single Responsibility: Gestion uniquement de la pagination
 * Open/Closed: Extensible via paramètres
 */
export function useCompanyPagination<T>({
	companies,
	itemsPerPage = 4,
}: UseCompanyPaginationProps<T>): UseCompanyPaginationReturn<T> {
	const [currentPage, setCurrentPage] = useState(0);

	const totalPages = Math.max(1, Math.ceil(companies.length / itemsPerPage));
	const startIndex = currentPage * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = companies.slice(startIndex, endIndex);

	const goToPage = (page: number) => {
		if (page >= 0 && page < totalPages) {
			setCurrentPage(page);
		}
	};

	const goToNext = () => {
		if (currentPage < totalPages - 1) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const goToPrevious = () => {
		if (currentPage > 0) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	const resetPagination = () => {
		setCurrentPage(0);
	};

	useEffect(() => {
		resetPagination();
	}, [companies.length]);

	return {
		currentPage,
		totalPages,
		currentItems,
		goToPage,
		goToNext,
		goToPrevious,
		resetPagination,
	};
}
