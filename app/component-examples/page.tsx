'use client'

import Button from '@/app/core/components/Button'
import CardPrice from '@/app/core/components/cards/CardPrice'
import CardInfo from '@/app/core/components/cards/CardInfo'
import { Footer } from '@/app/core/components/global/footer'
import { Header } from '@/app/core/components/global/header'
import Banner from '@/app/core/components/Banner'
import SearchBar from '@/app/core/components/SearchBar'
import CardValoration from '@/app/core/components/cards/CardValoration'
import Slider from '@/app/core/components/Slider'

import React, { createContext } from 'react'
import { SwiperSlide } from 'swiper/react'

function TitleComponentSection(props: { name: string }) {
	return <h2 className="text-title-2 text-center m-0">{props.name} </h2>
}

function Divider() {
	return <div className="w-full h-0.5 bg-gray-300" />
}

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
]

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

export default function Components() {
	return (
		<>
			<section className="p-4 flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<h1 className="text-title-1">Component page</h1>
				<TitleComponentSection name="Global components" />
				<Header />
				<Footer />
				<Divider />
				<TitleComponentSection name="Main components" />
				<div className="flex flex-row gap-4">
					<Button />
					<Button
						type="secondary"
						labelName="Accede a todas las categorías"
					/>
				</div>
				{/* <SearchBar 
					value="" // <-- AÑADIDO: El valor del input ahora es controlado por la prop
					onChange={() => {}}
					height="52px"
					width="w-[480px] mobile:w-[80vw]"
					borderColor="#12B1BB"
					borderWidth="2px"
				/> */}
				<Divider />
				<TitleComponentSection name="Card components" />
				<h3 className="text-title-3 text-dark-grey">Card with price</h3>
				<div className="flex justify-between gap-6">
					{cardPropsArray.map((cardProps, index) => (
						<CardPrice
							key={index}
							title={cardProps.title}
							price={cardProps.price}
							description={cardProps.description}
							reference={cardProps.reference}
						/>
					))}
				</div>
				<h3 className="text-title-3 text-dark-grey">
					Card information
				</h3>
				<div className="flex justify-between gap-6">
					{cardInfoPropsArray.map((cardInfoProps, index) => (
						<CardInfo key={index} title={cardInfoProps.title} image={cardInfoProps.image}/>
					))}
				</div>
				<div className="flex justify-between gap-6">
					{cardValorationPropsArray.map((cardValoration, index) => (
						<CardValoration
							key={index}
							title={cardValoration.title}
							valoration={cardValoration.valoration}
							comments={cardValoration.comments}
						/>
					))}
				</div>
				<Divider />
				<h3 className="text-title-3 text-dark-grey">
					Slider Component Component
				</h3>
				<Slider>
					{cardValorationPropsArray.map((cardValoration, index) => (
						<SwiperSlide key={index}>
							<CardValoration
								title={cardValoration.title}
								valoration={cardValoration.valoration}
								comments={cardValoration.comments}
							/>
						</SwiperSlide>
					))}
				</Slider>
				<Slider>
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
				<h3 className="text-title-3 text-dark-grey">
					Banner with Image Component
				</h3>
				<Banner
					imgUrl="/banner-motor.webp"
					height="561px"
					aligned="center"
					color="blue"
				>
					<h1 className="text-title-1 text-white text-center max-w-[728px]">
						ponemos a tu alcance la mayor variedad de piezas de
						coche recuperadas, reconstruidas y nuevas.
					</h1>
				</Banner>
			</section>
		</>
	)
}
