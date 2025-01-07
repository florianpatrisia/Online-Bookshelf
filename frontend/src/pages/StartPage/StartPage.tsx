import './StartPage.css'
import '../../utils/reset.css'
import { useNavigate } from 'react-router-dom'

export function StartPage() {
    const navigate = useNavigate()
    return (
        <div className="start-page">
            <div className="intro-container">
                <h1 className="welcome-banner">Welcome back!</h1>
                <p className="info-banner">
                    Sign in to access your virtual library, manage your borrowed
                    books, and purchase your favorites. Your next great read is
                    just a login away.
                </p>
            </div>
            <div className="button-container">
                <button
                    type="button"
                    className="btn register-btn"
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
                <button
                    type="button"
                    className="btn login-btn"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
            </div>
        </div>
    )
}
