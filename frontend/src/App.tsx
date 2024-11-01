import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
            {/*<Routes>*/}
            {/*<Route path="/add-book" component={AddBookPage} />*/}
            {/*<Route path="/" element={<Navigate to="/book/1" />} />*/}
            {/*<Route path="/book/:id" element={<BookViewUserPage />} />*/}
            {/*<Route path="/book/:id" element={<BookViewAdminPage />} />*/}
            {/*<Route path="/edit-book/:id" element={<UpdateBookPage />} />*/}
            {/*</Routes>*/}
        </div>
    )
}

export default App
