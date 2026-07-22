'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createScalapayOrder } from '../../../services/checkout/scalapay.service';
import ScalapayWidget from '../scalapayWidget/ScalapayWiget';
import TransferPayment from '../transferPayment/transferPayment';
import { FormsFields } from '../checkoutPage/CheckoutPage';
import { useAppDispatch } from '../../../redux/hooks';
import { savePurchaseAsync } from '../../../redux/features/shoppingCartSlice';
import Image from 'next/image';
import Swal from 'sweetalert2';
import api from '../../../api/api';

type PaymentMethod = 'caixa_card' | 'bizum' | 'transferencia' | 'stripe' | 'scalapay';
type DelayedProviderMethod = 'stripe' | 'scalapay';

const PaymentSelection = ({
	fieldsValue,
	numberPriceRounded,
	numberPrice,
	items,
	totalPrice,
	isSwitchOn,
	setFieldsValue,
	isProductPage,
	isPhoneValid,
	onPhoneValidationFail,
}: {
	purchaseIds: string[]
	fieldsValue: FormsFields
	numberPriceRounded: number
	numberPrice: number
	setIsScrolledInputs: React.Dispatch<
		React.SetStateAction<{
			name: boolean; email: boolean; nif: boolean; phoneNumber: boolean;
			shippingAddress: boolean; addressExtra: boolean; zip: boolean;
			city: boolean; province: boolean; country: boolean;
		}>
	>
	isScrolledInputs: {
		name: boolean; email: boolean; nif: boolean; phoneNumber: boolean;
		shippingAddress: boolean; addressExtra: boolean; zip: boolean;
		city: boolean; province: boolean; country: boolean;
	}
	items: any[]
	totalPrice: string
	isSwitchOn: boolean
	setFieldsValue: React.Dispatch<React.SetStateAction<FormsFields>>
	isProductPage: boolean
	isPhoneValid: boolean
	onPhoneValidationFail: () => void
}) => {
	const dispatch = useAppDispatch();
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [isFormValid, setIsFormValid] = useState(false)
	const [isCartReady, setIsCartReady] = useState(false);
	const paymentDetailRef = useRef<HTMLDivElement>(null);

	const userId = typeof window !== 'undefined' ? localStorage.getItem('airtableUserId') : null

	const { purchaseIds, isReady, hasError } = useMemo(() => {
		const ids = items.map(item => item.purchaseId).filter(Boolean) as string[];
		const allSaved = items.length > 0 && items.every(item => item.saveStatus === 'saved');
		// Detectamos si algún item falló
		const anyError = items.some(item => item.saveStatus === 'error');
		return { purchaseIds: ids, isReady: allSaved, hasError: anyError };
	}, [items]);

	// Actualizamos el estado local `isCartReady`
	useEffect(() => {
		setIsCartReady(isReady);
	}, [isReady])

	useEffect(() => {

		if (items.length > 0) {
			items.forEach(item => {
				// Si el item no tiene ID de compra y no se está guardando actualmente, reintentamos
				if (!item.purchaseId && item.saveStatus !== 'saved' && item.saveStatus !== 'saving') {
					console.log(`Reintentando sincronización para: ${item.title}`);
					const currentUserId = userId || localStorage.getItem('airtableUserId') || '';

					// Solo intentamos si tenemos usuario, si no, el authMiddleware debería encargarse
					if (currentUserId) {
						dispatch(savePurchaseAsync({
							product: { ...item } as any, // Cast necesario porque CartItem extiende ProductMongoInterface
							userId: currentUserId,
						}));
					}
				}
			});
		}
	}, [dispatch, items, userId]);

	useEffect(() => {

		const phoneDigits = fieldsValue.phoneNumber.replace(/\D/g, '');

		const isFieldsComplete =
			fieldsValue.shippingAddress && fieldsValue.country && fieldsValue.city &&
			fieldsValue.addressExtra && fieldsValue.name && fieldsValue.email &&
			fieldsValue.zip && fieldsValue.nif && fieldsValue.phoneNumber &&
			fieldsValue.province && phoneDigits.length >= 9;;

		setIsFormValid(!!isFieldsComplete);
	}, [fieldsValue]);

	useEffect(() => {
		if (!isFormValid) {
			setSelectedPaymentMethod(null);
		}
	}, [isFormValid]);

	const backToInputRefWhenError = () => {
		// Esta función se mantiene igual para guiar al usuario a campos vacíos.
	};

	const assistedOrigins = ['kommo', 'chatwoot'];
	const isAssisted = items.some(item => assistedOrigins.includes(item.origin));
	const isWebPurchase = !isAssisted;

	const prepareLocalStorageForRedirect = (paymentMethod: PaymentMethod) => {
		console.log(`Guardando datos del pedido en localStorage para ${paymentMethod}...`);

		const resolvedBillingAddress = isSwitchOn ? fieldsValue.shippingAddress : fieldsValue.billingAddress
		const resolvedBillingAddressExtra = isSwitchOn ? fieldsValue.addressExtra : fieldsValue.billingAddressExtra
		const resolvedBillingZip = isSwitchOn ? fieldsValue.zip : fieldsValue.billingZip
		const resolvedBillingProvince = isSwitchOn ? fieldsValue.province : fieldsValue.billingProvince

		const pendingOrder = {
			paymentMethod,
			matricula: fieldsValue.matricula,
			billingData: {
				Compras: purchaseIds,
				Usuarios: [userId!],
				transfer: paymentMethod === 'transferencia',
				address: fieldsValue.shippingAddress,
				country: fieldsValue.country,
				location: fieldsValue.city,
				addressNumber: fieldsValue.addressExtra,
				name: fieldsValue.name,
				cp: fieldsValue.zip,
				nif: fieldsValue.nif,
				phone: Number(fieldsValue.phoneNumber),
				province: fieldsValue.province,
			},
			extraData: {
				email: fieldsValue.email,
				billingAddress: resolvedBillingAddress,
				billingAddressExtra: resolvedBillingAddressExtra,
				billingProvince: resolvedBillingProvince,
				billingZip: resolvedBillingZip,
				isAssisted: isAssisted,
				isWebPurchase,
				isWeb: isWebPurchase,
				matricula: fieldsValue.matricula,
			},
			cart: JSON.parse(localStorage.getItem('cart') || JSON.stringify(items)),
		};

		localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
	};

	const validateCheckoutReady = () => {
		if (!isCartReady) {
			Swal.fire({
				icon: 'info',
				title: 'Un momento...',
				text: 'Estamos preparando tu carrito. Por favor, espera unos segundos.',
				timer: 2000,
				showConfirmButton: false,
			});
			return false;
		}

		if (!isFormValid) {
			backToInputRefWhenError();
			Swal.fire({
				icon: 'warning',
				title: 'Faltan datos',
				text: 'Por favor, completa todos los campos de envío antes de continuar.',
			});
			return false;
		}

		const phoneDigits = fieldsValue.phoneNumber.replace(/\D/g, '');
		if (phoneDigits.length < 9) {
			onPhoneValidationFail(); // hace scroll + foco al campo en CheckoutPage
			Swal.fire({
				icon: 'warning',
				title: 'Teléfono inválido',
				text: 'Por favor, introduce un número de teléfono válido (mínimo 9 dígitos).',
			});
			return false;
		}

		if (isSwitchOn) {
			setFieldsValue((prevState) => ({
				...prevState,
				billingAddress: fieldsValue.shippingAddress,
				billingAddressExtra: fieldsValue.addressExtra,
				billingZip: fieldsValue.zip,
				billingProvince: fieldsValue.province,
			}));
		}

		return true;
	};

	const submitRedirectForm = (html: string) => {
		const container = document.createElement('div');
		container.style.display = 'none';
		container.innerHTML = html;
		document.body.appendChild(container);
		const form = container.querySelector('form');

		if (!form) {
			document.body.removeChild(container);
			throw new Error('La respuesta del servidor no contenía un formulario de pago válido.');
		}

		form.submit();
	};

	const redirectToPaymentGateway = (data: any) => {
		const url = data?.url || data?.checkoutUrl || data?.redirectUrl || data?.paymentUrl;
		const html = data?.html || data?.formHtml || data?.redirectForm || data?.form;

		if (url) {
			window.location.href = url;
			return;
		}

		if (html) {
			submitRedirectForm(html);
			return;
		}

		throw new Error('No se recibió la URL o formulario de pago.');
	};

	const createPaymentPayload = (method: PaymentMethod) => ({
		method,
		items,
		userId,
		purchaseIds,
		fieldsValue,
		matricula: fieldsValue.matricula,
		isAssisted,
		isWebPurchase,
		isWeb: isWebPurchase,
	});

	const startRedsysPayment = async (method: 'caixa_card' | 'bizum') => {
		setSelectedPaymentMethod(method);
		prepareLocalStorageForRedirect(method);
		setIsProcessing(true);

		try {
			const response = await api.post('/payments', createPaymentPayload(method));
			redirectToPaymentGateway(response.data);
		} catch (error: any) {
			console.error(`Error al iniciar el pago con ${method}:`, error);
			Swal.fire('Error', error.response?.data?.message || 'No se pudo iniciar el pago. Inténtalo de nuevo.', 'error');
			setIsProcessing(false);
		}
	};

	const startStripePayment = async () => {
		setSelectedPaymentMethod('stripe');
		prepareLocalStorageForRedirect('stripe');
		setIsProcessing(true);

		try {
			const response = await api.post('/stripe/create-checkout-session', {
				items,
				userId,
				purchaseIds,
				fieldsValue,
				matricula: fieldsValue.matricula,
				isAssisted: isAssisted,
				isWebPurchase,
				isWeb: isWebPurchase,
			});

			redirectToPaymentGateway(response.data);
		} catch (error: any) {
			console.error("Error al crear la sesión de checkout de Stripe:", error);
			Swal.fire('Error', error.response?.data?.message || 'No se pudo iniciar el pago. Inténtalo de nuevo.', 'error');
			setIsProcessing(false);
		}
	};

	const showProviderDelayModal = async (method: DelayedProviderMethod) => {
		const result = await Swal.fire({
			icon: 'warning',
			title: 'Aviso sobre este método de pago',
			text: 'Si selecciona este método de pago, la compra podría sufrir retrasos entre 3-5 días por procedimientos de validaciones internas del proveedor de pago.',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			cancelButtonText: 'Pagar con tarjeta',
			confirmButtonColor: '#1D4ED8',
			cancelButtonColor: '#111827',
			reverseButtons: true,
		});

		if (result.isConfirmed) {
			if (method === 'stripe') {
				await startStripePayment();
				return;
			}

			setSelectedPaymentMethod('scalapay');
			setTimeout(() => {
				paymentDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 200);
			return;
		}

		if (result.dismiss === Swal.DismissReason.cancel) {
			await startRedsysPayment('caixa_card');
		}
	};

	const handlePaymentSelection = async (method: PaymentMethod) => {
		if (!validateCheckoutReady()) {
			return;
		}

		if (method === 'transferencia') {
			setSelectedPaymentMethod(method);
			setTimeout(() => {
				paymentDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 200);
			return;
		}

		if (method === 'caixa_card' || method === 'bizum') {
			await startRedsysPayment(method);
			return;
		}

		await showProviderDelayModal(method);
	};

	const handleScalapayPayment = async () => {
		setIsProcessing(true);
		prepareLocalStorageForRedirect('scalapay');

		try {
			// No guardamos en localStorage aquí, el backend se encarga de todo.
			const response = await createScalapayOrder({
				purchaseIds,
				userId: userId!,
				fieldsValue, // <-- Pasamos el objeto completo del formulario
				matricula: fieldsValue.matricula,
				items, // <-- Pasamos los items para calcular el total en el backend
				isAssisted: isAssisted,
				isWebPurchase,
				isWeb: isWebPurchase,
			});

			if (response.checkoutUrl) {
				window.location.href = response.checkoutUrl;
			} else {
				throw new Error('La respuesta del servidor no contenía una URL de checkout.');
			}
		} catch (error: any) {
			console.error('Error al preparar el pago con Scalapay:', error);
			Swal.fire('Error', error.message || 'No se pudo iniciar el pago con Scalapay.', 'error');
			setIsProcessing(false);
		}
	};

	const renderPaymentOptions = (enabledForm: boolean, enabledCart: boolean) => {
		const getButtonStyle = (method: string) => {
			if (!enabledForm || !enabledCart) {
				return 'bg-light-grey text-alter-grey border-light-grey cursor-not-allowed';
			}

			// Si está seleccionado, aplicamos el fondo azul directamente y quitamos el bg-white
			if (selectedPaymentMethod === method) {
				return 'bg-secondary-blue text-white border-secondary-blue';
			}

			// Si no está seleccionado pero está habilitado
			return 'bg-white text-secondary-blue border-secondary-blue hover:bg-secondary-blue hover:text-white';
		};

		const iconSrc = (method: string, defaultSrc: string, selectedSrc: string) => selectedPaymentMethod === method ? selectedSrc : defaultSrc;
		const isButtonBusy = (method: PaymentMethod) => isProcessing && selectedPaymentMethod === method;
		const baseButtonClass = `w-full flex ${isProductPage ? 'sm:flex-col min-h-[104px] px-5 py-3 text-[15px]' : 'px-4 py-3 xl:text-[0.8vw] lg:text-[1.1vw] md:text-[1.4vw] sm:text-[1.8vw]'} gap-3 items-center justify-center border-[1px] rounded-xl transition-all duration-300 mobile:text-[3vw]`;
		const paymentGridClass = isProductPage
			? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-6 gap-4'
			: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 mb-6 gap-3';

		return (
			<div>
				{!isCartReady && items.length > 0 && !hasError && (
					<div className="flex justify-center items-center my-4 p-2 bg-yellow-100 border border-yellow-300 rounded-md">
						<div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent border-solid rounded-full animate-spin"></div>
						<p className="ml-3 text-sm text-yellow-800">Sincronizando carrito...</p>
					</div>
				)}
				{hasError && (
					<div className="flex flex-col justify-center items-center my-4 p-2 bg-red-100 border border-red-300 rounded-md">
						<p className="text-sm text-red-800 font-bold">Hubo un error sincronizando tu carrito.</p>
						<button
							onClick={() => window.location.reload()}
							className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700"
						>
							Reintentar
						</button>
					</div>
				)}
				<div className={paymentGridClass}>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('caixa_card')}
						disabled={!enabledForm || !enabledCart || isProcessing}
						className={`${baseButtonClass} ${getButtonStyle('caixa_card')}`}
					>
						<Image src={iconSrc('caixa_card', '/tarjeta.svg', '/tarjeta-blanca.svg')} alt="tarjeta" width={46} height={46} className="w-12 h-12 rounded-md" />
						<span>{isButtonBusy('caixa_card') ? 'Conectando...' : 'Tarjeta Caixa'}</span>
					</button>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('bizum')}
						disabled={!enabledForm || !enabledCart || isProcessing}
						className={`${baseButtonClass} ${getButtonStyle('bizum')}`}
					>
						<Image src="/bizum.svg" alt="bizum" width={64} height={32} className="h-10 w-auto rounded-md" />
						<span>{isButtonBusy('bizum') ? 'Conectando...' : 'Bizum'}</span>
					</button>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('transferencia')}
						disabled={!enabledForm || !enabledCart || isProcessing}
						className={`${baseButtonClass} ${getButtonStyle('transferencia')}`}
					>
						<Image src={iconSrc('transferencia', '/transferencia.svg', '/Transferencia-white.svg')} alt="transferencia" width={46} height={46} className="w-12 h-12 rounded-md" />
						<span>Transferencia</span>
					</button>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('stripe')}
						disabled={!enabledForm || !enabledCart || isProcessing}
						className={`${baseButtonClass} ${isProductPage ? 'sm:gap-4' : 'gap-5'} ${getButtonStyle('stripe')}`}
					>
						<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
							<Image src="/PayPal.svg" alt="paypal" width={56} height={28} className="h-8 w-auto rounded-md" />
							<Image src="/klarna.png" alt="klarna" width={56} height={56} className="w-9 h-9 rounded-md" />
						</div>
						<span>{isButtonBusy('stripe') ? 'Conectando...' : 'PayPal / Klarna'}</span>
					</button>
					<button
						onClick={() => enabledForm && enabledCart && handlePaymentSelection('scalapay')}
						disabled={!enabledForm || !enabledCart || isProcessing}
						className={`${baseButtonClass} ${getButtonStyle('scalapay')}`}
					>
						<Image src="/scalapay3.png" alt="scalapay" width={80} height={20} />
						<span>Paga en 3 o 4 plazos</span>
					</button>
				</div>
			</div>
		);
	};


	return (
		<div className={`${!isProductPage && 'w-full mx-auto p-4 bg-white shadow-lg rounded-lg'}`}>
			<div style={{ display: 'none' }}>
				<span id="checkout-total-price-for-widget">{totalPrice}</span>
			</div>

			{renderPaymentOptions(isFormValid, isCartReady)}

			{!isFormValid && (
				<p className="text-center text-sm text-red-500 my-4">
					*Para activar los métodos de pago, todos los campos de envío deben estar completos.
				</p>
			)}

			<div className="mt-8" ref={paymentDetailRef}>
				{selectedPaymentMethod === 'transferencia' && (
					<div className="flex justify-center">
						<TransferPayment
							totalPrice={totalPrice}
							purchaseIds={purchaseIds}
							fieldsValue={fieldsValue}
							isAssisted={isAssisted}
							onTransferPayment={() => prepareLocalStorageForRedirect('transferencia')}
							matricula={fieldsValue.matricula}
						/>
					</div>
				)}
				{/* {selectedPaymentMethod === 'stripe' ? (
					<div className="flex justify-center">
						{isProcessing ? (
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
						) : (
							<StripePaymentHandler
								purchaseIds={purchaseIds}
								fieldsValue={fieldsValue}
								items={items}
								userId={userId!}
							/>
						)}
					</div>
				) : null} */}
				{selectedPaymentMethod === 'scalapay' && (
					<div className="flex flex-col justify-center items-center">
						<ScalapayWidget amountSelector="#checkout-total-price-for-widget" type="checkout" />
						{!isProcessing ? (
							<button
								onClick={handleScalapayPayment}
								className="w-1/2 mt-4 bg-custom-black font-tertiary-font  text-custom-white font-bold py-3 px-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-secondary-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<p className='text-[1.8rem] mobile:text-[1.3rem]'>Pagar con Scalapay</p>
							</button>
						) : (
							<div className="w-full flex justify-center mt-4">
								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentSelection;
