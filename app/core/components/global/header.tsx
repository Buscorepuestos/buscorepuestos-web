'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '../../../redux/hooks'

export function Header() {
	const principalMenuLinks = [
		{ label: 'Tienda', href: '/tienda' },
		{ label: 'Quiénes somos', href: '/sobre-nosotros' },
		{ label: 'Ayuda', href: '/ayuda' },
		{ label: 'Contacto', href: '/contacto' },
	]

	const secondaryMenuLinks = [
		{ label: 'Accesorios', href: 'tienda/Enganche%20Remolque' },
		{ label: 'Alumbrado', href: 'tienda/Faro%20Derecho' },
		{ label: 'Cambio/Embrague', href: 'tienda/Pomo%20Palanca%20Cambio' },
		{ label: 'Carrocería', href: 'tienda/Aleta%20Delantera%20Derecha' },
		{
			label: 'Climatización',
			href: 'tienda/Compresor%20Aire%20Acondicionado',
		},
		{ label: 'Electricidad', href: 'tienda/Conmutador%20De%20Arranque' },
		{ label: 'Motor', href: 'tienda/Valvula%20Egr' },
	]

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false)
	const [isProductPage, setIsProductPage] = useState(false)
	const pathname = usePathname()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}
	const closeMenu = () => setIsMenuOpen(false)

	useEffect(() => {
		const starWith = pathname.startsWith.bind(pathname)
		if (
			starWith('/producto') ||
			starWith('/contacto') ||
			starWith('/ayuda') ||
			starWith('/sobre-nosotros') ||
			starWith('/aviso-legal') ||
			starWith('/politica-privacidad') ||
			starWith('/politica-cookies') ||
			starWith('/terminos-condiciones')
		) {
			setIsProductPage(true)
		} else {
			setIsProductPage(false)
		}
	}, [pathname])

	const cart = useAppSelector((state) => state.cart.items)
	const [cartCount, setCartCount] = useState(0)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setCartCount(cart.length)
		}
	}, [cart])

	return (
		<section
			className={`lg:w-[95%] md:w-[90%] sm:w-[90%] max-w-[1213px] mobile:w-[100%] h-[122px] mobile:h-[14vw] sm:rounded-[21px] bg-custom-white sm:border-[2px] mobile:border-b-[2px]
			border-secondary-blue ${isProductPage ? 'mt-[1vw] mobile:mt-0 mobile:relative' : 'absolute'} top-[32px] mobile:p-[7px] mobile:top-0 left-0 right-0 z-10 m-auto drop-shadow-lg`}
			role="region"
		>
			<div className="flex flex-col md:flex-row sm:flex-row mobile:flex-row justify-between items-center px-28 mobile:px-10 md:px-14 sm:px-12">
				
				{/* 1. LOGO DESKTOP (Izquierda en PC) */}
				{/* mobile:hidden lo oculta en móviles */}
				<Link href="/" className="mobile:hidden">
					<Image
						src="/logo-br-desktop.svg"
						alt="Header"
						width={101}
						height={71}
						priority
					/>
				</Link>

				{/* 2. HAMBURGUESA (Izquierda en Móvil) */}
				{/* hidden mobile:block lo muestra SOLO en móviles */}
				<Image
					src="/hamburguesa.svg"
					alt="Hamburguesa"
					width={40}
					height={40}
					onClick={toggleMenu}
					className="hidden mobile:block mobile:w-[7.5vw] mobile:h-[7.5vw] cursor-pointer"
				/>

				{/* 3. LOGO MOBILE (Centro en Móvil) */}
				{/* hidden mobile:block lo muestra SOLO en móviles */}
				<Link href="/" className="hidden mobile:block">
					<Image
						src="/buscorepuestos.svg"
						alt="IconoMobile"
						width={63}
						height={63}
						className="mobile:w-[11vw] mobile:h-[11vw] cursor-pointer"
					/>
				</Link>

				{/* 4. ENLACES PRINCIPALES (Centro en Desktop) */}
				{/* mobile:hidden lo oculta en móviles para evitar el flash */}
				<div className="mobile:hidden flex flex-col md:flex-row sm:flex-row gap-4 md:gap-[64px] mb-4 md:mb-0 sm:mb-0">
					{principalMenuLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							className="lg:text-[1.4vw] md:text-[1.5vw] sm:text-[2.3vw] transition duration-300 ease-in-out hover:underline font-semibold"
							style={{ color: 'var(--neutro300)' }}
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* 5. CARRITO (Derecha en ambos) */}
				<div className="flex flex-row gap-7">
					<div className="relative flex flex-col items-center">
						<Link href="/verificacion-pago">
							<Image
								src="/CARRITO.svg"
								alt="Cart"
								width={30}
								height={30}
								className="mobile:w-[8vw] mobile:h-[8vw] cursor-pointer"
							/>
							{cartCount > 0 && (
								<span className="absolute -top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
									{cartCount}
								</span>
							)}
						</Link>
						<p className="mobile:hidden text-[0.8vw] text-secondary-blue">
							Carrito
						</p>
					</div>
				</div>
			</div>

			{/* MENU SECUNDARIO DESKTOP */}
			<div className="mobile:hidden">
				<div className="w-full h-[2px] bg-secondary-blue my-2 md:my-0 sm:my-0" />
				<div className="flex flex-wrap justify-between gap-4 px-4 md:px-[43px] pt-3">
					{secondaryMenuLinks.map((link, index) => {
						const adjustedHref = pathname.startsWith('/tienda')
							? `/${link.href.replace('tienda/', 'tienda/')}`
							: `/${link.href}`
						return (
							<Link
								key={index}
								href={adjustedHref}
								className="lg:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw] transition duration-300 ease-in-out hover:underline font-semibold"
								style={{ color: 'var(--neutro300)' }}
							>
								{link.label}
							</Link>
						)
					})}
				</div>
			</div>

			{/* MENU DESPLEGABLE MOBILE */}
			{/* CORRECCIÓN: Usamos renderizado condicional de React {isMenuOpen && ...} 
			    para asegurar que respeta el estado, y mantenemos la clase mobile:block 
				para asegurarnos de que el diseño sea correcto cuando se monte */}
			{isMenuOpen && (
				<div
					data-testid="Menu"
					className="hidden mobile:block absolute top-[12.8vw] left-0 right-0 bg-custom-white shadow-md z-20"
				>
					<div className="flex flex-col items-start border-t border-secondary-blue">
						{principalMenuLinks.map((link, index) => (
							<div
								key={index}
								className="w-full flex flex-col"
								data-testid={
									link.label === 'Tienda'
										? 'secondary-toggle'
										: undefined
								}
							>
								<Link
									key={index}
									href={link.href}
									className="text-[4vw] font-semibold"
									style={{ color: 'var(--neutro300)' }}
									onClick={closeMenu}
								>
									<div className="w-full flex items-center hover:bg-gray-100 h-[10vw] border-secondary-blue border-b-[1px] pl-14">
										{link.label}
									</div>
								</Link>
								{link.label === 'Tienda' &&
									isSecondaryMenuOpen && (
										<div
											data-testid="secondary-menu"
											className="flex flex-col"
										>
											{secondaryMenuLinks.map(
												(sublink, subindex) => (
													<Link
														key={subindex}
														href={sublink.href}
														className="w-full text-[4vw] py-4 font-semibold hover:bg-gray-100 h-[10vw] border-secondary-blue border-b-[1px] pl-28"
														style={{
															color: 'var(--neutro300)',
														}}
													>
														{sublink.label}
													</Link>
												)
											)}
										</div>
									)}
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	)
}