'use client'
import React, { useEffect, useState } from 'react'
import CardPrice from '../core/components/cards/CardPrice'
import { getProducts } from '../services/products/products.service'
import { IProductMongoose } from '../types/product'

export default function Store() {

	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await getProducts()
				setProducts(response.data.data.selectedProducts as IProductMongoose[])
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

	const cleanValue = (text: string) =>{
		return `${" "+text.replace('-', "")}`;
	}

	return (
		<main>
			<section className={'grid grid-cols-4 grid-rows-4 tablet:grid-cols-3 tablet:grid-rows-3 mobile:grid-cols-2 mobile:grid-rows-2'}>
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
