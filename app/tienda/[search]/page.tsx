'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import CardPrice from '../../core/components/cards/CardPrice'
import SearchBar from '../../core/components/SearchBar'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { useRouter } from 'next/navigation'
import Filters from '../../core/components/filters/filters'
import Facilities from '../../core/components/facilities/Facilities'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import NotFoundInStore from '../../core/components/notFound/NotFoundInStore' // Importado para el caso de no encontrar resultados
import '../tienda.css'
import { fetchProducts, setCurrentPage } from '../../redux/features/productSearchSlice'

export default function Store({ params }: { params: { search: string } }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        searchResults: products,
        loading: loadingSearch, // Renombrado para evitar conflicto con el estado local 'loading'
        error,
        currentPage,
        totalPages
    } = useAppSelector(state => state.productSearch);

    // --- ESTADOS LOCALES ---
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Estados de UI
    const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // --- EFECTOS ---

    // Efecto #1: Se ejecuta cuando el parámetro de la URL cambia (búsqueda inicial)
    useEffect(() => {
        const searchQuery = decodeURIComponent(params.search || '');
        setInputValue(searchQuery);

        // Una nueva búsqueda desde la URL debe ser una búsqueda "limpia"
        setSelectedSubcategory(null);
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedYear(null);

        // Volvemos a la página 1 para la nueva búsqueda
        dispatch(setCurrentPage(1));
    }, [params.search, dispatch]);

    // Efecto #2: El motor de búsqueda central. Se ejecuta cuando CUALQUIER filtro cambia.
    useEffect(() => {
        // Cancelamos el debounce anterior si existe
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // Establecemos un nuevo debounce para evitar llamadas excesivas a la API
        debounceTimer.current = setTimeout(() => {
            // Solo buscamos si hay algún filtro activo (texto o de faceta)
            if (inputValue.trim() || selectedSubcategory) {
                dispatch(fetchProducts({
                    // Pasamos TODOS los filtros actuales al thunk de Redux
                    searchTerm: inputValue.trim(),
                    page: currentPage,
                    sortOrder,
                    subcategory: selectedSubcategory,
                    brand: selectedBrand,
                    model: selectedModel,
                    year: selectedYear,
                }));
            }
        }, 500); // 500ms de espera

        // Función de limpieza para cancelar el timer si el componente se desmonta
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
        // Este efecto depende de todos los estados que pueden modificar la búsqueda
    }, [dispatch, inputValue, currentPage, sortOrder, selectedSubcategory, selectedBrand, selectedModel, selectedYear]);

    // --- HANDLERS ---

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            dispatch(setCurrentPage(currentPage + 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            dispatch(setCurrentPage(currentPage - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        // Cuando el usuario escribe, la búsqueda se vuelve por texto, reseteamos filtros
        // y volvemos a la página 1. Esta es una decisión de UX, puedes ajustarla.
        setSelectedSubcategory(null);
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedYear(null);
        dispatch(setCurrentPage(1));
    };

    // Al seleccionar un filtro, limpiamos el input de texto para evitar conflictos
    const handleSubcategoryChange = (subcategory: string | null) => {
        setSelectedSubcategory(subcategory);
        setSelectedBrand(null); // Reseteamos filtros dependientes
        setSelectedModel(null);
        setSelectedYear(null);
        setInputValue(''); // Limpiamos el texto
        dispatch(setCurrentPage(1));
    };

    const handleBrandChange = (brand: string | null) => {
        setSelectedBrand(brand);
        setSelectedModel(null); // Reseteamos filtros dependientes
        setSelectedYear(null);
        setInputValue('');
        dispatch(setCurrentPage(1));
    };

    const handleModelChange = (model: string | null) => {
        setSelectedModel(model);
        setInputValue('');
        dispatch(setCurrentPage(1));
    };

    const handleYearChange = (year: number | null) => {
        setSelectedYear(year);
        setInputValue('');
        dispatch(setCurrentPage(1));
    };

    const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value as 'asc' | 'desc' | null);
        dispatch(setCurrentPage(1));
    };

    const handleProductClick = (productId: string) => {
        setLoadingPurchase(productId);
        router.push(`/producto/${productId}`);
    };

    const cleanValue = (text: string) => {
        return text ? ` ${text.replace('-', '')}` : '';
    };

    const handleClearSearch = () => {
        setInputValue('');
        dispatch(setCurrentPage(1));
    };

    return (
        <main className="m-auto max-w-[1170px] mt-80 mobile:mt-[25vw] xl:w-[95%] lg:w-[90%] md:w-[85%] sm:w-[82%]">
            <div className="sm:grid sm:grid-cols-custom-filters sm:gap-10">
                <div className="mobile:hidden">
                    <Filters
                        onSubcategoryChange={handleSubcategoryChange}
                        onBrandChange={handleBrandChange}
                        onModelChange={handleModelChange}
                        onYearChange={handleYearChange}
                        // Pasamos todos los valores seleccionados para que Filters sea un componente controlado
                        selectedSubcategory={selectedSubcategory}
                        selectedBrand={selectedBrand}
                        selectedModel={selectedModel}
                        selectedYear={selectedYear}
                    />
                </div>
                <div className="flex flex-col gap-5 sm:max-h-[1500rem] mobile:items-center">
                    <div className="flex justify-end">
                        <SearchBar
                            value={inputValue} // Hacemos el SearchBar un componente controlado
                            onChange={handleInputChange}
                            height={'52px'}
                            width={'w-[480px] mobile:w-[80vw]'}
                            borderColor={'#12B1BB'}
                            borderWidth={'2px'}
                            onClear={handleClearSearch} // NUEVO: Función para limpiar la búsqueda
                        />
                    </div>
                    <Facilities
                        classNamePrincipal="flex w-full my-5 md:gap-14 sm:gap-3 bg-gray-200 font-tertiary-font text-secondary-blue font-semibold h-[5rem] mobile:h-[13rem] justify-center rounded-3xl lg:text-[14px] md:text-[1.1vw] sm:text-[1.2vw] mobile:text-[3.2vw] mobile:px-[2.9rem] mobile:grid mobile:grid-cols-2 mobile:gap-0 mobile:w-[85%] mobile:font-normal mobile:py-[1rem]"
                        classNameImg="lg:w-[1.8vw] md:w-[2.5vw] sm:w-[3vw] mobile:w-[10vw]"
                    />
                    <div className="sm:hidden mobile:w-full px-[8vw]">
                        <Filters
                            onSubcategoryChange={handleSubcategoryChange}
                            onBrandChange={handleBrandChange}
                            onModelChange={handleModelChange}
                            onYearChange={handleYearChange}
                            selectedSubcategory={selectedSubcategory}
                            selectedBrand={selectedBrand}
                            selectedModel={selectedModel}
                            selectedYear={selectedYear}
                        />
                    </div>
                    <div className="flex w-[100%] mr-11 justify-end sm:my-4">
                        <select
                            className="border border-gray-300 p-2 rounded mobile:text-sm"
                            value={sortOrder || ''}
                            onChange={handleSortOrderChange}
                        >
                            <option disabled value="">Ordenar por precio</option>
                            <option value="asc">Menor a Mayor</option>
                            <option value="desc">Mayor a Menor</option>
                        </select>
                    </div>

                    {loadingSearch ? (
                        <div className="flex justify-center my-4">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500">Error: {error}</p>
                    ) : (
                        <>
                            {products.length > 0 ? (
                                <section className={'grid grid-cols-4 grid-rows-4 tablet:grid-cols-3 tablet:grid-rows-3 mobile:grid-cols-2 mobile:grid-rows-2'}>
                                    {products.map((product: any) => (
                                        <CardPrice
                                            key={product._id}
                                            title={product.title}
                                            reference={product.mainReference || ''}
                                            description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
                                            price={product?.buscorepuestosPrice || 0}
                                            image={product.images?.[0] || '/nodisponible.png'}
                                            handle={() => handleProductClick(product._id)}
                                            id={product._id}
                                            loading={loadingPurchase === product._id}
                                        />
                                    ))}
                                </section>
                            ) : (
                                <NotFoundInStore />
                            )}
                        </>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination-controls flex justify-center items-center gap-4 mt-4 mb-4">
                            <button onClick={handlePrevPage} disabled={currentPage <= 1}>
                                <ChevronLeftIcon className="w-8 h-8 text-primary-blue hover:text-primary-lila disabled:text-gray-400" />
                            </button>
                            <span>{`Página ${currentPage} de ${totalPages}`}</span>
                            <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
                                <ChevronRightIcon className="w-8 h-8 text-primary-blue hover:text-primary-lila disabled:text-gray-400" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}