import { useAuth } from '../hooks/useAuth'
import { logout } from '../services/authService'

export default function TasksPage() {
  const { user } = useAuth()

  return (
    <main className="p-4">
      <p>Hola, {user?.email}</p>
      <button onClick={logout} className="mt-2 border rounded-lg px-3 py-1">
        Cerrar sesión
      </button>
    </main>
  )
}