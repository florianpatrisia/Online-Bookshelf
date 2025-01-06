import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import {
    createPaymentIntentService,
    getPaymentByUserIdService,
    stripePaymentCompleteService,
} from '../services/paymentApi.ts'
import { PaymentInfoRequest } from '../models/PaymentInfoRequest.ts'
import { useAuthContext } from './AuthContext.tsx'
import { AxiosResponse } from 'axios'

export interface PaymentContextProps {
    createPaymentIntent: (
        paymentInfoRequest: PaymentInfoRequest
    ) => Promise<AxiosResponse>
    completePayment: () => Promise<void>
    fees: number
    error: string | null
    succeeded: boolean | null
    submitDisabled: boolean
    setSubmitDisabled: (value: boolean) => void
}

const PaymentContext = createContext<PaymentContextProps | undefined>(undefined)

export const usePaymentContext = (): PaymentContextProps => {
    const context = useContext(PaymentContext)
    if (!context) {
        throw new Error(
            'usePaymentContext must be used within a PaymentProvider'
        )
    }
    return context
}

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { user } = useAuthContext()
    const [fees, setFees] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const [succeeded, setSucceeded] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        const loadFees = async () => {
            try {
                const paymentResponse = await getPaymentByUserIdService(
                    user?.userId as number
                )
                setFees(paymentResponse.data.amount)
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? 'Failed to load fees. Please try again later.'
                        : 'An unexpected error occurred.'
                setError(errorMessage)
            }
        }
        loadFees()
    }, [user])

    const createPaymentIntent = async (
        paymentInfoRequest: PaymentInfoRequest
    ): Promise<AxiosResponse> => {
        const stripeResponse =
            await createPaymentIntentService(paymentInfoRequest)
        if (stripeResponse.status !== 200) {
            throw new Error('Something went wrong!')
        }
        return stripeResponse
    }

    const completePayment = async (): Promise<void> => {
        const stripeResponse = await stripePaymentCompleteService()
        if (stripeResponse.status !== 200) {
            throw new Error('Something went wrong!')
        }
        setFees(0)
        setSucceeded(true)
        setSubmitDisabled(false)
    }

    return (
        <PaymentContext.Provider
            value={{
                createPaymentIntent,
                completePayment,
                fees,
                error,
                succeeded,
                submitDisabled,
                setSubmitDisabled,
            }}
        >
            {children}
        </PaymentContext.Provider>
    )
}
