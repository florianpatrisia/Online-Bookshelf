import { useBookContext } from '../../context/BooksContext'
import '../../utils/reset.css'
import Card from '../../components/Card/Card'
import './BookshelfPage.css'
import MyNavbar from '../../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext.tsx'

export function BookshelfPage() {
    const { books } = useBookContext()
    const { user } = useAuthContext()

    if (!books || books.length === 0) {
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
                    {books.map((book) => (
                        <div
                            className="col-md-4 mb-4 card-elem"
                            key={book.bookId}
                        >
                            <Card book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
