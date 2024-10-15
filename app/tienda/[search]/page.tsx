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
import { addItemToCart, savePurchaseAsync } from '../../redux/features/shoppingCartSlice'
import { useAppDispatch } from '../../redux/hooks';
import { useRouter } from 'next/navigation'
import { environment } from '../../environment/environment'

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey

export default function Store({ params }: { params: { search: string } }) {

	const router = useRouter()
	const dispatch = useAppDispatch()
	const client = algoliasearch(appID, apiKey)
	const index = client.initIndex(environment.algoliaIndexName)
	const hitsRef = useRef<any[]>([])

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('')

	const searchAlgolia = useCallback(
		async (query: string) => {
			setLoading(true)
			try {
				const result = await index.search(query, {
					hitsPerPage: 50,
					facetFilters: ['isMetasync:true', 'stock:true'],
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
			} catch (error) {
				setError((error as Error).message)
			} finally {
				setLoading(false)
			}
		},
		[index]
	)

	useEffect(() => {
		// Si hay un valor en params.search, realiza la búsqueda automáticamente
		if (!inputValue) {
			const searchQuery = decodeURIComponent(params.search)
			searchAlgolia(searchQuery)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.search, inputValue])

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const handleEnterPress = () => {
		searchAlgolia(inputValue); // Realiza la búsqueda solo cuando se presiona Enter
	}

	let userId: string | null = null
	if (typeof window !== 'undefined') {
		userId = localStorage.getItem('airtableUserId')
	}

	const buynow = (product: any) => {
        dispatch(addItemToCart(product));
        dispatch(savePurchaseAsync({ product: product, userId: userId ?? '' }));
        router.push('/verificacion-pago');
    };

	return (
		<main className="flex flex-col items-center mt-80">
			<div>
				<SearchBar
					onChange={handleInputChange}
					onEnterPress={handleEnterPress} // Pasa el nuevo método aquí
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
		</main>
	)
}
