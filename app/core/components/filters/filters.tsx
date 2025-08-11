// import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { categories, CategoryKey } from './categories'
// import api from '../../../api/api'
// import { environment } from '../../../environment/environment'
// import FilterTag from '../filterTag/FilterTag'
// import './filters.css'

// interface FiltersProps {
// 	onSubcategoryChange: (subcategory: string | null) => void
// 	onBrandChange: (brand: string | null) => void
// 	onModelChange: (model: string | null) => void
// 	onYearChange: (year: number | null) => void
// 	selectedSubcategory: string | null
// 	selectedBrand: string | null
// 	selectedModel: string | null
// 	selectedYear: number | null
// }

// const Filters: React.FC<FiltersProps> = ({
// 	onSubcategoryChange,
// 	onBrandChange,
// 	onModelChange,
// 	onYearChange,
// 	selectedSubcategory,
// 	selectedBrand,
// 	selectedModel,
// 	selectedYear,
// }) => {
// 	const [selectedCategory, setSelectedCategory] =
// 		useState<CategoryKey | null>(null)
// 	const [brands, setBrands] = useState<string[]>([])
// 	const [models, setModels] = useState<string[]>([])
// 	const [years, setYears] = useState<number[]>([])
// 	const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false)
// 	const [loadingOptions, setLoadingOptions] = useState<boolean>(false)

// 	// Estado temporal para gestionar los filtros sin aplicarlos inmediatamente en móvil.
// 	const [tempFiltros, setTempFiltros] = useState({
// 		subcategory: selectedSubcategory,
// 		brand: selectedBrand,
// 		model: selectedModel,
// 		year: selectedYear,
// 	})

// 	// Efecto para obtener las opciones de filtros (marcas, modelos, años)
// 	// Ahora depende de los filtros temporales para funcionar correctamente en móvil.
// 	useEffect(() => {
// 		const subcategory = tempFiltros.subcategory
// 		const brand = tempFiltros.brand

// 		if (!subcategory) {
// 			setBrands([])
// 			setModels([])
// 			setYears([])
// 			return
// 		}

// 		const fetchFilterOptions = async () => {
// 			setLoadingOptions(true)
// 			try {
// 				const params = new URLSearchParams()
// 				if (subcategory) params.append('subcategory', subcategory)
// 				if (brand) params.append('brand', brand)

// 				const response = await api.get(
// 					`/products/filter-options?${params.toString()}`
// 				)
// 				const options = response.data

// 				setBrands(options.brands || [])
// 				setModels(options.models || [])
// 				setYears(options.years || [])
// 			} catch (error) {
// 				console.error('Error fetching filter options:', error)
// 				setBrands([])
// 				setModels([])
// 				setYears([])
// 			} finally {
// 				setLoadingOptions(false)
// 			}
// 		}

// 		fetchFilterOptions()
// 	}, [tempFiltros.subcategory, tempFiltros.brand])

// 	// Efecto para sincronizar los props con el estado temporal.
// 	// Se activa cuando los filtros cambian desde fuera (ej. tags) o al abrir el modal.
// 	useEffect(() => {
// 		setTempFiltros({
// 			subcategory: selectedSubcategory,
// 			brand: selectedBrand,
// 			model: selectedModel,
// 			year: selectedYear,
// 		})
// 	}, [selectedSubcategory, selectedBrand, selectedModel, selectedYear, isFiltersVisible])
	
// 	// Efecto para aplicar los filtros inmediatamente en la versión de escritorio.
// 	useEffect(() => {
// 		// Si el modal móvil está visible, esperamos al botón "Aplicar".
// 		if (isFiltersVisible) return
	
// 		// Comparamos para evitar bucles de renderizado.
// 		if (tempFiltros.subcategory !== selectedSubcategory) onSubcategoryChange(tempFiltros.subcategory)
// 		if (tempFiltros.brand !== selectedBrand) onBrandChange(tempFiltros.brand)
// 		if (tempFiltros.model !== selectedModel) onModelChange(tempFiltros.model)
// 		if (tempFiltros.year !== selectedYear) onYearChange(tempFiltros.year)

// 	}, [tempFiltros, isFiltersVisible])

// 	// Los handlers ahora actualizan el estado temporal `tempFiltros`.
// 	const handleCategoryChange = (category: CategoryKey) => {
// 		const newCategory = selectedCategory === category ? null : category
// 		setSelectedCategory(newCategory)
// 		if (newCategory === null) {
// 			setTempFiltros((prev) => ({ ...prev, subcategory: null }))
// 		}
// 	}

// 	const handleSubcategoryChange = (subcategory: string) => {
// 		const newSubcategory = tempFiltros.subcategory === subcategory ? null : subcategory
// 		setTempFiltros((prev) => ({ ...prev, subcategory: newSubcategory }))
// 	}

// 	const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// 		const newBrand = event.target.value || null
// 		setTempFiltros((prev) => ({
// 			...prev,
// 			brand: newBrand,
// 			model: null,
// 			year: null,
// 		}))
// 	}

// 	const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// 		const newModel = event.target.value || null
// 		setTempFiltros((prev) => ({ ...prev, model: newModel }))
// 	}

// 	const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// 		const newYear = event.target.value ? parseInt(event.target.value, 10) : null
// 		setTempFiltros((prev) => ({ ...prev, year: newYear }))
// 	}
	
// 	// Función para aplicar los filtros seleccionados en el modal móvil.
// 	const handleApplyFilters = () => {
// 		onSubcategoryChange(tempFiltros.subcategory)
// 		onBrandChange(tempFiltros.brand)
// 		onModelChange(tempFiltros.model)
// 		onYearChange(tempFiltros.year)
// 		closeFilters()
// 	}

// 	const removeFilter = (filterType: string) => {
// 		if (filterType === 'subcategory') onSubcategoryChange(null)
// 		else if (filterType === 'brand') onBrandChange(null)
// 		else if (filterType === 'model') onModelChange(null)
// 		else if (filterType === 'year') onYearChange(null)
// 	}

// 	const activeFilters = [
// 		selectedSubcategory && { type: 'subcategory', value: selectedSubcategory },
// 		selectedBrand && { type: 'brand', value: selectedBrand },
// 		selectedModel && { type: 'model', value: selectedModel },
// 		selectedYear && { type: 'year', value: selectedYear.toString() },
// 	].filter(Boolean) as { type: string, value: string }[]

// 	const toggleFiltersVisibility = () => setIsFiltersVisible(!isFiltersVisible)
// 	const closeFilters = () => {
// 		setIsFiltersVisible(false)
// 		setTempFiltros({
// 			subcategory: selectedSubcategory,
// 			brand: selectedBrand,
// 			model: selectedModel,
// 			year: selectedYear,
// 		})
// 	}


// 	useEffect(() => {
// 		if (isFiltersVisible) {
// 			document.body.classList.add('overflow-hidden')
// 		} else {
// 			document.body.classList.remove('overflow-hidden')
// 		}
// 		return () => {
// 			document.body.classList.remove('overflow-hidden')
// 		}
// 	}, [isFiltersVisible])

// 	function toTitleCase(str: string): string {
// 		if (!str) return ''
// 		return str
// 			.toLowerCase()
// 			.split(' ')
// 			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
// 			.join(' ')
// 	}

// 	return (
// 		<div className="w-auto font-tertiary-font">
// 			<div className="flex justify-between items-center gap-5 mb-4">
// 				<div
// 					className="sm:hidden flex gap-5"
// 					onClick={toggleFiltersVisibility}
// 				>
// 					<p className="text-primary-blue font-bold cursor-pointer">
// 						Filtrar
// 					</p>
// 					<Image
// 						src="/filtros.svg"
// 						alt="filtro"
// 						width={20}
// 						height={20}
// 					/>
// 				</div>
// 				<div className="mobile:hidden flex gap-5">
// 					<p className="text-primary-blue font-bold">Filtrar</p>
// 					<Image
// 						src="/filtros.svg"
// 						alt="filtro"
// 						width={20}
// 						height={20}
// 					/>
// 				</div>
// 			</div>

// 			{/* <div className="flex flex-wrap gap-2 mb-4">
// 				{activeFilters.map((filter) => (
// 					<FilterTag
// 						key={filter.type}
// 						filterName={`${filter.value}`}
// 						onRemove={() => removeFilter(filter.type)}
// 					/>
// 				))}
// 			</div> */}

// 			{/* MODIFICADO: Se cambia p-6 por pt-6 para controlar el padding en los hijos */}
// 			<div
// 				className={` ${isFiltersVisible ? 'fixed z-10 top-0 left-0 right-0 bg-white h-[100%] flex flex-col pt-6' : 'hidden'} sm:block sm:p-0 sm:h-auto sm:static`}
// 			>
// 				{/* MODIFICADO: Se añade px-6 para alinear el contenido, dejando el scrollbar en el borde */}
// 				<div className="flex-grow overflow-y-auto px-6 sm:px-0">
// 					<div className="flex gap-5 mb-4 sm:hidden">
// 						<p className="text-primary-blue font-bold">Filtrar</p>
// 						<Image
// 							src="/filtros.svg"
// 							alt="filtro"
// 							width={20}
// 							height={20}
// 						/>
// 						<div className="absolute right-6 top-6 cursor-pointer">
// 							<button onClick={closeFilters}>
// 								<Image
// 									src="/equis.svg"
// 									alt="equis"
// 									width={20}
// 									height={20}
// 								/>
// 							</button>
// 						</div>
// 					</div>
// 					<p className="font-bold text-dark-grey mb-4">
// 						BÚSQUEDA POR <br /> CATEGORÍA
// 					</p>
// 					<div className="mb-4">
// 						{Object.keys(categories).map((categoryName) => {
// 							const typedCategory = categoryName as CategoryKey
// 							return (
// 								<div key={typedCategory} className="mb-2">
// 									<label className="flex items-center text-custom-grey gap-4">
// 										<div className="relative flex-shrink-0">
// 											<input
// 												type="checkbox"
// 												checked={
// 													selectedCategory ===
// 													typedCategory
// 												}
// 												onChange={() =>
// 													handleCategoryChange(
// 														typedCategory
// 													)
// 												}
// 												className="appearance-none w-8 h-8 rounded-lg border-2 border-checkbox-grey bg-white checked:bg-primary-blue checked:border-primary-blue"
// 											/>
// 											<span className="absolute top-[-3px] left-0 w-full h-full flex items-center justify-center pointer-events-none">
// 												<svg
// 													className={`w-6 h-6 text-white ${selectedCategory === typedCategory ? 'block' : 'hidden'}`}
// 													fill="none" stroke="currentColor" viewBox="0 0 24 24"
// 													xmlns="http://www.w3.org/2000/svg"
// 												>
// 													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
// 												</svg>
// 											</span>
// 										</div>
// 										<span className="break-words">
// 											{toTitleCase(typedCategory)}
// 										</span>
// 									</label>

// 									{selectedCategory === typedCategory && (
// 										<div className="ml-6 mt-2">
// 											{selectedCategory && !tempFiltros.subcategory && (
// 												<p className="text-sm text-amber-600 font-semibold mb-2 p-2 bg-amber-50 rounded-md">
// 													Por favor, selecciona una subcategoría para filtrar.
// 												</p>
// 											)}
// 											<div className="max-h-48 overflow-y-auto">
// 												{categories[typedCategory].map(
// 													(subcategory) => (
// 														<div key={subcategory} className="mb-1">
// 															<label className="flex items-center text-custom-grey gap-4">
// 																<div className="relative flex-shrink-0">
// 																	<input
// 																		type="checkbox"
// 																		checked={tempFiltros.subcategory === subcategory}
// 																		onChange={() => handleSubcategoryChange(subcategory)}
// 																		className="appearance-none w-6 h-6 rounded-lg border-2 border-checkbox-grey bg-white checked:bg-primary-blue checked:border-primary-blue"
// 																	/>
// 																	<span className="absolute top-[-2px] left-0 w-full h-full flex items-center justify-center pointer-events-none">
// 																		<svg
// 																			className={`w-5 h-5 text-white ${tempFiltros.subcategory === subcategory ? 'block' : 'hidden'}`}
// 																			fill="none" stroke="currentColor" viewBox="0 0 24 24"
// 																			xmlns="http://www.w3.org/2000/svg"
// 																		>
// 																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
// 																		</svg>
// 																	</span>
// 																</div>
// 																{toTitleCase(subcategory)}
// 															</label>
// 														</div>
// 													)
// 												)}
// 											</div>
// 										</div>
// 									)}
// 								</div>
// 							)
// 						})}
// 					</div>

// 					<div className="mb-4">
// 						<label className="block text-dark-grey font-bold mb-5">
// 							Marca:
// 						</label>
// 						<div className="relative">
// 							<span
// 								className="absolute left-3 -top-4 text-secondary-blue text-xs z-10"
// 								style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}
// 							>
// 								Marca de coche
// 							</span>
// 							<select
// 								value={tempFiltros.brand || ''}
// 								onChange={handleBrandChange}
// 								className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-primary-blue focus:ring-primary-blue p-2 bg-white"
// 							>
// 								<option value="" className="bg-white hidden"></option>
// 								{brands.map((brand) => (
// 									<option key={brand} value={brand} className="bg-white">
// 										{toTitleCase(brand)}
// 									</option>
// 								))}
// 							</select>
// 							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none">
// 								<Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} />
// 							</span>
// 						</div>
// 					</div>

// 					<div className="mb-4">
// 						<label className="block text-dark-grey font-bold mb-5">
// 							Modelos:
// 						</label>
// 						<div className="relative">
// 							<span
// 								className="absolute left-3 -top-4 text-secondary-blue text-xs z-10"
// 								style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}
// 							>
// 								Modelo de coche
// 							</span>
// 							<select
// 								value={tempFiltros.model || ''}
// 								onChange={handleModelChange}
// 								className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white"
//                                 disabled={!tempFiltros.brand}
// 							>
// 								<option value="" className="bg-white hidden"></option>
// 								{models.map((model) => (
// 									<option key={model} value={model} className="bg-white">
// 										{toTitleCase(model)}
// 									</option>
// 								))}
// 							</select>
// 							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none">
// 								<Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} />
// 							</span>
// 						</div>
// 					</div>

// 					<div className="mb-4">
// 						<label className="block text-dark-grey font-bold mb-5">
// 							Año:
// 						</label>
// 						<div className="relative">
// 							<span
// 								className="absolute left-3 -top-4 text-secondary-blue text-xs z-10"
// 								style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}
// 							>
// 								Año del coche
// 							</span>
// 							<select
// 								value={tempFiltros.year || ''}
// 								onChange={handleYearChange}
// 								className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white"
// 								disabled={!tempFiltros.brand}
// 							>
// 								<option value="" className="bg-white hidden"></option>
// 								{years.map((year) => (
// 									<option key={year} value={year} className="bg-white">
// 										{year}
// 									</option>
// 								))}
// 							</select>
// 							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none">
// 								<Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} />
// 							</span>
// 						</div>
// 					</div>
// 				</div>

// 				{/* MODIFICADO: Se añade px-6 y pb-6 para alinear el botón y darle espacio inferior */}
// 				<div className="mt-auto pt-4 border-t border-gray-200 sm:hidden px-6 pb-6">
// 					<button
// 						onClick={handleApplyFilters}
// 						className="w-full bg-primary-blue text-white font-bold py-3 px-4 rounded-full text-sm shadow-md hover:bg-blue-700 transition-colors duration-200"
// 					>
// 						Aplicar Filtros
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default Filters

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { categories, CategoryKey } from './categories'
import api from '../../../api/api'
import { environment } from '../../../environment/environment'
import FilterTag from '../filterTag/FilterTag'
import './filters.css'

interface FiltersProps {
	onSubcategoryChange: (subcategory: string | null) => void
	onBrandChange: (brand: string | null) => void
	onModelChange: (model: string | null) => void
	onYearChange: (year: number | null) => void
	selectedSubcategory: string | null
	selectedBrand: string | null
	selectedModel: string | null
	selectedYear: number | null
}

const Filters: React.FC<FiltersProps> = ({
	onSubcategoryChange,
	onBrandChange,
	onModelChange,
	onYearChange,
	selectedSubcategory,
	selectedBrand,
	selectedModel,
	selectedYear,
}) => {
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryKey | null>(null)
	const [brands, setBrands] = useState<string[]>([])
	const [models, setModels] = useState<string[]>([])
	const [years, setYears] = useState<number[]>([])
	const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false)
	const [loadingOptions, setLoadingOptions] = useState<boolean>(false)

	const [tempFiltros, setTempFiltros] = useState({
		subcategory: selectedSubcategory,
		brand: selectedBrand,
		model: selectedModel,
		year: selectedYear,
	})

	// Efecto para obtener las opciones de filtros (marcas, modelos, años)
	useEffect(() => {
		// Usa los filtros temporales para que las opciones se actualicen dentro del modal móvil
		const subcategory = tempFiltros.subcategory
		const brand = tempFiltros.brand

		if (!subcategory) {
			setBrands([])
			setModels([])
			setYears([])
			return
		}

		const fetchFilterOptions = async () => {
			setLoadingOptions(true)
			try {
				const params = new URLSearchParams()
				if (subcategory) params.append('subcategory', subcategory)
				if (brand) params.append('brand', brand)

				const response = await api.get(
					`/products/filter-options?${params.toString()}`
				)
				const options = response.data
				setBrands(options.brands || [])
				setModels(options.models || [])
				setYears(options.years || [])
			} catch (error) {
				console.error('Error fetching filter options:', error)
				setBrands([])
				setModels([])
				setYears([])
			} finally {
				setLoadingOptions(false)
			}
		}

		fetchFilterOptions()
	}, [tempFiltros.subcategory, tempFiltros.brand])

	// Efecto para sincronizar los props con el estado temporal.
	// Esto es crucial para que el modal se abra con los filtros correctos
	// y para que los cambios externos (como quitar un tag) se reflejen.
	useEffect(() => {
		setTempFiltros({
			subcategory: selectedSubcategory,
			brand: selectedBrand,
			model: selectedModel,
			year: selectedYear,
		})
	}, [selectedSubcategory, selectedBrand, selectedModel, selectedYear, isFiltersVisible])
	

	// --- LÓGICA DE HANDLERS REFACTORIZADA ---

	const handleCategoryChange = (category: CategoryKey) => {
		const newCategory = selectedCategory === category ? null : category
		setSelectedCategory(newCategory)
		if (newCategory === null) {
			// Si deseleccionamos una categoría, limpiamos la subcategoría en ambos modos
			if (isFiltersVisible) {
				setTempFiltros((prev) => ({ ...prev, subcategory: null }))
			} else {
				onSubcategoryChange(null)
			}
		}
	}

	const handleSubcategoryChange = (subcategory: string) => {
		const newSubcategory = (isFiltersVisible ? tempFiltros.subcategory : selectedSubcategory) === subcategory ? null : subcategory
		if (isFiltersVisible) {
			setTempFiltros((prev) => ({ ...prev, subcategory: newSubcategory }))
		} else {
			onSubcategoryChange(newSubcategory)
		}
	}

	const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newBrand = event.target.value || null
		if (isFiltersVisible) {
			setTempFiltros((prev) => ({ ...prev, brand: newBrand, model: null, year: null }))
		} else {
			onBrandChange(newBrand)
			onModelChange(null)
			onYearChange(null)
		}
	}

	const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newModel = event.target.value || null
		if (isFiltersVisible) {
			setTempFiltros((prev) => ({ ...prev, model: newModel }))
		} else {
			onModelChange(newModel)
		}
	}

	const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newYear = event.target.value ? parseInt(event.target.value, 10) : null
		if (isFiltersVisible) {
			setTempFiltros((prev) => ({ ...prev, year: newYear }))
		} else {
			onYearChange(newYear)
		}
	}
	
	const handleApplyFilters = () => {
		// Aplica todos los filtros del estado temporal al estado global
		onSubcategoryChange(tempFiltros.subcategory)
		onBrandChange(tempFiltros.brand)
		onModelChange(tempFiltros.model)
		onYearChange(tempFiltros.year)
		// Simplemente cierra el modal
		setIsFiltersVisible(false)
	}

	const removeFilter = (filterType: string) => {
		if (filterType === 'subcategory') onSubcategoryChange(null)
		else if (filterType === 'brand') onBrandChange(null)
		else if (filterType === 'model') onModelChange(null)
		else if (filterType === 'year') onYearChange(null)
	}

	const activeFilters = [
		selectedSubcategory && { type: 'subcategory', value: selectedSubcategory },
		selectedBrand && { type: 'brand', value: selectedBrand },
		selectedModel && { type: 'model', value: selectedModel },
		selectedYear && { type: 'year', value: selectedYear.toString() },
	].filter(Boolean) as { type: string, value: string }[]

	const toggleFiltersVisibility = () => setIsFiltersVisible(!isFiltersVisible)
	// Cerrar ahora solo oculta el modal. El useEffect se encargará de resetear tempFiltros la próxima vez que se abra.
	const closeFilters = () => setIsFiltersVisible(false)

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
		if (!str) return ''
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	// El valor de `checked` y `value` de los inputs ahora debe leer de `tempFiltros` en móvil
    // y de `selected...` en desktop para una respuesta instantánea.
    const displaySubcategory = isFiltersVisible ? tempFiltros.subcategory : selectedSubcategory;
    const displayBrand = isFiltersVisible ? tempFiltros.brand : selectedBrand;
    const displayModel = isFiltersVisible ? tempFiltros.model : selectedModel;
    const displayYear = isFiltersVisible ? tempFiltros.year : selectedYear;

	return (
		<div className="w-auto font-tertiary-font">
			{/* <div className="sm:hidden flex flex-wrap gap-2 mb-4">
				{activeFilters.map((filter) => (
					<FilterTag
						key={filter.type}
						filterName={`${filter.value}`}
						onRemove={() => removeFilter(filter.type)}
					/>
				))}
			</div> */}
			<div className="flex justify-between items-center gap-5 mb-4">
				<div
					className="sm:hidden flex gap-5"
					onClick={toggleFiltersVisibility}
				>
					<p className="text-primary-blue font-bold cursor-pointer">
						Filtrar
					</p>
					<Image src="/filtros.svg" alt="filtro" width={20} height={20} />
				</div>
				<div className="mobile:hidden flex gap-5">
					<p className="text-primary-blue font-bold">Filtrar</p>
					<Image src="/filtros.svg" alt="filtro" width={20} height={20} />
				</div>
			</div>

			<div className={` ${isFiltersVisible ? 'fixed z-10 top-0 left-0 right-0 bg-white h-[100%] flex flex-col pt-6' : 'hidden'} sm:block sm:p-0 sm:h-auto sm:static`}>
				<div className="flex-grow overflow-y-auto px-6 sm:px-0">
					<div className="flex gap-5 mb-4 sm:hidden">
						<p className="text-primary-blue font-bold">Filtrar</p>
						<Image src="/filtros.svg" alt="filtro" width={20} height={20} />
						<div className="absolute right-6 top-6 cursor-pointer">
							<button onClick={closeFilters}>
								<Image src="/equis.svg" alt="equis" width={20} height={20} />
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
												checked={selectedCategory === typedCategory}
												onChange={() => handleCategoryChange(typedCategory)}
												className="appearance-none w-8 h-8 rounded-lg border-2 border-checkbox-grey bg-white checked:bg-primary-blue checked:border-primary-blue"
											/>
											<span className="absolute top-[-3px] left-0 w-full h-full flex items-center justify-center pointer-events-none">
												<svg className={`w-6 h-6 text-white ${selectedCategory === typedCategory ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
												</svg>
											</span>
										</div>
										<span className="break-words">{toTitleCase(typedCategory)}</span>
									</label>

									{selectedCategory === typedCategory && (
										<div className="ml-6 mt-2">
											{selectedCategory && !displaySubcategory && (
												<p className="text-sm text-amber-600 font-semibold mb-2 p-2 bg-amber-50 rounded-md">
													Por favor, selecciona una subcategoría para filtrar.
												</p>
											)}
											<div className="max-h-48 overflow-y-auto">
												{categories[typedCategory].map((subcategory) => (
													<div key={subcategory} className="mb-1">
														<label className="flex items-center text-custom-grey gap-4">
															<div className="relative flex-shrink-0">
																<input
																	type="checkbox"
																	checked={displaySubcategory === subcategory}
																	onChange={() => handleSubcategoryChange(subcategory)}
																	className="appearance-none w-6 h-6 rounded-lg border-2 border-checkbox-grey bg-white checked:bg-primary-blue checked:border-primary-blue"
																/>
																<span className="absolute top-[-2px] left-0 w-full h-full flex items-center justify-center pointer-events-none">
																	<svg className={`w-5 h-5 text-white ${displaySubcategory === subcategory ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
																	</svg>
																</span>
															</div>
															{toTitleCase(subcategory)}
														</label>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							)
						})}
					</div>

					<div className="mb-4">
						<label className="block text-dark-grey font-bold mb-5">Marca:</label>
						<div className="relative">
							<span className="absolute left-3 -top-4 text-secondary-blue text-xs z-10" style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}>Marca de coche</span>
							<select value={displayBrand || ''} onChange={handleBrandChange} className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-primary-blue focus:ring-primary-blue p-2 bg-white">
								<option value="" className="bg-white hidden"></option>
								{brands.map((brand) => (<option key={brand} value={brand} className="bg-white">{toTitleCase(brand)}</option>))}
							</select>
							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none"><Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} /></span>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-dark-grey font-bold mb-5">Modelos:</label>
						<div className="relative">
							<span className="absolute left-3 -top-4 text-secondary-blue text-xs z-10" style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}>Modelo de coche</span>
							<select value={displayModel || ''} onChange={handleModelChange} className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white" disabled={!displayBrand}>
								<option value="" className="bg-white hidden"></option>
								{models.map((model) => (<option key={model} value={model} className="bg-white">{toTitleCase(model)}</option>))}
							</select>
							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none"><Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} /></span>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-dark-grey font-bold mb-5">Año:</label>
						<div className="relative">
							<span className="absolute left-3 -top-4 text-secondary-blue text-xs z-10" style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}>Año del coche</span>
							<select value={displayYear || ''} onChange={handleYearChange} className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white" disabled={!displayBrand}>
								<option value="" className="bg-white hidden"></option>
								{years.map((year) => (<option key={year} value={year} className="bg-white">{year}</option>))}
							</select>
							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none"><Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} /></span>
						</div>
					</div>
				</div>

				<div className="mt-auto pt-4 border-t border-gray-200 sm:hidden px-6 pb-6">
					<button onClick={handleApplyFilters} className="w-full bg-primary-blue text-white font-bold py-3 px-4 rounded-full text-sm shadow-md hover:bg-blue-700 transition-colors duration-200">
						Aplicar Filtros
					</button>
				</div>
			</div>
		</div>
	)
}

export default Filters