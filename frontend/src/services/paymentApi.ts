import { AxiosResponse } from 'axios'
import { axiosInstance } from './authApi'
import { PaymentInfoRequest } from '../models/PaymentInfoRequest'

// const handleAxiosResponse = (response: AxiosResponse) => {
//     if (response.status < 200 || response.status >= 300) {
//         throw new Error(
//             `HTTP Error: ${response.status} ${response.statusText} - ${JSON.stringify(response.data)}`
//         )
//     }
//     if (response.headers['content-type']?.includes('application/json')) {
//         return response.data
//     } else {
//         return response.data
//     }
// }

export const createPaymentIntentService = async (
    paymentInfoRequest: PaymentInfoRequest
): Promise<AxiosResponse> => {
    return await axiosInstance.post(
        '/api/payment/payment-intent',
        paymentInfoRequest
    )
}

export const stripePaymentCompleteService =
    async (): Promise<AxiosResponse> => {
        return await axiosInstance.put('/api/payment/payment-complete')
    }

export const getPaymentByUserIdService = async (
    userId: number
): Promise<AxiosResponse> => {
    return await axiosInstance.get('/api/payment/find-by-user-id', {
        params: { userId },
    })
}
