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
	selectedSubcategory: string | null;
	selectedBrand: string | null;
	selectedModel: string | null;
	selectedYear: number | null;
}

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey
const indexName = environment.algoliaIndexName

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
	const [selectedFilters, setSelectedFilters] = useState<
		{ type: string; value: string }[]
	>([])
	const [loadingOptions, setLoadingOptions] = useState<boolean>(false);

	    // Efecto para obtener las opciones de filtros (marcas, modelos, años) del backend
    useEffect(() => {
        // Si no hay una subcategoría seleccionada, no hay nada que buscar. Reseteamos las opciones.
        if (!selectedSubcategory) {
            setBrands([]);
            setModels([]);
            setYears([]);
            return;
        }

        const fetchFilterOptions = async () => {
            setLoadingOptions(true);
            try {
                const params = new URLSearchParams();
                // Añadimos los filtros activos para que el backend devuelva opciones contextuales
                if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
                if (selectedBrand) params.append('brand', selectedBrand);
                
                // Llamada al nuevo endpoint del backend
                const response = await api.get(`/products/filter-options?${params.toString()}`);
                const options = response.data;
                
                // Actualizamos los estados con las opciones recibidas
                setBrands(options.brands || []);
                setModels(options.models || []);
                setYears(options.years || []);

            } catch (error) {
                console.error("Error fetching filter options:", error);
                // En caso de error, reseteamos las opciones para evitar inconsistencias
                setBrands([]);
                setModels([]);
                setYears([]);
            } finally {
                setLoadingOptions(false);
            }
        };

        fetchFilterOptions();
    // Este efecto se ejecuta cada vez que el usuario cambia la subcategoría o la marca
    }, [selectedSubcategory, selectedBrand]);


    // Handlers para cambios en los filtros.
    // Solo llaman a las funciones del padre, que es quien controla el estado global.
    const handleCategoryChange = (category: CategoryKey) => {
        setSelectedCategory(prevCategory => prevCategory === category ? null : category);
    };

    const handleSubcategoryChange = (subcategory: string) => {
        // Si el usuario deselecciona, pasamos null. Si selecciona, pasamos el valor.
        const newSubcategory = selectedSubcategory === subcategory ? null : subcategory;
        onSubcategoryChange(newSubcategory);
    };

    const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Si el valor es "", pasamos null.
        onBrandChange(event.target.value || null);
    };

    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onModelChange(event.target.value || null);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value ? parseInt(event.target.value, 10) : null;
        onYearChange(year);
    };

    // Función para eliminar un filtro desde los "tags"
    const removeFilter = (filterType: string) => {
        if (filterType === 'subcategory') onSubcategoryChange(null);
        else if (filterType === 'brand') onBrandChange(null);
        else if (filterType === 'model') onModelChange(null);
        else if (filterType === 'year') onYearChange(null);
    };
    
    // Construir la lista de filtros activos para mostrar los tags
    const activeFilters = [
        selectedSubcategory && { type: 'subcategory', value: selectedSubcategory },
        selectedBrand && { type: 'brand', value: selectedBrand },
        selectedModel && { type: 'model', value: selectedModel },
        selectedYear && { type: 'year', value: selectedYear.toString() },
    ].filter(Boolean) as { type: string, value: string }[]; // 'filter(Boolean)' elimina los nulos/falsos
    

    // Funciones para la UI
    const toggleFiltersVisibility = () => setIsFiltersVisible(!isFiltersVisible);
    const closeFilters = () => setIsFiltersVisible(false);

    // Efecto para bloquear el scroll del body cuando el filtro móvil está abierto
    useEffect(() => {
        if (isFiltersVisible) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isFiltersVisible]);

    // Función de utilidad para capitalizar texto
    function toTitleCase(str: string): string {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
