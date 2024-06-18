'use client'
import React, { createContext } from 'react'
import { SwiperSlide } from 'swiper/react'
import Banner from '@/app/core/components/Banner'
import Button from '@/app/core/components/Button'
import CardInfo from '@/app/core/components/cards/CardInfo'
import SearchBar from '@/app/core/components/SearchBar'
import Slider from '@/app/core/components/Slider'
import CardPrice from '@/app/core/components/cards/CardPrice'
import CardValoration from '@/app/core/components/cards/CardValoration'
import TagBanner from './core/components/tags/TagBanner'

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
		title: 'Preferidos en España',
		description:
			'Somos el Comparador de Repuestos preferido en España. Nuestra reputación se basa en la sencillez y rapidez para encontrar artículos, una amplia variedad de precios y, sobre todo, en las garantías de calidad de todos los repuestos vendidos.',
	},
	{
		title: 'Centralización de Compras',
		description:
			'Centraliza en un único proveedor todas tus compras. Simplifica tu proceso de compra y gestión de repuestos con nosotros.',
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
			<Banner
				imgUrl="/banner-motor.webp"
				height="561px"
				aligned="center"
				color="blue"
				position=""
				extraCss=""
			>
				<div className="flex flex-col justify-center align-middle mt-[180px] mobile:mt-[100px]">
					<h1 className="text-title-1 text-custom-white text-center max-w-[728px] mb-[35px] mobile:max-w-[350px] mobile:text-xl">
						Ponemos a tu alcance la mayor variedad de piezas de
						coche <span className="text-warning">recuperadas</span>,
						<span className="text-warning"> reconstruidas</span> y
						<span className="text-warning"> nuevas</span>.
					</h1>
					<SearchBar />
				</div>
			</Banner>

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
			</section>

			<Banner imgUrl="/banner-warehouse.webp"
					height="305px"
					aligned="left"
					color="blue"
					position="desktop:absolute"
					extraCss={'mobile:hidden tablet:hidden'}
			>
				<div className="flex justify-center">
					<h1 className="content-center text-8xl text-custom-white text-left ml-[150px] max-w-[450px] mobile:max-w-[350px] mobile:text-xl">
						Busca repuestos inter<span className="text-warning">nacionales</span> y compara precios
					</h1>
				</div>
			</Banner>
			<section className="flex flex-col items-end relative bottom-12 mobile:hidden tablet:hidden">
				<TagBanner title={'Rapidez'} flexDir={''} fontColor={'white'} color={'#3A27B0'} width={'1000px'}
						   height={'130px'}
						   align={'center'} alignItems={'center'} position={'relative'} zIndex={'1'}
						   radius={'rounded-tl-3xl rounded-bl-3xl'} alignSelf={''} padding={''} axis={''}>
					<p className="w-[40vw] text-title-4">Con solo unos clics, nos encargamos de buscar el repuesto
						que necesitas
						de forma rápida y
						fácil.
						Comparamos entre el stock de cientos de tiendas para garantizar la mejor opción en tiempo
						récord.</p>
				</TagBanner>
				<TagBanner title={'Eficacia'} flexDir={''} fontColor={'white'} color={'#12B1BB'} width={'870px'}
						   height={'130px'} align={'center'} alignItems={'center'} position={'relative'} zIndex={'2'}
						   axis={'bottom-5'}
						   radius={'rounded-tl-3xl rounded-bl-3xl'} alignSelf={''} padding={''}>
					<p className="w-[35vw] text-title-4">Todas nuestras piezas han sido validadas por profesionales,
						es por ello
						que tenemos el
						porcentaje de devoluciones más bajo del mercado.</p>
				</TagBanner>
				<TagBanner title={'100% Fiabilidad'} flexDir={''} fontColor={'white'} color={'#1A61F1'} width={'650px'}
						   height={'130px'} align={'center'} alignItems={'center'} position={'relative'} zIndex={'2'}
						   axis={'bottom-9'}
						   radius={'rounded-tl-3xl rounded-bl-3xl'} alignSelf={''} padding={''}>
					<p className="w-[25vw] text-title-4">Devoluciones sin coste en el plazo de 14 días.
						Tu satisfacción y confianza son nuestra prioridad.</p>
				</TagBanner>
			</section>

			<Banner imgUrl="/mobile_banner_warehouse.webp"
					height="920px"
					aligned="center"
					color="blue"
					position=""
					extraCss={'desktop:hidden m-auto items-start'}
			>
				<div className="flex justify-center">
					<h1 className="content-center text-8xl text-custom-white text-left w-[65vw] mt-16 mobile:text-xl">
						Busca repuestos inter<span className="text-warning">nacionales</span> y compara precios
					</h1>
				</div>
			</Banner>
			<section className="desktop:hidden flex justify-center relative z-10 tablet:pt-20"
					 style={{ bottom: '700px' }}>
				<div className="flex flex-col align-end w-[100vw]">
					<TagBanner title={'Rapidez'} flexDir={'flex-col'} fontColor={'white'} color={'#3A27B0'}
							   width={'90vw'} height={'auto'}
							   align={'left'} alignItems={'left'} alignSelf={'self-end'}
							   radius={'rounded-tl-3xl rounded-bl-3xl'} padding={'p-6 pl-12'} axis={''} position={''}
							   zIndex={''}>
						<p className="text-title-4 font-light">Con solo unos clics, nos encargamos de buscar el
							repuesto que necesitas
							de forma rápida y
							fácil.
							<span className={'font-semibold'}>Comparamos entre el stock de cientos de tiendas para garantizar la mejor opción en
								tiempo
									récord</span>.</p>
					</TagBanner>
					<TagBanner title={'Eficacia'} flexDir={'flex-col'} fontColor={'white'} color={'#12B1BB'}
							   width={'80vw'} height={'auto'}
							   align={'left'} alignItems={'left'} alignSelf={'self-end'}
							   radius={'rounded-tl-3xl rounded-bl-3xl'} padding={'p-6 pl-12'} axis={''} position={''}
							   zIndex={''}>
						<p className="text-title-4 font-light"><span className={'font-semibold'}>Todas nuestras piezas han sido validadas por profesionales</span>,
							es por ello
							que tenemos el
							porcentaje de devoluciones más bajo del mercado.</p>
					</TagBanner>
					<TagBanner title={'100% Fiabilidad'} flexDir={'flex-col'} fontColor={'white'} color={'#1A61F1'}
							   width={'70vw'} height={'auto'}
							   align={'left'} alignItems={'left'} alignSelf={'self-end'}
							   radius={'rounded-tl-3xl rounded-bl-3xl'} padding={'p-6 pl-12'} axis={''} position={''}
							   zIndex={''}>
						<p className="text-title-4 font-light">Devoluciones sin coste en el plazo de <span
							className={'font-semibold'}>14 días.
								Tu satisfacción y confianza son nuestra prioridad.</span></p>
					</TagBanner>
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

			<Banner
				imgUrl="/banner-truck.webp"
				height="740px"
				aligned="center"
				color="blue"
				position={''}
				extraCss={''}
			>
				<div className="flex flex-col items-center">
					<div className="max-w-[1034px] mb-[96px]">
						{ValorationInfo.map((info, index) => (
							<div key={index} className="mt-[30px]">
								<h2 className="text-xl font-normal text-custom-white">
									{info.title}
								</h2>
								<p className="text-title-4 text-custom-white">
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
							),
						)}
					</Slider>
				</div>
			</Banner>

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
