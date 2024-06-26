'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import CardPrice from '../core/components/cards/CardPrice'
import { getProducts } from '../services/products/products.service'
import { IProductMongoose } from '../types/product'
import algoliasearch from 'algoliasearch'

const appID = 'DSKGGHHS58'
const apiKey = '6f49eeb288faef802bf5236c9fa6720d'

export default function Store() {

	const client = algoliasearch(appID, apiKey)
	// Create a new index and add a record
	const index = client.initIndex('dev_PRODUCTS')

	const search = async (query: string) => {
		// Search for query in the index "products"
		const result = await index.search(query);
		setProducts(result.hits as IProductMongoose[]);
	}

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string>('');

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await getProducts()
				setProducts(response.data.data.selectedProducts as IProductMongoose[])
				await index.replaceAllObjects(response.data.data.selectedProducts, {autoGenerateObjectIDIfNotExist: true}).wait();
			} catch (error) {
				setError((error as Error).message)
			} finally {
				setLoading(false)
			}
		}

		fetchProducts()
	}, [])

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
		search(event.target.value);
	};

	return (
		<main>
			{/*<div>*/}
			{/*	<input*/}
			{/*		type="text"*/}
			{/*		value={inputValue}*/}
			{/*		onChange={handleInputChange}*/}
			{/*		placeholder="Type something..."*/}
			{/*		className="border rounded p-2"*/}
			{/*	/>*/}
			{/*</div>*/}
			<section
				className={'grid grid-cols-4 grid-rows-4 tablet:grid-cols-3 tablet:grid-rows-3 mobile:grid-cols-2 mobile:grid-rows-2'}>
				{products.map((product: any) => (
					<CardPrice title={product.title}
							   reference={product.mainReference}
							   description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
							   price={product.buscorepuestosPrice.toString().replace('.', ',')}
							   image={product.images[0]} />
				))}
			</section>
		</main>
	)
}
