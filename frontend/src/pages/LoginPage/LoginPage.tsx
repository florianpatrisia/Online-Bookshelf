import { useNavigate } from 'react-router-dom'
import './LoginPage.css'
import '../../utils/reset.css'
import { useAuthContext } from '../../context/AuthContext.tsx'
import React, { useState } from 'react'

export function LoginPage() {
    const { login } = useAuthContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault() // Prevent page reload

        try {
            await login(email, password)
            navigate('/')
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError(
                    'Login failed. Please check your credentials and try again.'
                )
            }
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
                    <button type="submit" className="btn-create">
                        Log in
                    </button>
                </fieldset>
            </form>
        </>
    )
}
