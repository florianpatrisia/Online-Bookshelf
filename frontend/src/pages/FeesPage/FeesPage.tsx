import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { PaymentInfoRequest } from '../../models/PaymentInfoRequest'
import { useAuthContext } from '../../context/AuthContext.tsx'
import { PaymentIntentResult } from '@stripe/stripe-js'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './FeesPage.css'
import { usePaymentContext } from '../../context/PaymentContext.tsx'

export function FeesPage() {
    const { user } = useAuthContext()
    const {
        fees,
        succeeded,
        submitDisabled,
        setSubmitDisabled,
        createPaymentIntent,
        completePayment,
    } = usePaymentContext()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const elements = useElements()
    const stripe = useStripe()

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return
        }

        setSubmitDisabled(true)

        const paymentInfo: PaymentInfoRequest = {
            amount: Math.round(fees * 100),
            currency: 'USD',
            receiptEmail: user?.email || '',
        }

        try {
            const stripeResponse = await createPaymentIntent(paymentInfo)
            const stripeResponseJson = await stripeResponse.data

            stripe
                .confirmCardPayment(
                    stripeResponseJson.client_secret,
                    {
                        payment_method: {
                            card: elements.getElement(CardElement)!,
                            billing_details: {
                                email: user?.email,
                            },
                        },
                    },
                    { handleActions: false }
                )
                .then(async function (result: PaymentIntentResult) {
                    if (result.error) {
                        setSubmitDisabled(false)
                        alert('There was an error')
                    } else {
                        await completePayment()
                    }
                })
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Payment error.')
            }
        }
    }

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    if (error) {
        return <div className="loading">Error: {error}</div>
    }

    return (
        <>
            <MyNavbar />
            <div className="container mt-5">
                <h1 className="mb-4">My Fees</h1>
                <div className="row">
                    {succeeded && (
                        <div className="successful-payment">
                            Payment successful!
                        </div>
                    )}
                </div>
                {fees === 0 ? (
                    <div className="no-fees">You have no fees!</div>
                ) : (
                    <div className="card-container">
                        <div className="my-card mt-3">
                            <h5 className="card-header">
                                Fees pending:{' '}
                                <span className="fee">${fees}</span>
                            </h5>
                            <div className="card-body">
                                <h5 className="card-title mb-3">Credit Card</h5>
                                <CardElement id="card-element" />
                                <button
                                    disabled={submitDisabled}
                                    type="button"
                                    className="btn btn-primary mt-3"
                                    onClick={checkout}
                                >
                                    Pay fees
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {submitDisabled && <div className="loading">Loading...</div>}
            </div>
        </>
    )
}
