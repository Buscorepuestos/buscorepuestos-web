'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../../../app/redux/features/shoppingCartSlice'
import { useStripe } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import { createBill } from '../../../services/billing/billing.service'
import Swal from 'sweetalert2'
import { Suspense } from 'react'

const PaymentSuccessContent = () => {
    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <PaymentSuccess />
      </Suspense>
    );
  };

const PaymentSuccess = () => {

    const stripe = useStripe()
	const router = useRouter()
	const dispatch = useDispatch()
    const searchParams = useSearchParams()

	useEffect(() => {
        const payment_intent_id = searchParams.get('payment_intent')
        const client_secret = searchParams.get('payment_intent_client_secret')

		const getPaymentIntent = async (paymentIntentId: string) => {
			if (!stripe || !paymentIntentId) {
				return null
			}

			try {
				const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentId)
				return paymentIntent
			} catch (error) {
				console.error('Error retrieving payment intent:', error)
				return null
			}
		}

		const verifyPayment = async () => {

			if (!payment_intent_id) {
				return
			}

			const paymentIntent = client_secret ? await getPaymentIntent(client_secret) : null
            
            if(paymentIntent) {
                if (paymentIntent?.status === 'succeeded') {

                    const billingData = localStorage.getItem('billingData')
                    
                    if (billingData) {
                        try {
                            const parsedBillingData = JSON.parse(billingData)

                            await createBill(parsedBillingData)
                            dispatch(clearCart())
                            localStorage.removeItem('billingData')

                            //se muestra un mensaje de confirmacion y cuando el usuario da click en aceptar se redirige a la pagina principal
                            Swal.fire({
                                title: 'Pago exitoso',
                                text: 'Tu pago ha sido procesado exitosamente',
                                icon: 'success',
                                confirmButtonText: 'Aceptar'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    router.push('/')
                                }
                            })
                        } catch (error) {
                            console.error('Error parsing or processing billing data:', error)
                        }
                    } else {
                        console.error('No billing data found in localStorage')
                    }
                } else {
                    // Si el pago no se ha procesado correctamente, se muestra un mensaje de error y se redirige a la pagina principal
                    Swal.fire({
                        title: 'Error en el pago',
                        text: 'Ha ocurrido un error al procesar tu pago',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.push('/')
                        }
                    })
                }
            }
		}

		verifyPayment()
	}, [dispatch, router, searchParams, stripe])

	return <div> <h1>Procesando pago...</h1> </div>
}

export default PaymentSuccessContent
