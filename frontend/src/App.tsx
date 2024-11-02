import './App.css'
import AddBookPage from './pages/AddBookPage.tsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import UpdateBookPage from './pages/UpdateBookPage.tsx'
import BookViewAdminPage from './pages/ViewBookAdminPage.tsx'
import BookViewUserPage from './pages/ViewBookUserPage.tsx'

const App: React.FC = () => {
    return (
        <div>
            <AddBookPage />
            <Routes>
                <Route path="/add-book" component={AddBookPage} />
                <Route path="/" element={<Navigate to="/book/1" />} />
                <Route path="/book/:id" element={<BookViewAdminPage />} />
                <Route path="/edit-book/:id" element={<UpdateBookPage />} />
                <Route path="/book/:id" element={<BookViewUserPage />} />
            </Routes>
        </div>
    )
}

export default App
