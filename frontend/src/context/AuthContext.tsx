import React, { createContext, useState, useContext, ReactNode } from 'react'
import { loginService, signupService } from '../services/authApi'
import { useNavigate } from 'react-router-dom'

interface AuthContext {
    isAuthenticated: boolean
    token: string | null
    user: { isAdmin: boolean } | null
    login: (username: string, password: string) => Promise<void>
    signup: (userData: {
        username: string
        email: string
        password: string
    }) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContext | undefined>(undefined)

export const useAuthContext = (): AuthContext => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    )
    const [user, setUser] = useState<{ isAdmin: boolean } | null>(
        token
            ? {
                  isAdmin: JSON.parse(atob(token.split('.')[1])).roles.includes(
                      'ROLE_ADMIN'
                  ),
              }
            : null
    )
    const navigate = useNavigate()

    const login = async (username: string, password: string) => {
        try {
            const response = await loginService(username, password)
            localStorage.setItem('token', response.token)
            setToken(response.token)
            const decoded = JSON.parse(atob(response.token.split('.')[1]))
            const isAdmin = decoded.roles.includes('ROLE_ADMIN')
            setUser({ isAdmin })
            console.log(JSON.parse(atob(response.token.split('.')[1])))
            navigate('/')
        } catch (error) {
            console.error('Login failed: ', error)
        }
    }

    const signup = async (userData: {
        username: string
        email: string
        password: string
    }) => {
        try {
            const userWithAdminFlag = { ...userData, isAdmin: false }
            await signupService(userWithAdminFlag)
            navigate('/login')
        } catch (error) {
            console.error('Signup failed: ', error)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        navigate('/')
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token,
                token,
                user,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
