import { createContext, ReactNode, useContext, useState } from 'react'
import { Book } from '../models/Book'

export interface BooksContext {
    books: Book[]
    addBook: (book: Book) => void
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

const BooksContext = createContext<BooksContext>({
    books: [],
    addBook: () => {},
    setBooks: () => {},
})

export const useBookContext = () => useContext(BooksContext)

export const BookProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [books, setBooks] = useState<Book[]>([])

    const addBook = (book: Book) => {
        setBooks((prevBooks) => [...prevBooks, book])
    }

    return (
        <BooksContext.Provider value={{ books, addBook, setBooks }}>
            {children}
        </BooksContext.Provider>
    )
}
