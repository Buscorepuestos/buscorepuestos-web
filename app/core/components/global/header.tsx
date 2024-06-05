'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Header() {
	const principalMenuLinks = [
		{ label: 'Tienda', href: '#' },
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

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	};

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

	return (
		<section
			className="lg:w-[95%] md:w-[90%] sm:w-[90%] max-w-[1213px] mobile:w-[100%] h-[122px] sm:rounded-[21px] bg-custom-white sm:border-[2px] mobile:border-b-[2px]
			border-secondary-blue fixed top-[32px] mobile:top-0 left-0 right-0 z-10 m-auto "
		>
			<div className="flex flex-col md:flex-row sm:flex-row mobile:flex-row justify-between items-center px-28 md:px-14 sm:px-12">
				<Image
					src="/logo-br-desktop.svg"
					alt="Header"
					width={101}
					height={71}
				/>
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
						<Link href="#">
							<Image
								src="/CARRITO.svg"
								alt="Cart"
								width={30}
								height={30}
							/>
						</Link>
						<p className="text-[0.8vw] text-secondary-blue">Carrito</p>
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
								className="lg:text-[1.1vw] md:text-[1.3vw] sm:text-[1.4vw] transition duration-300 ease-in-out hover:underline font-semibold"
								style={{ color: 'var(--neutro300)' }}
							>
								{link.label}
							</Link>
						))}
					</div>
				</>
			)}
		</section>
	)
}
