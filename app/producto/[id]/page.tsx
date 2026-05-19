import React from 'react'
import Head from 'next/head'
import Carousel from '../../core/components/carousel/carousel'
import ProductTitle from '../../core/components/productTitle/productTitle'
import SupplierRating from '../../core/components/supplierRating/supplierRating'
import ProductInfo from '../../core/components/productInfo/productInfo'
import PaymentMethod from '../../core/components/paymentMethod/paymentMethod'
import ProductPrice from '../../core/components/productPrice/productPrice'
import Facilities from '../../core/components/facilities/Facilities'
import { ProductMongoInterface } from '../../redux/interfaces/product.interface'
import { environment } from '../../environment/environment'
import { PartInterface } from '../../types/metasync/product'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import Warranties from '../../core/components/warranties/Warranties'
import RelatedProducts from '../../core/components/relatedProducts/RelatedProducts'
import ValidadorMatricula from '../../core/components/matriculaInput/MatriculaInput'
import '../product.css'
const paymentOptions = [
	{
		src: '/tarjeta.svg',
		alt: 'tarjeta',
		subtitle: 'Pago con tarjeta',
		width: 56,
		height: 56,
		className: `xl:w-[3.4vw] lg:w-[4.5vw] md:w-[4.8vw] sm:w-[6vw] mobile:w-[12vw]`,
	},
	{
		src: '/transferencia.svg',
		alt: 'transferencia',
		subtitle: 'Transferencia',
		width: 50,
		height: 50,
		className: `xl:w-[3vw] lg:w-[4vw] md:w-[4.3vw] sm:w-[5.5vw] mobile:w-[11vw]`,
	},
	{
		src: '/paypal-product.png',
		alt: 'paypal;',
		subtitle: 'Paypal',
		width: 35,
		height: 35,
		className: `xl:w-[3vw] lg:w-[3vw] md:w-[3.3vw] sm:w-[4vw] mobile:w-[12vw]`,
	},
	{
		src: '/plazos.svg',
		alt: 'plazos',
		subtitle: 'Pago a plazos',
		width: 45,
		height: 45,
		className: `xl:w-[3vw] lg:w-[4vw] md:w-[4.4vw] sm:w-[5.5vw] mobile:w-[11vw]`,
	},
]

const fetchProductData = async (id: string): Promise<ProductMongoInterface> => {
	const response = await axios.get(
		`${environment.api.url}/products/product-mongo/${id}`
	)
	return response.data.data
}

const fetchDistributorData = async (id: string) => {
	try {
		const response = await axios.get(
			`${environment.api.url}/distributors/${id}?populate=true`
		)
		return response.data
	} catch (error) {
		console.error('Error fetching distributor data:', error)
	}
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const data = await fetchProductData(id)

	return {
		title: `${data?.title}`,
		description: `Compra ${data?.title} en Buscorepuestos.com. ${data?.version} - ${data?.engine}`,
		openGraph: {
			title: `${data?.title}`,
			description: `Compra ${data?.title} en Buscorepuestos.com. ${data?.version} - ${data?.engine}`,
			images: data?.images.map((image) => ({ url: image })),
		},
	}
}

// const validateMetasyncProduct = async (
// 	refLocal: string,
// 	idCompany: string
// ): Promise<AxiosResponse<PartInterface>> => {
// 	try {
// 		const response = await axios.get(
// 			`${environment.api.url}/metasync/inventory/product/${refLocal}/${idCompany}`
// 		)
// 		return response
// 	} catch (error) {
// 		console.error('Error fetching metasync product:', error)
// 		throw error
// 	}
// }

export default async function Product({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const data = await fetchProductData(id)
	const distributorData = await fetchDistributorData(data?.distributor)
	const relatedRes = await fetch(
		`${environment.api.url}/products/related/${id}?limit=8`,
		{ cache: 'no-store' }
	).then(r => r.json()).catch(() => ({ data: [] }))

	const relatedProducts = relatedRes.data || []
	let metasyncProduct: AxiosResponse<PartInterface> | null = null

	// if (data.isMetasync) {
	// 	metasyncProduct = await validateMetasyncProduct(
	// 		data.refLocal!,
	// 		data.idEmpresa!
	// 	)
	// }

	const buscoRepuestoPriceNew = () => {
		if (data?.buscorepuestosPrice) {
			const priceWithMarkup = data.buscorepuestosPrice * 1.3
			const rounder = Math.ceil(priceWithMarkup / 10) * 10
			return rounder
		}
	}
	const discountRounded = Math.ceil(data?.discount || 0)
	const buscoRepuestoPrice = (data?.buscorepuestosPrice || 0).toFixed(2)
	const { 'Media de valoración': valoracion, Provincia } =
		distributorData?.data?.fields || {}

	const brandLabel = data.brand
		? data.brand.charAt(0).toUpperCase() + data.brand.slice(1).toLowerCase()
		: 'Vehículo'

	const ArticleModelLabel = data.articleModel
		? data.articleModel.charAt(0).toUpperCase() + data.articleModel.slice(1).toLowerCase()
		: 'Vehículo'

	return (
		<>
			<Head>
				<meta property="og:title" content={data.title} />
				<meta
					property="og:description"
					content={`Compra ${data.title} en Buscorepuestos.com. ${data.version} - ${data.engine}`}
				/>
				{data.images?.length > 0 && (
					<meta property="og:image" content={data.images[0]} />
				)}
				<meta
					property="og:url"
					content={`${environment.base_url}/producto/${id}`}
				/>
				<meta property="og:type" content="product" />
			</Head>
			<div>
				<div className="w-full mobile:w-[100vw] mt-[4vw] grid grid-cols-2 mobile:flex mobile:flex-col gap-10 mobile:gap-0 px-[5vw] xl:px-[10vw] mobile:px-[3vw]">
					<div>
						{data && (
							<div className="hidden mobile:block">
								<ProductTitle
									title={data.title}
									refNumber={data.mainReference}
									productName={data.version}
									imageSrc="/COMPARTIR.svg"
								/>
							</div>
						)}
						{/* <div className="w-full px-[4vw] py-[2.5vw] bg-[#f0fbfc] sm:hidden">
							<p className="font-tertiary-font text-[3.2vw] text-dark-grey leading-snug">
								<span className="font-semibold">Compatible con: </span>
								<span className="text-secondary-blue font-bold">
									{brandLabel}
									{ArticleModelLabel !== 'Vehículo' && ` ${ArticleModelLabel}`}
								</span>
							</p>
						</div> */}
						<div className="w-full px-[2vw] pt-[2vw] mb-[0.5vw] bg-white sm:hidden">
							<div className="inline-flex max-w-full items-center gap-[2vw] bg-green-50 border border-green-200 rounded-full px-[3vw] py-[1.5vw]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14" height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#16a34a"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="flex-shrink-0"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
								<p className="font-tertiary-font text-[2.8vw] text-green-700 font-semibold leading-snug">
									Compatible con:{' '}
									<span className="text-green-800 font-bold">
										{brandLabel}
										{ArticleModelLabel !== 'Vehículo' && ` ${ArticleModelLabel}`}
									</span>
								</p>
							</div>
						</div>
						<Carousel
							images={
								data?.images.map((image) => ({ image })) || []
							}
						/>

						<Facilities isProductPage={true} />
						<div className="px-[4vw] mb-[1vw] mt-[3vw] sm:hidden">
							<Warranties compact />
						</div>
						<div className='sm:hidden'>
							{data && (
								<ProductInfo
									vehicleVersion={data.version}
									engine={data.engine}
									engineCode={data.engineCode}
									oemReference={data.mainReference}
									observations={data.observations}
									vehicleBrand={data.brand}
									articleModel={data.articleModel}
								/>
							)}
						</div>
						<div className=" mobile:hidden flex justify-center mobile:justify-center mobile:px-[3vw] mt-8">
							<div className="flex mobile:justify-center mb-6">
								<PaymentMethod
									paymentOptions={paymentOptions}
								/>
							</div>
						</div>
					</div>
					{/* <div className="hidden mobile:block w-full h-[2px] bg-secondary-blue mb-6 mobile:mb-[2vw]" /> */}
					<div className="bg-neutro-grey">
						{data && (
							<div className="block mobile:hidden">
								<ProductTitle
									title={data.title}
									refNumber={data.mainReference}
									productName={data.version}
									imageSrc="/COMPARTIR.svg"
								/>
							</div>
						)}
						<div className="mt-[1.5vw] ml-10 mobile:hidden">
							<SupplierRating
								valoration={5}
								location={Provincia || ''}
								title="Valoración del proveedor"
							/>
						</div>
						<div>
							<ProductPrice
								price={buscoRepuestoPrice}
								shippingInfo="Envío e IVA incluido"
								warningImgSrc="/info.svg"
								originalPrice={buscoRepuestoPriceNew() || 0}
								discount={
									discountRounded ? `${discountRounded}%` : ''
								}
								button1Props={{
									type: 'secondary',
								}}
								button2Props={{
									type: 'tertiary',
									labelName: 'Comprar',
									bg: 'bg-primary-blue',
									hoverBg: 'hover:bg-primary-lila',
									hoverBc: 'hover:border-primary-lila',
									hoverText: 'hover:text-white',
									borderColor: 'border-primary-blue',
								}}
								data={data}
								stock={
									// metasyncProduct === null
									// 	? undefined
									// 	: metasyncProduct.data.reserva
									undefined
								}
							/>
						</div>
						
						<ValidadorMatricula productTitle={data?.title || data?.subcategory || 'Repuesto'} />

						{/* ── CROSS-SELL — mobile ── */}
						<RelatedProducts productId={id} brand={data.brand} />
						<div className='mobile:hidden'>
							{data && (
								<ProductInfo
									vehicleVersion={data.version}
									engine={data.engine}
									engineCode={data.engineCode}
									oemReference={data.mainReference}
									observations={data.observations}
									vehicleBrand={data.brand}
								/>
							)}
						</div>
					</div>
					<div className="hidden mobile:block w-full h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
					<div className="hidden mobile:block justify-center mobile:justify-center mobile:px-[3vw] mt-8">
						<div className="flex mobile:justify-center mb-6">
							<PaymentMethod paymentOptions={paymentOptions} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
