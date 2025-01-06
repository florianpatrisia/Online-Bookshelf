import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import App from './App'

const stripePromise = loadStripe(
    'pk_test_51QdYahRsh17TzOP5gkQ3mcEmwRhYgeYlqmJPmJ82qbrJJj76llamBCs9VHLjpwU25Nt00ZgrzWusI91tyXYUVF2C00HePqtpqV'
)

const rootElement = document.getElementById('root')

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <Elements stripe={stripePromise}>
                    <App />
                </Elements>
            </BrowserRouter>
        </React.StrictMode>
    )
}
