'use client'
import React, { ChangeEvent, use, useEffect, useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import Banner from '@/app/core/components/Banner'
import CardInfo from '@/app/core/components/cards/CardInfo'
import SearchBar from '@/app/core/components/SearchBar'
import Slider from '@/app/core/components/Slider'
import CardPrice from '@/app/core/components/cards/CardPrice'
import CardValoration from '@/app/core/components/cards/CardValoration'
import TagBanner from './core/components/tags/TagBanner'
import Dropdown from './core/components/Dropdown'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './redux/store'
import { IProductMongoose } from './types/product'
import { environment } from './environment/environment'
import algoliasearch from 'algoliasearch'

const appID = environment.algoliaAppID
const apiKey = environment.algoliaAPIKey
const indexName = environment.algoliaIndexName

const cardInfoPropsArray = [
	{
		title: 'Interior\nHabitáculo',
		image: '/Interior.svg',
		href: '#',
	},
	{
		title: 'Carrocería\ny lunas',
		image: '/Carroceria.svg',
		href: '#',
	},
	{
		title: 'Faros y\npilotos',
		image: '/Faros.svg',
		href: '#',
	},
	{
		title: 'Sistema de\nseguridad',
		image: '/Seguridad.svg',
		href: '#',
	},
	{
		title: 'Electrónica\ny electricidad',
		image: '/Electricidad.svg',
		href: '#',
	},
	{
		title: 'Suspensión,\nEjes y Dirección',
		image: '/Suspension.svg',
		href: '#',
	},
	{
		title: 'Cajas de\ncambio y\ntransmisión',
		image: '/Transmision.svg',
		href: '#',
	},
	{
		title: 'Refrigeración y\naire\nacondicionado',
		image: '/Refrigeracion.svg',
		href: '#',
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

const breakPointsCardValoration = {
	300: {
		slidesPerView: 1.2,
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
		slidesPerView: 4.5,
		spaceBetween: 10,
	},
}

const breakPointsCardPrices = {
	375: {
		slidesPerView: 2,
		spaceBetween: 5,
	},
	550: {
		slidesPerView: 2.5,
		spaceBetween: 10,
	},
	716: {
		slidesPerView: 2.8,
		spaceBetween: 10,
	},
	900: {
		slidesPerView: 4,
		spaceBetween: 10,
	},
	1120: {
		slidesPerView: 5,
		spaceBetween: 10,
	},
	1524: {
		slidesPerView: 6,
		spaceBetween: 2,
	},
}

const classCardCategories = 'w-full h-auto object-cover'

export default function Home() {
	const [isMobile, setIsMobile] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [products, setProducts] = useState<IProductMongoose[]>([])
	const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null)

	const client = algoliasearch(appID, apiKey)
	const index = client.initIndex(indexName)

	const search = async () => {
		setLoading(true)
		try {
			const filters: string[] = ['isMetasync:true', 'stock:true']

			const result = await index.search('', {
				facetFilters: filters,
				hitsPerPage: 40,
				attributesToRetrieve: [
					'title',
					'mainReference',
					'brand',
					'articleModel',
					'year',
					'buscorepuestosPrice',
					'images',
					'_id',
					'isMetasync',
					'stock',
					'refLocal',
					'idEmpresa',
				],
			})

			const sortedProducts = (
				result.hits as unknown as IProductMongoose[]
			).sort((a, b) => {
				const aHasImages = a.images && a.images.length > 0 ? 1 : 0
				const bHasImages = b.images && b.images.length > 0 ? 1 : 0
				return bHasImages - aHasImages
			})

			const filteredProducts = sortedProducts.filter(
				(product) =>
					!product.images.includes('https://cdn11.metasync.com/simg')
			)

			setProducts(filteredProducts)
		} catch (err) {
			console.log(err)
			setError((err as Error).message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		search()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 640)
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value)
	}

	const handleSearch = () => {
		if (searchTerm) {
			router.push(`/tienda/${searchTerm}`)
		}
	}

	useEffect(() => {
		dispatch({ type: 'auth/checkUserStatus' })
	}, [dispatch])

	console.log('products', products)

	const cleanValue = (text: string) => {
		return `${' ' + text.replace('-', '')}`
	}

	const handle = (productId: string) => {
		setLoadingPurchase(productId)
		router.push(`/producto/${productId}`)
	}

	const handleFilterRoutes = (title: string) => {
		const routeMap: { [key: string]: string } = {
			'Interior\nHabitáculo': '/tienda/Guarnecidos%20Palanca%20Cambio',
			'Carrocería\ny lunas': '/tienda/Aleron%20Trasero',
			'Faros y\npilotos': '/tienda/Faro%20Derecho',
			'Sistema de\nseguridad': '/tienda/Airbag%20Delantero%20Derecho',
			'Electrónica\ny electricidad': '/tienda/Conmutador%20De%20Arranque',
			'Suspensión,\nEjes y Dirección':
				'/tienda/Brazo%20Suspension%20Inferior%20Delantero%20Izquierdo',
			'Cajas de\ncambio y\ntransmisión':
				'/tienda/Transmision%20Delantera%20Izquierda',
			'Refrigeración y\naire\nacondicionado':
				'/tienda/Compresor%20Aire%20Acondicionado',
		}

		const route = routeMap[title]
		if (route) {
			router.push(route)
		}
	}

	return (
		<main>
			<Banner
				imgUrl="/banner-motor.webp"
				height="561px"
				aligned="center"
				color="blue"
				position=""
				extraCss="m-auto"
			>
				<div className="flex flex-col justify-center align-middle mt-[180px] mobile:mt-[100px]">
					<h1 className="text-title-1 text-custom-white text-center max-w-[728px] mb-[35px] mobile:max-w-[350px] mobile:text-xl">
						Ponemos a tu alcance la mayor variedad de piezas de
						coche <span className="text-warning">recuperadas</span>,
						<span className="text-warning"> reconstruidas</span> y
						<span className="text-warning"> nuevas</span>.
					</h1>
					<SearchBar
						onChange={handleInputChange}
						onEnterPress={handleSearch}
						height={'52px'}
						width={'w-[496px] mobile:w-[82vw]'}
						borderColor={'#12B1BB'}
						borderWidth={'2px'}
					/>
				</div>
			</Banner>
			<Banner
				imgUrl=""
				height="32px"
				aligned="center"
				color="#12B1BB"
				position=""
				extraCss="justify-center items-center m-auto"
			>
				<p className="font-semibold text-warning uppercase mobile:text-[4vw]">
					Dos años de garantía en todas las piezas
				</p>
			</Banner>
			<section className="pt-[72px]">
				<div className="flex justify-center items-center">
					<h2 className="text-title-2 text-center max-w-[505px] mb-[31px]">
						Disponemos del catálogo de
						<span className="text-primary-blue">15.435.468</span>
						piezas diferentes
					</h2>
				</div>
				<div className="flex w-[99vw] justify-center mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 lg:gap-[85px] sm:gap-[16px] mobile:gap-[20px] mb-[85px]">
						{cardInfoPropsArray.map((cardInfoProps, index) => (
							<button
								key={index}
								className="transition-transform transform hover:scale-105 hover:shadow-lg rounded-b-[24px]"
								onClick={() =>
									handleFilterRoutes(cardInfoProps.title)
								}
							>
								<CardInfo
									key={index}
									title={cardInfoProps.title}
									image={cardInfoProps.image}
									href={cardInfoProps.href}
									className={classCardCategories}
								/>
							</button>
						))}
					</div>
				</div>
			</section>

			<Banner
				imgUrl="/banner-warehouse.webp"
				height="305px"
				aligned="left"
				color="blue"
				position="desktop:absolute"
				extraCss={'mobile:hidden tablet:hidden'}
			>
				<div className="flex justify-center">
					<h1 className="content-center text-8xl text-custom-white text-left ml-[150px] max-w-[450px] mobile:max-w-[350px] mobile:text-xl">
						Busca repuestos inter
						<span className="text-warning">nacionales</span> y
						compara precios
					</h1>
				</div>
			</Banner>
			<section className="flex flex-col items-end relative bottom-12 mobile:hidden tablet:hidden">
				<TagBanner
					title={'Rapidez'}
					flexDir={''}
					fontColor={'white'}
					color={'#3A27B0'}
					width={'1000px'}
					height={'130px'}
					align={'center'}
					alignItems={'center'}
					position={'relative'}
					zIndex={'1'}
					radius={'rounded-tl-3xl rounded-bl-3xl'}
					alignSelf={''}
					padding={''}
					axis={''}
				>
					<p className="w-[40vw] text-title-4">
						Con solo unos clics, nos encargamos de buscar el
						repuesto que necesitas de forma rápida y fácil.
						Comparamos entre el stock de cientos de tiendas para
						garantizar la mejor opción en tiempo récord.
					</p>
				</TagBanner>
				<TagBanner
					title={'Eficacia'}
					flexDir={''}
					fontColor={'white'}
					color={'#12B1BB'}
					width={'870px'}
					height={'130px'}
					align={'center'}
					alignItems={'center'}
					position={'relative'}
					zIndex={'2'}
					axis={'bottom-5'}
					radius={'rounded-tl-3xl rounded-bl-3xl'}
					alignSelf={''}
					padding={''}
				>
					<p className="w-[35vw] text-title-4">
						Todas nuestras piezas han sido validadas por
						profesionales, es por ello que tenemos el porcentaje de
						devoluciones más bajo del mercado.
					</p>
				</TagBanner>
				<TagBanner
					title={'100% Fiabilidad'}
					flexDir={''}
					fontColor={'white'}
					color={'#1A61F1'}
					width={'650px'}
					height={'130px'}
					align={'center'}
					alignItems={'center'}
					position={'relative'}
					zIndex={'2'}
					axis={'bottom-9'}
					radius={'rounded-tl-3xl rounded-bl-3xl'}
					alignSelf={''}
					padding={''}
				>
					<p className="w-[25vw] text-title-4">
						Devoluciones sin coste en el plazo de 14 días. Tu
						satisfacción y confianza son nuestra prioridad.
					</p>
				</TagBanner>
			</section>

			<Banner
				imgUrl="/mobile_banner_warehouse.webp"
				height="920px"
				aligned="center"
				color="blue"
				position=""
				extraCss={'desktop:hidden m-auto items-start'}
			>
				<div className="flex justify-center">
					<h1 className="content-center text-8xl text-custom-white text-left w-[65vw] mt-16 mobile:text-xl">
						Busca repuestos inter
						<span className="text-warning">nacionales</span> y
						compara precios
					</h1>
				</div>
			</Banner>
			<section
				className="desktop:hidden flex justify-center absolute z-10 md:top-[180rem] sm:top-[230rem] mobile:top-[230rem]"
				style={{ bottom: '700px' }}
			>
				<div className="flex flex-col align-end w-[100vw]">
					<TagBanner
						title={'Rapidez'}
						flexDir={'flex-col'}
						fontColor={'white'}
						color={'#3A27B0'}
						width={'90vw'}
						height={'auto'}
						align={'left'}
						alignItems={'left'}
						alignSelf={'self-end'}
						radius={'rounded-tl-3xl rounded-bl-3xl'}
						padding={'p-6 pl-12'}
						axis={''}
						position={''}
						zIndex={''}
					>
						<p className="text-title-4 font-light">
							Con solo unos clics, nos encargamos de buscar el
							repuesto que necesitas de forma rápida y fácil.
							<span className={'font-semibold'}>
								Comparamos entre el stock de cientos de tiendas
								para garantizar la mejor opción en tiempo récord
							</span>
							.
						</p>
					</TagBanner>
					<TagBanner
						title={'Eficacia'}
						flexDir={'flex-col'}
						fontColor={'white'}
						color={'#12B1BB'}
						width={'80vw'}
						height={'auto'}
						align={'left'}
						alignItems={'left'}
						alignSelf={'self-end'}
						radius={'rounded-tl-3xl rounded-bl-3xl'}
						padding={'p-6 pl-12'}
						axis={''}
						position={''}
						zIndex={''}
					>
						<p className="text-title-4 font-light">
							<span className={'font-semibold'}>
								Todas nuestras piezas han sido validadas por
								profesionales
							</span>
							, es por ello que tenemos el porcentaje de
							devoluciones más bajo del mercado.
						</p>
					</TagBanner>
					<TagBanner
						title={'100% Fiabilidad'}
						flexDir={'flex-col'}
						fontColor={'white'}
						color={'#1A61F1'}
						width={'70vw'}
						height={'auto'}
						align={'left'}
						alignItems={'left'}
						alignSelf={'self-end'}
						radius={'rounded-tl-3xl rounded-bl-3xl'}
						padding={'p-6 pl-12'}
						axis={''}
						position={''}
						zIndex={''}
					>
						<p className="text-title-4 font-light">
							Devoluciones sin coste en el plazo de{' '}
							<span className={'font-semibold'}>
								14 días. Tu satisfacción y confianza son nuestra
								prioridad.
							</span>
						</p>
					</TagBanner>
				</div>
			</section>

			<section className="pt-[72px]">
				<div className=" flex justify-start ml-36 mobile:ml-12">
					<h2 className="text-title-2 mobile:text-[10vw] mb-[46px] font-tertiary-font text-dark-grey">
						{' '}
						Novedades
					</h2>
				</div>
				<Slider breakpoints={breakPointsCardPrices} isMobile={isMobile}>
					{products.slice(0, 10).map((product: any, index) => (
						<SwiperSlide
							key={index}
							className="flex justify-center items-center"
						>
							<CardPrice
								key={index}
								title={product.title}
								reference={product.mainReference!}
								description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
								price={product?.buscorepuestosPrice || 0}
								image={
									product.images[0]
										? product.images[0]
										: '/nodisponible.png'
								}
								handle={() => handle(product._id)}
								id={product._id}
								loading={loadingPurchase === product._id}
							/>
						</SwiperSlide>
					))}
				</Slider>
			</section>

			<Dropdown />

			<Banner
				imgUrl="/banner-truck.webp"
				aligned="center"
				color="blue"
				position={''}
				extraCss={'py-10 mobile:py-4 m-auto h-[800px] mobile:h-[900px]'}
			>
				<div className="flex flex-col items-center">
					<div className="max-w-[70vw] mb-[40px] mobile:mb-[20px]">
						{ValorationInfo.map((info, index) => (
							<div key={index} className="mb-[30px]">
								<h2 className="text-xl mobile:text-lg tablet:text-lg font-normal text-custom-white">
									{info.title}
								</h2>
								<p className="text-title-4 mobile:text-sm tablet:text-base text-custom-white">
									{info.description}
								</p>
							</div>
						))}
					</div>
					<Slider breakpoints={breakPointsCardValoration}>
						{cardValorationPropsArray.map(
							(cardValoration, index) => (
								<SwiperSlide key={index}>
									<CardValoration
										title={cardValoration.title}
										valoration={cardValoration.valoration}
										comments={cardValoration.comments}
									/>
								</SwiperSlide>
							)
						)}
					</Slider>
				</div>
			</Banner>

			<section className="pt-[72px]">
				<div className="flex justify-start ml-36 mobile:ml-12">
					<h2 className="text-title-2 mobile:text-[10vw] mb-[46px] font-tertiary-font text-dark-grey">
						{' '}
						Podría interesarte
					</h2>
				</div>
				<Slider breakpoints={breakPointsCardPrices} isMobile={isMobile}>
					{products.slice(10, 20).map((product: any, index) => (
						<SwiperSlide
							key={index}
							className="flex justify-center items-center"
						>
							<CardPrice
								key={index}
								title={product.title}
								reference={product.mainReference!}
								description={`${cleanValue(product.brand)}${cleanValue(product.articleModel)}${cleanValue(product.year.toString())}`}
								price={product?.buscorepuestosPrice || 0}
								image={
									product.images[0]
										? product.images[0]
										: '/nodisponible.png'
								}
								handle={() => handle(product._id)}
								id={product._id}
								loading={loadingPurchase === product._id}
							/>
						</SwiperSlide>
					))}
				</Slider>
			</section>
		</main>
	)
}
