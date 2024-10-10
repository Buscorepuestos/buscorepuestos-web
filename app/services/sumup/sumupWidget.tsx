// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { FormsFields } from '../../verificacion-pago/page';
// import { updatePurchase } from '../../services/purchase/purchase';
// import { createBill } from '../../services/billing/billing.service';
// import { useDispatch } from 'react-redux'
// import { clearCart } from '../../redux/features/shoppingCartSlice'
// import Swal from 'sweetalert2';

// interface PaymentWidgetProps {
//   checkoutId: string;
//   purchaseIds: string[];
//   fieldsValue: FormsFields;
// }

// declare global {
//   interface Window {
//     SumUpCard?: {
//       mount: (config: {
//         id: string;
//         checkoutId: string;
//         locale?: string;
//         onResponse: (type: string, body: any) => void;
//         showSubmitButton?: boolean;
//       }) => void;
//     };
//   }
// }

// const PaymentWidget: React.FC<PaymentWidgetProps> = ({ checkoutId, purchaseIds, fieldsValue }) => {
//   const router = useRouter();
//   const dispatch = useDispatch()
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [isWidgetMounted, setIsWidgetMounted] = useState(false);

//   let userId: string | null = null;
//   if (typeof window !== 'undefined') {
//     userId = localStorage.getItem('airtableUserId');
//   }

//   // Function to check form validity
//   useEffect(() => {
//     const isFieldsComplete =
//       fieldsValue.shippingAddress &&
//       fieldsValue.country &&
//       fieldsValue.city &&
//       fieldsValue.addressExtra &&
//       fieldsValue.name &&
//       fieldsValue.zip &&
//       fieldsValue.nif &&
//       fieldsValue.phoneNumber &&
//       fieldsValue.province &&
//       fieldsValue.email;

//     setIsFormValid(!!isFieldsComplete);
//   }, [fieldsValue]);

//   // Effect to load SumUp widget when the form is valid
//   useEffect(() => {
//     if (checkoutId && isFormValid) {
//       setIsWidgetMounted(true);
//     }
//     if (isWidgetMounted) {
//       const script = document.createElement('script');
//       script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js';
//       script.async = true;
//       document.body.appendChild(script);

//       script.onload = () => {
//         if (window.SumUpCard) {
//           window.SumUpCard.mount({
//             id: 'sumup-card',
//             checkoutId,
//             showSubmitButton: true,
//             locale: 'es-ES',
//             onResponse: async (type, body) => {
//               if (type === 'success') {
//                 await createBill({
//                   Compras: purchaseIds,
//                   Usuarios: [userId!],
//                   transfer: false,
//                   address: fieldsValue.shippingAddress,
//                   country: fieldsValue.country,
//                   location: fieldsValue.city,
//                   addressNumber: fieldsValue.addressExtra,
//                   name: fieldsValue.name,
//                   cp: fieldsValue.zip,
//                   nif: fieldsValue.nif,
//                   phone: Number(fieldsValue.phoneNumber),
//                   province: fieldsValue.province,
//                 });
//                 purchaseIds.forEach(async (purchaseId) => {
//                   await updatePurchase(purchaseId);
//                 });
//                 dispatch(clearCart())
//                 Swal.fire({
//                   title: 'Pago exitoso',
//                   text: 'El pago se ha realizado con éxito.',
//                   icon: 'success',
//                   confirmButtonText: 'Aceptar',
//                 });
//                 router.push('/tienda');
//               } else if (type === 'error') {
//                 Swal.fire({
//                   title: 'Error',
//                   text: 'Ha ocurrido un error al procesar el pago.',
//                   icon: 'error',
//                   confirmButtonText: 'Aceptar',
//                 });
//                 router.push('/verificacion-pago');
//               }
//             },
//           });
//         }
//       };

//       return () => {
//         document.body.removeChild(script);
//       };
//     }
//   }, [checkoutId, isFormValid, router, purchaseIds, fieldsValue, userId, isWidgetMounted, dispatch]);

//   return <div>{isWidgetMounted && <div id="sumup-card"></div>}</div>;
// };

// export default PaymentWidget;

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormsFields } from '../../verificacion-pago/page'
import { updatePurchase } from '../../services/purchase/purchase'
import { createBill } from '../../services/billing/billing.service'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../redux/features/shoppingCartSlice'
import Swal from 'sweetalert2'

interface PaymentWidgetProps {
	checkoutId: string
	purchaseIds: string[]
	fieldsValue: FormsFields
}

declare global {
	interface Window {
		SumUpCard?: {
			mount: (config: {
				id: string
				checkoutId: string
				locale?: string
				onResponse: (type: string, body: any) => void
				showSubmitButton?: boolean
			}) => void
		}
	}
}

const PaymentWidget: React.FC<PaymentWidgetProps> = ({
	checkoutId,
	purchaseIds,
	fieldsValue,
}) => {
	const router = useRouter()
	const dispatch = useDispatch()
	const [isFormValid, setIsFormValid] = useState(false)
	const [isWidgetMounted, setIsWidgetMounted] = useState(false)
	const [missingFieldMessage, setMissingFieldMessage] = useState('')

	let userId: string | null = null
	if (typeof window !== 'undefined') {
		userId = localStorage.getItem('airtableUserId')
	}

	// Function to check form validity and missing fields
	useEffect(() => {
		const fields = fieldsValue
		let missingField = ''

		if (!fields.shippingAddress)
			missingField = 'Por favor, ingresa tu dirección.'
		else if (!fields.country)
			missingField = 'Por favor, selecciona tu país.'
		else if (!fields.city) missingField = 'Por favor, ingresa tu ciudad.'
		else if (!fields.addressExtra)
			missingField = 'Por favor, ingresa el número de tu dirección.'
		else if (!fields.name)
			missingField = 'Por favor, ingresa tu nombre completo.'
		else if (!fields.zip)
			missingField = 'Por favor, ingresa tu código postal.'
		else if (!fields.nif)
			missingField = 'Por favor, ingresa tu NIF o identificación fiscal.'
		else if (!fields.phoneNumber)
			missingField = 'Por favor, ingresa tu número de teléfono.'
		else if (!fields.province)
			missingField = 'Por favor, selecciona tu provincia.'
		else if (!fields.email)
			missingField = 'Por favor, ingresa tu correo electrónico.'

		setMissingFieldMessage(missingField)
		setIsFormValid(!missingField)
	}, [fieldsValue])

	const createbilling = async () => {
		const billingData = {
			Compras: purchaseIds,
			Usuarios: [userId!],
			transfer: false,
			address: fieldsValue.shippingAddress,
			country: fieldsValue.country,
			location: fieldsValue.city,
			addressNumber: fieldsValue.addressExtra,
			name: fieldsValue.name,
			cp: fieldsValue.zip,
			nif: fieldsValue.nif,
			phone: Number(fieldsValue.phoneNumber),
			province: fieldsValue.province,
		}

		const extraData = {
			email: fieldsValue.email,
			billingAddress: fieldsValue.billingAddress,
			billingAddressExtra: fieldsValue.billingAddressExtra,
			billingProvince: fieldsValue.billingProvince,
			billingZip: fieldsValue.billingZip,
		}

		try {
			const storedBillingData = localStorage.getItem('billingData')
			const storedEmailData = localStorage.getItem('extraData')
			const cart = localStorage.getItem('cart')
			if (cart) {
				const copyCartExist = localStorage.getItem('copyCart')
				if (copyCartExist) {
					localStorage.removeItem('copyCart')
				}
				const copyCart = JSON.parse(cart)
				localStorage.setItem('copyCart', JSON.stringify(copyCart))
			}
			if (storedBillingData) {
				localStorage.removeItem('billingData')
			}
			if (storedEmailData) {
				localStorage.removeItem('extraData')
			}
			localStorage.setItem('billingData', JSON.stringify(billingData))
			localStorage.setItem('extraData', JSON.stringify(extraData))
		} catch (error) {
			console.error('Error saving billing data to localStorage:', error)
		}
	}

	// Effect to load SumUp widget when the form is valid
	useEffect(() => {
		if (checkoutId && isFormValid) {
			setIsWidgetMounted(true)
		}

		if (isWidgetMounted) {
			const script = document.createElement('script')
			script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'
			script.async = true
			document.body.appendChild(script)

			script.onload = () => {
				if (window.SumUpCard) {
					window.SumUpCard.mount({
						id: 'sumup-card',
						checkoutId,
						showSubmitButton: true,
						locale: 'es-ES',
						onResponse: async (type, body) => {
							if (type === 'success') {
								await createBill({
									Compras: purchaseIds,
									Usuarios: [userId!],
									transfer: false,
									address: fieldsValue.shippingAddress,
									country: fieldsValue.country,
									location: fieldsValue.city,
									addressNumber: fieldsValue.addressExtra,
									name: fieldsValue.name,
									cp: fieldsValue.zip,
									nif: fieldsValue.nif,
									phone: Number(fieldsValue.phoneNumber),
									province: fieldsValue.province,
								})
								purchaseIds.forEach(async (purchaseId) => {
									await updatePurchase(purchaseId)
								})
								await createbilling()
								dispatch(clearCart())
								router.push('/pago-exitoso?pagoSumup=true')
							} else if (type === 'error') {
								Swal.fire({
									title: 'Error',
									text: 'Ha ocurrido un error al procesar el pago.',
									icon: 'error',
									confirmButtonText: 'Aceptar',
								})
								setTimeout(() => {
									router.push('/verificacion-pago')
								}, 2000)
							}
						},
					})
				}
			}

			return () => {
				document.body.removeChild(script)
			}
		}
		// eslint-disable-next-line
	}, [
		checkoutId,
		isFormValid,
		router,
		purchaseIds,
		fieldsValue,
		userId,
		isWidgetMounted,
		dispatch,
	])

	return (
		<div>
			{isWidgetMounted && <div id="sumup-card"></div>}
			{!isFormValid && missingFieldMessage && (
				<p style={{ color: 'red', marginTop: '10px' }}>
					{missingFieldMessage}
				</p>
			)}
		</div>
	)
}

export default PaymentWidget
