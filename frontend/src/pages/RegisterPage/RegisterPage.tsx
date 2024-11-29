import { useNavigate } from 'react-router-dom'
import './RegisterPage.css'
import '../../utils/reset.css'
import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext.tsx'
import axios from 'axios'

export function RegisterPage() {
    const { signup } = useAuthContext()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await signup({ username, email, password })
            navigate('/login')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const errorMessage =
                        error.response.data?.message ||
                        'Signup failed. Please try again.'
                    setError(errorMessage)
                } else if (error.request) {
                    setError(
                        'No response from server. Please check your internet connection.'
                    )
                }
            } else if (error instanceof Error) {
                setError('Signup failed. Please try again.')
            } else {
                setError('An unknown error occurred.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={submitHandler} name="register-form">
                <fieldset className="form-register">
                    <legend className="legend">Create a new account</legend>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            className="input-username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
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
                        {loading ? 'Signing up...' : 'Sign up'}
                    </button>
                </fieldset>
            </form>
        </>
    )
}
