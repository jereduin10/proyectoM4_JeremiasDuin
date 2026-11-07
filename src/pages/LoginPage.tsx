import { Link, Navigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../hooks/useAuth'
import { loginWithEmail, loginWithGoogle } from '../services/authService'

export default function LoginPage() {
  const { user } = useAuth()

  // Si ya está logueado, no tiene sentido mostrar el login
  if (user) return <Navigate to="/" replace />

  return (
    <AuthForm
      title="Iniciar sesión"
      submitLabel="Entrar"
      onSubmit={loginWithEmail}
      onGoogle={loginWithGoogle}
      footer={
        <>
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-blue-600 underline">
            Registrate
          </Link>
        </>
      }
    />
  )
}