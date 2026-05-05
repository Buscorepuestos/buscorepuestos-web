'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Button, { ButtonProps } from '../Button'
import { ProductMongoInterface } from '../../../redux/interfaces/product.interface'
import { useAppDispatch } from '../../../redux/hooks'
import {
	addItemToCart,
	CartItem,
	removeItemFromCart,
	savePurchaseAsync,
	removePurchaseAsync,
} from '../../../redux/features/shoppingCartSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { updateMetasyncProduct } from '../../../services/products/products.service'
import { updateAlgoliaProductStock } from '../../../services/algolia/updateStock.service'
import CheckoutPage from '../checkoutPage/CheckoutPage'
import ScalapayWidget from '../scalapayWidget/ScalapayWiget'

interface ProductPriceProps {
	price: string
	shippingInfo: string
	warningImgSrc: string
	originalPrice: number
	discount: string
	button1Props: ButtonProps
	button2Props: ButtonProps
	data: ProductMongoInterface
	stock?: number | undefined
}

const ProductPrice: React.FC<ProductPriceProps> = ({
	price,
	shippingInfo,
	warningImgSrc,
	originalPrice,
	discount,
	button1Props,
	button2Props,
	data,
	stock,
}) => {
	const dispatch = useAppDispatch()
	const searchParams = useSearchParams()

	let [globalStock, setGlobalStock] = useState<boolean>(true)

	const [existingItem, setExistingItem] = useState<CartItem | null>(null)
	const [isProccesingAddToCart, setIsProccesingAddToCart] =
		useState<boolean>(false)
	const [isProccesingBuyNow, setIsProccesingBuyNow] = useState<boolean>(false)
	const userId = useSelector((state: RootState) => {
		const currentUser = state.airtableUser.currentUser
		return currentUser &&
			Array.isArray(currentUser.data) &&
			currentUser.data.length > 0
			? currentUser.data[0].id
			: null
	})
	const userId2 = useSelector((state: RootState) => {
		const currentUser = state.airtableUser.currentUser as any
		return currentUser?.data?.id || null
	})
	const cart = useSelector((state: RootState) => state.cart.items)
	const user = useSelector(
		(state: RootState) => state.airtableUser.currentUser ?? null
	)

	const [onePageIsOpen, setOnePageIsOpen] = useState<boolean>(false)

	// console.log(
	// 	'Redux state:',
	// 	useSelector((state: RootState) => state.airtableUser)
	// )

	const handleAddToCart = () => {
		setIsProccesingAddToCart(true)
		dispatch({ type: 'auth/checkUserStatus' })
		const origin = searchParams.get('origin') || undefined;
		dispatch(addItemToCart({ ...data, origin }))
		dispatch(
			savePurchaseAsync({
				product: data,
				userId: userId === null ? userId2 : userId ?? '',
			})
		)
		Swal.fire({
			position: 'center',
			icon: 'success',
			title: 'Producto añadido al carrito',
			showConfirmButton: false,
			timer: 1500,
		})
	}

	const handleRemoveFromCart = () => {
		setIsProccesingAddToCart(false)
		dispatch(removeItemFromCart(data._id))
		dispatch(
			removePurchaseAsync({
				productId: data._id,
				purchaseId: existingItem!.purchaseId!,
			})
		)
	}

	useEffect(() => {
		const item = cart.find((item) => item._id === data._id)
		setExistingItem(item!)
	}, [cart, data._id])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Verificamos si localStorage está disponible antes de despachar la acción
			dispatch({ type: 'auth/checkUserStatus' })
		}
	}, [dispatch])

	useEffect(() => {
		if (stock !== undefined) {
			if (stock > 0) {
				setGlobalStock(false)
					; (async () => {
						await updateMetasyncProduct(data._id, {
							id: data._id,
							data: {
								stock: false,
							},
						})
						await updateAlgoliaProductStock(data._id, false)
					})()
			}
		}
	}, [globalStock, stock, data._id, dispatch])

	const buynow = async () => {
		dispatch({ type: 'auth/checkUserStatus' })
		setIsProccesingBuyNow(true)
		const origin = searchParams.get('origin') || undefined;
		dispatch(addItemToCart({ ...data, origin }))

		setTimeout(() => {
			dispatch(
				savePurchaseAsync({
					product: data,
					userId: userId === null ? userId2 : userId ?? '',
				})
			)
		}, 2000)
		// router.push('/verificacion-pago')
		setOnePageIsOpen(true)
	}

	// return (
	// 	<div className="relative overflow-hidden">
	// 		<div className="mt-[1.5vw] ml-10 flex justify-center">
	// 			<div className="flex flex-col justify-center items-center font-tertiary-font">
	// 				<div className="relative flex items-center">
	// 					<p id="product-page-price" className="text-[32px] xl:text-[2.5vw] lg:text-[2.8vw] md:text-[3.2vw] sm:text-[3.5vw] text-primary-blue font-semibold">
	// 						{price}€
	// 					</p>
	// 					{/* <p
	// 						className="
	// 						absolute left-[105%] top-[40%] transform -translate-y-1/2 bg-custom-orange rounded-full 
	// 						text-custom-white px-2 text-[2.8vw] xl:text-[0.9vw] md:text-[1.3vw] xl:h-[1.1vw] lg:h-[1.6vw] md:h-[1.8vw] mobile:h-[3.5vw]
	// 						sm:text-[1.4vw]
	// 					"
	// 					>
	// 						-30%
	// 					</p> */}
	// 				</div>
	// 				<p className="mt-[-1.3rem] font-semibold text-dark-grey xl:text-[1vw] md:text-[1.2vw] sm:text-[1.7vw]">
	// 					{shippingInfo}
	// 				</p>
	// 				<div className="mt-4 flex justify-center w-full scalapay-widget-mobile-container">
	// 					<ScalapayWidget
	// 						amountSelector="#product-page-price"
	// 						type="product"
	// 					/>
	// 				</div>
	// 				<div className="text-custom-orange gap-3 flex items-center">
	// 					<Image
	// 						src={warningImgSrc}
	// 						alt="warning"
	// 						width={20}
	// 						height={20}
	// 						className="mobile:w-[13px] sm:w-[15px] md:w-[12px] lg:w-[15px]"
	// 					/>
	// 					<p className="text-[2.8vw] xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw]">
	// 						Precio medio pieza original nueva:
	// 						<span className="font-extrabold line-through">
	// 							{' '}
	// 							{originalPrice}€{' '}
	// 						</span>
	// 					</p>
	// 					<p className="text-[2.8vw] xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw] bg-custom-orange text-custom-white rounded-2xl px-1 flex items-center">
	// 						{"-"}{discount}
	// 					</p>
	// 				</div>
	// 				{!onePageIsOpen && (
	// 					<div>
	// 						{user ? (
	// 							<div className="flex gap-7 mt-7">
	// 								{data.stock === false ||
	// 									globalStock === false ? (
	// 									<Button
	// 										labelName="Producto no disponible"
	// 										type="secondary"
	// 										bg="bg-alter-grey"
	// 										borderColor="border-alter-grey"
	// 										hoverBg="hover:bg-alter-grey"
	// 										hoverText="white"
	// 										cursor="cursor-not-allowed"
	// 									/>
	// 								) : (
	// 									<>
	// 										{existingItem ? (
	// 											<Button
	// 												labelName="Quitar de la cesta"
	// 												type="secondary"
	// 												bg="bg-secondary-blue"
	// 												borderColor="border-secondary-blue"
	// 												hoverBg="hover:bg-custom-white"
	// 												hoverText="hover:text-secondary-blue"
	// 												cursor="cursor-pointer"
	// 												onClick={
	// 													handleRemoveFromCart
	// 												}
	// 											/>
	// 										) : (
	// 											<>
	// 												{isProccesingAddToCart ? (
	// 													<div className="flex justify-start my-4">
	// 														<div className="w-8 h-8 border-4 border-secondary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
	// 													</div>
	// 												) : isProccesingBuyNow ? (
	// 													<div className="flex justify-center my-4">
	// 														<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
	// 													</div>
	// 												) : (
	// 													<>
	// 														<Button
	// 															{...button1Props}
	// 															onClick={
	// 																handleAddToCart
	// 															}
	// 														/>
	// 														<Button
	// 															{...button2Props}
	// 															onClick={buynow}
	// 														/>
	// 													</>
	// 												)}
	// 											</>
	// 										)}
	// 									</>
	// 								)}
	// 							</div>
	// 						) : (
	// 							<div className="flex justify-center my-4">
	// 								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
	// 							</div>
	// 						)}
	// 					</div>
	// 				)}
	// 			</div>
	// 		</div>
	// 		<div
	// 			className={`w-[93%] m-auto h-[2px] bg-secondary-blue mt-[1.5vw] mobile:mt-[3vw]`}
	// 		/>
	// 		<div>
	// 			<div
	// 				className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${onePageIsOpen ? '' : 'max-h-0'
	// 					}`}
	// 			>
	// 				<div className="py-8 sm:px-10 mobile:py-0">
	// 					<CheckoutPage isProductPage={true} />
	// 				</div>
	// 			</div>
	// 		</div>
	// 		{onePageIsOpen && (
	// 			<div className="w-[93%] m-auto h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
	// 		)}
	// 	</div>
	// )
	return (
		<div className="relative overflow-hidden">

			{/* ── DESKTOP/TABLET: layout original ─────────────────────────── */}
			<div className="mobile:hidden">
				<div className="mt-[1.5vw] ml-10 flex justify-center">
					<div className="flex flex-col justify-center items-center font-tertiary-font">
						<div className="relative flex items-center">
							<p id="product-page-price" className="text-[32px] xl:text-[2.5vw] lg:text-[2.8vw] md:text-[3.2vw] sm:text-[3.5vw] text-primary-blue font-semibold">
								{price}€
							</p>
						</div>
						<p className="mt-[-1.3rem] font-semibold text-dark-grey xl:text-[1vw] md:text-[1.2vw] sm:text-[1.7vw]">
							{shippingInfo}
						</p>
						<div className="mt-4 flex justify-center w-full scalapay-widget-mobile-container">
							<ScalapayWidget amountSelector="#product-page-price" type="product" />
						</div>
						<div className="text-custom-orange gap-3 flex items-center">
							<Image src={warningImgSrc} alt="warning" width={20} height={20} className="sm:w-[15px] md:w-[12px] lg:w-[15px]" />
							<p className="xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw]">
								Precio medio pieza original nueva:
								<span className="font-extrabold line-through"> {originalPrice}€ </span>
							</p>
							<p className="xl:text-[1vw] md:text-[1.3vw] sm:text-[1.4vw] bg-custom-orange text-custom-white rounded-2xl px-1 flex items-center">
								{"-"}{discount}
							</p>
						</div>
						{!onePageIsOpen && (
							<div>
								{user ? (
									<div className="flex gap-7 mt-7">
										{data.stock === false || globalStock === false ? (
											<Button labelName="Producto no disponible" type="secondary" bg="bg-alter-grey" borderColor="border-alter-grey" hoverBg="hover:bg-alter-grey" hoverText="white" cursor="cursor-not-allowed" />
										) : (
											<>
												{existingItem ? (
													<Button labelName="Quitar de la cesta" type="secondary" bg="bg-secondary-blue" borderColor="border-secondary-blue" hoverBg="hover:bg-custom-white" hoverText="hover:text-secondary-blue" cursor="cursor-pointer" onClick={handleRemoveFromCart} />
												) : (
													<>
														{isProccesingAddToCart ? (
															<div className="flex justify-start my-4">
																<div className="w-8 h-8 border-4 border-secondary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
															</div>
														) : isProccesingBuyNow ? (
															<div className="flex justify-center my-4">
																<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
															</div>
														) : (
															<>
																<Button {...button1Props} onClick={handleAddToCart} />
																<Button {...button2Props} onClick={buynow} />
															</>
														)}
													</>
												)}
											</>
										)}
									</div>
								) : (
									<div className="flex justify-center my-4">
										<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ── MOBILE: nuevo diseño ─────────────────────────────────────── */}
			<div className="hidden mobile:block px-[2vw] pt-[1.2vw] pb-[4vw] font-tertiary-font">

				{/* Fila envío con camión */}
				<div className="flex justify-center gap-[2.5vw] mb-[1vw] px-[1vw]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20" height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#12B1BB"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="flex-shrink-0"
					>
						<rect x="1" y="3" width="15" height="13" rx="1" />
						<path d="M16 8h4l3 5v3h-7V8z" />
						<circle cx="5.5" cy="18.5" r="2.5" />
						<circle cx="18.5" cy="18.5" r="2.5" />
					</svg>
					<p className="text-[3.2vw] text-dark-grey">
						<span className="font-bold text-secondary-blue">Envío incluido</span>
						{' '}(24/72h)
						{/* {' '}<span className="text-dark-grey">| 2 años de garantía</span> */}
					</p>
				</div>

				{/* Precio total */}
				<div className="flex justify-center text-center mb-[1vw] gap-3">
					<p
						id="product-page-price"
						className="text-[8vw] text-primary-blue font-bold leading-none"
					>
						Total {price}€
					</p>
					<p className="text-[3.2vw] text-dark-grey font-semibold mt-[2.5vw]">
						(IVA incluido)
					</p>
				</div>

				{/* Scalapay + PayPal — card blanca */}
				<div className="mb-[2vw] px-[1vw]">
					<div className="flex items-center gap-[3vw] bg-white rounded-2xl px-[4vw] py-[2.5vw] shadow-sm">
						{/* Logo Scalapay */}
						<Image 
							src="/scalapay3.png" 
							alt="scalapay" 
							width={60} 
							height={20}
							className="flex-shrink-0 object-contain"
						/>

						{/* Logo PayPal */}
						<Image
							src="/PayPalp.svg"
							alt="paypal"
							width={60}
							height={16}
							className="flex-shrink-0 object-contain"
						/>

						{/* Texto cuota */}
						<p className="text-[2.5vw] text-dark-grey font-tertiary-font leading-snug">
							Paga en 3 o 4* plazos de{' '}
							<span className="font-bold">
								{(parseFloat(price) / 4).toFixed(2)}€
							</span>
						</p>
					</div>
				</div>

				{/* Precio medio original */}
				{/* {originalPrice > 0 && discount && (
					<div className="flex items-center justify-center gap-[2vw] mb-[4vw]">
						<Image src={warningImgSrc} alt="warning" width={14} height={14} className="flex-shrink-0" />
						<p className="text-[3vw] text-custom-orange">
							Precio medio pieza original nueva:{' '}
							<span className="font-extrabold line-through">{originalPrice}€</span>
						</p>
						<span className="text-[3vw] bg-custom-orange text-custom-white rounded-2xl px-[2vw] py-[0.5vw]">
							-{discount}
						</span>
					</div>
				)} */}

				{/* Botones CTA */}
				{!onePageIsOpen && (
					<>
						{user ? (
							<>
								{data.stock === false || globalStock === false ? (
									<button
										disabled
										className="w-full py-[3.5vw] rounded-3xl bg-alter-grey text-custom-white font-bold text-[4vw] cursor-not-allowed"
									>
										Producto no disponible
									</button>
								) : existingItem ? (
									<button
										onClick={handleRemoveFromCart}
										className="w-full py-[3.5vw] rounded-3xl border-2 border-secondary-blue bg-secondary-blue text-custom-white font-bold text-[4vw]"
									>
										Quitar del carrito
									</button>
								) : isProccesingAddToCart || isProccesingBuyNow ? (
									<div className="flex justify-center my-4">
										<div className="w-8 h-8 border-4 border-secondary-blue border-t-transparent border-solid rounded-full animate-spin"></div>
									</div>
								) : (
									<div className="flex gap-[3vw]">
										<button
											onClick={handleAddToCart}
											className="flex-1 py-[1.8vw] rounded-3xl border-2 border-secondary-blue bg-secondary-blue text-custom-white font-bold text-[3.8vw] hover:bg-white hover:text-secondary-blue transition-colors"
										>
											Añadir al carrito
										</button>
										<button
											onClick={buynow}
											className="flex-1 py-[1.8vw] rounded-3xl border-2 border-custom-orange bg-custom-orange text-white font-bold text-[3.8vw] hover:opacity-90 transition-opacity"
										>
											Comprar ahora
										</button>
									</div>
								)}
							</>
						) : (
							<div className="flex justify-center my-4">
								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
							</div>
						)}
					</>
				)}
			</div>

			{/* Separador y checkout (compartido ambos) */}
			{/* <div className={`w-[93%] m-auto h-[2px] bg-secondary-blue mt-[1.5vw] mobile:mt-[3vw]`} /> */}
			<div>
				<div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${onePageIsOpen ? '' : 'max-h-0'}`}>
					<div className="py-8 sm:px-10 mobile:py-0">
						<CheckoutPage isProductPage={true} />
					</div>
				</div>
			</div>
			{onePageIsOpen && (
				<div className="w-[93%] m-auto h-[2px] bg-secondary-blue mb-6 mt-[1.5vw] mobile:mt-[3vw]" />
			)}
		</div>
	)
}

export default ProductPrice
