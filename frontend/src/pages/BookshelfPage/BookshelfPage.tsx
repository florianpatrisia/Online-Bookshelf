import { useBookContext } from '../../context/BooksContext'
import '../../utils/reset.css'
import Card from '../../components/Card/Card'
import './BookshelfPage.css'
import MyNavbar from '../../components/Navbar/Navbar'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext.tsx'
import { useEffect } from 'react'

export function BookshelfPage() {
    const { books, loadBooksByCategory } = useBookContext()
    const { user } = useAuthContext()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const category = searchParams.get('category')
        loadBooksByCategory(category || '')
    }, [searchParams, loadBooksByCategory])

    if (!books) {
        return <div className="loading">Loading...</div>
    }

    return (
        <>
            <MyNavbar />
            <div className="container mt-5">
                <h1 className="mb-4">Bookshelf</h1>
                {user && user.isAdmin && (
                    <Link to="/add-book" className="btn btn-primary add-btn">
                        Add Book
                    </Link>
                )}
                <div className="card-grid">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div
                                className="col-md-4 mb-4 card-elem"
                                key={book.bookId}
                            >
                                <Card book={book} />
                            </div>
                        ))
                    ) : (
                        <div className="no-books-message">
                            <h2>No books in this category</h2>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
