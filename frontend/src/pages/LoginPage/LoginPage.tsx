import { useNavigate } from 'react-router-dom'
import './LoginPage.css'
import '../../utils/reset.css'
import { useAuthContext } from '../../context/AuthContext.tsx'
import React, { useState } from 'react'
import axios from 'axios'

export function LoginPage() {
    const { login } = useAuthContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await login(email, password)
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
        <>
            <form onSubmit={submitHandler} name="register-form-login">
                <fieldset className="form-register-login">
                    <legend className="legend">Sign In</legend>
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            className="input-email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Password"
                            name="password"
                            className="input-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button
                        type="submit"
                        className="btn-create"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </fieldset>
            </form>
        </>
    )
}
