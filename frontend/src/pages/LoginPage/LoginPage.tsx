import { useNavigate } from 'react-router-dom'
import './LoginPage.css'
import '../../utils/reset.css'
import { useAuthContext } from '../../context/AuthContext.tsx'
import React, { useState } from 'react'
import axios from 'axios'

export function LoginPage() {
    const { login } = useAuthContext()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            await login(username, password)
            navigate('/')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const errorMessage =
                        error.response.data?.message ||
                        'Login failed. Please try again.'
                    setError(errorMessage)
                } else if (error.request) {
                    setError(
                        'No response from server. Please check your internet connection.'
                    )
                }
            } else if (error instanceof Error) {
                setError('Login failed. Please try again.')
            } else {
                setError('An unknown error occurred.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <form
                onSubmit={submitHandler}
                name="login-form"
                className="form-login"
            >
                <legend className="legend">Sign In to Your Account</legend>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        className="input-field"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        className="input-field"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn-login" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    )
}
