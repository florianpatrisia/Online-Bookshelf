export interface Book {
    _id?: number
    title: string
    author: string
    description: string
    price: number
    image: string | null
    rating: number
    availableCount: number
    category: string
}
