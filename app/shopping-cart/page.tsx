'use client'
import ProductCartInfo from '../core/components/shopping-cart/ProductCartInfo'
import { useEffect, useState } from 'react'

export default function ShoppingCart(){
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 640);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<ProductCartInfo image={''} title={'Turbo Reconstruido de intercambio asincrono'} brand={'MITSUBISHI'} model={'EVO VIII 2004'} ref={'123131313'} price={33.2} isMobile={isMobile}/>
	)
}
