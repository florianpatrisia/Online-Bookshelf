import { AxiosResponse } from 'axios'
import { axiosInstance } from './authApi.ts'
import { FavoriteBook } from '../models/FavoriteBook.ts'

const handleAxiosResponse = (response: AxiosResponse) => {
    if (response.status < 200 || response.status >= 300) {
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

export const fetchFavoriteBooksByUserId = async (
    userId: number
): Promise<FavoriteBook[]> => {
    const response = await axiosInstance.get(
        `/api/favorite_books/user/${userId}`
    )
    return handleAxiosResponse(response)
}

export const addFavoriteBookService = async (
    userId: number,
    bookId: number
): Promise<FavoriteBook> => {
    const response = await axiosInstance.post('/api/favorite_books/add', {
        userId,
        bookId,
    })
    return handleAxiosResponse(response)
}

export const removeFavoriteBookService = async (
    userId: number,
    bookId: number
): Promise<void> => {
    const response = await axiosInstance.post('/api/favorite_books/remove', {
        userId,
        bookId,
    })
    await handleAxiosResponse(response)
}
