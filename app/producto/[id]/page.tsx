import React from 'react'
import Head from 'next/head'
import Carousel from '../../core/components/carousel/carousel'
import ProductTitle from '../../core/components/productTitle/productTitle'
import SupplierRating from '../../core/components/supplierRating/supplierRating'
import ProductInfo from '../../core/components/productInfo/productInfo'
import PaymentMethod from '../../core/components/paymentMethod/paymentMethod'
import ProductPrice from '../../core/components/productPrice/productPrice'
import { ProductMongoInterface } from '../../redux/interfaces/product.interface'
import { environment } from '../../environment/environment'
import { PartInterface } from '../../types/metasync/product'
import { AxiosResponse } from 'axios'
import axios from 'axios'
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

export async function generateMetadata({ params }: { params: { id: string } }) {
	const data = await fetchProductData(params.id)

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

const validateMetasyncProduct = async (
	refLocal: string,
	idCompany: string
): Promise<AxiosResponse<PartInterface>> => {
	try {
		const response = await axios.get(
			`${environment.api.url}/metasync/inventory/product/${refLocal}/${idCompany}`
		)
		return response
	} catch (error) {
		console.error('Error fetching metasync product:', error)
		throw error
	}
}

export default async function Product({ params }: { params: { id: string } }) {
	const data = await fetchProductData(params.id)
	const distributorData = await fetchDistributorData(data?.distributor)
	let metasyncProduct: AxiosResponse<PartInterface> | null = null

	if (data.isMetasync) {
		metasyncProduct = await validateMetasyncProduct(
			data.refLocal!,
			data.idEmpresa!
		)
	}

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
					content={`${environment.base_url}/producto/${params.id}`}
				/>
				<meta property="og:type" content="product" />
			</Head>
			<div>
				<div className="w-full mobile:w-[100vw] mt-[4vw] mb-[2vw] grid grid-cols-2 mobile:flex mobile:flex-col gap-10 mobile:gap-0 px-[5vw] xl:px-[10vw] mobile:px-[3vw]">
					<div>
						{data && (
							<div className="mobile:mb-10 hidden mobile:block">
								<ProductTitle
									title={data.title}
									refNumber={data.mainReference}
									productName={data.version}
									imageSrc="/COMPARTIR.svg"
								/>
							</div>
						)}
						<Carousel
							images={
								data?.images.map((image) => ({ image })) || []
							}
						/>
					</div>
					<div className="hidden mobile:block w-full h-[2px] bg-secondary-blue mb-6 mobile:mb-[2vw]" />
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
						<div className="mt-[1.5vw] ml-10 mobile:mt-[4vw]">
							<SupplierRating
								valoration={valoracion || 0}
								location={Provincia || ''}
								title="Valoración del proveedor"
							/>
						</div>
						<div className="mt-[1.5vw] ml-10 flex justify-center">
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
									labelName: 'Añadir a la cesta',
								}}
								button2Props={{
									type: 'primary',
									labelName: 'Comprar',
								}}
								data={data}
								stock={
									metasyncProduct === null
										? undefined
										: metasyncProduct.data.reserva
								}
							/>
						</div>
						<div className="w-[93%] m-auto h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
						<div>
							{data && (
								<ProductInfo
									vehicleVersion={data.version}
									engine={data.engine}
									engineCode={data.engineCode}
									oemReference={data.mainReference}
									observations={data.observations}
								/>
							)}
						</div>
					</div>
					<div className="hidden mobile:block w-full h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
				</div>
				<div className="flex justify-end mobile:justify-center px-[5vw] xl:px-[10vw] mobile:px-[3vw]">
					<div className="flex mobile:justify-center mb-6">
						<PaymentMethod paymentOptions={paymentOptions} />
					</div>
				</div>
			</div>
		</>
	)
}
