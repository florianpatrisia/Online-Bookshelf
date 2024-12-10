import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import {
    addFavoriteBookService,
    fetchFavoriteBooksByUserId,
    removeFavoriteBookService,
} from '../services/favoriteBooksApi.ts'
import { Book } from '../models/Book.ts'
import { useBookContext } from './BooksContext.tsx'
import { FavoriteBook } from '../models/FavoriteBook.ts'

import { useAuthContext } from './AuthContext.tsx'

export interface FavoriteBooksContext {
    favoriteBooks: Book[]
    addFavoriteBook: (
        bookId: number,
        onError?: (error: string) => void
    ) => Promise<void>
    removeFavoriteBook: (
        bookId: number,
        onError?: (error: string) => void
    ) => Promise<void>
    isFavorite: (
        bookId: number,
        onError?: (error: string) => void
    ) => Promise<boolean>
    setFavoriteBooks: React.Dispatch<React.SetStateAction<Book[]>>
    error: string | null
}

const initialFavoriteBooks: Book[] = []

const FavoriteBooksContext = createContext<FavoriteBooksContext | undefined>(
    undefined
)

export const useFavoriteBookContext = (): FavoriteBooksContext => {
    const context = useContext(FavoriteBooksContext)
    if (!context) {
        throw new Error(
            'useFavoriteBookContext must be used within a FavoriteBookProvider'
        )
    }
    return context
}

export const FavoriteBookProvider: React.FC<{
    children: ReactNode
}> = ({ children }) => {
    const [favoriteBooks, setFavoriteBooks] =
        useState<Book[]>(initialFavoriteBooks)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuthContext()
    const { getBookById } = useBookContext()

    const getBooksFromFavorites = async (
        favoriteBooks: FavoriteBook[]
    ): Promise<Book[]> => {
        const favoriteBookPromises = favoriteBooks
            .filter((favorite) => favorite.book.bookId !== undefined)
            .map((favorite) => getBookById(favorite.book.bookId!.toString()))

        const resolvedBooks = await Promise.all(favoriteBookPromises)

        return resolvedBooks.filter((book): book is Book => book !== undefined)
    }

    useEffect(() => {
        const loadFavoriteBooks = async () => {
            try {
                const fetchedFavoriteBooks = await fetchFavoriteBooksByUserId(
                    user?.userId as number
                )

                const favoriteBookPromises = fetchedFavoriteBooks
                    .filter((favorite) => favorite.book.bookId !== undefined)
                    .map((favorite) =>
                        getBookById(favorite.book.bookId!.toString())
                    )

                const resolvedBooks = await Promise.all(favoriteBookPromises)

                const favoriteBooks = resolvedBooks.filter(
                    (book): book is Book => book !== undefined
                )

                setFavoriteBooks(favoriteBooks)
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? 'There was an error loading the favorite books. Please try again later.'
                        : 'An unexpected error occurred.'
                setError(errorMessage)
            }
        }
        loadFavoriteBooks()
    }, [user, getBookById])

    const isFavorite = async (
        bookId: number,
        onError?: (error: string) => void
    ): Promise<boolean> => {
        try {
            const fetchedFavoriteBooks = await fetchFavoriteBooksByUserId(
                user?.userId as number
            )

            return fetchedFavoriteBooks.some(
                (favorite) =>
                    favorite.book.bookId?.toString() === bookId.toString()
            )
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error loading the favorite books. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
            return false
        }
    }

    const addFavoriteBook = async (
        bookId: number,
        onError?: (error: string) => void
    ): Promise<void> => {
        try {
            await addFavoriteBookService(user?.userId as number, bookId)

            const updatedFavoriteBooks = await fetchFavoriteBooksByUserId(
                user?.userId as number
            )

            const favoriteBooks = getBooksFromFavorites(updatedFavoriteBooks)

            setFavoriteBooks(await favoriteBooks)
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
        }
    }

    const removeFavoriteBook = async (
        bookId: number,
        onError?: (error: string) => void
    ): Promise<void> => {
        const prevFavoriteBooks = [...favoriteBooks]
        setFavoriteBooks((prevFavoriteBooks) =>
            prevFavoriteBooks.filter((b) => b.bookId != bookId.toString())
        )

        try {
            await removeFavoriteBookService(user?.userId as number, bookId)
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? 'There was an error removing the book from favorites. Please try again later.'
                    : 'An unexpected error occurred.'
            if (onError) onError(errorMessage)
            setError(errorMessage)
            setFavoriteBooks(prevFavoriteBooks)
        }
    }

    return (
        <FavoriteBooksContext.Provider
            value={{
                favoriteBooks,
                addFavoriteBook,
                removeFavoriteBook,
                isFavorite,
                setFavoriteBooks,
                error,
            }}
        >
            {children}
        </FavoriteBooksContext.Provider>
    )
}
