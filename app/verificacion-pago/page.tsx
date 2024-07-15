'use client'
import ShoppingBasket from '../core/components/shopping-cart/ShoppingBasket'
import React from 'react'
import { p } from 'vitest/dist/reporters-yx5ZTtEV'
import Input from '../core/components/input/input'

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
		<section className={'w-full bg-green-300 mt-[12vw] mb-[8vw] p-6'}>
			<article>
				<ShoppingBasket products={products} />
				<div className="w-full h-[2px] bg-secondary-blue mt-6" />
				<div className={'flex justify-end items-center mr-8'}>
					<p className={'mr-6 font-medium'}>Total:</p>
					<p className={'text-title-3 text-primary-blue-2 font-semibold'}>{products.map(item => item.price).reduce((acc, curr) => acc + curr, 0)}€</p>
				</div>
				<div className="w-full h-[2px] bg-secondary-blue mb-8" />
			</article>
			<article>
				<form className={'flex flex-col justify-center items-center'}>
					<h1 className={'text-title-3 mb-6 self-start'}>Información personal</h1>
					<div className={'grid grid-cols-1 w-[60%] gap-4'}>
						<Input placeholder={'Nombre y apellidos'} name={'name'} value={''}/>
					</div>
					<div className={'grid grid-cols-3 w-[60%] mt-4 gap-4'}>
						<Input placeholder={'Email'} name={'email'} value={''} cssClass={'col-span-2'} />
						<Input placeholder={'NIF / CIF'} name={'company_id'} value={''}/>
					</div>
					<div className={'grid grid-cols-2 w-[60%] mt-4 gap-4'}>
						<Input placeholder={'Número de teléfono'} name={'phone'} value={''}/>
					</div>
				</form>
			</article>

		</section>
	)
}
