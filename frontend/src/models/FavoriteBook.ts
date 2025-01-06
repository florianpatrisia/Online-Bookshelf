import { Book } from './Book.ts'

export interface FavoriteBook {
    id?: number
    userId: number
    book: Book
}
