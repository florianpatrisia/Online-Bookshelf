import React, { createContext, useState, useContext, ReactNode } from 'react'
import { loginService, signupService } from '../services/authApi'
import { useNavigate } from 'react-router-dom'
import { User } from '../models/User'

interface AuthContext {
    isAuthenticated: boolean
    token: string | null
    user: User | null
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
    const [user, setUser] = useState<User | null>(
        token
            ? {
                  userId: JSON.parse(atob(token.split('.')[1])).userId,
                  isAdmin: JSON.parse(atob(token.split('.')[1])).roles.includes(
                      'ROLE_ADMIN'
                  ),
                  email: JSON.parse(atob(token.split('.')[1])).email,
              }
            : null
    )
    const navigate = useNavigate()

    const login = async (username: string, password: string) => {
        const response = await loginService(username, password)
        localStorage.setItem('token', response.token)
        setToken(response.token)
        const decoded = JSON.parse(atob(response.token.split('.')[1]))
        const userId = decoded.userId
        const isAdmin = decoded.roles.includes('ROLE_ADMIN')
        setUser({ userId, username, password, isAdmin })
        console.log(JSON.parse(atob(response.token.split('.')[1])))
        navigate('/')
    }

    const signup = async (userData: {
        username: string
        email: string
        password: string
    }) => {
        const userWithAdminFlag = { ...userData, isAdmin: false }
        await signupService(userWithAdminFlag)
        navigate('/login')
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
