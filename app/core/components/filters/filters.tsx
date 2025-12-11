import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { categories, CategoryKey } from './categories'
import api from '../../../api/api'
import SearchableSelect from '../selectDropdown/SearchableSelect'
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

	// El estado temporal 'tempFiltros' ya no es necesario, se elimina.

	// Efecto para obtener las opciones de filtros (marcas, modelos, años)
	// Ahora depende directamente de los props globales.
	useEffect(() => {
		// if (!selectedSubcategory) {
		// 	setBrands([])
		// 	setModels([])
		// 	setYears([])
		// 	return
		// }

		const fetchFilterOptions = async () => {
			setLoadingOptions(true)
			try {
				const params = new URLSearchParams()
				if (selectedSubcategory) params.append('subcategory', selectedSubcategory)
				if (selectedBrand) params.append('brand', selectedBrand)
				if (selectedModel) params.append('model', selectedModel)

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
	}, [selectedSubcategory, selectedBrand, selectedModel])

	// --- LÓGICA DE HANDLERS SIMPLIFICADA ---
	// --- HANDLERS ACTUALIZADOS (Ahora reciben el valor directo) ---

	const handleCategoryChange = (category: CategoryKey) => {
		const newCategory = selectedCategory === category ? null : category
		setSelectedCategory(newCategory)
		// Si se deselecciona una categoría, limpiamos la subcategoría globalmente
		if (newCategory === null) {
			onSubcategoryChange(null)
		}
	}

	// MODIFICADO: Este es el cambio principal.
	// Aplica el filtro y cierra el modal.
	const handleSubcategoryChange = (subcategory: string) => {
		const newSubcategory = selectedSubcategory === subcategory ? null : subcategory
		onSubcategoryChange(newSubcategory)
		// Cerramos automáticamente el modal al seleccionar una subcategoría
		setIsFiltersVisible(false)
	}

	// Los siguientes handlers aplican el filtro pero no cierran el modal,
	// permitiendo al usuario ajustar varios campos antes de elegir la subcategoría.
	const handleBrandChange = (value: string | null) => {
		const newBrand = value
		onBrandChange(newBrand)
	}

	const handleModelChange = (value: string | null) => {
		const newModel = value
		onModelChange(newModel)
	}

	const handleYearChange = (value: string | null) => {
		const newYear = value ? parseInt(value, 10) : null
		onYearChange(newYear)
	}

	const toggleFiltersVisibility = () => setIsFiltersVisible(!isFiltersVisible)
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

	const formattedBrands = brands.map(b => toTitleCase(b));
	const formattedModels = models.map(m => toTitleCase(m));

	return (
		<div className="w-auto font-tertiary-font">
			<div className="flex justify-between items-center gap-5 mb-4">
				<div
					className="sm:hidden flex items-center gap-5"
					onClick={toggleFiltersVisibility}
				>
					<p className="text-primary-blue font-bold cursor-pointer">
						Filtrar
					</p>
					<Image src="/filtros.svg" alt="filtro" width={20} height={20} />
				</div>
				<div className="mobile:hidden flex items-center gap-5">
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
											{selectedCategory && !selectedSubcategory && (
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
																	checked={selectedSubcategory === subcategory}
																	onChange={() => handleSubcategoryChange(subcategory)}
																	className="appearance-none w-6 h-6 rounded-lg border-2 border-checkbox-grey bg-white checked:bg-primary-blue checked:border-primary-blue"
																/>
																<span className="absolute top-[-2px] left-0 w-full h-full flex items-center justify-center pointer-events-none">
																	<svg className={`w-5 h-5 text-white ${selectedSubcategory === subcategory ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
				</div>
				<div className="mb-4">
						<label className="block text-dark-grey font-bold mb-5">Marca:</label>
						{/* <div className="relative">
							<span className="absolute left-3 -top-4 text-secondary-blue text-xs z-10" style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}>Marca de coche</span>
							<select value={selectedBrand || ''} onChange={handleBrandChange} className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-primary-blue focus:ring-primary-blue p-2 bg-white">
								<option value="" className="bg-white hidden"></option>
								{brands.map((brand) => (<option key={brand} value={brand} className="bg-white">{toTitleCase(brand)}</option>))}
							</select>
							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none"><Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} /></span>
						</div> */}
						<SearchableSelect
							options={brands} // Pasamos los datos crudos, el componente los normaliza
							value={selectedBrand}
							onChange={handleBrandChange}
							placeholder="Selecciona Marca"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-dark-grey font-bold mb-5">Modelos:</label>
						{/* <div className="relative">
							<span className="absolute left-3 -top-4 text-secondary-blue text-xs z-10" style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}>Modelo de coche</span>
							<select value={selectedModel || ''} onChange={handleModelChange} className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white">
								<option value="" className="bg-white hidden"></option>
								{models.map((model) => (<option key={model} value={model} className="bg-white">{toTitleCase(model)}</option>))}
							</select>
							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none"><Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} /></span>
						</div> */}
						<SearchableSelect
							options={models}
							value={selectedModel}
							onChange={handleModelChange}
							placeholder="Selecciona Modelo"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-dark-grey font-bold mb-5">Año:</label>
						{/* <div className="relative">
							<span className="absolute left-3 -top-4 text-secondary-blue text-xs z-10" style={{ background: isFiltersVisible ? 'white' : 'linear-gradient(to top, white 10%, rgba(206, 206, 206, 0.685) 200%)', padding: '0 4px' }}>Año del coche</span>
							<select value={selectedYear || ''} onChange={handleYearChange} className="block w-full border-2 border-secondary-blue rounded-3xl shadow-sm focus:border-secondary-blue focus:ring-primary-blue p-2 bg-white">
								<option value="" className="bg-white hidden"></option>
								{years.map((year) => (<option key={year} value={year} className="bg-white">{year}</option>))}
							</select>
							<span className="absolute inset-y-0 right-2 flex items-center pr-2 pointer-events-none"><Image src="/dropdown-arrow.svg" alt="arrow down" width={20} height={20} /></span>
						</div> */}
						<SearchableSelect
                            options={years}
                            value={selectedYear}
                            onChange={handleYearChange}
                            placeholder="Selecciona Año"
                        />
					</div>

				{/* EL BOTÓN DE APLICAR FILTROS SE HA ELIMINADO */}
			</div>
		</div>
	)
}

export default Filters