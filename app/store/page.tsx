'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import CardPrice from '../core/components/cards/CardPrice'
import { IProductMongoose } from '../types/product'
import algoliasearch from 'algoliasearch'
import SearchBar from '../core/components/SearchBar'
import { addItemToCart, savePurchaseAsync } from '../redux/features/shoppingCartSlice'
import { useAppDispatch } from '../redux/hooks';
import { useRouter } from 'next/navigation'
import { environment } from '../environment/environment'

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey

export default function Store() {

	const dispatch = useAppDispatch()
	const router = useRouter()
	const client = algoliasearch(appID, apiKey)
	const index = client.initIndex(environment.algoliaIndexName)

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('')

	const search = async (query: string) => {
		setLoading(true)
		try {
			const result = await index.search(query, {
				hitsPerPage: 50,
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
			setProducts(result.hits as unknown as IProductMongoose[])
		} catch (err) {
			setError((err as Error).message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const fetchInitialProducts = async () => {
			try {
				const { hits } = await index.search('', { hitsPerPage: 50 })
				setProducts(hits as unknown as IProductMongoose[])
			} catch (error) {
				setError((error as Error).message)
			} finally {
				setLoading(false)
			}
		}

		fetchInitialProducts()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
        dispatch({ type: "auth/checkUserStatus" });
    }, [dispatch]);

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
		search(event.target.value)
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
					/>
				))}
				{loading && <p>Loading...</p>}
				{error && <p>Error</p>}
			</section>
		</main>
	)
}
