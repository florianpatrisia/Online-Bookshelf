import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating.tsx'
import { Book } from '../../models/Book.ts'
import { useBookContext } from '../../context/BooksContext.tsx'
import MyNavbar from '../../components/Navbar/Navbar.tsx'
import './ViewBookPage.css'
import { useAuthContext } from '../../context/AuthContext.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const BookViewAdminPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuthContext()
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
                    setError('Book not found!')
                } else {
                    setBook(bookData)
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('Book not found!')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [id, getBookById])

    const handleUpdateClick = () => {
        navigate(`/edit-book/${id}`)
    }

    const handleDeleteClick = async () => {
        await deleteBook(id!, (errorMessage) => {
            setError(errorMessage)
        })
        navigate('/bookshelf')
    }

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    if (!book) {
        return <div className="loading">Book not found.</div>
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <br />
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={book!.imageUrl || undefined}
                        alt={book!.title}
                        className="img-fluid"
                    />
                </div>

                <div className="col-md-4">
                    <h2 className="title">{book!.title}</h2>
                    <h5 className="author">{book!.author}</h5>
                    <p className="description">{book!.description}</p>
                </div>

                <div className="col-md-4 additional-info">
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

                    {user && user.isAdmin ? (
                        <div className="d-flex mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdateClick}
                            >
                                Update this Book
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleDeleteClick}
                            >
                                Delete this Book
                            </button>
                        </div>
                    ) : (
                        <div className="d-flex mt-3 user-btn">
                            <button className="btn btn-primary">
                                Add to Cart
                            </button>
                            <button className="btn btn-light fav-btn">
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    )
}

export default BookViewAdminPage
