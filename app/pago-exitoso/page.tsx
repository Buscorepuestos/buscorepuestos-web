'use client'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentSuccess from '../core/components/checkout/paymentSuccess'
import { environment } from '../environment/environment'

const stripePromise = loadStripe(environment.stripe_publishable_key)

const PaymentSuccessPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentSuccess />
        </Elements>
    )
}

export default PaymentSuccessPage
