import React, { useState } from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { FaSearch } from 'react-icons/fa'
import { useAuthContext } from '../../context/AuthContext.tsx'

const MyNavbar: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState(false)
    const { logout } = useAuthContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const [isDropdownVisible, setDropdownVisible] = useState(false)

    const categories = [
        'Fiction',
        'Non-Fiction',
        'Science',
        'Biography',
        'Fantasy',
        'Mystery',
        'Romance',
        'History',
        'Horror',
    ]

    const handleSearchIconClick = () => {
        setSearchVisible(!searchVisible)
    }

    const handleLogin = () => {
        navigate('/pageTurner')
    }

    const handleCategoryClick = (category: string) => {
        navigate(`/bookshelf?category=${encodeURIComponent(category)}`)
    }
    return (
        <Navbar expand="lg" fixed="top" className="custom-navbar">
            <Link to="/" className="navbar-brand">
                Page Turners
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto custom-nav">
                    <Nav.Link href="/" className="nav-link">
                        Home
                    </Nav.Link>

                    <div
                        className="nav-item bookshelf-container"
                        onMouseEnter={() => setDropdownVisible(true)}
                        onMouseLeave={() => setDropdownVisible(false)}
                    >
                        <Nav.Link href="/bookshelf" className="nav-link">
                            Bookshelf
                        </Nav.Link>
                        <div
                            className={`dropdown-content ${
                                isDropdownVisible ? 'visible' : ''
                            }`}
                            onMouseEnter={() => setDropdownVisible(true)}
                            onMouseLeave={() => setDropdownVisible(false)}
                        >
                            <div className="books-dropdown">
                                {categories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleCategoryClick(category)
                                        }
                                    >
                                        {category}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Nav.Link href="/favorites" className="nav-link">
                        Favorite Books
                    </Nav.Link>
                    <Nav.Link href="#my-account" className="nav-link">
                        My Account
                    </Nav.Link>
                    <Nav.Link href="#cart" className="nav-link">
                        Cart
                    </Nav.Link>

                    {user ? (
                        <button onClick={logout} className="btn btn-primary">
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="btn btn-primary"
                        >
                            Log in
                        </button>
                    )}
                </Nav>
            </Navbar.Collapse>
            <div className="search-container">
                <Form
                    className={`search-form ${searchVisible ? 'visible' : 'hidden'}`}
                >
                    <FormControl
                        type="text"
                        placeholder="Search"
                        className="mt-0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // To Do: Add search logic
                            }
                        }}
                    />
                </Form>
                <FaSearch
                    className="search-icon"
                    onClick={handleSearchIconClick}
                />
            </div>
        </Navbar>
    )
}

export default MyNavbar
