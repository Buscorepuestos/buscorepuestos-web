import Link from 'next/link'
import Image from 'next/image'

const socialMediaLinks = [
	{ imgUrl: 'facebook.svg', href: '#' },
	{ imgUrl: 'instagram.svg', href: '#' },
	{ imgUrl: 'whatsapp.svg', href: '#' },
	{ imgUrl: 'linkedin.svg', href: '#' },
	{ imgUrl: 'mail.svg', href: '#' },
]

const footerLinks = [
	{
		category: 'Te puede interesar',
		links: [
			{ name: 'Outlet', href: '#' },
			{ name: 'Más buscados', href: '#' },
			{ name: 'Servicios', href: '#' },
			{ name: 'Partners', href: '#' },
		],
	},
	{
		category: 'Te puede gustar',
		links: [
			{ name: 'Outlet', href: '#' },
			{ name: 'Más buscados', href: '#' },
			{ name: 'Servicios', href: '#' },
			{ name: 'Partners', href: '#' },
		],
	},
	{
		category: 'Te puede atraer',
		links: [
			{ name: 'Outlet', href: '#' },
			{ name: 'Más buscados', href: '#' },
			{ name: 'Servicios', href: '#' },
			{ name: 'Partners', href: '#' },
		],
	},
]

export function Footer() {
	return (
		<section className="flex bg-primary-blue text-white w-full h-[350]">
			<div className="my-0 mx-auto w-full max-w-screen-desktop grid grid-cols-2 self-center items-center">
				<article className="self-center">
					<div className="mb-7 pl-[68px]">
						<div className="flex align-bottom gap-4">
							<Link href="#">
								<Image
									src="/logo-br-footer-transparent.svg"
									alt="Logo Buscorepuestos"
									width={90}
									height={90}
								/>
							</Link>
							{socialMediaLinks.map((link, index) => (
								<Link
									className="self-end"
									key={index}
									href={link.href}
								>
									<Image
										src={`/${link.imgUrl}`}
										alt="Icono de red social"
										width={30}
										height={30}
									/>
								</Link>
							))}
						</div>
					</div>
					<div className="max-w-[558px]">
						<h2 className="pl-[68px] mb-3">Tienes alguna duda?</h2>
						<div className="w-full h-0.5  bg-gray-300 mb-3" />
						<p className="pl-[68px] w-full text-wrap">
							Estaremos encantados de poder ayudarte, detrás de
							cualquier método de contacto habrá uno de nosotros
							esperándote
						</p>
					</div>
				</article>
				<article className="flex justify-between w-[650px] gap-12">
					{footerLinks.map((footerLink, index) => (
						<div key={index}>
							<h2>{footerLink.category}</h2>
							<ul>
								{footerLink.links.map((link, index) => (
									<li key={index}>
										<Link href={link.href}>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</article>
			</div>
		</section>
	)
}
