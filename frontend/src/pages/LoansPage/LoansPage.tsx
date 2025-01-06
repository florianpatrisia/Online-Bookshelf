import { Table, Button } from 'react-bootstrap'
import { useLoanBookContext } from '../../context/LoanBooksContext'
import MyNavbar from '../../components/Navbar/Navbar'
import { useEffect, useState } from 'react'
import './LoansPage.css'
import { AxiosError } from 'axios'

const BookLoanListPage: React.FC = () => {
    const {
        currentLoans,
        error,
        renewLoan,
        returnBook,
        fetchAndSetCurrentLoans,
    } = useLoanBookContext()
    const [isLoading, setIsLoading] = useState(true)
    const [overdueMessage, setOverdueMessage] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const refreshLoans = async () => {
        try {
            await fetchAndSetCurrentLoans()
        } catch (err) {
            console.error('Error refreshing loans:', err)
        }
    }

    const handleRenew = async (bookId: number) => {
        try {
            await renewLoan(bookId)
            console.log(`Successfully renewed bookId: ${bookId}`)
            await refreshLoans()
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                alert(error.response.data)
            }
        }
    }

    const handleRestore = async (bookId: number, daysLeft: number) => {
        try {
            await returnBook(bookId, (err) => {
                console.log(`Failed to restore bookId ${bookId}: ${err}`)
            })
            if (daysLeft < 0) {
                setOverdueMessage(true)
            }
            console.log(`Successfully restored bookId: ${bookId}`)
        } catch (err) {
            console.error(`Error restoring loan for bookId ${bookId}:`, err)
        }
    }

    if (isLoading) {
        return <div className="loading">Loading...</div>
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>
    }

    return (
        <div className="container mt-5">
            <MyNavbar />
            <h1 className="mb-4">Book Loans</h1>
            <div className="row">
                {overdueMessage && (
                    <div className="overdue-message">
                        This loan was overdue. Please check your account for any
                        fees and pay them in order to loan more books.
                    </div>
                )}
            </div>
            {currentLoans !== undefined && currentLoans.length === 0 ? (
                <div className="no-loaned-books">No book loans available!</div>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Book Name</th>
                                <th>Book Author</th>
                                <th>Days Left/ Overdue</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLoans.map((loan, index) => {
                                const isOverdue = loan.daysLeft < 0
                                const days = Math.abs(loan.daysLeft)

                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{loan.book.title}</td>
                                        <td>{loan.book.author}</td>
                                        <td
                                            className={
                                                isOverdue ? 'text-danger' : ''
                                            }
                                        >
                                            {isOverdue
                                                ? `${days} days overdue`
                                                : `${days} days left`}
                                        </td>
                                        <td>
                                            <Button
                                                className="me-2"
                                                onClick={() =>
                                                    handleRenew(
                                                        Number(loan.book.bookId)
                                                    )
                                                }
                                                disabled={loan.daysLeft <= 0}
                                            >
                                                Renew
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleRestore(
                                                        Number(
                                                            loan.book.bookId
                                                        ),
                                                        loan.daysLeft
                                                    )
                                                }
                                            >
                                                Return
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    )
}

export default BookLoanListPage
