import { AxiosResponse } from 'axios'
import { axiosInstance } from './authApi'
import { CurrentLoansResponse } from '../models/CurrentLoansResponse'
import { Book } from '../models/Book'

const handleAxiosResponse = (response: AxiosResponse) => {
    if (response.status < 200 || response.status >= 300) {
        console.log('here', response.data)
        throw new Error(
            `HTTP Error: ${response.status} ${response.statusText} - ${JSON.stringify(response.data)}`
        )
    }
    if (response.headers['content-type']?.includes('application/json')) {
        return response.data
    } else {
        return response.data
    }
}

export const fetchCurrentLoansService = async (): Promise<
    CurrentLoansResponse[]
> => {
    const response = await axiosInstance.get('/api/book-loans/current-loans')
    return handleAxiosResponse(response)
}

export const fetchCurrentLoansCountService = async (): Promise<number> => {
    const response = await axiosInstance.get(
        '/api/book-loans/current-loans-count'
    )
    return handleAxiosResponse(response)
}

export const loanBookService = async (bookId: number): Promise<Book> => {
    const response = await axiosInstance.put(`/api/book-loans/loan/${bookId}`)
    console.log('here', response.data)
    return handleAxiosResponse(response)
}

export const isBookLoanedByUserService = async (
    bookId: number
): Promise<boolean> => {
    const response = await axiosInstance.get(
        `/api/book-loans/is-loaned-by-user`,
        {
            params: { bookId },
        }
    )
    return handleAxiosResponse(response)
}

export const returnBookService = async (bookId: number): Promise<void> => {
    const response = await axiosInstance.put(`/api/book-loans/return`, null, {
        params: { bookId },
    })
    await handleAxiosResponse(response)
}

export const renewLoanService = async (bookId: number): Promise<void> => {
    const response = await axiosInstance.put(
        '/api/book-loans/renew-loan',
        null,
        {
            params: { bookId },
        }
    )
    await handleAxiosResponse(response)
}
