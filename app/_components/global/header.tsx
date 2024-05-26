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
		<section className="w-[1213px] h-[122px] rounded-[21px] bg-custom-white border-[1px] border-secondary-blue pl-[25px] pr-[25px]">
			<div className="flex flex-row justify-between items-center">
				<Image
					src="/logo-br-desktop.svg"
					alt="Header"
					width={101}
					height={71}
				/>
				<div className="flex flex-row gap-[64px]">
					{principalMenuLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							className="text-title-3 text-dark-grey transition duration-300 ease-in-out hover:underline"
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex flex-row gap-4">
					<Link href="#">
						<Image
							src="/user-logo.svg"
							alt="Search"
							width={20}
							height={20}
						/>
					</Link>

					<Link href="#">
						<Image
							src="/cart-logo.svg"
							alt="Search"
							width={20}
							height={20}
						/>
					</Link>
				</div>
			</div>
			<div className="w-full h-0.5 bg-secondary-blue" />
			<div className="flex flex-row justify-between gap-4 pl-[43px] pr-[43px] pt-3">
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
