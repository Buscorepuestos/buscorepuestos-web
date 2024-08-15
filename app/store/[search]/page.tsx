'use client'
import React, {
	ChangeEvent,
	useRef,
	useCallback,
	useEffect,
	useState,
} from 'react'
import CardPrice from '../../core/components/cards/CardPrice'
import { IProductMongoose } from '../../types/product'
import algoliasearch from 'algoliasearch'
import SearchBar from '../../core/components/SearchBar'

const appID = 'DSKGGHHS58'
const apiKey = '6f49eeb288faef802bf5236c9fa6720d'

export default function Store({ params }: { params: { search: string } }) {
	const client = algoliasearch(appID, apiKey)
	// Create a new index and add a record
	const index = client.initIndex('dev_PRODUCTS')
	const hitsRef = useRef<any[]>([])

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('')

	const searchAlgolia = useCallback(
		async (query: string) => {
			// Search for query in the index "products"
			const result = await index.search(query)
			setProducts(result.hits as unknown as IProductMongoose[])
		},
		[index]
	)

	useEffect(() => {
		if (params.search && !inputValue) {
			const searchQuery = decodeURIComponent(params.search)
			searchAlgolia(searchQuery)
		} else if (!params.search && !inputValue) {
			// Carga inicial o búsqueda sin parámetros
			const fetchProducts = async () => {
				try {
					await index
						.browseObjects({
							batch: (batch) => {
								hitsRef.current = hitsRef.current.concat(batch)
							},
							attributesToRetrieve: [
								'title',
								'mainReference',
								'brand',
								'articleModel',
								'year',
								'buscorepuestosPrice',
								'images',
							],
						})
						.then(() => setProducts(hitsRef.current))
				} catch (error) {
					setError((error as Error).message)
				} finally {
					setLoading(false)
				}
			}
			fetchProducts()
		}
	}, [params.search, inputValue, searchAlgolia, hitsRef, index])

	// useEffect(() => {
	// 	if (params.search && !inputValue) {
	// 		if (params.search.includes('%20')) {
	// 			const search = params.search.split('%20').join(' ');
	// 			searchAlgolia(search);
	// 		} else {
	// 			searchAlgolia(params.search);
	// 		}
	// 	}
	// }
	// , [params.search, searchAlgolia, inputValue]);

	// useEffect(() => {
	// 	const fetchProducts = async () => {
	// 		try {
	// 			index.browseObjects({
	// 				batch: batch => {
	// 					// eslint-disable-next-line react-hooks/exhaustive-deps
	// 					hits = hits.concat(batch)
	// 				},
	// 				attributesToRetrieve: ['title', 'mainReference', 'brand', 'articleModel', 'year', 'buscorepuestosPrice', 'images'],
	// 			}).then(() => setProducts(hits))
	// 		} catch (error) {
	// 			setError((error as Error).message)
	// 		} finally {
	// 			setLoading(false)
	// 		}
	// 	}

	// 	fetchProducts()
	// }, [])

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}
	const parsePrice = (price: number) => {
		return price.toFixed(2).replace('.', ',')
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
		searchAlgolia(event.target.value)
	}

	return (
		<main>
			<div className={'flex justify-end mr-6 mt-80'}>
				<SearchBar
					onChange={handleInputChange}
					height={'52px'}
					width={'w-[480px] mobile:w-[80vw]'}
					borderColor={'#12B1BB'}
					borderWidth={'2px'}
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
						reference={product.mainReference}
						description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
						price={product?.buscorepuestosPrice || 0}
						image={
							product.images[0]
								? product.images[0]
								: '/nodisponible.png'
						}
					/>
				))}
				{loading && <p>Loading...</p>}
				{error && <p>Error</p>}
			</section>
		</main>
	)
}
