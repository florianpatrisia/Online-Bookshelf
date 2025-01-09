import axios from 'axios'

export const API_BASE_URL = 'http://34.203.236.245:8080'

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data'
    } else {
        config.headers['Content-Type'] = 'application/json'
    }
    return config
})

export const loginService = async (username: string, password: string) => {
    const response = await axiosInstance.post('/api/auth/login', {
        username,
        password,
    })
    return response.data
}

export const signupService = async (userData: {
    username: string
    email: string
    password: string
    isAdmin?: boolean
}) => {
    const response = await axiosInstance.post('/api/auth/signup', userData)
    return response.data
}
