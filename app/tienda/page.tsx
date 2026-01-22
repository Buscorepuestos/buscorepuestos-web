'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import CardPrice from '../core/components/cards/CardPrice'
import { IProductMongoose } from '../types/product'
import SearchBar from '../core/components/SearchBar'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useRouter } from 'next/navigation'
import Filters from '../core/components/filters/filters'
import Facilities from '../core/components/facilities/Facilities'
import NotFoundInStore from '../core/components/notFound/NotFoundInStore'
import FilterTag from '../core/components/filterTag/FilterTag'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import {
	fetchProducts,
	setCurrentPage,
} from '../redux/features/productSearchSlice'
import { useUserLocation } from '../hooks/useUserLoaction'
import './tienda.css'

export default function Store() {
	const dispatch = useAppDispatch()
	const {
		error: searchError,
		loading: searchLoading,
		searchResults,
		currentPage,
		totalPages,
	} = useAppSelector((state) => state.productSearch)
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('')
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
	const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
	const [selectedModel, setSelectedModel] = useState<string | null>(null)
	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'proximity' | null>(null);
	const [isTyping, setIsTyping] = useState(false)
	const debounceTimer = useRef<NodeJS.Timeout | null>(null)

	const { province: userProvince, requestLocation } = useUserLocation();

	useEffect(() => {
		// Pedir la ubicación una sola vez al cargar el componente
		requestLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		dispatch({ type: 'auth/checkUserStatus' })
		const debounceTimer = setTimeout(() => {
			setLoading(true);
			dispatch(
				fetchProducts({
					searchTerm: inputValue.trim(),
					page: currentPage,
					sortOrder,
					userProvince: sortOrder === 'proximity' ? userProvince : null,
					// Pasamos todos los filtros seleccionados
					subcategory: selectedSubcategory,
					brand: selectedBrand,
					model: selectedModel,
					year: selectedYear,
				})
			).finally(() => setLoading(false));
		}, 500); // 500ms de 
		return () => clearTimeout(debounceTimer);
	}, [dispatch, inputValue, currentPage, sortOrder, userProvince, selectedSubcategory, selectedBrand, selectedModel, selectedYear]);


	useEffect(() => {
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}

		if (inputValue.trim() !== '') {
			setIsTyping(true)
			debounceTimer.current = setTimeout(() => {
				setIsTyping(false)
				setLoading(true)
				dispatch(
					fetchProducts({
						searchTerm: inputValue.trim(),
						page: 1,
						sortOrder,
					})
				).finally(() => setLoading(false))
			}, 1000)
		}

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValue, sortOrder])

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			dispatch(setCurrentPage(currentPage + 1))
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			dispatch(setCurrentPage(currentPage - 1))
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
		dispatch(setCurrentPage(1))
	}

	const handleSubcategoryChange = (subcategory: string | null) => {
		setSelectedSubcategory(subcategory);
		// Reseteamos los filtros dependientes
		setSelectedBrand(null);
		setSelectedModel(null);
		setSelectedYear(null);
		dispatch(setCurrentPage(1));
	};

	const handleBrandChange = (brand: string | null) => {
		setSelectedBrand(brand)
		// Reseteamos los filtros dependientes
		setSelectedModel(null)
		setSelectedYear(null)
		dispatch(setCurrentPage(1))
	}

	const handleModelChange = (model: string | null) => {
		setSelectedModel(model)
		// Reseteamos el filtro de año
		setSelectedYear(null)
		dispatch(setCurrentPage(1))
	}

	const handleYearChange = (year: number | null) => {
		setSelectedYear(year)
		dispatch(setCurrentPage(1))
	}

	const handle = (productId: string) => {
		setLoadingPurchase(productId)
		router.push(`/producto/${productId}`)
	}

	const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(event.target.value as 'asc' | 'desc' | 'proximity' | null);
		dispatch(setCurrentPage(1))
	}

	const handleClearSearch = () => {
		setInputValue('');
		dispatch(setCurrentPage(1));
	};

	const activeFilters = [
		selectedSubcategory && { type: 'subcategory', value: selectedSubcategory },
		selectedBrand && { type: 'brand', value: selectedBrand },
		selectedModel && { type: 'model', value: selectedModel },
		selectedYear && { type: 'year', value: selectedYear.toString() },
	].filter(Boolean) as { type: string, value: string }[]

	const removeFilter = (filterType: string) => {
		if (filterType === 'subcategory') handleSubcategoryChange(null)
		else if (filterType === 'brand') handleBrandChange(null)
		else if (filterType === 'model') handleModelChange(null)
		else if (filterType === 'year') handleYearChange(null)
	}

	const shouldShowFiltersAndSort = searchResults.length > 0 || loading || isTyping;

	return (
		<main className="m-auto max-w-[1170px] mt-80 mobile:mt-[15vw] xl:w-[95%] lg:w-[90%] md:w-[85%] sm:w-[82%]">
			<div className={shouldShowFiltersAndSort ? 'sm:grid sm:grid-cols-custom-filters sm:gap-10 ' : ''}>
				{
					shouldShowFiltersAndSort && (
						<div className="mobile:hidden">
							<Filters
								onSubcategoryChange={handleSubcategoryChange}
								onBrandChange={handleBrandChange}
								onModelChange={handleModelChange}
								onYearChange={handleYearChange}
								selectedBrand={selectedBrand}
								selectedModel={selectedModel}
								selectedYear={selectedYear}
								selectedSubcategory={selectedSubcategory}
							/>
						</div>
					)
				}

				<div className="flex flex-col gap-5 sm:max-h-[1500rem] mobile:items-center">
					<Facilities
						classNamePrincipal="
							flex w-full my-5 md:gap-14 sm:gap-3 bg-gray-200 font-tertiary-font 
							text-secondary-blue font-semibold h-[5rem] mobile:h-[6rem] justify-center 
							rounded-3xl lg:text-[14px] md:text-[1.1vw] sm:text-[1.2vw] mobile:text-[3.2vw] mobile:px-[2.9rem]
							mobile:grid mobile:grid-cols-2 mobile:gap-0 mobile:w-[85%] mobile:font-normal mobile:py-[1rem]
						"
						classNameImg="lg:w-[1.8vw] md:w-[2.5vw] sm:w-[3vw] mobile:w-[8vw]"
					/>
					<div className={shouldShowFiltersAndSort ? 'flex justify-end' : 'flex justify-center'}>
						<SearchBar
							value={inputValue} // <-- AÑADIDO: El valor del input ahora es controlado por la prop
							onChange={handleInputChange}
							height={'52px'}
							width={'w-[480px] mobile:w-[80vw]'}
							borderColor={'#12B1BB'}
							borderWidth={'2px'}
							onClear={handleClearSearch} // <-- NUEVO: Función para limpiar la búsqueda
						/>
					</div>
					<div className='mobile:w-full mobile:flex mobile:justify-between mobile:items-center mobile:px-4'>
						{
							shouldShowFiltersAndSort && (
								<div className="sm:hidden mobile:w-full mobile:mt-4 px-[8vw]">
									<Filters
										onSubcategoryChange={handleSubcategoryChange}
										onBrandChange={handleBrandChange}
										onModelChange={handleModelChange}
										onYearChange={handleYearChange}
										selectedBrand={selectedBrand}
										selectedModel={selectedModel}
										selectedYear={selectedYear}
										selectedSubcategory={selectedSubcategory}
									/>
								</div>
							)
						}
						{
							shouldShowFiltersAndSort && (
								<div className="flex w-[100%] mr-11 justify-end sm:my-4">
									<select
										className="border border-gray-300 p-2 rounded mobile:text-sm"
										value={sortOrder || ''}
										onChange={handleSortOrderChange}
									>
										<option disabled value="">
											Ordenar por
										</option>
										{/* NUEVA OPCIÓN */}
										<option value="proximity" disabled={!userProvince}>
											Proximidad (más cercanos)
										</option>
										<option value="asc">Precio: Menor a Mayor</option>
										<option value="desc">Precio: Mayor a Menor</option>
									</select>
								</div>
							)
						}

					</div>

					<div className="flex flex-wrap gap-2 w-full mobile:px-6">
						{activeFilters.map((filter) => (
							<FilterTag
								key={filter.type}
								filterName={`${filter.value}`}
								onRemove={() => removeFilter(filter.type)}
							/>
						))}
					</div>
					{isTyping ? (
						<div className="flex justify-center my-4">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
							<span className="ml-2">Buscando...</span>
						</div>
					) : loading ? (
						<div className="flex justify-center my-4">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
						</div>
					) : error ? (
						<p>Error</p>
					) : (
						<>
							{searchResults.length > 0 ? (
								<section
									className={
										'grid grid-cols-4 grid-rows-4 tablet:grid-cols-3 tablet:grid-rows-3 mobile:grid-cols-2 mobile:grid-rows-2'
									}
								>
									{searchResults.map((product: any, index) => (
										<CardPrice
											key={index}
											title={product.title}
											reference={product.mainReference!}
											description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
											price={
												product?.buscorepuestosPrice || 0
											}
											image={
												product.images[0]
													? product.images[0]
													: '/nodisponible.png'
											}
											handle={() => handle(product._id)}
											id={product._id}
											loading={
												loadingPurchase === product._id
											}
											location={product.distributorProvince}
											shippingIncluded={true}
										/>
									))}
								</section>
							) : (
								<NotFoundInStore />
							)}
						</>
					)}
					{
						searchResults.length > 0 && !loading && !isTyping && (
							<div className="pagination-controls flex justify-center items-center gap-4 mt-4 mb-4">
								<button
									onClick={handlePrevPage}
									disabled={currentPage === 0}
								>
									<ChevronLeftIcon className="w-8 h-8 text-primary-blue hover:text-primary-lila" />
								</button>
								<span>{`Página ${currentPage} de ${totalPages}`}</span>
								<button
									onClick={handleNextPage}
									disabled={currentPage === totalPages - 1}
								>
									<ChevronRightIcon className="w-8 h-8 text-primary-blue hover:text-primary-lila" />
								</button>
							</div>
						)
					}

				</div>
			</div>
		</main>
	)
}
