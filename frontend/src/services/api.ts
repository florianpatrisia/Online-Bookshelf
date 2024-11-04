import { Book } from '../models/Book.ts'

export const API_BASE_URL = 'http://localhost:8080'

export const fetchBookById = async (id: string): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok) {
        throw new Error('Failed to fetch book')
    }
    return response.json()
}

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/api/books`)
    if (!response.ok) {
        throw new Error('Failed to fetch books')
    }
    return await response.json()
}

export const createBook = async (book: Book): Promise<Book> => {
    console.log('Book din API ', book)
    const newBook = {
        book_id: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        image: book.image,
        rating: book.rating,
        available_count: book.availableCount,
        category: book.category,
    }
    const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
    })
    if (!response.ok) {
        throw new Error('Failed to create book')
    }
    return await response.json()
}

export const updateBookService = async (
    id: string,
    updatedBook: Partial<Book>
): Promise<Book> => {
    console.log('Booook ' + updatedBook)
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
