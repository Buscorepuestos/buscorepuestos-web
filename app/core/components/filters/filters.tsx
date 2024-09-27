import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { categories, CategoryKey } from './categories'

interface FiltersProps {
	onSubcategoryChange: (subcategory: string | null) => void
}

const Filters: React.FC<FiltersProps> = ({ onSubcategoryChange }) => {
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryKey | null>(null)
	const [selectedSubcategory, setSelectedSubcategory] = useState<
		string | null
	>(null)
	const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false)

	const handleCategoryChange = (category: CategoryKey) => {
		setSelectedCategory(selectedCategory === category ? null : category)
	}

	const handleSubcategoryChange = (subcategory: string) => {
		if (selectedSubcategory === subcategory) {
			setSelectedSubcategory(null)
			onSubcategoryChange(null)
		} else {
			setSelectedSubcategory(subcategory)
			onSubcategoryChange(subcategory)
			setIsFiltersVisible(false) // Ocultar filtros después de seleccionar
		}
	}

	const toggleFiltersVisibility = () => {
		setIsFiltersVisible(!isFiltersVisible)
	}

	const closeFilters = () => {
		setIsFiltersVisible(false) // Función para cerrar filtros
	}

	// Efecto para manejar el scroll del body
	useEffect(() => {
		if (isFiltersVisible) {
			document.body.classList.add('overflow-hidden')
		} else {
			document.body.classList.remove('overflow-hidden')
		}
		// Limpieza del efecto
		return () => {
			document.body.classList.remove('overflow-hidden')
		}
	}, [isFiltersVisible])

	return (
		<div className="w-auto font-tertiary-font">
			<div className="flex justify-between items-center gap-5 mb-4">
				<div className="flex gap-5" onClick={toggleFiltersVisibility}>
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
			</div>

			<div
				className={`${
					isFiltersVisible
						? 'fixed top-[14vw] left-0 right-0 bg-white p-6 h-[100%] overflow-y-auto'
						: 'hidden'
				} sm:block`}
			>
				<div className="flex gap-5 mb-4 sm:hidden">
					<p className="text-primary-blue font-bold">Filtrar</p>
					<Image
						src="/filtros.svg"
						alt="filtro"
						width={20}
						height={20}
					/>
                    <div className='absolute right-6 top-6 cursor-pointer'>
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
					BÚSQUEDA POR <br />
					CATEGORÍA
				</p>
				<div className="mb-4">
					{Object.keys(categories).map((categoryName) => {
						const typedCategory = categoryName as CategoryKey
						return (
							<div key={typedCategory} className="mb-2">
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={
											selectedCategory === typedCategory
										}
										onChange={() =>
											handleCategoryChange(typedCategory)
										}
										className="mr-2"
									/>
									{typedCategory}
								</label>
								{selectedCategory === typedCategory && (
									<div className="ml-6 mt-2">
										{categories[typedCategory].map(
											(subcategory) => (
												<div
													key={subcategory}
													className="mb-1"
												>
													<label className="flex items-center">
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
															className="mr-2"
														/>
														{subcategory}
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
			</div>
		</div>
	)
}

export default Filters
