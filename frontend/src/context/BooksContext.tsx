import { createContext, ReactNode, useContext, useState } from 'react'
import { Book } from '../models/Book'

// Definirea contextului cărților
export interface BooksContext {
    books: Book[]
    addBook: (book: Book) => void
    updateBook: (updatedBook: Book) => void // Funcția pentru actualizarea cărților
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

// Crearea contextului inițial
const BooksContext = createContext<BooksContext>({
    books: [],
    addBook: () => {},
    updateBook: () => {}, // Funcția goală pentru actualizare
    setBooks: () => {},
})

// Hook-ul pentru utilizarea contextului
export const useBookContext = () => useContext(BooksContext)

// Providerul pentru cărți
export const BookProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [books, setBooks] = useState<Book[]>([])

    // Funcția pentru adăugarea unei cărți
    const addBook = (book: Book) => {
        setBooks((prevBooks) => [...prevBooks, book])
    }

    // Funcția pentru actualizarea unei cărți
    const updateBook = (updatedBook: Book) => {
        setBooks((prevBooks) =>
            prevBooks.map(
                (book) => (book._id === updatedBook._id ? updatedBook : book) // Actualizează cartea cu informațiile noi
            )
        )
    }

    return (
        <BooksContext.Provider value={{ books, addBook, updateBook, setBooks }}>
            {children}
        </BooksContext.Provider>
    )
}
