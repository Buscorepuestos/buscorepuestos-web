'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function Header() {
	const principalMenuLinks = [
		{ label: 'Tienda', href: 'store' },
		{ label: 'Quiénes somos', href: '#' },
		{ label: 'Ayuda', href: '#' },
		{ label: 'Contacto', href: '#' },
	]

	const secondaryMenuLinks = [
		{ label: 'Marcas', href: '#' },
		{ label: 'Categorías', href: '#' },
		{ label: 'Accesorios', href: '#' },
		{ label: 'Alumbrado', href: '#' },
		{ label: 'Cambio/Embrague', href: '#' },
		{ label: 'Carrocería', href: '#' },
		{ label: 'Climatización', href: '#' },
		{ label: 'Electricidad', href: '#' },
		{ label: 'Motor', href: '#' },
	]

	

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
	const [isProductPage, setIsProductPage] = useState(false)
	const pathname = usePathname()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	};

	const toggleSecondaryMenu = () => {
		setIsSecondaryMenuOpen(!isSecondaryMenuOpen)
	}

	const [isWideScreen, setIsWideScreen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsWideScreen(window.innerWidth > 640);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		setIsProductPage(pathname.startsWith('/product'))
	}, [pathname])
	
	return (
		<section
			className={`lg:w-[95%] md:w-[90%] sm:w-[90%] max-w-[1213px] mobile:w-[100%] h-[122px] mobile:h-[13vw] sm:rounded-[21px] bg-custom-white sm:border-[2px] mobile:border-b-[2px]
			border-secondary-blue ${ isProductPage && !isWideScreen ? 'mt-0' : isProductPage ? 'mt-[1vw]' : 'absolute'} top-[32px] mobile:p-[7px] mobile:top-0 left-0 right-0 z-10 m-auto shadow-md`}
			role='region'
		>
			<div className="flex flex-col md:flex-row sm:flex-row mobile:flex-row justify-between items-center px-28 mobile:px-10 md:px-14 sm:px-12">
				{isWideScreen ? (
					<Link href="/">
						<Image
							src="/logo-br-desktop.svg"
							alt="Header"
							width={101}
							height={71}
						/>
					</Link>
				): (
					<>
						<Image
							src="/hamburguesa.svg"
							alt="Hamburguesa"
							width={40}
							height={40}
							onClick={toggleMenu}
							className='mobile:w-[7.5vw] mobile:h-[7.5vw] cursor-pointer'
						/>
						<Link href="/">
							<Image
								src="/buscorepuestos.svg"
								alt="IconoMobile"
								width={63}
								height={63}
								className='mobile:w-[10vw] mobile:h-[10vw] cursor-pointer'
							/>
						</Link>
					</>
				)}
				{isWideScreen && (
					<div className="flex flex-col md:flex-row sm:flex-row mobile:flex-row md:gap-[64px] gap-4 mb-4 md:mb-0 sm:mb-0">
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
				)}
				<div className="flex flex-row gap-7">
					{isWideScreen && (
						<div className="flex flex-col items-center">
						<Link href="#">
							<Image
								src="/USUARIO.svg"
								alt="User"
								width={30}
								height={30}
							/>
						</Link>
						<p className="text-[0.8vw] text-secondary-blue">Accede</p>
					</div>
					)}
					<div className="flex flex-col items-center">
						<Link href="/verificacion-pago">
							<Image
								src="/CARRITO.svg"
								alt="Cart"
								width={30}
								height={30}
								className='mobile:w-[7.5vw] mobile:h-[7.5vw] cursor-pointer'
							/>
						</Link>
						{isWideScreen && (
							<p className="text-[0.8vw] text-secondary-blue">Carrito</p>
						)}
					</div>
				</div>
			</div>
			{isWideScreen && (
				<>
					<div className="w-full h-[2px] bg-secondary-blue my-2 md:my-0 sm:my-0" />
					<div className="flex flex-wrap justify-between gap-4 px-4 md:px-[43px] pt-3">
						{secondaryMenuLinks.map((link, index) => (
							<Link
								key={index}
								href={link.href}
								className="lg:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw] transition duration-300 ease-in-out hover:underline font-semibold"
								style={{ color: 'var(--neutro300)' }}
							>
								{link.label}
							</Link>
						))}
					</div>
				</>
			)}
			{!isWideScreen && isMenuOpen && (
				<div data-testid='Menu' className="absolute top-[12.8vw] left-0 right-0 bg-custom-white shadow-md z-20">
					<div className="flex flex-col items-start border-t border-secondary-blue">
						<div className='w-full flex items-center gap-5 text-[4vw] py-5 text-secondary-blue font-semibold hover:bg-gray-100 h-[12vw] border-secondary-blue border-b-[1px] pl-14'>
							<Image
								src="/USUARIO.svg"
								alt="UserMobile"
								width={30}
								height={30}
								className='mobile:w-[7vw] mobile:h-[7vw]'
							/>
							<p style={{ color: 'var(--neutro300)' }} >Accede</p>
						</div>
						{principalMenuLinks.map((link, index) => (
							<div key={index} className='w-full flex flex-col' onClick={
								link.label === 'Tienda' ? toggleSecondaryMenu : undefined
							} data-testid={
								link.label === 'Tienda' ? 'secondary-toggle' : undefined
							}>
								<div className='w-full flex items-center hover:bg-gray-100 h-[10vw] border-secondary-blue border-b-[1px] pl-14'>
									<Link
										key={index}
										href={link.href}
										className="text-[4vw] font-semibold"
										style={{ color: 'var(--neutro300)' }}
									>
										{link.label === 'Tienda' ? (
											<div className='flex items-center gap-10'>
												<p>{link.label}</p>
												<Image
													src="/right-arrow.svg"
													alt="right-Arrow"
													width={30}
													height={30}
													className='mobile:w-[5vw] mobile:h-[5vw] cursor-pointer'
												/>
											</div>
										) : (
											link.label
										)}
									</Link>
								</div>
								{link.label === 'Tienda' && isSecondaryMenuOpen && (
									<div data-testid='secondary-menu' className="flex flex-col">
										{secondaryMenuLinks.map((sublink, subindex) => (
											<Link
												key={subindex}
												href={sublink.href}
												className="w-full text-[4vw] py-4 font-semibold hover:bg-gray-100 h-[10vw] border-secondary-blue border-b-[1px] pl-28"
												style={{ color: 'var(--neutro300)' }}
											>
												{sublink.label}
											</Link>
										))}
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
