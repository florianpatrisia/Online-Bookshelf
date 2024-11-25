import Logo from '../../assets/Logo.jpg'
import './StartPage.css'
import '../../utils/reset.css'
import { useNavigate } from 'react-router-dom'
export function StartPage() {
    const navigate = useNavigate()
    return (
        <>
            <img src={Logo} alt="Page Turner Logo" className="logo" />
            <div className="container-into">
                <h1 className="banner-welcoming ">
                    Welcome back! Enjoy the best experience
                </h1>
                <h2 className="banner-info">
                    Sign in to access your virtual library, manage your borrowed
                    books, and purchase your favorites. Your next great read is
                    just a login away.
                </h2>
            </div>
            <div className="container-register">
                <button
                    type="button"
                    className="btn-register"
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </div>
            <div className="container-login">
                <button
                    type="button"
                    className="btn-login"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
            </div>
        </>
    )
}
