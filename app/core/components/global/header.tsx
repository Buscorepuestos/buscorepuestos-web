import Image from 'next/image'
import Link from 'next/link'

export function Header() {
	const principalMenuLinks = [
		{ label: 'Tienda', href: '#' },
		{ label: 'Quienes somos', href: '#' },
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

	return (
		<section
			className="w-full max-w-[1213px] h-[122px] rounded-[21px] bg-custom-white border-[1px] 
			border-secondary-blue px-4 md:px-[25px] absolute top-[32px] left-1/2 transform -translate-x-1/2 z-10 m-auto"
		>
			<div className="flex flex-col md:flex-row justify-between items-center">
				<Image
					src="/logo-br-desktop.svg"
					alt="Header"
					width={101}
					height={71}
					className="mb-4 md:mb-0"
				/>
				<div className="flex flex-col md:flex-row md:gap-[64px] gap-4 mb-4 md:mb-0 md:text-">
					{principalMenuLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							className="lg:text-title-3 md:text-[18px] text-dark-grey transition duration-300 ease-in-out hover:underline"
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex flex-row gap-4">
					<Link href="#">
						<Image
							src="/user-logo.svg"
							alt="User"
							width={20}
							height={20}
						/>
					</Link>
					<Link href="#">
						<Image
							src="/cart-logo.svg"
							alt="Cart"
							width={20}
							height={20}
						/>
					</Link>
				</div>
			</div>
			<div className="w-full h-0.5 bg-secondary-blue my-2 md:my-0" />
			<div className="lg:text-[0.9vw] md:text-[1.4vw] sm:text-[0.5vw] flex flex-wrap justify-between gap-4 px-4 md:px-[43px] pt-3">
				{secondaryMenuLinks.map((link, index) => (
					<Link
						key={index}
						href={link.href}
						className="text-dark-grey transition duration-300 ease-in-out hover:underline"
					>
						{link.label}
					</Link>
				))}
			</div>
		</section>
	)
}
