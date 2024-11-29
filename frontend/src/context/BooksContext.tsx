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
    addBook: (book: FormData) => Promise<void>
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
    getBookById: (id: string) => Promise<Book | undefined>
    deleteBook: (id: string) => Promise<void>
    updateBook: (id: string, updatedBook: FormData) => Promise<void>
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

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const fetchedBooks = await fetchBooks()
                setBooks(fetchedBooks)
            } catch (error) {
                console.error('Error loading books:', error)
            }
        }
        loadBooks()
    }, [])

    const addBook = async (book: FormData): Promise<void> => {
        try {
            await addBookService(book)
            const updatedBooks = await fetchBooks()
            setBooks(updatedBooks)
        } catch (error) {
            console.error('Error adding book:', error)
        }
    }

    const updateBook = async (id: string, book: FormData): Promise<void> => {
        try {
            await updateBookService(id, book)
            const fetchedBooks = await fetchBooks()
            setBooks(fetchedBooks)
        } catch (error) {
            console.error('Error updating book:', error)
        }
    }

    const deleteBook = async (id: string): Promise<void> => {
        const prevBooks = [...books]
        setBooks((prevBooks) => prevBooks.filter((b) => b.bookId != id))

        try {
            await deleteBookService(id)
        } catch (error) {
            console.error('Error deleting book:', error)
            setBooks(prevBooks)
        }
    }

    const getBookById = async (id: string): Promise<Book | undefined> => {
        try {
            return await fetchBookById(id)
        } catch (error) {
            console.error('Error fetching book by ID:', error)
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
            }}
        >
            {children}
        </BooksContext.Provider>
    )
}
