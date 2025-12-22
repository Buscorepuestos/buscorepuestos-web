import Link from 'next/link'
import Image from 'next/image'

const socialMediaLinks = [
	{ 
        imgUrl: 'facebook.svg', 
        href: 'https://www.facebook.com/buscorepuestosoficial' 
    },
	{ 
        imgUrl: 'instagram.svg', 
        href: 'https://www.instagram.com/buscorepuestos_com/#' 
    },
	{ 
        imgUrl: 'whatsapp.svg', 
        // Se usa el formato wa.me para abrir WhatsApp directamente
        href: 'https://wa.me/34611537631' 
    },
	// { imgUrl: 'linkedin.svg', href: '#' }, // <-- Ícono de LinkedIn eliminado
	{ 
        imgUrl: 'mail.svg',
        // Se usa mailto: para abrir el cliente de correo por defecto
        href: 'mailto:buscorepuestosoficial@gmail.com' 
    },
]

const footerLinks = [
	// {
	// 	category: 'TE PUEDE\nINTERESAR',
	// 	links: [
	// 		{ name: 'Outlet', href: '#' },
	// 		{ name: 'Más buscados', href: '#' },
	// 		{ name: 'Servicios', href: '#' },
	// 		{ name: 'Partners', href: '#' },
	// 	],
	// },
	{
		category: 'PÁGINAS\nRECIENTES',
		links: [
			{ name: 'Tienda', href: '/tienda' },
			{ name: 'Menú', href: `/` },
			{ name: 'Quienes somos', href: '/sobre-nosotros' },
			{ name: 'Contacto', href: '/contacto' },
		],
	},
	{
		category: 'MÁS\nINFORMACIÓN',
		links: [
			{ name: 'Aviso Legal', href: '/aviso-legal' },
			{ name: 'Política de privacidad', href: '/politica-privacidad' },
			{ name: 'Política de cookies', href: '/politica-cookies' },
			{ name: 'Términos y condiciones', href: '/terminos-condiciones' },
		],
	},
]

export function Footer() {
	return (
		<section className="flex bg-primary-blue text-white w-full flex-col pb-10 mobile:py-6">
			<div className="w-full bg-white/10 py-4">
					<div className="max-w-screen-desktop mx-auto px-4 flex flex-wrap justify-center items-center gap-8">
						<p className="text-[1.2rem] font-semibold text-white/70 uppercase tracking-widest mobile:w-full text-center">Pago Seguro Garantizado</p>
						<div className="flex gap-8 items-center">
							<Image src="/visa-logo.svg" alt="Visa" width={40} height={25} className="h-16 w-auto mobile:h-12" />
							<Image src="/mastercard-logo.svg" alt="Visa" width={40} height={25} className="h-16 w-auto mobile:h-12" />
							<Image src="/PayPal.svg" alt="PayPal" width={60} height={25} className="h-14 w-auto mobile:h-10" />
							<Image src="/scalapay-png.png" alt="Scalapay" width={70} height={25} className="h-12 w-auto mobile:h-8" />
							<div className="h-8 w-[1px] bg-white/20 mx-2 mobile:hidden" />
							<div className="flex items-center gap-2 mobile:hidden">
								<Image src="/padlock.svg" alt="SSL" width={20} height={20} className="h-10 w-auto invert" />
								<span className="text-[1.1rem] font-bold font-tertiary-font">SSL 256-bit Encrypted</span>
							</div>
						</div>
					</div>
				</div>
			<div className="my-0 mx-auto w-full max-w-screen-desktop gap-[1vw] grid grid-cols-2 mobile:flex mobile:flex-col-reverse self-center items-center">
				<article className="self-center lg:mt-[1vw] md:mt-[5vw] sm:mt-[6vw]">
					<div className="mobile:flex mobile:flex-col-reverse mb-7 pl-[1.5vw] mobile:pl-0">
						<div className="flex justify-center align-bottom gap-10 mobile:flex-col mobile:mt-[12vw] mobile:items-center">
							<Link href="#">
								<Image
									src="/logo-br-footer-transparent.svg"
									alt="Logo Buscorepuestos"
									width={65}
									height={65}
									className='mr-[2vw] lg:w-[4vw] lg:h-[4vw] md:w-[5vw] md:h-[5vw] sm:w-[5vw] sm:h-[5vw]'
								/>
							</Link>
							<div className='flex gap-[1.3vw] mobile:gap-[4.5vw] mobile:mb-[5vw]'>
								{socialMediaLinks.map((link, index) => (
									<Link
										className="self-end"
										key={index}
										href={link.href}
										target="_blank"
                                        rel="noopener noreferrer"
									>
										<Image
											src={`/${link.imgUrl}`}
											alt="Icono de red social"
											width={30}
											height={30}
											className='lg:w-[1.6vw] lg:h-[1.6vw] md:w-[2vw] md:h-[2vw] sm:w-[2vw] sm:h-[2vw] cursor-pointer'
										/>
									</Link>
								))}
							</div>
						</div>
						<div className="mt-10 flex flex-col items-center lg:pl-[9vw] md:pl-[14vw] sm:pl-[14vw]">
							<h2 className="lg:text-[0.8vw] md:text-[1vw] sm:text-[1.2vw] mobile:text-[3.5vw] mb-3 font-tertiary-font font-semibold">¿Tienes alguna duda o consulta?</h2>
							<div className='lg:pr-[12vw] md:pr-[16vw] sm:pr-[7vw]'>
								<div className="lg:w-[25vw] md:w-[32vw] mobile:w-full h-0.5 bg-gray-300 mb-3" />
								<p className="lg:text-[0.8vw] md:text-[1vw] sm:text-[1.2vw] text-wrap mobile:mx-[2.5vw] text-center">
									Estaremos encantados de poder ayudarte, detrás de
									cualquier método de contacto habrá uno de nosotros
									esperándote
								</p>
							</div>
						</div>
					</div>					
				</article>
				<div className='mobile:w-full mobile:pl-[8vw] mobile:mt-[6.5vw]'>
					<article className="flex justify-around gap-12 mb-[2vw]">
						{footerLinks.map((footerLink, index) => (
							<div key={index}>
								<h2 className="whitespace-pre-wrap lg:text-[0.8vw] md:text-[1vw] sm:text-[1.2vw] font-medium mb-[1vw] mobile:mb-[2.5vw]">{footerLink.category}</h2>
								<ul>
									{footerLink.links.map((link, index) => (
										<li key={index} className="lg:text-[0.8vw] md:text-[1vw] sm:text-[1.2vw] mobile:font-light">
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
			</div>
		</section>
	)
}
