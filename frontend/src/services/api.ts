import { Book } from '../models/Book.ts'

export const API_BASE_URL = 'http://localhost:3000'

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/books`)
    if (!response.ok) {
        throw new Error('Failed to fetch books')
    }
    return response.json()
}

// export const fetchBookById = async (id: string): Promise<Book> => {
//     const response = await fetch(`${API_BASE_URL}/books/${id}`)
//     if (!response.ok) {
//         throw new Error('Failed to fetch book')
//     }
//     return response.json()
// }
export const fetchBookById = async (id: string): Promise<Book> => {
    // Mock book data
    return {
        _id: id,
        title: 'Mock Book Title',
        author: 'Mock Author',
        description:
            'Crima ca forma de arta? O idee la fel de originala precum cel caruia ii apartine, extravagantul si bogatul domn Shaitana. Acesta ii pro­pune lui Hercule Poirot sa ii arate exponatele sale in cadrul unei petreceri la care il invita alaturi de alti trei specialisti in dezlegarea enigmelor si de patru ucigasi care au scapat nepedepsiti pana acum. Si, asa cum se temea Poirot, ceea ce incepe ca o seara captivanta de bridge devine pana la urma un joc mult mai periculos...  Agatha Christie este unul dintre scriitorii care nu au nevoie de nici o prezentare, pentru ca opera lor a trecut cu brio testul timpului si al cititorilor din toate epocile si generatiile. Cu peste 2 miliarde de carti vandute si cu traduceri in mai mult de 100 de limbi, Agatha Christie este surclasata in acest top numai de Biblie si de William Shakespeare.',
        category: 'Fiction',
        price: 19.99,
        rating: 4.5,
        availableCount: 10,
        image: 'https://i.pinimg.com/564x/54/4b/b8/544bb808d12c36d47be9e0e77844aa9d.jpg',
    } as Book
}
