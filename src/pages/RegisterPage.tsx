import { Link, Navigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../hooks/useAuth'
import { registerWithEmail, loginWithGoogle } from '../services/authService'

export default function RegisterPage() {
  const { user } = useAuth()

  if (user) return <Navigate to="/" replace />

  return (
    <AuthForm
      title="Crear cuenta"
      description="Creá tu cuenta para organizar tus tareas diarias. Se guardan en la nube y podés acceder desde cualquier dispositivo."
      submitLabel="Registrarme"
      onSubmit={registerWithEmail}
      onGoogle={loginWithGoogle}
      footer={
        <>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-blue-600 underline">
            Iniciá sesión
          </Link>
        </>
      }
    />
  )
}