'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import CardPrice from '../core/components/cards/CardPrice'
import { IProductMongoose } from '../types/product'
import algoliasearch from 'algoliasearch'
import SearchBar from '../core/components/SearchBar'

const appID = 'DSKGGHHS58'
const apiKey = '6f49eeb288faef802bf5236c9fa6720d'

export default function Store() {

	const client = algoliasearch(appID, apiKey)
	const index = client.initIndex('dev_PRODUCTS')
	const hitsRef = useRef<IProductMongoose[]>([]);

	const search = async (query: string) => {
		const result = await index.search(query);
		setProducts(result.hits as unknown as IProductMongoose[]);
	}

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('');

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				await index.browseObjects({
					batch: batch => {
						const formattedBatch = batch.map((item: any) => ({
							...item,
							// Asegúrate de que los campos necesarios se ajusten al tipo `IProductMongoose`
							title: item.title,
							mainReference: item.mainReference,
							brand: item.brand,
							articleModel: item.articleModel,
							year: item.year,
							buscorepuestosPrice: item.buscorepuestosPrice,
							images: item.images
						}));
						hitsRef.current = hitsRef.current.concat(formattedBatch);
					},
					attributesToRetrieve: ['title', 'mainReference', 'brand', 'articleModel', 'year', 'buscorepuestosPrice', 'images'],
				});
				setProducts(hitsRef.current);
			} catch (error) {
				setError((error as Error).message);
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, [
		index
	]);

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`;
	}
	const parsePrice = (price: number) => {
		return price.toFixed(2).replace('.', ',');
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
		search(event.target.value);
	};

	return (
		<main>
			<div className={'flex justify-end mr-6 mt-80'}>
				<SearchBar onChange={handleInputChange} height={'52px'} width={'w-[480px] mobile:w-[80vw]'} borderColor={'#12B1BB'} borderWidth={'2px'} />
			</div>
			<section
				className={'grid grid-cols-4 grid-rows-4 tablet:grid-cols-3 tablet:grid-rows-3 mobile:grid-cols-2 mobile:grid-rows-2'}>
				{products.map((product, index) => (
					<CardPrice key={index} title={product.title}
						reference={product.mainReference ?? ''}
						description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
						price={Number(parsePrice(product.buscorepuestosPrice ?? 0))}
						image={product.images[0] ? product.images[0] : '/nodisponible.png'} />
				))}
				{loading && <p>Loading...</p>}
				{error && <p>Error</p>}
			</section>
		</main>
	)
}

