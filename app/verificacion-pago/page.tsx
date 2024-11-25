'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store'
import ShoppingBasket from '../core/components/shopping-cart/ShoppingBasket'
import SelectDropdown from '../core/components/selectDropdown/selectDropdown'
import PaymentSelection from '../core/components/paymentSelection/PaymentSelection'
import Input from '../core/components/input/input'
import { createPaymentIntent } from '../services/checkout/stripe.service'
import { userService } from '../services/user/userService'
import { subscribe } from '../services/mailchimp/mailchimp'
import Image from 'next/image'
import './stripe.css'

export interface FormsFields {
	name: string
	email: string
	nif: string
	phoneNumber: string
	shippingAddress: string
	addressExtra: string
	zip: string
	city: string
	province: string
	country: string
	billingAddress: string
	billingAddressExtra: string
	billingZip: string
	billingProvince: string
}

export interface addressFields {
	Created: string
	additionalInformation: string
	address: string
	addressNumber: string
	country: string
	cp: string
	id: string
	location: string
	name: string
	nif: string
	phone: number
	province: string
}

function useCartItems() {
	const items = useSelector((state: RootState) => state.cart.items)
	const [isLoaded, setIsLoaded] = useState(false)
	const purchaseIds = items.map((item) => item.purchaseId ?? '')
	const userId = useSelector((state: RootState) => {
		const currentUser = state.airtableUser.currentUser
		return currentUser &&
			Array.isArray(currentUser.data) &&
			currentUser.data.length > 0
			? currentUser.data[0].id
			: null
	})
	useEffect(() => {
		if (items) {
			setIsLoaded(true)
		}
	}, [items])

	return { items, isLoaded, purchaseIds, userId }
}

export default function Payment() {
	const dispatch = useDispatch()
	const [sameBillAddress, setSameBillAddress] = useState<boolean>(false)
	const [isSwitchOn, setIsSwitchOn] = useState(true)
	const [clientSecret, setClientSecret] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isMobile, setIsMobile] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [userAddresses, setUserAddresses] = useState<addressFields[]>([])
	const [isScrolledInputs, setIsScrolledInputs] = useState({
		name: false,
		email: false,
		nif: false,
		phoneNumber: false,
		shippingAddress: false,
		addressExtra: false,
		zip: false,
		city: false,
		province: false,
		country: false,
	})
	const [fieldsValue, setFieldsValue] = useState<FormsFields>({
		name: '',
		email: '',
		nif: '',
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

	const { items, isLoaded, purchaseIds, userId } = useCartItems()

	const [emailError, setEmailError] = useState<string | null>(null)
	const [isFormVisible, setIsFormVisible] = useState(false)

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	useEffect(() => {
		// Verificar si hay un correo almacenado en localStorage
		const storedEmail = localStorage.getItem('userEmail')
		if (storedEmail) {
			setFieldsValue((prevState) => ({
				...prevState,
				email: storedEmail,
			})) // Establecer el email en fieldsValue
			setIsFormVisible(true) // Si hay un correo, mostrar el siguiente formulario
		}
	}, [setFieldsValue])

	const calculateTotal = () => {
		const stringPrice = items
			.filter((product) => product.stock)
			.map((product) => product.buscorepuestosPrice)
			.reduce((acc, price) => acc + Number(price), 0)
			.toFixed(2)

		const numberPrice = parseFloat(stringPrice)
		const numberPriceRounded = Math.round(numberPrice * 100)

		return {
			stringPrice,
			numberPriceRounded,
			numberPrice,
		}
	}

	const { numberPriceRounded, stringPrice, numberPrice } = calculateTotal()

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

	const prevPurchaseIdsRef = useRef<string[]>([])

	useEffect(() => {
		const createIntent = async () => {
			try {
				if (
					purchaseIds.length === 0 ||
					purchaseIds.every((id) => id.trim() === '')
				) {
					console.error(
						'No se puede crear el PaymentIntent porque purchaseIds está vacío o solo contiene strings vacíos.'
					)
					return
				}

				const res = await createPaymentIntent({
					amount: numberPriceRounded,
					currency: 'eur',
					cartIDs: purchaseIds,
					automatic_payment_methods: { enabled: true },
				})
				setClientSecret(res.data.client_secret)
			} catch (error) {
				setError('Error al crear el Payment Intent')
				console.error('Error al crear el Payment Intent:', error)
			}
		}

		// Compara el valor actual de purchaseIds con el anterior
		if (
			JSON.stringify(prevPurchaseIdsRef.current) !==
			JSON.stringify(purchaseIds)
		) {
			createIntent()
			// Actualiza el valor anterior
			prevPurchaseIdsRef.current = purchaseIds
		}
	}, [purchaseIds, numberPriceRounded])

	useEffect(() => {
		dispatch({ type: 'auth/checkUserStatus' })
	}, [dispatch])

	useEffect(() => {
		if (sameBillAddress) {
			setFieldsValue((prevState) => ({
				...prevState,
				billingAddress: prevState.shippingAddress,
				billingAddressExtra: prevState.addressExtra,
				billingZip: prevState.zip,
				billingProvince: prevState.province,
			}))
		} else {
			// Limpiar los campos de dirección de facturación si se deselecciona el checkbox
			setFieldsValue((prevState) => ({
				...prevState,
				billingAddress: '',
				billingAddressExtra: '',
				billingZip: '',
				billingProvince: '',
			}))
		}
	}, [sameBillAddress])

	useEffect(() => {
		const fetchUser = async () => {
			if (userId) {
				try {
					const user = await userService.getUserById(userId)
					const userData = user.data?.fields.userAddresses
					if (userData) {
						const addresses = await Promise.all(
							userData.map(async (address: any) => {
								const addresses =
									await userService.getUserAdressesById(
										address
									)
								return addresses.data.fields
							}) || []
						)
						setUserAddresses(addresses)
					}
				} catch (error) {
					console.error('Error fetching user:', error)
				}
			}
		}

		fetchUser()
	}, [userId])

	const shippingOptions = userAddresses.map((address) => ({
		value: address.id,
		label: address.address,
	}))

	const addressOnChanges = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const address = userAddresses.find(
			(address) => address.id === event.target.value
		)
		if (address) {
			setFieldsValue((prevState) => ({
				...prevState,
				shippingAddress: address.address,
				addressExtra: address.addressNumber,
				zip: address.cp,
				city: address.location,
				province: address.province,
				country: address.country,
			}))
		}
	}

	const billingOptions = [
		{ value: 'opcion1', label: 'Direcciones de facturación guardadas' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' },
	]

	const handleCheckboxChange = () => {
		setIsSwitchOn((prev) => !prev)
		setSameBillAddress((prev) => !prev)
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

	const nameRef = useRef<HTMLInputElement>(null)
	const emailRef = useRef<HTMLInputElement>(null)
	const nifRef = useRef<HTMLInputElement>(null)
	const phoneNumberRef = useRef<HTMLInputElement>(null)
	const shippingAddressRef = useRef<HTMLInputElement>(null)
	const addressExtraRef = useRef<HTMLInputElement>(null)
	const zipRef = useRef<HTMLInputElement>(null)
	const cityRef = useRef<HTMLInputElement>(null)
	const provinceRef = useRef<HTMLInputElement>(null)
	const countryRef = useRef<HTMLInputElement>(null)

	const handleNext = async () => {
		if (!fieldsValue.email) {
			setEmailError('Por favor, ingrese su correo.')
		} else if (!emailRegex.test(fieldsValue.email)) {
			setEmailError('Por favor, ingrese un correo válido.')
		} else {
			setEmailError(null) // Si es válido, no hay error
			localStorage.setItem('userEmail', fieldsValue.email) // Guardar el correo en localStorage
			setIsFormVisible(true) // Mostrar el siguiente formulario
			userService.updateUser({
				id: localStorage.getItem('airtableUserId'),
				['correo electronico']: fieldsValue.email,
			}) // Actualizar el correo en la base de datos
			await subscribe(fieldsValue.email) // Suscribir al usuario a Mailchimp
		}
	}

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Actualiza el valor del correo en fieldsValue
		setFieldsValue((prevState) => ({
			...prevState,
			email: e.target.value,
		}))
	}

	let userEmail: string | null = null
	if (typeof window !== 'undefined') {
		userEmail = localStorage.getItem('airtableUserId')
	}

	if (!isLoaded) {
		return <div>Loading...</div>
	}

	return (
		<div className="flex justify-center mobile:mt-[12vw] mt-[22rem] mb-[10rem]">
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
								{stringPrice}€
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
								{stringPrice}€
							</p>
						</div>
						{localDropdown()}
					</article>
				)}
				<div className="relative overflow-hidden">
					{/* Pantalla de correo */}
					<div
						className={` inset-0 w-full transition-transform duration-500 ease-in-out ${
							isFormVisible
								? '-translate-x-full opacity-0 absolute'
								: 'translate-x-0 opacity-100'
						}`}
					>
						<div className="flex flex-col items-center">
							<h1
								className={
									'text-title-4 font-tertiary-font mb-4 self-start'
								}
							>
								Comprar como invitado
							</h1>
							<div
								className={
									'grid grid-cols-1 w-[60%] mobile:w-full gap-4 mt-4'
								}
							>
								<Input
									placeholder="Correo electrónico"
									value={fieldsValue.email}
									onChange={handleEmailChange}
								/>
								{emailError && (
									<p className="text-red-500 text-sm mt-1">
										{emailError}
									</p>
								)}
							</div>
							<div className="flex">
								<button
									className="mt-8 inline-flex items-center justify-center px-4 py-2 border border-transparent text-[16px] mobile:text-[12px] font-sm rounded-3xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									onClick={handleNext}
									// Deshabilitar si no es válido
								>
									Continuar con la compra
								</button>
							</div>
						</div>
					</div>

					{/* Pantalla de formulario */}
					<div
						className={` inset-0 w-full transition-transform duration-500 ease-in-out ${
							isFormVisible
								? 'translate-x-0 opacity-100'
								: 'translate-x-full opacity-0 absolute'
						}`}
					>
						<article className={'mobile:p-6'}>
							<div
								className={
									'flex flex-col justify-center items-center'
								}
							>
								{/*Personal Information*/}
								<h1
									className={
										'text-title-4 font-tertiary-font mb-4 self-start'
									}
								>
									Datos de envío
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
										ref={nameRef}
										isScrolled={isScrolledInputs.name}
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
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												email: e.target.value,
											})
										}
										ref={emailRef}
										isScrolled={isScrolledInputs.email}
										disabled={!!userEmail}
										buttonText="Modificar" // Texto del botón
										onButtonClick={() => {
											setIsFormVisible(false)
											localStorage.removeItem('userEmail')
										}}
									/>
									<Input
										placeholder={'NIF / CIF'}
										name={'company_id'}
										value={fieldsValue.nif}
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												nif: e.target.value,
											})
										}
										ref={nifRef}
										isScrolled={isScrolledInputs.nif}
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
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												phoneNumber: e.target.value,
											})
										}
										ref={phoneNumberRef}
										isScrolled={
											isScrolledInputs.phoneNumber
										}
									/>
								</div>

								{/*Shipping Address Information*/}
								{/* <h1
									className={
										'text-title-4 font-tertiary-font mb-4 mt-12 self-start'
									}
								>
									Dirección de envío
								</h1> */}
								<div
									className={
										'grid grid-cols-3 mobile:grid-cols-1 w-[60%] mobile:w-full gap-4 mt-4'
									}
								>
									<div
										className={
											'col-span-2 tablet:col-span-3'
										}
									>
										<SelectDropdown
											name={'saved_shipping_address'}
											options={
												shippingOptions.length > 0
													? shippingOptions
													: [
															{
																value: 'option1',
																label: 'Aún no tienes direcciones guardadas',
															},
														]
											}
											placeholder={
												'Direcciones de envío guardadas'
											}
											onChange={addressOnChanges}
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
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												shippingAddress: e.target.value,
											})
										}
										ref={shippingAddressRef}
										isScrolled={
											isScrolledInputs.shippingAddress
										}
									/>
								</div>
								<div
									className={
										'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
									}
								>
									<Input
										placeholder={
											'Número, piso, puerta, portal'
										}
										name={'address_extra'}
										value={fieldsValue.addressExtra}
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												addressExtra: e.target.value,
											})
										}
										ref={addressExtraRef}
										isScrolled={
											isScrolledInputs.addressExtra
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
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												zip: e.target.value,
											})
										}
										ref={zipRef}
										isScrolled={isScrolledInputs.zip}
									/>
									<Input
										placeholder={'Ciudad'}
										name={'city'}
										value={fieldsValue.city}
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												city: e.target.value,
											})
										}
										ref={cityRef}
										isScrolled={isScrolledInputs.city}
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
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												province: e.target.value,
											})
										}
										ref={provinceRef}
										isScrolled={isScrolledInputs.province}
									/>
									<Input
										placeholder={'País'}
										name={'country'}
										value={fieldsValue.country}
										cssClass={'mobile:w-[50%]'}
										onChange={(e) =>
											setFieldsValue({
												...fieldsValue,
												country: e.target.value,
											})
										}
										ref={countryRef}
										isScrolled={isScrolledInputs.country}
									/>
								</div>
								<div className="flex flex-col justify-center items-center space-y-4">
									<div className="flex flex-col justify-center items-center space-y-4">
										<p
											className="
												ms-10 mt-4 font-tertiary-font text-custom-grey
												xl:text-[0.9vw] lg:text-[1vw] md:text-[1.4vw] 
												sm:text-[1.6vw] mobile:text-[3vw]
											"
										>
											¿Usar los mismos datos para la
											factura?
										</p>
										<label className="inline-flex items-center cursor-pointer">
											<span
												className="
												font-tertiary-font ms-3 mr-4 text-custom-grey
												xl:text-[0.9vw] lg:text-[1vw] md:text-[1.4vw] 
												sm:text-[1.6vw] mobile:text-[3vw]
											"
											>
												No
											</span>
											<input
												type="checkbox"
												value=""
												className="sr-only peer"
												onChange={handleCheckboxChange}
												checked={isSwitchOn}
											/>
											<div className="relative w-16 h-8 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
											<span
												className="
												font-tertiary-font ms-3 mr-4 text-custom-grey
												xl:text-[0.9vw] lg:text-[1vw] md:text-[1.4vw] 
												sm:text-[1.6vw] mobile:text-[3vw]
											"
											>
												Si
											</span>
										</label>
									</div>
								</div>
								{!isSwitchOn && (
									<>
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
												'grid grid-cols-1 w-[60%] mobile:w-full mt-4 gap-4'
											}
										>
											<Input
												placeholder={'Dirección'}
												name={'bill_address_name'}
												value={
													fieldsValue.billingAddress
												}
												onChange={(e) =>
													setFieldsValue({
														...fieldsValue,
														billingAddress:
															e.target.value,
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
												placeholder={
													'Número, piso, puerta, portal'
												}
												name={'bill_address_extra'}
												value={
													fieldsValue.billingAddressExtra
												}
												onChange={(e) =>
													setFieldsValue({
														...fieldsValue,
														billingAddressExtra:
															e.target.value,
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
												onChange={(e) =>
													setFieldsValue({
														...fieldsValue,
														billingZip:
															e.target.value,
													})
												}
											/>
											<Input
												placeholder={'Provincia'}
												name={'bill_province'}
												value={
													fieldsValue.billingProvince
												}
												onChange={(e) =>
													setFieldsValue({
														...fieldsValue,
														billingProvince:
															e.target.value,
													})
												}
											/>
										</div>
									</>
								)}

								{/*Stripe Form*/}
								<h1
									className={
										'text-title-4 font-tertiary-font mb-4 mt-12 self-start'
									}
								>
									Seleccionar Método de pago
								</h1>
								<div className="w-full px-24 mobile:px-0">
									<PaymentSelection
										clientSecret={clientSecret}
										purchaseIds={purchaseIds}
										fieldsValue={fieldsValue}
										numberPriceRounded={numberPrice}
										nameRef={nameRef}
										emailRef={emailRef}
										nifRef={nifRef}
										phoneNumberRef={phoneNumberRef}
										shippingAddressRef={shippingAddressRef}
										addressExtraRef={addressExtraRef}
										zipRef={zipRef}
										cityRef={cityRef}
										provinceRef={provinceRef}
										countryRef={countryRef}
										setIsScrolledInputs={
											setIsScrolledInputs
										}
										isScrolledInputs={isScrolledInputs}
										items={items}
										totalPrice={stringPrice}
										isSwitchOn={isSwitchOn}
										setFieldsValue={setFieldsValue}
									/>
								</div>
							</div>
						</article>
					</div>
				</div>
			</section>
		</div>
	)
}
