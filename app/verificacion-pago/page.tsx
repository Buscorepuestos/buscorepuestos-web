'use client'
import ShoppingBasket from '../core/components/shopping-cart/ShoppingBasket'
import React, { useEffect, useState } from 'react'
import Input from '../core/components/input/input'
import SelectDropdown from '../core/components/selectDropdown/selectDropdown'
import Checkbox from '../core/components/checkbox/checkbox'
import PaymentForm from '../core/components/checkout/PaymentForm'
import { createPaymentIntent } from '../services/checkout/stripe.service'
import Image from 'next/image'
import './stripe.css'

export default function Payment() {
	const [sameBillAddress, setSameBillAddress] = useState<boolean>(false)
	const [clientSecret, setClientSecret] = useState('')
	const [error, setError] = useState('')
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
		const handleResize = () => {
			setIsMobile(window.innerWidth < 640)
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		const createIntent = () => {
			try {
				// Mock data
				createPaymentIntent({
					amount: 200,
					currency: 'eur',
					cartIDs: ['recV9AQVCb64NveMF'],
					automatic_payment_methods: { enabled: true },
				}).then((res) =>
					setClientSecret(res.data.client_secret),
				)
			} catch (error) {
				setError(error)
			}
		}

		createIntent()
	}, [])

	const products = [
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
		{
			image: '/card-preview.webp',
			title: 'Capot Delantero',
			brand: 'Nissan',
			model: 'V4',
			ref: '123123fsdf4v',
			price: 156,
			isMobile: false,
			isAvailable: true,
		},
	]

	const [productsToShow, setProductsToShow] = useState(products.slice(0, 2))


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

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSameBillAddress(event.target.checked)
	}

	const localDropdown = () => {
		return (<div className={'w-full flex flex-col items-center mt-[1vw]'}>
			<div className='w-full mobile:w-screen sm:w-[10vw] flex flex-col items-center'>
				<div className="w-full lg:w-[130px] md:w-[100px] h-0.5 bg-secondary-blue mb-3" />
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
		</div>)
	}

	useEffect(() => {
		if (isOpen)
			setProductsToShow(products)
		else setProductsToShow(products.slice(0, 2))
	}, [isOpen])

	return (
		<section className={'w-full bg-custom-white rounded-[10px] shadow-lg mt-[12vw] mb-[8vw] p-6'}>
			{!isMobile && <article>
				<ShoppingBasket products={products} />
				<div className="w-full h-[2px] bg-secondary-blue mt-6" />
				<div className={'flex justify-end items-center mr-8'}>
					<p className={'mr-6 font-medium'}>Total:</p>
					<p className={'text-title-3 text-primary-blue-2 font-semibold'}>{products.map(item => item.price).reduce((acc, curr) => acc + curr, 0)}€</p>
				</div>
				<div className="w-full h-[2px] bg-secondary-blue mb-8" />
			</article>
			}

			{isMobile && <article>
				<ShoppingBasket products={productsToShow} />
				<div className="w-full h-[2px] bg-secondary-blue mt-6" />
				<div className={'flex justify-end items-center mr-20'}>
					<p className={'mr-6 font-medium'}>Total:</p>
					<p className={'text-title-3 text-primary-blue-2 font-semibold'}>{products.map(item => item.price).reduce((acc, curr) => acc + curr, 0)}€</p>
				</div>
				{localDropdown()}
			</article>}

			<article className={'mobile:p-6'}>
				<form className={'flex flex-col justify-center items-center'}>
					{/*Personal Information*/}
					<h1 className={'text-title-4 font-tertiary-font mb-4 self-start'}>Información personal</h1>
					<div className={'grid grid-cols-1 w-[60%] mobile:w-full gap-4'}>
						<Input placeholder={'Nombre y apellidos'} name={'name'} value={fieldsValue.name}
							   onChange={(e) => setFieldsValue({ ...fieldsValue, name: e.target.value })}/>
					</div>
					<div className={'grid grid-cols-3 mobile:grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Email'} name={'email'} value={''}
							   cssClass={'desktop:col-span-2 tablet:col-span-2 mobile:col-span-1'} />
						<Input placeholder={'NIF / CIF'} name={'company_id'} value={''} />
					</div>
					<div className={'grid grid-cols-2 mobile:grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Número de teléfono'} name={'phone'} value={''} />
					</div>

					{/*Shipping Address Information*/}
					<h1 className={'text-title-4 font-tertiary-font mb-4 mt-12 self-start'}>Dirección de envío</h1>
					<div className={'grid grid-cols-3 mobile:grid-cols-1 w-[60%] mobile:w-full gap-4'}>
						<div className={'col-span-2 tablet:col-span-3'}>
							<SelectDropdown name={'saved_shipping_address'} options={shippingOptions}
											placeholder={'Direcciones de envío guardadas'} />
						</div>
					</div>
					<div className={'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Dirección'} name={'address_name'} value={''} />
					</div>
					<div className={'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Número, piso, puerta, portal'} name={'address_extra'} value={''} />
					</div>
					<div className={'grid grid-cols-2 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Código postal'} name={'zip'} value={''} />
						<Input placeholder={'Ciudad'} name={'city'} value={''} />
					</div>
					<div className={'grid grid-cols-2 mobile:grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Provincia'} name={'province'} value={''} />
						<Input placeholder={'País'} name={'country'} value={''} cssClass={'mobile:w-[50%]'} />
					</div>
					<div className={'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Checkbox name={'same_address'} value={sameBillAddress} onChange={handleCheckboxChange}
								  label={'Usar la misma dirección de facturación'} />
					</div>

					{/*Billing address*/}
					<h1 className={'text-title-4 font-tertiary-font mb-4 mt-12 self-start'}>Dirección de
						facturación</h1>
					<div className={'grid grid-cols-3 mobile:grid-cols-1 w-[60%] mobile:w-full gap-4'}>
						<div className={'col-span-2 tablet:col-span-3'}>
							<SelectDropdown name={'saved_billing_address'} options={billingOptions}
											placeholder={'Direcciones de facturación guardadas'} />
						</div>
					</div>
					<div className={'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Dirección'} name={'bill_address_name'} value={''} />
					</div>
					<div className={'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Número, piso, puerta, portal'} name={'bill_address_extra'} value={''} />
					</div>
					<div className={'grid grid-cols-2 w-[60%] mobile:w-full mt-4 gap-4'}>
						<Input placeholder={'Código postal'} name={'bill_zip'} value={''} />
						<Input placeholder={'Provincia'} name={'bill_province'} value={''} />
					</div>

					{/*Stripe Form*/}
					<h1 className={'text-title-4 font-tertiary-font mb-4 mt-12 self-start'}>Método de pago</h1>
					<div>
						{clientSecret && <PaymentForm clientSecret={clientSecret} />}
					</div>

				</form>
			</article>
		</section>
	)
}
