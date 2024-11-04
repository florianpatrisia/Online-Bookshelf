import './App.css'
import AddBookPage from './pages/AddBookPage.tsx'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import UpdateBookPage from './pages/UpdateBookPage.tsx'
import BookViewAdminPage from './pages/ViewBookAdminPage.tsx'
import { BookProvider } from './context/BooksContext'

const App: React.FC = () => {
    return (
        <BookProvider>
            <Routes>
                <Route path="/add-book" element={<AddBookPage />} />
                <Route path="/" element={<Navigate to="/books/5" />} />
                <Route path="/books/:id" element={<BookViewAdminPage />} />
                <Route path="/edit-book/:id" element={<UpdateBookPage />} />
            </Routes>
        </BookProvider>
    )
}

export default App
