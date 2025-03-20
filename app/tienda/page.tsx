'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import CardPrice from '../core/components/cards/CardPrice'
import { IProductMongoose } from '../types/product'
import algoliasearch from 'algoliasearch'
import SearchBar from '../core/components/SearchBar'
import { useAppDispatch } from '../redux/hooks'
import { useRouter } from 'next/navigation'
import { environment } from '../environment/environment'
import Filters from '../core/components/filters/filters'
import Facilities from '../core/components/facilities/Facilities'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import './tienda.css'

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey
const indexName = environment.algoliaIndexName

export default function Store() {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const client = algoliasearch(appID, apiKey)
	const index = client.initIndex(indexName)

	index.setSettings({
		paginationLimitedTo: 20000,
	})

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('')
	const [selectedSubcategory, setSelectedSubcategory] = useState<
		string | null
	>(null)
	const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
	const [selectedModel, setSelectedModel] = useState<string | null>(null)
	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null)

	const [currentPage, setCurrentPage] = useState(0) // Página actual
	const [totalPages, setTotalPages] = useState(0) // Total de páginas
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)

	const search = async (
		query: string,
		subcategory: string | null = null,
		brand: string | null = null,
		model: string | null = null,
		year: number | null = null,
		page: number = 0
	) => {
		setLoading(true)
		let searchQuery = query
		try {
			const filters: string[] = ['isMetasync:true', 'stock:true']
			if (subcategory) {
				searchQuery = ''
				filters.push(`productName:${subcategory}`)
			}
			if (brand) filters.push(`brand:${brand}`)
			if (model) filters.push(`articleModel:${model}`)
			if (year) filters.push(`year:${year}`)

			const result = await index.search(searchQuery, {
				facetFilters: filters,
				hitsPerPage: 100,
				page: page,
				attributesToRetrieve: [
					'title',
					'mainReference',
					'brand',
					'articleModel',
					'year',
					'buscorepuestosPrice',
					'images',
					'_id',
					'isMetasync',
					'stock',
					'refLocal',
					'idEmpresa',
				],
			})

			const sortedProducts = (
				result.hits as unknown as IProductMongoose[]
			).sort((a, b) => {
				if (sortOrder === 'asc')
					return (
						(a.buscorepuestosPrice || 0) -
						(b.buscorepuestosPrice || 0)
					)
				if (sortOrder === 'desc')
					return (
						(b.buscorepuestosPrice || 0) -
						(a.buscorepuestosPrice || 0)
					)
				return 0
			})

			const sortedProductsWithImages = sortedProducts.sort((a, b) => {
				const aHasImages = a.images && a.images.length > 0 ? 1 : 0
				const bHasImages = b.images && b.images.length > 0 ? 1 : 0
				return bHasImages - aHasImages
			})

			setProducts(sortedProductsWithImages)
			setTotalPages(result.nbPages) // Total de páginas disponibles
		} catch (err) {
			console.log(err)
			setError((err as Error).message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		dispatch({ type: 'auth/checkUserStatus' })
	}, [dispatch])

	useEffect(() => {
		search(
			inputValue,
			selectedSubcategory,
			selectedBrand,
			selectedModel,
			selectedYear
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		selectedSubcategory,
		selectedBrand,
		selectedModel,
		selectedYear,
		sortOrder,
	])

	const handleNextPage = () => {
		if (currentPage < totalPages - 1) {
			const nextPage = currentPage + 1
			setCurrentPage(nextPage)
			search(
				inputValue,
				selectedSubcategory,
				selectedBrand,
				selectedModel,
				selectedYear,
				nextPage
			)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const handlePrevPage = () => {
		if (currentPage > 0) {
			const prevPage = currentPage - 1
			setCurrentPage(prevPage)
			search(
				inputValue,
				selectedSubcategory,
				selectedBrand,
				selectedModel,
				selectedYear,
				prevPage
			)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const handleEnterPress = () => {
		// Reinicia los filtros antes de realizar una nueva búsqueda desde la barra de búsqueda
		setSelectedSubcategory(null)
		setSelectedBrand(null)
		setSelectedModel(null)

		search(inputValue) // Realiza la búsqueda solo cuando se presiona Enter
	}

	const handleSubcategoryChange = (subcategory: string | null) => {
		setSelectedSubcategory(subcategory)
	}

	const handleBrandChange = (brand: string | null) => {
		setSelectedBrand(brand)
	}

	const handleModelChange = (model: string | null) => {
		setSelectedModel(model)
	}

	const handleYearChange = (year: number | null) => {
		setSelectedYear(year)
	}

	const handle = (productId: string) => {
		setLoadingPurchase(productId)
		router.push(`/producto/${productId}`)
	}

	console.log('products', products)
	return (
		<main className="m-auto max-w-[1170px] mt-80 mobile:mt-[25vw] xl:w-[95%] lg:w-[90%] md:w-[85%] sm:w-[82%]">
			<div className="sm:grid sm:grid-cols-custom-filters sm:gap-10">
				<div className="mobile:hidden">
					<Filters
						initialSubcategory={''}
						onSubcategoryChange={handleSubcategoryChange}
						onBrandChange={handleBrandChange}
						onModelChange={handleModelChange}
						onYearChange={handleYearChange}
					/>
				</div>
				<div className="flex flex-col gap-5 sm:max-h-[1500rem] mobile:items-center">
					<div className="flex justify-end">
						<SearchBar
							onChange={handleInputChange}
							onEnterPress={handleEnterPress} // Pasa el nuevo método aquí
							height={'52px'}
							width={'w-[480px] mobile:w-[80vw]'}
							borderColor={'#12B1BB'}
							borderWidth={'2px'}
						/>
					</div>
					<Facilities
						classNamePrincipal="
							flex w-full my-5 md:gap-14 sm:gap-3 bg-gray-200 font-tertiary-font 
							text-secondary-blue font-semibold h-[5rem] mobile:h-[13rem] justify-center 
							rounded-3xl lg:text-[14px] md:text-[1.1vw] sm:text-[1.2vw] mobile:text-[3.2vw] mobile:px-[2.9rem]
							mobile:grid mobile:grid-cols-2 mobile:gap-0 mobile:w-[85%] mobile:font-normal mobile:py-[1rem]
						"
						classNameImg="lg:w-[1.8vw] md:w-[2.5vw] sm:w-[3vw] mobile:w-[10vw]"
					/>
					<div className="sm:hidden mobile:w-full px-[8vw]">
						<Filters
							initialSubcategory={''}
							onSubcategoryChange={handleSubcategoryChange}
							onBrandChange={handleBrandChange}
							onModelChange={handleModelChange}
							onYearChange={handleYearChange}
						/>
					</div>
					<div className="flex w-[100%] mr-11 justify-end sm:my-4">
						<select
							className="border border-gray-300 p-2 rounded mobile:text-sm"
							value={sortOrder || ''}
							onChange={(e) =>
								setSortOrder(
									e.target.value as 'asc' | 'desc' | null
								)
							}
						>
							<option disabled value="">Ordenar por precio</option>
							<option value="asc">Menor a Mayor</option>
							<option value="desc">Mayor a Menor</option>
						</select>
					</div>
					<section
						className={
							'grid grid-cols-4 grid-rows-4 tablet:grid-cols-3 tablet:grid-rows-3 mobile:grid-cols-2 mobile:grid-rows-2'
						}
					>
						{products.map((product: any, index) => (
							<CardPrice
								key={index}
								title={product.title}
								reference={product.mainReference!}
								description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
								price={product?.buscorepuestosPrice || 0}
								image={
									product.images[0]
										? product.images[0]
										: '/nodisponible.png'
								}
								handle={() => handle(product._id.$oid)}
								id={product._id.$oid}
								loading={loadingPurchase === product._id.$oid}
							/>
						))}
					</section>
					{loading && (
						<div className="flex justify-center my-4">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
						</div>
					)}
					{error && <p>Error</p>}
					<div className="pagination-controls flex justify-center items-center gap-4 mt-4 mb-4">
						<button
							onClick={handlePrevPage}
							disabled={currentPage === 0}
						>
							<ChevronLeftIcon className="w-8 h-8 text-primary-blue hover:text-primary-lila" />
						</button>
						<span>{`Página ${currentPage + 1} de ${totalPages}`}</span>
						<button
							onClick={handleNextPage}
							disabled={currentPage === totalPages - 1}
						>
							<ChevronRightIcon className="w-8 h-8 text-primary-blue hover:text-primary-lila" />
						</button>
					</div>
				</div>
			</div>
		</main>
	)
}
