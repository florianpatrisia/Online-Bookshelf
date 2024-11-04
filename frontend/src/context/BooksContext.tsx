import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Book } from '../models/Book'
import {
    createBook,
    fetchBooks,
    fetchBookById,
    deleteBookService,
    updateBookService,
} from '../services/api'

export interface BooksContext {
    books: Book[]
    addBook: (book: Book) => Promise<void>
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
    getBookById: (id: string) => Promise<Book | undefined>
    deleteBook: (id: string) => void
    updateBook: (id: string, updatedBook: Book) => Promise<void>
}

const initialBooks: Book[] = []
const BooksContext = createContext<BooksContext>({
    books: initialBooks,
    addBook: async () => {},
    updateBook: async () => {},
    deleteBook: () => {},
    setBooks: () => {},
    getBookById: () => undefined,
})

export const useBookContext = () => useContext(BooksContext)

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

    const addBook = async (book: Book) => {
        try {
            console.log('BOOK CONTEXT ', book)
            const newBook = await createBook(book)
            setBooks((prevBooks) => [...prevBooks, newBook])
        } catch (error) {
            console.error('Error adding book:', error)
        }
    }

    const updateBook = async (id: string, book: Partial<Book>) => {
        try {
            const updatedBook = await updateBookService(id, book)
            setBooks((prevBooks) =>
                prevBooks.map((b) => (b._id === id ? updatedBook : b))
            )
        } catch (error) {
            console.error('Error updating book:', error)
        }
    }

    const deleteBook = async (id: string) => {
        try {
            await deleteBookService(id)
            setBooks((prevBooks) => prevBooks.filter((b) => b._id !== id))
        } catch (error) {
            console.error('Error deleting book:', error)
        }
    }

    const getBookById = async (id: string): Promise<Book | undefined> => {
        try {
            console.log('Context ID ' + id)
            const book = await fetchBookById(id)
            console.log('Titlee ' + book.title)
            return book
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
