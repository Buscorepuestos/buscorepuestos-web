'use client'
import ShoppingBasket from '../core/components/shopping-cart/ShoppingBasket'
import React from 'react'
import { p } from 'vitest/dist/reporters-yx5ZTtEV'

export default function Payment() {

	const products = [
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		}
	]
	return (
		<section className={'w-full bg-green-300 mt-[12vw] mb-[8vw] '}>
			<article>
				<ShoppingBasket products={products} />
				<div className="w-full h-[2px] bg-secondary-blue mt-6" />
				<div className={'flex justify-end items-center mr-8'}>
					<p className={'mr-6 font-medium'}>Total:</p>
					<p className={'text-title-3 text-primary-blue-2 font-semibold'}>{products.map(item => item.price).reduce((acc, curr) => acc + curr, 0)}€</p>
				</div>
				<div className="w-full h-[2px] bg-secondary-blue mb-6" />
			</article>
		</section>
	)
}
