import { Book } from '../models/Book.ts'

export const API_BASE_URL = 'http://localhost:8080'

export const fetchBookById = async (id: string): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch book')
    }

    const data: Book = await response.json()

    console.log(data)

    return data
}

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/api/books`)
    if (!response.ok) {
        throw new Error('Failed to fetch books')
    }

    const data: Book[] = await response.json()

    console.log('Data', data)

    return data
}

export const createBook = async (book: FormData): Promise<Book> => {
    console.log('Book din API ', book)
    const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: 'POST',
        body: book,
    })
    if (!response.ok) {
        throw new Error('Failed to create book')
        // const errorText = await response.text()
        // throw new Error(`Failed to create book: ${errorText}`)
    }
    const newBook = await response.json()
    console.log(newBook)

    return newBook
}

export const updateBookService = async (
    id: string,
    updatedBook: Partial<Book>
): Promise<Book> => {
    console.log('Booook from update method api: ' + updatedBook)
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
    })
    if (!response.ok) {
        throw new Error('Failed to update book')
    }
    return await response.json()
}

export const deleteBookService = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error('Failed to delete book')
    }
}
