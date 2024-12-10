import MyNavbar from '../../components/Navbar/Navbar.tsx'
import Card from '../../components/Card/Card.tsx'
import { useFavoriteBookContext } from '../../context/FavoriteBooksContext.tsx'
import './FavoriteBooksPage.css'
import { useEffect, useState } from 'react'

export function FavoriteBooksPage() {
    const { favoriteBooks } = useFavoriteBookContext()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <div className="loading">Loading...</div>
    }

    return (
        <>
            <MyNavbar />
            <div className="container mt-5">
                <h1 className="mb-4">My Favorite Books</h1>
                {favoriteBooks !== undefined && favoriteBooks.length === 0 ? (
                    <div className="no-favorite-books">
                        You don&#39;t have any favorite books yet. Explore our
                        collection and add some to your list!
                    </div>
                ) : (
                    <div className="card-grid">
                        {favoriteBooks !== undefined &&
                            favoriteBooks.map((favoriteBook) => (
                                <div
                                    className="col-md-4 card-elem"
                                    key={favoriteBook.bookId}
                                >
                                    <Card book={favoriteBook} />
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </>
    )
}
