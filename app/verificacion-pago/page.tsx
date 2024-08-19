'use client'
import ShoppingBasket from '../core/components/shopping-cart/ShoppingBasket'
import React, { useEffect, useState, useMemo } from 'react'
import Input from '../core/components/input/input'
import SelectDropdown from '../core/components/selectDropdown/selectDropdown'
import Checkbox from '../core/components/checkbox/checkbox'
import PaymentForm from '../core/components/checkout/PaymentForm'
import { createPaymentIntent } from '../services/checkout/stripe.service'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import './stripe.css'
import { RootState } from '../redux/store'

function useCartItems() {
	const items = useSelector((state: RootState) => state.cart.items)
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		if (items) {
			setIsLoaded(true)
		}
	}, [items])

	return { items, isLoaded }
}

export default function Payment() {
	const [sameBillAddress, setSameBillAddress] = useState<boolean>(false)
	const [clientSecret, setClientSecret] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isMobile, setIsMobile] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [fieldsValue, setFieldsValue] = useState({
		name: '',
		email: '',
		companyId: '',
		phoneNumber: '',
		shippingAddress: '',
		addressExtra: '',
		zip: '',
		city: '',
		province: '',
		country: '',
		billingAddress: '',
		billingAddressExtra: '',
		billingZip: '',
		billingProvince: '',
	})

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const handleResize = () => {
				setIsMobile(window.innerWidth < 640)
			}

			handleResize()
			window.addEventListener('resize', handleResize)

			return () => {
				window.removeEventListener('resize', handleResize)
			}
		}
	}, [])

	useEffect(() => {
		const createIntent = async () => {
			try {
				// Mock data
				const res = await createPaymentIntent({
					amount: 200,
					currency: 'eur',
					cartIDs: ['recV9AQVCb64NveMF'],
					automatic_payment_methods: { enabled: true },
				})
				setClientSecret(res.data.client_secret)
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message)
				} else {
					setError('An unknown error occurred')
				}
			}
		}

		createIntent()
	}, [])

	// const products = useMemo(
	// 	() => [
	// 		{
	// 			images: [
	// 				'/card-preview.webp',
	// 				'/card-preview.webp',
	// 				'/card-preview.webp',
	// 			],
	// 			title: 'Capot Delantero',
	// 			brand: 'Nissan',
	// 			articleModel: 'V4',
	// 			mainReference: '123123fsdf4v',
	// 			buscorepuestosPrice: 156,
	// 			stock: true,
	// 		},
	// 	],
	// 	[]
	// )

	// const [productsToShow, setProductsToShow] = useState(products.slice(0, 2))

	const shippingOptions = [
		{ value: 'opcion1', label: 'Direcciones de envío guardadas' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' },
	]

	const billingOptions = [
		{ value: 'opcion1', label: 'Direcciones de facturación guardadas' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' },
	]

	const handleCheckboxChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSameBillAddress(event.target.checked)
	}

	const localDropdown = () => {
		return (
			<div className={'w-full flex flex-col items-center mt-[1vw] '}>
				<div className="w-full mobile:w-screen sm:w-[10vw] flex flex-col items-center">
					<div className="w-full lg:w-[130px] md:w-[100px] h-[2px] bg-secondary-blue mb-3" />
					<Image
						src="/dropdown.svg"
						alt="dropdown icon"
						width={20}
						height={20}
						priority
						className={`mb-3 cursor-pointer hover:scale-110 transition duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
						onClick={() => setIsOpen(!isOpen)}
					/>
				</div>
			</div>
		)
	}

	// useEffect(() => {
	// 	if (isOpen) setProductsToShow(products)
	// 	else setProductsToShow(products.slice(0, 2))
	// }, [isOpen, products])

	const { items, isLoaded } = useCartItems()

	const calculateTotal = () => {
		//mapea todos los productos y si el stock del producto es true, suma el precio del producto
		return items
			.filter((product) => product.stock) // Filter out boolean values
			.map((product) => product.buscorepuestosPrice)
			.reduce((acc, price) => acc + Number(price), 0)
			.toFixed(2)
	}

	if (!isLoaded) {
		return <div>Loading...</div>
	}

	return (
		<div className='flex justify-center mobile:mt-[12vw] mt-[22rem] mb-[10rem]'>
			<section
				className={
					'w-max-[750px] mobile:w-[100vw] bg-custom-white rounded-[10px] shadow-lg p-6 mobile:rounded-bl-[5rem] mobile:rounded-br-[5rem]'
				}
			>
				{!isMobile && (
					<article>
						<ShoppingBasket products={items} isMobile={isMobile} />
						<div className="w-full h-[2px] bg-secondary-blue mt-6" />
						<div className={'flex justify-end items-center mr-8'}>
							<p className={'mr-6 font-medium'}>Total:</p>
							<p
								className={
									'text-title-3 text-primary-blue-2 font-semibold'
								}
							>
								{
									calculateTotal()
								}
								€
							</p>
						</div>
						<div className="w-full h-[2px] bg-secondary-blue mb-8" />
					</article>
				)}

				{isMobile && (
					<article>
						<ShoppingBasket products={items} isMobile={isMobile} />
						<div className="w-full h-[2px] bg-secondary-blue mt-6" />
						<div className={'flex justify-end items-center mr-20'}>
							<p className={'mr-6 font-medium'}>Total:</p>
							<p
								className={
									'text-title-3 text-primary-blue-2 font-semibold'
								}
							>
								{
									calculateTotal()
								}
								€
							</p>
						</div>
						{localDropdown()}
					</article>
				)}

				<article className={'mobile:p-6'}>
					<form className={'flex flex-col justify-center items-center'}>
						{/*Personal Information*/}
						<h1
							className={
								'text-title-4 font-tertiary-font mb-4 self-start'
							}
						>
							Información personal
						</h1>
						<div
							className={
								'grid grid-cols-1 w-[60%] mobile:w-full gap-4'
							}
						>
							<Input
								placeholder={'Nombre y apellidos'}
								name={'name'}
								value={fieldsValue.name}
								onChange={(e) =>
									setFieldsValue({
										...fieldsValue,
										name: e.target.value,
									})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-3 mobile:grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Email'}
								name={'email'}
								value={fieldsValue.email}
								cssClass={
									'desktop:col-span-2 tablet:col-span-2 mobile:col-span-1'
								}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											email: e.target.value,
										})
								}
							/>
							<Input
								placeholder={'NIF / CIF'}
								name={'company_id'}
								value={fieldsValue.companyId}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											companyId: e.target.value,
										})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-2 mobile:grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Número de teléfono'}
								name={'phone'}
								value={fieldsValue.phoneNumber}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											phoneNumber: e.target.value,
										})
								}
							/>
						</div>

						{/*Shipping Address Information*/}
						<h1
							className={
								'text-title-4 font-tertiary-font mb-4 mt-12 self-start'
							}
						>
							Dirección de envío
						</h1>
						<div
							className={
								'grid grid-cols-3 mobile:grid-cols-1 w-[60%] mobile:w-full gap-4'
							}
						>
							<div className={'col-span-2 tablet:col-span-3'}>
								<SelectDropdown
									name={'saved_shipping_address'}
									options={shippingOptions}
									placeholder={'Direcciones de envío guardadas'}
								/>
							</div>
						</div>
						<div
							className={
								'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Dirección'}
								name={'address_name'}
								value={fieldsValue.shippingAddress}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											shippingAddress: e.target.value,
										})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Número, piso, puerta, portal'}
								name={'address_extra'}
								value={fieldsValue.addressExtra}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											addressExtra: e.target.value,
										})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-2 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Código postal'}
								name={'zip'}
								value={fieldsValue.zip}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											zip: e.target.value,
										})
								}
							/>
							<Input
								placeholder={'Ciudad'}
								name={'city'}
								value={fieldsValue.city}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											city: e.target.value,
										})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-2 mobile:grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Provincia'}
								name={'province'}
								value={fieldsValue.province}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											province: e.target.value,
										})
								}
							/>
							<Input
								placeholder={'País'}
								name={'country'}
								value={fieldsValue.country}
								cssClass={'mobile:w-[50%]'}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											country: e.target.value,
										})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Checkbox
								name={'same_address'}
								value={sameBillAddress}
								onChange={handleCheckboxChange}
								label={'Usar la misma dirección de facturación'}
							/>
						</div>

						{/*Billing address*/}
						<h1
							className={
								'text-title-4 font-tertiary-font mb-4 mt-12 self-start'
							}
						>
							Dirección de facturación
						</h1>
						<div
							className={
								'grid grid-cols-3 mobile:grid-cols-1 w-[60%] mobile:w-full gap-4'
							}
						>
							<div className={'col-span-2 tablet:col-span-3'}>
								<SelectDropdown
									name={'saved_billing_address'}
									options={billingOptions}
									placeholder={
										'Direcciones de facturación guardadas'
									}
								/>
							</div>
						</div>
						<div
							className={
								'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Dirección'}
								name={'bill_address_name'}
								value={fieldsValue.billingAddress}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											billingAddress: e.target.value,
										})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Número, piso, puerta, portal'}
								name={'bill_address_extra'}
								value={fieldsValue.billingAddressExtra}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											billingAddressExtra: e.target.value,
										})
								}
							/>
						</div>
						<div
							className={
								'grid grid-cols-2 w-[60%] mobile:w-full mt-4 gap-4'
							}
						>
							<Input
								placeholder={'Código postal'}
								name={'bill_zip'}
								value={fieldsValue.billingZip}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											billingZip: e.target.value,
										})
								}
							/>
							<Input
								placeholder={'Provincia'}
								name={'bill_province'}
								value={fieldsValue.billingProvince}
								onChange={
									(e) =>
										setFieldsValue({
											...fieldsValue,
											billingProvince: e.target.value,
										})
								}
							/>
						</div>

						{/*Stripe Form*/}
						<h1
							className={
								'text-title-4 font-tertiary-font mb-4 mt-12 self-start'
							}
						>
							Método de pago
						</h1>
						
					</form>
					<div>
							{clientSecret && (
								<PaymentForm clientSecret={clientSecret} />
							)}
						</div>
				</article>
			</section>
		</div>
	)
}
