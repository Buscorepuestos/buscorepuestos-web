'use client'
import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useState,
} from 'react'
import CardPrice from '../../core/components/cards/CardPrice'
import { IProductMongoose } from '../../types/product'
import algoliasearch from 'algoliasearch'
import SearchBar from '../../core/components/SearchBar'
import {
	addItemToCart,
	savePurchaseAsync,
} from '../../redux/features/shoppingCartSlice'
import { useAppDispatch } from '../../redux/hooks'
import { useRouter } from 'next/navigation'
import { environment } from '../../environment/environment'
import Filters from '../../core/components/filters/filters'
import Image from 'next/image'
import '../tienda.css'

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey
const indexName = environment.algoliaIndexName

export default function Store({ params }: { params: { search: string } }) {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const client = algoliasearch(appID, apiKey)
	const index = client.initIndex(indexName)

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('')
	const [selectedSubcategory, setSelectedSubcategory] = useState<
		string | null
	>(null)
	const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
	const [selectedModel, setSelectedModel] = useState<string | null>(null)

	const searchAlgolia = useCallback(
		async (
			query: string,
			subcategory: string | null = null,
			brand: string | null = null,
			model: string | null = null
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

				const result = await index.search(searchQuery, {
					hitsPerPage: 100,
					facetFilters: filters,
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
				setProducts(result.hits as unknown as IProductMongoose[])
				console.log(query, "THIS IS THE QUERY")
				console.log(filters, "THESE ARE THE FILTERS")
				console.log(result.hits)
			} catch (error) {
				setError((error as Error).message)
			} finally {
				setLoading(false)
			}
		},
		[index]
	)

	useEffect(() => {
		// Si no hay un valor en inputValue, realiza la búsqueda inicial desde params.search
		if (!inputValue) {
			const searchQuery = decodeURIComponent(params.search);
			searchAlgolia(searchQuery, selectedSubcategory, selectedBrand, selectedModel);
		} else {
			// Realiza la búsqueda basada en el inputValue y los filtros seleccionados
			searchAlgolia(inputValue, selectedSubcategory, selectedBrand, selectedModel);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.search, selectedSubcategory, selectedBrand, selectedModel]);

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const handleEnterPress = () => {
		// Reinicia los filtros antes de realizar una nueva búsqueda desde la barra de búsqueda
		setSelectedSubcategory(null);
		setSelectedBrand(null);
		setSelectedModel(null);
		
		searchAlgolia(inputValue); // Realiza la búsqueda solo cuando se presiona Enter
	}

	const handleSubcategoryChange = (subcategory: string | null) => {
		setSelectedSubcategory(subcategory);
		setInputValue(''); // Resetea inputValue si cambias la subcategoría
	}
	
	const handleBrandChange = (brand: string | null) => {
		setSelectedBrand(brand);
		setInputValue(''); // Resetea inputValue si cambias la marca
	}
	
	const handleModelChange = (model: string | null) => {
		setSelectedModel(model);
		setInputValue(''); // Resetea inputValue si cambias el modelo
	}

	const buynow = (product: any) => {
		dispatch({ type: 'auth/checkUserStatus' })
		setTimeout(() => {
			dispatch(addItemToCart(product))
			dispatch(
				savePurchaseAsync({
					product: product,
					userId: localStorage.getItem('airtableUserId') ?? '',
				})
			)
			router.push('/verificacion-pago')
		}, 1500)
	}

	return (
		<main className="m-auto max-w-[1170px] mt-80 mobile:mt-[25vw] xl:w-[95%] lg:w-[90%] md:w-[85%] sm:w-[82%]">
			<div className="sm:grid sm:grid-cols-custom-filters sm:gap-10">
				<div className="mobile:hidden">
					<Filters 
						onSubcategoryChange={handleSubcategoryChange} 
						onBrandChange={handleBrandChange}
						onModelChange={handleModelChange}
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
					<div
						className="
							flex w-full my-5 md:gap-14 sm:gap-3 bg-gray-200 font-tertiary-font 
							text-secondary-blue font-semibold h-[5rem] mobile:h-[13rem] justify-center 
							rounded-3xl lg:text-[14px] md:text-[1.1vw] sm:text-[1.2vw] mobile:text-[3.2vw] mobile:px-[2.9rem]
							mobile:grid mobile:grid-cols-2 mobile:gap-0 mobile:w-[85%] mobile:font-normal mobile:py-[1rem]
						"
					>
						<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
							<Image
								src="/garantia.svg"
								alt="garantia"
								width={34}
								height={34}
								className="lg:w-[1.8vw] md:w-[2.5vw] sm:w-[3vw] mobile:w-[8vw]"
							/>
							<p>2 años de garantía</p>
						</div>
						<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
							<Image
								src="/devolucion.svg"
								alt="devolucion"
								width={34}
								height={34}
								className="lg:w-[1.8vw] md:w-[2.5vw] sm:w-[3vw] mobile:w-[8vw]"
							/>
							<p>devolución gratuita</p>
						</div>
						<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
							<Image
								src="/atencion.svg"
								alt="atencion"
								width={34}
								height={34}
								className="lg:w-[1.8vw] md:w-[2.5vw] sm:w-[3vw] mobile:w-[9vw]"
							/>
							<p>Atencíon al cliente 24h</p>
						</div>
						<div className="flex items-center md:gap-4 sm:gap-1 mobile:gap-5">
							<Image
								src="/pago.svg"
								alt="pago"
								width={34}
								height={34}
								className="lg:w-[1.8vw] md:w-[2.5vw] sm:w-[3vw] mobile:w-[8vw]"
							/>
							<p>Pago a plazos</p>
						</div>
					</div>
					<div className="sm:hidden mobile:w-full px-[8vw]">
						<Filters
							onSubcategoryChange={handleSubcategoryChange}
							onBrandChange={handleBrandChange}
							onModelChange={handleModelChange}
						/>
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
								handleBuy={() => buynow(product)}
								id={product._id}
							/>
						))}
						{loading && <p>Loading...</p>}
						{error && <p>Error</p>}
					</section>
				</div>
			</div>
		</main>
	)
}
