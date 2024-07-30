'use client'
import { useEffect, useState } from 'react'
import ShoppingBasket from '../core/components/shopping-cart/ShoppingBasket'

export default function ShoppingCart() {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 640)
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<div>
			<ShoppingBasket products={[]} />
		</div>
	)
}