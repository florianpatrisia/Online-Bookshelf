import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

interface PrivateRouteProps {
    adminOnly?: boolean
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ adminOnly = false }) => {
    const { isAuthenticated, user } = useAuthContext()

    if (!isAuthenticated || !user) {
        return <Navigate to="/pageTurner" />
    }

    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default PrivateRoute
