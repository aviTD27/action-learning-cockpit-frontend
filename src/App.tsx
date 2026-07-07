import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/index'
import { AuthProvider } from './auth/AuthContext'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}