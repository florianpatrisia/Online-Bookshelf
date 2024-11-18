import { Book } from '../models/Book.ts'

export const API_BASE_URL = 'http://localhost:8080'

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

export const fetchBookById = async (id: string): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`)
    return handleResponse(response)
}

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/api/books`)
    return handleResponse(response)
}

export const addBookService = async (book: FormData): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: 'POST',
        body: book,
    })
    return handleResponse(response)
}

export const updateBookService = async (
    id: string,
    book: FormData
): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'PUT',
        body: book,
    })
    return handleResponse(response)
}

export const deleteBookService = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'DELETE',
    })
    await handleResponse(response)
}
