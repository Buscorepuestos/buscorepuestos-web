import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { categories, CategoryKey } from './categories'
import algoliasearch from 'algoliasearch'
import { environment } from '../../../environment/environment'
import FilterTag from '../filterTag/FilterTag'
import './filters.css'

interface FiltersProps {
	initialSubcategory: string | null
	onSubcategoryChange: (subcategory: string | null) => void
	onBrandChange: (brand: string | null) => void
	onModelChange: (model: string | null) => void
	onYearChange: (year: number | null) => void
}

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey
const indexName = environment.algoliaIndexName

const Filters: React.FC<FiltersProps> = ({
	initialSubcategory,
	onSubcategoryChange,
	onBrandChange,
	onModelChange,
	onYearChange,
}) => {
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryKey | null>(null)
	const [selectedSubcategory, setSelectedSubcategory] = useState<
		string | null
	>(null)
	const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
	const [selectedModel, setSelectedModel] = useState<string | null>(null)
	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const [brands, setBrands] = useState<string[]>([])
	const [models, setModels] = useState<string[]>([])
	const [years, setYears] = useState<number[]>([])
	const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false)
	const [selectedFilters, setSelectedFilters] = useState<
		{ type: string; value: string }[]
	>([])

	const algoliaClient = algoliasearch(appID, apiKey)
	const index = algoliaClient.initIndex(indexName)

	useEffect(() => {
		// Mapa de subcategorías a categorías
		const subcategoryCategoryMap: Record<
			string,
			{ category: string; subcategory: string }
		> = {
			'Guarnecidos Palanca Cambio': {
				category: 'INTERIOR',
				subcategory: 'GUARNECIDOS PALANCA CAMBIO',
			},
			'Aleron Trasero': {
				category: 'CARROCERÍA TRASERA',
				subcategory: 'ALERON TRASERO',
			},
			'Faro Derecho': {
				category: 'ALUMBRADO',
				subcategory: 'FARO DERECHO',
			},
			'Airbag Delantero Derecho': {
				category: 'INTERIOR',
				subcategory: 'AIRBAG DELANTERO DERECHO',
			},
			'Conmutador De Arranque': {
				category: 'ELECTRICIDAD',
				subcategory: 'CONMUTADOR DE ARRANQUE',
			},
			'Brazo Suspension Inferior Delantero Izquierdo': {
				category: 'SUSPENSIÓN / FRENOS',
				subcategory: 'BRAZO SUSPENSION INFERIOR DELANTERO IZQUIERDO',
			},
			'Transmision Delantera Izquierda': {
				category: 'DIRECCIÓN / TRANSMISIÓN',
				subcategory: 'TRANSMISION DELANTERA IZQUIERDA',
			},
			'Compresor Aire Acondicionado': {
				category: 'CLIMATIZACIÓN',
				subcategory: 'COMPRESOR AIRE ACONDICIONADO',
			},
			'Enganche Remolque': {
				category: 'ACCESORIOS',
				subcategory: 'ENGANCHE REMOLQUE',
			},
			'Pomo Palanca Cambio': {
				category: 'CAMBIO / EMBRAGUE',
				subcategory: 'POMO PALANCA CAMBIO',
			},
			'Aleta Delantera Derecha': {
				category: 'CARROCERÍA FRONTAL',
				subcategory: 'ALETA DELANTERA DERECHA',
			},
			'Valvula Egr': {
				category: 'MOTOR / ADMISIÓN / ESCAPE',
				subcategory: 'VALVULA EGR',
			},
		}

		// Verificar si la subcategoría inicial tiene un mapeo correspondiente
		if (initialSubcategory && subcategoryCategoryMap[initialSubcategory]) {
			const { category, subcategory } =
				subcategoryCategoryMap[initialSubcategory]

			// Solo modificar la categoría y subcategoría si aún no se ha seleccionado
			if (selectedCategory !== category && !selectedSubcategory) {
				setSelectedCategory(category as CategoryKey)
				setSelectedSubcategory(subcategory)
			}
		}
	}, [initialSubcategory, selectedCategory, selectedSubcategory])

	const handleCategoryChange = (category: CategoryKey) => {
		setSelectedCategory(selectedCategory === category ? null : category)
	}

	const handleSubcategoryChange = (subcategory: string) => {
		if (selectedSubcategory === subcategory) {
			setSelectedSubcategory(null)
			onSubcategoryChange(null)
			setBrands([])
			setModels([])
			setYears([])
			setSelectedFilters((filters) =>
				filters.filter((filter) => filter.type !== 'subcategory')
			)
		} else {
			setSelectedSubcategory(subcategory)
			onSubcategoryChange(subcategory)
			fetchBrandsAndModelsAndYear(subcategory)
			setSelectedFilters((filters) => [
				...filters.filter((filter) => filter.type !== 'subcategory'),
				{ type: 'subcategory', value: subcategory },
			])
			// setIsFiltersVisible(false) // Ocultar filtros después de seleccionar
		}
	}

	const removeFilter = (filterType: string) => {
		if (filterType === 'subcategory') {
			setSelectedSubcategory(null)
			onSubcategoryChange(null)
		} else if (filterType === 'brand') {
			setSelectedBrand(null)
			onBrandChange(null)
		} else if (filterType === 'model') {
			setSelectedModel(null)
			onModelChange(null)
		} else if (filterType === 'year') {
			setSelectedYear(null)
			onYearChange(null)
		}

		setSelectedFilters((filters) =>
			filters.filter((filter) => filter.type !== filterType)
		)
	}

	const fetchBrandsAndModelsAndYear = async (
		subcategory: string,
		selectedBrand?: string
	) => {
		try {
			const filters = [`productName:${subcategory}`] // Filtro inicial basado en la subcategoría

			if (selectedBrand) {
				filters.push(`brand:${selectedBrand}`) // Si hay una marca seleccionada, se agrega al filtro
			}

			const { hits } = await index.search('', {
				facets: ['brand', 'articleModel'],
				facetFilters: filters, // Usamos el array de filtros actualizado
			})

			// Filtrar las marcas solo si no hay una marca ya seleccionada
			if (!selectedBrand) {
				const uniqueBrands = [
					...new Set(hits.map((hit: any) => hit.brand)),
				]
				setBrands(uniqueBrands)
			}

			// Filtrar los modelos en base a la combinación de subcategoría y marca
			const uniqueModels = [
				...new Set(hits.map((hit: any) => hit.articleModel)),
			]
			setModels(uniqueModels)

			// Filtrar los años en base a la combinación de subcategoría y marca
			const uniqueYears = [...new Set(hits.map((hit: any) => hit.year))]
			setYears(uniqueYears)
		} catch (error) {
			console.error('Error fetching brands and models:', error)
		}
	}

	const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedBrand = event.target.value
		setSelectedBrand(selectedBrand)
		onBrandChange(selectedBrand)
		setSelectedFilters((filters) => [
			...filters.filter((filter) => filter.type !== 'brand'),
			{ type: 'brand', value: selectedBrand },
		])

		// Resetear el modelo cuando se cambia la marca
		setSelectedModel(null)
		onModelChange(null)

		// Filtrar modelos en función de la subcategoría y la marca seleccionada
		if (selectedSubcategory) {
			fetchBrandsAndModelsAndYear(selectedSubcategory, selectedBrand) // Filtrado por subcategoría y marca
		}
	}

	const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedModel = event.target.value
		setSelectedModel(selectedModel)
		onModelChange(selectedModel)
		setSelectedFilters((filters) => [
			...filters.filter((filter) => filter.type !== 'model'),
			{ type: 'model', value: selectedModel },
		])
	}

	const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedYear = parseInt(event.target.value)
		setSelectedYear(selectedYear)
		onYearChange(selectedYear)
		setSelectedFilters((filters) => [
			...filters.filter((filter) => filter.type !== 'year'),
			{ type: 'year', value: selectedYear.toString() },
		])
	}

	const toggleFiltersVisibility = () => {
		setIsFiltersVisible(!isFiltersVisible)
	}

	const closeFilters = () => {
		setIsFiltersVisible(false) // Función para cerrar filtros
	}

	useEffect(() => {
		if (isFiltersVisible) {
			document.body.classList.add('overflow-hidden')
		} else {
			document.body.classList.remove('overflow-hidden')
		}

		return () => {
			document.body.classList.remove('overflow-hidden')
		}
	}, [isFiltersVisible])

	function toTitleCase(str: string): string {
		return str
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Convierte la primera letra en mayúscula
			.join(' ')
	}

	return (
		<div className="w-auto font-tertiary-font">
			<div className="flex justify-between items-center gap-5 mb-4">
				<div
					className="sm:hidden flex gap-5"
					onClick={toggleFiltersVisibility}
				>
					<p className="text-primary-blue font-bold cursor-pointer">
						Filtrar
					</p>
					<Image
						src="/filtros.svg"
						alt="filtro"
						width={20}
						height={20}
					/>
				</div>
				<div className="mobile:hidden flex gap-5">
					<p className="text-primary-blue font-bold">Filtrar</p>
					<Image
						src="/filtros.svg"
						alt="filtro"
						width={20}
						height={20}
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mb-4 sm:hidden">
					{selectedFilters.map((filter) => (
						<FilterTag
							key={filter.type}
							filterName={`${filter.value}`}
							onRemove={() => removeFilter(filter.type)}
						/>
					))}
				</div>

			<div
				className={` ${isFiltersVisible ? 'fixed z-10 top-0 left-0 right-0 bg-white p-6 h-[100%] overflow-y-auto' : 'hidden'} sm:block`}
			>
				<div className="flex gap-5 mb-4 sm:hidden">
					<p className="text-primary-blue font-bold">Filtrar</p>
					<Image
						src="/filtros.svg"
						alt="filtro"
						width={20}
						height={20}
					/>
					<div className="absolute right-6 top-6 cursor-pointer">
						<button onClick={closeFilters}>
							<Image
								src="/equis.svg"
								alt="equis"
								width={20}
								height={20}
							/>
						</button>
					</div>
				</div>
				<p className="font-bold text-dark-grey mb-4">
					BÚSQUEDA POR <br /> CATEGORÍA
				</p>
				<div className="mb-4">
					{Object.keys(categories).map((categoryName) => {
						const typedCategory = categoryName as CategoryKey
						return (
							<div key={typedCategory} className="mb-2">
								<label className="flex items-center text-custom-grey gap-4">
									<div className="relative flex-shrink-0">
										<input
											type="checkbox"
											checked={
												selectedCategory ===
												typedCategory
											}
											onChange={() =>
												handleCategoryChange(
													typedCategory
												)
											}
											className="appearance-none w-8 h-8 rounded-lg border-2 border-checkbox-grey bg-white checked:bg-primary-blue checked:border-primary-blue"
										/>

										<span className="absolute top-[-3px] left-0 w-full h-full flex items-center justify-center pointer-events-none">
											<svg
												className={`w-6 h-6 text-white ${selectedCategory === typedCategory ? 'block' : 'hidden'}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M5 13l4 4L19 7"
												></path>
											</svg>
										</span>
									</div>
									<span className="break-words">
										{toTitleCase(typedCategory)}
									</span>
								</label>

								{selectedCategory === typedCategory && (
									<div className="ml-6 mt-2 max-h-48 overflow-y-auto">
										{categories[typedCategory].map(
											(subcategory) => (
												<div
													key={subcategory}
													className="mb-1"
												>
													<label className="flex items-center text-custom-grey gap-4">
														<div className="relative flex-shrink-0">
															<input
																type="checkbox"
																checked={
																	selectedSubcategory ===
																	subcategory
																}
																onChange={() =>
																	handleSubcategoryChange(
																		subcategory
																	)
																}
																className="appearance-none w-6 h-6 rounded-lg border-2 border-checkbox-grey bg-white checked:bg-primary-blue checked:border-primary-blue"
															/>
															<span className="absolute top-[-2px] left-0 w-full h-full flex items-center justify-center pointer-events-none">
																<svg
																	className={`w-5 h-5 text-white ${selectedSubcategory === subcategory ? 'block' : 'hidden'}`}
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M5 13l4 4L19 7"
																	></path>
																</svg>
															</span>
														</div>
														{toTitleCase(
															subcategory
														)}
													</label>
												</div>
											)
										)}
									</div>
								)}
							</div>
						)
					})}
				</div>

				<div className="mb-4">
					<label className="block text-dark-grey font-bold mb-5">
						Marca:
					</label>
					<div className="relative">
						<span
							className="absolute left-3 -top-4 text-secondary-blue text-xs z-10"
							style={{
								background: isFiltersVisible
									? 'white'
									: 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)',
								padding: '0 4px',
							}}
						>
							Marca de coche
						</span>

						<select
							value={selectedBrand || ''}
							onChange={handleBrandChange}
							className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-primary-blue focus:ring-primary-blue p-2 bg-white"
						>
							<option
								value=""
								className="bg-white hidden"
							></option>
							{brands.map((brand) => (
								<option
									key={brand}
									value={brand}
									className="bg-white"
								>
									{toTitleCase(brand)}
								</option>
							))}
						</select>
						<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none">
							<Image
								src="/dropdown-arrow.svg"
								alt="arrow down"
								width={20}
								height={20}
							/>
						</span>
					</div>
				</div>

				<div className="mb-4">
					<label className="block text-dark-grey font-bold mb-5">
						Modelos:
					</label>
					<div className="relative">
						<span
							className="absolute left-3 -top-4 text-secondary-blue text-xs z-10"
							style={{
								background: isFiltersVisible
									? 'white'
									: 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)',
								padding: '0 4px',
							}}
						>
							Modelo de coche
						</span>
						<select
							value={selectedModel || ''}
							onChange={handleModelChange}
							className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white"
						>
							<option
								value=""
								className="bg-white hidden"
							></option>
							{models.map((model) => (
								<option
									key={model}
									value={model}
									className="bg-white"
								>
									{toTitleCase(model)}
								</option>
							))}
						</select>
						<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none">
							<Image
								src="/dropdown-arrow.svg"
								alt="arrow down"
								width={20}
								height={20}
							/>
						</span>
					</div>
				</div>

				<div className="mb-4">
					<label className="block text-dark-grey font-bold mb-5">
						Año:
					</label>
					<div className="relative">
						<span
							className="absolute left-3 -top-4 text-secondary-blue text-xs z-10"
							style={{
								background: isFiltersVisible
									? 'white'
									: 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)',
								padding: '0 4px',
							}}
						>
							Año del coche
						</span>
						<select
							value={selectedYear || ''}
							onChange={handleYearChange}
							className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white"
							disabled={!selectedBrand}
						>
							<option
								value=""
								className="bg-white hidden"
							></option>
							{years.map((year) => (
								<option
									key={year}
									value={year}
									className="bg-white"
								>
									{year}
								</option>
							))}
						</select>
						<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none">
							<Image
								src="/dropdown-arrow.svg"
								alt="arrow down"
								width={20}
								height={20}
							/>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Filters
