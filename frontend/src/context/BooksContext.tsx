import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Book } from '../models/Book'
import {
    addBookService,
    deleteBookService,
    fetchBookById,
    fetchBooks,
    updateBookService,
} from '../services/booksApi.ts'

export interface BooksContext {
    books: Book[]
    addBook: (
        book: FormData,
        onError?: (error: string) => void
    ) => Promise<void>
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
    getBookById: (id: string) => Promise<Book | undefined>
    deleteBook: (id: string, onError?: (error: string) => void) => Promise<void>
    updateBook: (
        id: string,
        updatedBook: FormData,
        onError?: (error: string) => void
    ) => Promise<void>
    error: string | null
}

const initialBooks: Book[] = []

const BooksContext = createContext<BooksContext | undefined>(undefined)

export const useBookContext = (): BooksContext => {
    const context = useContext(BooksContext)
    if (!context) {
        throw new Error('useBookContext must be used within a BookProvider')
    }
    return context
}

export const BookProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [books, setBooks] = useState<Book[]>(initialBooks)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const fetchedBooks = await fetchBooks()
                setBooks(fetchedBooks)
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? 'There was an error loading the books. Please try again later.'
                        : 'An unexpected error occurred.'
                setError(errorMessage)
            }
        }
        loadBooks()
    }, [])

    const addBook = async (
        book: FormData,
        onError?: (error: string) => void
    ): Promise<void> => {
        try {
            await addBookService(book)
            const updatedBooks = await fetchBooks()
            setBooks(updatedBooks)
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error saving the book. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
        }
    }

    const updateBook = async (
        id: string,
        book: FormData,
        onError?: (error: string) => void
    ): Promise<void> => {
        try {
            await updateBookService(id, book)
            const fetchedBooks = await fetchBooks()
            setBooks(fetchedBooks)
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error updating the book. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
        }
    }

    const deleteBook = async (
        id: string,
        onError?: (error: string) => void
    ): Promise<void> => {
        const prevBooks = [...books]
        setBooks((prevBooks) => prevBooks.filter((b) => b.bookId != id))

        try {
            await deleteBookService(id)
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error deleting the book. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
            setBooks(prevBooks)
        }
    }

    const getBookById = async (id: string): Promise<Book | undefined> => {
        try {
            return await fetchBookById(id)
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error finding the book. Please try again later.'
                    : 'An unexpected error occurred.'
            setError(errorMessage)
            return undefined
        }
    }

    return (
        <BooksContext.Provider
            value={{
                books,
                addBook,
                updateBook,
                deleteBook,
                getBookById,
                setBooks,
                error,
            }}
        >
            {children}
        </BooksContext.Provider>
    )
}
