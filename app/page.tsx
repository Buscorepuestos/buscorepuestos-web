'use client'
import React, { createContext } from 'react'
import { SwiperSlide } from 'swiper/react'
import BannerImage from '@/app/core/components/BannerImage'
import Button from '@/app/core/components/Button'
import CardInfo from '@/app/core/components/cards/CardInfo'
import SearchBar from '@/app/core/components/SearchBar'
import Slider from '@/app/core/components/Slider'
import CardPrice from '@/app/core/components/cards/CardPrice'
import CardValoration from '@/app/core/components/cards/CardValoration'

const cardInfoPropsArray = [
	{
		title: 'Interior\nHabitáculo',
		image: '/Interior.svg',
		href: '#'
	},
	{
		title: 'Carrocería\ny lunas',
		image: '/Carroceria.svg',
		href: '#'
	},
	{
		title: 'Faros y\npilotos',
		image: '/Faros.svg',
		href: '#'
	},
	{
		title: 'Sistema de\nseguridad',
		image: '/Seguridad.svg',
		href: '#'
	},
	{
		title: 'Electrónica\ny electricidad',
		image: '/Electricidad.svg',
		href: '#'
	},
	{
		title: 'Suspensión,\nEjes y Dirección',
		image: '/Suspension.svg',
		href: '#'
	},
	{
		title: 'Cajas de\ncambio y\ntransmisión',
		image: '/Transmision.svg',
		href: '#'
	},
	{
		title: 'Refrigeración y\naire\nacondicionado',
		image: '/Refrigeracion.svg',
		href: '#'
	}
]

const cardPropsArray = [
	{
		title: 'Parachoques delantero',
		reference: '5FG8715S52SA',
		description: 'Mitsuha EVO III 2003',
		price: 1000,
	},
	{
		title: 'Parachoques trasero',
		reference: '7GH8715S52SA',
		description: 'Subaru Impreza 2005',
		price: 1200,
	},
	{
		title: 'Faro delantero',
		reference: '3JK9812D52SA',
		description: 'Honda Civic 2010',
		price: 800,
	},
	{
		title: 'Faro trasero',
		reference: '9PL6715S52SA',
		description: 'Toyota Corolla 2007',
		price: 750,
	},
	{
		title: 'Espejo lateral',
		reference: '1MN8715S52SA',
		description: 'Nissan Sentra 2012',
		price: 300,
	},
	{
		title: 'Rueda',
		reference: '2OP8715S52SA',
		description: 'Ford Mustang 2015',
		price: 500,
	},
	{
		title: 'Parachoques delantero',
		reference: '5FG8715S52SA',
		description: 'Mitsuha EVO III 2003',
		price: 1000,
	},
	{
		title: 'Parachoques trasero',
		reference: '7GH8715S52SA',
		description: 'Subaru Impreza 2005',
		price: 1200,
	},
	{
		title: 'Faro delantero',
		reference: '3JK9812D52SA',
		description: 'Honda Civic 2010',
		price: 800,
	},
	{
		title: 'Faro trasero',
		reference: '9PL6715S52SA',
		description: 'Toyota Corolla 2007',
		price: 750,
	},
	{
		title: 'Espejo lateral',
		reference: '1MN8715S52SA',
		description: 'Nissan Sentra 2012',
		price: 300,
	},
	{
		title: 'Rueda',
		reference: '2OP8715S52SA',
		description: 'Ford Mustang 2015',
		price: 500,
	},
]

const ValorationInfo = [
	{
		title: 'Amplia variedad de productos',
		description:
			'Encuentra repuestos y compara precios entre cientos de tiendas al mismo tiempo. Ponemos a tu disposición una extensa selección para que encuentres exactamente lo que necesitas.',
	},
	{
		title: 'Centralización de Compras',
		description:
			'Centraliza en un único proveedor todas tus compras. Simplifica tu proceso de compra y gestión de repuestos con nosotros.',
	},
	{
		title: 'Preferidos en España',
		description:
			'Somos el Comparador de Repuestos preferido en España. Nuestra reputación se basa en la sencillez y rapidez para encontrar artículos, una amplia variedad de precios y, sobre todo, en las garantías de calidad de todos los repuestos vendidos.',
	},
]

const cardValorationPropsArray = [
	{
		title: 'Comentario',
		valoration: 3,
		comments:
			'Atención muy buena, espero tener el piloto solicitado para confirmar mi impresión ha llegado en 24 horas es perfecto, ya lo he ',
	},
	{
		title: 'Comentario',
		valoration: 3,
		comments:
			'Atención muy buena, espero tener el piloto solicitado para confirmar mi impresión ha llegado en 24 horas es perfecto, ya lo he ',
	},
	{
		title: 'Comentario',
		valoration: 5,
		comments:
			'Atención muy buena, espero tener el piloto solicitado para confirmar mi impresión ha llegado en 24 horas es perfecto, ya lo he ',
	},
	{
		title: 'Comentario',
		valoration: 2,
		comments:
			'Atención muy buena, espero tener el piloto solicitado para confirmar mi impresión ha llegado en 24 horas es perfecto, ya lo he ',
	},
	{
		title: 'Comentario',
		valoration: 4,
		comments:
			'Atención muy buena, espero tener el piloto solicitado para confirmar mi impresión ha llegado en 24 horas es perfecto, ya lo he ',
	},
	{
		title: 'Comentario',
		valoration: 1,
		comments:
			'Atención muy buena, espero tener el piloto solicitado para confirmar mi impresión ha llegado en 24 horas es perfecto, ya lo he ',
	},
]

const breakPointsCardValoration = {
	300: {
		slidesPerView: 1.1,
		spaceBetween: 10,
	},
	550: {
		slidesPerView: 1.5,
		spaceBetween: 10,
	},
	716: {
		slidesPerView: 2.2,
		spaceBetween: 100,
	},
	900: {
		slidesPerView: 2.5,
		spaceBetween: 10,
	},
	1120: {
		slidesPerView: 3,
		spaceBetween: 10,
	},
	1524: {
		slidesPerView: 4,
		spaceBetween: 100,
	}
}

const classCardCategories = "w-full h-auto object-cover";

export default function Home() {
	return (
		<main>
			<BannerImage
				imgUrl="/banner-motor.webp"
				height="561px"
				aligned="center"
			>
				<div className="flex flex-col justify-center align-middle mt-[86px]">
					<h1 className="text-title-1 text-custom-white text-center max-w-[728px] mb-[60px]">
						Ponemos a tu alcance la mayor variedad de piezas de
						coche <span className="text-warning">recuperadas</span>,
						<span className="text-warning">reconstruidas</span> y
						<span className="text-warning">nuevas</span>.
					</h1>
					<SearchBar />
				</div>
			</BannerImage>

			<section className="pt-[72px]">
				<div className="flex justify-center items-center">
					<h2 className="text-title-2 text-center max-w-[505px] mb-[31px]">
						Disponemos del catálogo de
						<span className="text-primary-blue">15.435.468</span>
						piezas diferentes
					</h2>
				</div>
				<div className='flex w-screen justify-center mx-auto'>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-[85px] mobile:gap-[20px] mb-[85px]">
						{cardInfoPropsArray.map((cardInfoProps, index) => (
							<CardInfo 
								key={index} 
								title={cardInfoProps.title} 
								image={cardInfoProps.image}
								href={cardInfoProps.href}
								className={classCardCategories}
							/>
						))}
					</div>
				</div>
			</section>

			<section className="pt-[72px]">
				<h2 className="text-title-2 mb-[46px] font-tertiary-font text-dark-grey ml-[5vw]"> Novedades</h2>
				<div className="pb-[72px]">
					<Slider breakpoints={breakPointsCardValoration}>
						{cardPropsArray.map((cardProps, index) => (
							<SwiperSlide key={index}>
								<CardPrice
									title={cardProps.title}
									price={cardProps.price}
									description={cardProps.description}
									reference={cardProps.reference}
								/>
							</SwiperSlide>
						))}
					</Slider>
				</div>
			</section>

			<section>
				<BannerImage
					imgUrl="/banner-truck.webp"
					height="740px"
					aligned="center"
				>
					<div className="flex flex-col items-center">
						<div className="max-w-[1034px] mb-[96px]">
							{ValorationInfo.map((info, index) => (
								<div key={index} className="mb-[20px]">
									<h3 className="text-title-3 text-custom-white">
										{info.title}
									</h3>
									<p className="text-custom-white">
										{info.description}
									</p>
								</div>
							))}
						</div>
						<Slider
							height={280}
							breakpoints={breakPointsCardValoration}
						>
							{cardValorationPropsArray.map(
								(cardValoration, index) => (
									<SwiperSlide key={index}>
										<CardValoration
											title={cardValoration.title}
											valoration={
												cardValoration.valoration
											}
											comments={cardValoration.comments}
										/>
									</SwiperSlide>
								)
							)}
						</Slider>
					</div>
				</BannerImage>
			</section>
			<section className="pt-[72px]">
				<h2 className="text-title-2 mb-[46px] font-tertiary-font text-dark-grey ml-[5vw]"> Podría interesarte</h2>
				<Slider breakpoints={breakPointsCardValoration}>
					{cardPropsArray.map((cardProps, index) => (
						<SwiperSlide key={index}>
							<CardPrice
								title={cardProps.title}
								price={cardProps.price}
								description={cardProps.description}
								reference={cardProps.reference}
							/>
						</SwiperSlide>
					))}
				</Slider>
			</section>
		</main>
	)
}
