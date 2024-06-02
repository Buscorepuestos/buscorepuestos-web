'use client'
import React, { createContext } from 'react'
import { SwiperSlide } from 'swiper/react'
import BannerImage from '@/app/(core)/components/BannerImage/BannerImage'
import Button from '@/app/(core)/components/Button/Button'
import CardInfo from '@/app/(core)/components/CardInfo/CardInfo'
import SearchBar from '@/app/(core)/components/SearchBar/SearchBar'
import Slider from '@/app/(core)/components/Slider/Slider'
import CardPrice from '@/app/(core)/components/CardPrice/CardPrice'
import CardValoration from '@/app/(core)/components/CardValoration/CardValoration'

const cardInfoPropsArray = [
	{
		title: 'Parachoques delantero',
	},
	{
		title: 'Parachoques trasero',
	},
	{
		title: 'Faro delantero',
	},
	{
		title: 'Faro trasero',
	},
	{
		title: 'Espejo lateral',
	},
	{
		title: 'Rueda',
	},
	{
		title: 'Parachoques trasero',
	},
	{
		title: 'Faro delantero',
	},
	{
		title: 'Faro trasero',
	},
	{
		title: 'Espejo lateral',
	},
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
				<div className="flex flex-row flex-wrap gap-[85px] mb-[85px] justify-center">
					{cardInfoPropsArray.map((cardInfoProps, index) => (
						<CardInfo key={index} title={cardInfoProps.title} />
					))}
				</div>
				<div className="flex justify-center">
					<Button
						type="secondary"
						labelName="Accede a todas las categorías"
					/>
				</div>
			</section>

			<section className="pt-[72px]">
				<h2 className="text-title-2 mb-[46px]"> Novedades</h2>
				<div className="pb-[72px]">
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
							slidePerView={3.2}
							spaceBetween={10}
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
				<h2 className="text-title-2 mb-[46px]"> Podría interesarte</h2>
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
			</section>
		</main>
	)
}
