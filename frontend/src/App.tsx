import './App.css'
import AddBookPage from './pages/AddBookPage.tsx'
import { Route, Routes } from 'react-router-dom'
import UpdateBookPage from './pages/UpdateBookPage.tsx'
import BookViewAdminPage from './pages/ViewBookAdminPage.tsx'
import { BookProvider } from './context/BooksContext'
import HomePage from './pages/HomePage.tsx'
import React from 'react'

const App: React.FC = () => {
    return (
        <BookProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-book" element={<AddBookPage />} />
                <Route path="/books/:id" element={<BookViewAdminPage />} />
                <Route path="/edit-book/:id" element={<UpdateBookPage />} />
            </Routes>
        </BookProvider>
    )
}

export default App
