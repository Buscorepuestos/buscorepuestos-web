// // import React, { useEffect, useState } from 'react'
// // import Image from 'next/image'
// // import { categories, CategoryKey } from './categories'
// // import algoliasearch from 'algoliasearch'
// // import { environment } from '../../../environment/environment'

// // interface FiltersProps {
// // 	onSubcategoryChange: (subcategory: string | null) => void
// // 	onBrandChange: (brand: string | null) => void
// // 	onModelChange: (model: string | null) => void
// // }

// // const appID = environment.algoliaAppID
// // const apiKey = environment.algoliaAPIKey
// // const indexName = environment.algoliaIndexName

// // const Filters: React.FC<FiltersProps> = ({
// // 	onSubcategoryChange,
// // 	onBrandChange,
// // 	onModelChange,
// // }) => {
// // 	const [selectedCategory, setSelectedCategory] =
// // 		useState<CategoryKey | null>(null)
// // 	const [selectedSubcategory, setSelectedSubcategory] = useState<
// // 		string | null
// // 	>(null)
// // 	const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
// // 	const [selectedModel, setSelectedModel] = useState<string | null>(null)
// // 	const [brands, setBrands] = useState<string[]>([])
// // 	const [models, setModels] = useState<string[]>([])
// // 	const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false)

// // 	const algoliaClient = algoliasearch(
// // 		appID,
// // 		apiKey
// // 	)
// // 	const index = algoliaClient.initIndex(indexName)

// // 	const handleCategoryChange = (category: CategoryKey) => {
// // 		setSelectedCategory(selectedCategory === category ? null : category)
// // 	}

// // 	const handleSubcategoryChange = (subcategory: string) => {
// // 		if (selectedSubcategory === subcategory) {
// // 			setSelectedSubcategory(null)
// // 			onSubcategoryChange(null)
// // 			setBrands([])
// // 			setModels([])
// // 		} else {
// // 			setSelectedSubcategory(subcategory)
// // 			onSubcategoryChange(subcategory)
// // 			fetchBrandsAndModels(subcategory)
// // 			setIsFiltersVisible(false) // Ocultar filtros después de seleccionar
// // 		}
// // 	}

// // 	const fetchBrandsAndModels = async (subcategory: string) => {
// // 		try {
// // 			const { hits } = await index.search('', {
// // 				facets: ['brand', 'articleModel'],
// // 				facetFilters: [`productName:${subcategory}`],
// // 			})

// // 			const uniqueBrands = [...new Set(hits.map((hit: any) => hit.brand))]
// // 			const uniqueModels = [
// // 				...new Set(hits.map((hit: any) => hit.articleModel)),
// // 			]
// // 			setBrands(uniqueBrands)
// // 			setModels(uniqueModels)
// // 		} catch (error) {
// // 			console.error('Error fetching brands and models:', error)
// // 		}
// // 	}

// // 	const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// // 		const selectedBrand = event.target.value
// // 		setSelectedBrand(selectedBrand)
// // 		onBrandChange(selectedBrand)
// // 	}

// // 	const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// // 		const selectedModel = event.target.value
// // 		setSelectedModel(selectedModel)
// // 		onModelChange(selectedModel)
// // 	}

// // 	const toggleFiltersVisibility = () => {
// // 		setIsFiltersVisible(!isFiltersVisible)
// // 	}

// // 	const closeFilters = () => {
// // 		setIsFiltersVisible(false) // Función para cerrar filtros
// // 	}

// // 	useEffect(() => {
// // 		if (isFiltersVisible) {
// // 			document.body.classList.add('overflow-hidden')
// // 		} else {
// // 			document.body.classList.remove('overflow-hidden')
// // 		}

// // 		return () => {
// // 			document.body.classList.remove('overflow-hidden')
// // 		}
// // 	}, [isFiltersVisible])

// // 	return (
// // 		<div className="w-auto font-tertiary-font">
// // 			<div className="flex justify-between items-center gap-5 mb-4">
// // 				<div className="flex gap-5" onClick={toggleFiltersVisibility}>
// // 					<p className="text-primary-blue font-bold cursor-pointer">
// // 						Filtrar
// // 					</p>
// // 					<Image src="/filtros.svg" alt="filtro" width={20} height={20} />
// // 				</div>
// // 			</div>
	
// // 			<div
// // 				className={`${
// // 					isFiltersVisible
// // 						? 'fixed top-[14vw] left-0 right-0 bg-white p-6 h-[100%] overflow-y-auto'
// // 						: 'hidden'
// // 				} sm:block`}
// // 			>
// // 				<div className="flex gap-5 mb-4 sm:hidden">
// // 					<p className="text-primary-blue font-bold">Filtrar</p>
// // 					<Image src="/filtros.svg" alt="filtro" width={20} height={20} />
// // 					<div className="absolute right-6 top-6 cursor-pointer">
// // 						<button onClick={closeFilters}>
// // 							<Image src="/equis.svg" alt="equis" width={20} height={20} />
// // 						</button>
// // 					</div>
// // 				</div>
// // 				<p className="font-bold text-dark-grey mb-4">
// // 					BÚSQUEDA POR <br /> CATEGORÍA
// // 				</p>
// // 				<div className="mb-4">
// // 					{Object.keys(categories).map((categoryName) => {
// // 						const typedCategory = categoryName as CategoryKey;
// // 						return (
// // 							<div key={typedCategory} className="mb-2">
// // 								<label className="flex items-center">
// // 									<input
// // 										type="checkbox"
// // 										checked={selectedCategory === typedCategory}
// // 										onChange={() => handleCategoryChange(typedCategory)}
// // 										className="mr-2"
// // 									/>
// // 									{typedCategory}
// // 								</label>
// // 								{selectedCategory === typedCategory && (
// // 									<div className="ml-6 mt-2 max-h-[150px] overflow-y-auto border border-gray-300 rounded p-2">
// // 										{categories[typedCategory].map((subcategory) => (
// // 											<div key={subcategory} className="mb-1">
// // 												<label className="flex items-center">
// // 													<input
// // 														type="checkbox"
// // 														checked={selectedSubcategory === subcategory}
// // 														onChange={() => handleSubcategoryChange(subcategory)}
// // 														className="mr-2"
// // 													/>
// // 													{subcategory}
// // 												</label>
// // 											</div>
// // 										))}
// // 									</div>
// // 								)}
// // 							</div>
// // 						);
// // 					})}
// // 				</div>
	
				
// // 					<div className="mb-4">
// // 						<label className="block font-bold text-dark-grey mb-2">
// // 							Marca
// // 						</label>
// // 						<select
// // 							value={selectedBrand || ''}
// // 							onChange={handleBrandChange}
// // 							className="w-full p-2 border"
// // 						>
// // 							<option value="">Selecciona una marca</option>
// // 							{brands.map((brand) => (
// // 								<option key={brand} value={brand}>
// // 									{brand}
// // 								</option>
// // 							))}
// // 						</select>
// // 					</div>
				
	
// // 				{selectedBrand && (
// // 					<div className="mb-4">
// // 						<label className="block font-bold text-dark-grey mb-2">
// // 							Modelo
// // 						</label>
// // 						<select
// // 							value={selectedModel || ''}
// // 							onChange={handleModelChange}
// // 							className="w-full p-2 border"
// // 						>
// // 							<option value="">Selecciona un modelo</option>
// // 							{models.map((model) => (
// // 								<option key={model} value={model}>
// // 									{model}
// // 								</option>
// // 							))}
// // 						</select>
// // 					</div>
// // 				)}
// // 			</div>
// // 		</div>
// // 	);
// // }

// // export default Filters

// import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { categories, CategoryKey } from './categories'
// import algoliasearch from 'algoliasearch'
// import { environment } from '../../../environment/environment'

// interface FiltersProps {
//     onSubcategoryChange: (subcategory: string | null) => void
//     onBrandChange: (brand: string | null) => void
//     onModelChange: (model: string | null) => void
// }

// const appID = environment.algoliaAppID
// const apiKey = environment.algoliaAPIKey
// const indexName = environment.algoliaIndexName

// const Filters: React.FC<FiltersProps> = ({
//     onSubcategoryChange,
//     onBrandChange,
//     onModelChange,
// }) => {
//     const [selectedCategory, setSelectedCategory] =
//         useState<CategoryKey | null>(null)
//     const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
//     const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
//     const [selectedModel, setSelectedModel] = useState<string | null>(null)
//     const [brands, setBrands] = useState<string[]>([])
//     const [models, setModels] = useState<string[]>([])
//     const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false)

//     const algoliaClient = algoliasearch(appID, apiKey)
//     const index = algoliaClient.initIndex(indexName)

//     const handleCategoryChange = (category: CategoryKey) => {
//         setSelectedCategory(selectedCategory === category ? null : category)
//     }

//     const handleSubcategoryChange = (subcategory: string) => {
//         if (selectedSubcategory === subcategory) {
//             setSelectedSubcategory(null)
//             onSubcategoryChange(null)
//             setBrands([])
//             setModels([])
//         } else {
//             setSelectedSubcategory(subcategory)
//             onSubcategoryChange(subcategory)
//             fetchBrandsAndModels(subcategory)
//             setIsFiltersVisible(false) // Ocultar filtros después de seleccionar
//         }
//     }

//     const fetchBrandsAndModels = async (subcategory: string, selectedBrand?: string) => {
//         try {
//             const filters = [`productName:${subcategory}`]  // Filtro inicial basado en la subcategoría
            
//             if (selectedBrand) {
//                 filters.push(`brand:${selectedBrand}`)  // Si hay una marca seleccionada, se agrega al filtro
//             }

//             const { hits } = await index.search('', {
//                 facets: ['brand', 'articleModel'],
//                 facetFilters: filters,  // Usamos el array de filtros actualizado
//             })

//             // Filtrar las marcas solo si no hay una marca ya seleccionada
//             if (!selectedBrand) {
//                 const uniqueBrands = [...new Set(hits.map((hit: any) => hit.brand))]
//                 setBrands(uniqueBrands)
//             }

//             // Filtrar los modelos en base a la combinación de subcategoría y marca
//             const uniqueModels = [...new Set(hits.map((hit: any) => hit.articleModel))]
//             setModels(uniqueModels)

//         } catch (error) {
//             console.error('Error fetching brands and models:', error)
//         }
//     }

//     const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedBrand = event.target.value
//         setSelectedBrand(selectedBrand)
//         onBrandChange(selectedBrand)
        
//         // Filtrar modelos en función de la subcategoría y la marca seleccionada
//         if (selectedSubcategory) {
//             fetchBrandsAndModels(selectedSubcategory, selectedBrand)  // Filtrado por subcategoría y marca
//         }
//     }

//     const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedModel = event.target.value
//         setSelectedModel(selectedModel)
//         onModelChange(selectedModel)
//     }

//     const toggleFiltersVisibility = () => {
//         setIsFiltersVisible(!isFiltersVisible)
//     }

//     const closeFilters = () => {
//         setIsFiltersVisible(false) // Función para cerrar filtros
//     }

//     useEffect(() => {
//         if (isFiltersVisible) {
//             document.body.classList.add('overflow-hidden')
//         } else {
//             document.body.classList.remove('overflow-hidden')
//         }

//         return () => {
//             document.body.classList.remove('overflow-hidden')
//         }
//     }, [isFiltersVisible])

//     return (
//         <div className="w-auto font-tertiary-font">
//             <div className="flex justify-between items-center gap-5 mb-4">
//                 <div className="flex gap-5" onClick={toggleFiltersVisibility}>
//                     <p className="text-primary-blue font-bold cursor-pointer">
//                         Filtrar
//                     </p>
//                     <Image
//                         src="/filtros.svg"
//                         alt="filtro"
//                         width={20}
//                         height={20}
//                     />
//                 </div>
//             </div>

//             <div
//                 className={`${
//                     isFiltersVisible
//                         ? 'fixed top-[14vw] left-0 right-0 bg-white p-6 h-[100%] overflow-y-auto'
//                         : 'hidden'
//                 } sm:block`}
//             >
//                 <div className="flex gap-5 mb-4 sm:hidden">
//                     <p className="text-primary-blue font-bold">Filtrar</p>
//                     <Image
//                         src="/filtros.svg"
//                         alt="filtro"
//                         width={20}
//                         height={20}
//                     />
//                     <div className="absolute right-6 top-6 cursor-pointer">
//                         <button onClick={closeFilters}>
//                             <Image
//                                 src="/equis.svg"
//                                 alt="equis"
//                                 width={20}
//                                 height={20}
//                             />
//                         </button>
//                     </div>
//                 </div>
//                 <p className="font-bold text-dark-grey mb-4">
//                     BÚSQUEDA POR <br /> CATEGORÍA
//                 </p>
//                 <div className="mb-4">
//                     {Object.keys(categories).map((categoryName) => {
//                         const typedCategory = categoryName as CategoryKey
//                         return (
//                             <div key={typedCategory} className="mb-2">
//                                 <label className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedCategory === typedCategory}
//                                         onChange={() =>
//                                             handleCategoryChange(typedCategory)
//                                         }
//                                         className="mr-2"
//                                     />
//                                     {typedCategory}
//                                 </label>
//                                 {selectedCategory === typedCategory && (
//                                     <div className="ml-6 mt-2 max-h-32 overflow-y-auto">
//                                         {categories[typedCategory].map(
//                                             (subcategory) => (
//                                                 <div key={subcategory} className="mb-1">
//                                                     <label className="flex items-center">
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={
//                                                                 selectedSubcategory === subcategory
//                                                             }
//                                                             onChange={() =>
//                                                                 handleSubcategoryChange(subcategory)
//                                                             }
//                                                             className="mr-2"
//                                                         />
//                                                         {subcategory}
//                                                     </label>
//                                                 </div>
//                                             )
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         )
//                     })}
//                 </div>

               
//                     <div className="mb-4">
//                         <label className="block font-bold text-dark-grey mb-2">
//                             Marca
//                         </label>
//                         <select
//                             value={selectedBrand || ''}
//                             onChange={handleBrandChange}
//                             className="w-full p-2 border"
//                         >
//                             <option value="">Selecciona una marca</option>
//                             {brands.map((brand) => (
//                                 <option key={brand} value={brand}>
//                                     {brand}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
               

                
//                     <div className="mb-4">
//                         <label className="block font-bold text-dark-grey mb-2">
//                             Modelo
//                         </label>
//                         <select
//                             value={selectedModel || ''}
//                             onChange={handleModelChange}
//                             className="w-full p-2 border"
//                         >
//                             <option value="">Selecciona un modelo</option>
//                             {models.map((model) => (
//                                 <option key={model} value={model}>
//                                     {model}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
               
//             </div>
//         </div>
//     )
// }

// export default Filters

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { categories, CategoryKey } from './categories'
import algoliasearch from 'algoliasearch'
import { environment } from '../../../environment/environment'

interface FiltersProps {
    onSubcategoryChange: (subcategory: string | null) => void
    onBrandChange: (brand: string | null) => void
    onModelChange: (model: string | null) => void
}

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey
const indexName = environment.algoliaIndexName

const Filters: React.FC<FiltersProps> = ({
    onSubcategoryChange,
    onBrandChange,
    onModelChange,
}) => {
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryKey | null>(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [selectedModel, setSelectedModel] = useState<string | null>(null)
    const [brands, setBrands] = useState<string[]>([])
    const [models, setModels] = useState<string[]>([])
    const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false)

    const algoliaClient = algoliasearch(appID, apiKey)
    const index = algoliaClient.initIndex(indexName)

    const handleCategoryChange = (category: CategoryKey) => {
        setSelectedCategory(selectedCategory === category ? null : category)
    }

    const handleSubcategoryChange = (subcategory: string) => {
        if (selectedSubcategory === subcategory) {
            setSelectedSubcategory(null)
            onSubcategoryChange(null)
            setBrands([])
            setModels([])
        } else {
            setSelectedSubcategory(subcategory)
            onSubcategoryChange(subcategory)
            fetchBrandsAndModels(subcategory)
            setIsFiltersVisible(false) // Ocultar filtros después de seleccionar
        }
    }

    const fetchBrandsAndModels = async (subcategory: string, selectedBrand?: string) => {
        try {
            const filters = [`productName:${subcategory}`]  // Filtro inicial basado en la subcategoría
            
            if (selectedBrand) {
                filters.push(`brand:${selectedBrand}`)  // Si hay una marca seleccionada, se agrega al filtro
            }

            const { hits } = await index.search('', {
                facets: ['brand', 'articleModel'],
                facetFilters: filters,  // Usamos el array de filtros actualizado
            })

            // Filtrar las marcas solo si no hay una marca ya seleccionada
            if (!selectedBrand) {
                const uniqueBrands = [...new Set(hits.map((hit: any) => hit.brand))]
                setBrands(uniqueBrands)
            }

            // Filtrar los modelos en base a la combinación de subcategoría y marca
            const uniqueModels = [...new Set(hits.map((hit: any) => hit.articleModel))]
            setModels(uniqueModels)

        } catch (error) {
            console.error('Error fetching brands and models:', error)
        }
    }

    const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBrand = event.target.value
        setSelectedBrand(selectedBrand)
        onBrandChange(selectedBrand)

        // Resetear el modelo cuando se cambia la marca
        setSelectedModel(null)
        onModelChange(null)

        // Filtrar modelos en función de la subcategoría y la marca seleccionada
        if (selectedSubcategory) {
            fetchBrandsAndModels(selectedSubcategory, selectedBrand)  // Filtrado por subcategoría y marca
        }
    }

    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedModel = event.target.value
        setSelectedModel(selectedModel)
        onModelChange(selectedModel)
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
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategory === typedCategory}
                                        onChange={() =>
                                            handleCategoryChange(typedCategory)
                                        }
                                        className="mr-2"
                                    />
                                    {typedCategory}
                                </label>
                                {selectedCategory === typedCategory && (
                                    <div className="ml-6 mt-2 max-h-32 overflow-y-auto">
                                        {categories[typedCategory].map(
                                            (subcategory) => (
                                                <div key={subcategory} className="mb-1">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedSubcategory === subcategory
                                                            }
                                                            onChange={() =>
                                                                handleSubcategoryChange(subcategory)
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

                
                    <div className="mb-4">
                        <label className="block font-bold text-dark-grey mb-2">
                            Marca
                        </label>
                        <select
                            value={selectedBrand || ''}
                            onChange={handleBrandChange}
                            className="w-full p-2 border"
                        >
                            <option value="">Selecciona una marca</option>
                            {brands.map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>
                

                
                    <div className="mb-4">
                        <label className="block font-bold text-dark-grey mb-2">
                            Modelo
                        </label>
                        <select
                            value={selectedModel || ''}
                            onChange={handleModelChange}
                            className="w-full p-2 border"
                        >
                            <option value="">Selecciona un modelo</option>
                            {models.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>
                
            </div>
        </div>
    )
}

export default Filters

