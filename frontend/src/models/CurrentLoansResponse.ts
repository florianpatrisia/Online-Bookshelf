import { Book } from './Book.ts'

export interface CurrentLoansResponse {
    book: Book
    daysLeft: number
}
