import { useNavigate } from 'react-router-dom'
import { Book } from '../models/Book.ts'
import { API_BASE_URL, axiosInstance } from './authApi.ts'
import { AxiosResponse } from 'axios'

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
    const response = await axiosInstance.post('/api/books/admin', book)
    return handleAxiosResponse(response)
}

export const updateBookService = async (
    id: string,
    book: FormData
): Promise<Book> => {
    const response = await axiosInstance.put(`/api/books/admin/${id}`, book)
    return handleAxiosResponse(response)
}

export const deleteBookService = async (id: string): Promise<void> => {
    const response = await axiosInstance.delete(`/api/books/admin/${id}`)
    await handleAxiosResponse(response)
}

export const useFetchBooks = () => {
    const navigate = useNavigate()

    const fetchBooksByCategory = async (category: string) => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/pageTurner')
            return
        }

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }

        const response = await fetch(
            `http://localhost:8080/api/books/filter/category?category=${category}`,
            {
                method: 'GET',
                headers,
            }
        )

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token')
                navigate('/pageTurner')
                return
            }
            throw new Error(`Failed to fetch books: ${response.status}`)
        }

        return response.json()
    }

    return { fetchBooksByCategory }
}
