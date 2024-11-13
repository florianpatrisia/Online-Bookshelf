import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'
// import { fetchBookById } from '../services/api' // Import your API functions
import { Book } from '../models/Book.ts'
import { useBookContext } from '../context/BooksContext'
import MyNavbar from '../components/Navbar/Navbar.tsx'

const BookViewAdminPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getBookById, deleteBook } = useBookContext()
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await getBookById(id!)
                if (!bookData) {
                    setError('Book not found.')
                } else {
                    setBook(bookData)
                }
            } catch (error) {
                setError(error.message || 'Book not found.')
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [id, getBookById])

    const handleUpdateClick = () => {
        navigate(`/edit-book/${id}`) // Navigate to the edit page
    }

    const handleDeleteClick = async () => {
        try {
            await deleteBook(id!)
            navigate('/')
        } catch (error) {
            setError(error)
            setError('Failed to delete the book.')
        }
    }

    if (loading) {
        return <div className="container mt-5">Loading...</div>
    }

    if (error) {
        return <div className="container mt-5">{error}</div>
    }

    if (!book) {
        return <div className="container mt-5">Book not found.</div>
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br></br>
            <br></br>
            <br></br>
            <div className="row">
                {/* First column - Image */}
                <div className="col-md-4">
                    <img
                        src={book!.image || undefined}
                        alt={book!.title}
                        className="img-fluid"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            width: '300px',
                            borderRadius: '8px',
                        }}
                    />
                </div>

                {/* Second column - Title, Author, and Description */}
                <div className="col-md-4">
                    <h2 style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
                        {book!.title}
                    </h2>
                    <h5
                        style={{
                            textAlign: 'left',
                            marginTop: '0',
                            marginBottom: '1.5rem',
                            color: 'gray',
                        }}
                    >
                        {book!.author}
                    </h5>
                    <p style={{ textAlign: 'left', lineHeight: '1.5' }}>
                        {book!.description}
                    </p>
                </div>

                {/* Third column - Additional Information */}
                <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
                    <p>
                        <strong>Category:</strong> {book!.category}
                    </p>
                    <p>
                        <strong>Price:</strong> ${book!.price.toFixed(2)}
                    </p>
                    <div>
                        <strong>Rating:</strong>
                        <StarRating rating={book!.rating} />
                        {book!.rating} / 5
                    </div>
                    <p>
                        <strong>Available Count:</strong> {book!.availableCount}
                    </p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={handleUpdateClick}
                    >
                        Update this Book
                    </button>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={handleDeleteClick}
                    >
                        Delete this Book
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookViewAdminPage
