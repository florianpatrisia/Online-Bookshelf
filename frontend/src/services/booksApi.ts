import { Book } from '../models/Book.ts'
import { API_BASE_URL, axiosInstance } from './authApi.ts'

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
            `HTTP Error: ${response.status} ${response.statusText} - ${errorText}`
        )
    }
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
        return response.json()
    } else {
        return await response.text()
    }
}

// export const fetchBookById = async (id: string): Promise<Book> => {
//     const response = await axiosInstance.get(`/api/books/${id}`)
//     return handleResponse(response.data)
// }
//
// export const fetchBooks = async (): Promise<Book[]> => {
//     const response = await axiosInstance.get('/api/books')
//     return handleResponse(response.data)
// }

// fetch books doesn't require token
export const fetchBookById = async (id: string): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`)
    return handleResponse(response)
}

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/api/books`)
    return handleResponse(response)
}

export const addBookService = async (book: FormData): Promise<Book> => {
    console.log(axiosInstance)
    const response = await axiosInstance.post('/api/books/admin', book)
    return handleResponse(response.data)
}

export const updateBookService = async (
    id: string,
    book: FormData
): Promise<Book> => {
    const response = await axiosInstance.put(`/api/books/admin/${id}`, book)
    return handleResponse(response.data)
}

export const deleteBookService = async (id: string): Promise<void> => {
    const response = await axiosInstance.delete(`/api/books/admin/${id}`)
    await handleResponse(response.data)
}
