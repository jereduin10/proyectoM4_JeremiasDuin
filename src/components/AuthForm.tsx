import { useState, type FormEvent, type ReactNode } from 'react'
import { getAuthErrorMessage } from '../services/authService'

interface AuthFormProps {
  title: string
  description?: string
  submitLabel: string
  onSubmit: (email: string, password: string) => Promise<unknown>
  onGoogle: () => Promise<unknown>
  footer: ReactNode
}

export default function AuthForm({
  title,
  description,
  submitLabel,
  onSubmit,
  onGoogle,
  footer,
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const run = async (action: () => Promise<unknown>) => {
    setError(null)
    setSubmitting(true)
    try {
      await action()
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    run(() => onSubmit(email, password))
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
                <header className="mb-4">
          <p className="text-sm font-semibold text-blue-600">Gestor de tareas</p>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded-lg p-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded-lg p-2"
          />

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white rounded-lg p-2 font-medium disabled:opacity-50"
          >
            {submitting ? 'Procesando...' : submitLabel}
          </button>
        </form>

        <button
          type="button"
          onClick={() => run(onGoogle)}
          disabled={submitting}
          className="w-full mt-3 border rounded-lg p-2 font-medium disabled:opacity-50"
        >
          Continuar con Google
        </button>

        <p className="text-sm text-center mt-4">{footer}</p>
      </div>
    </main>
  )
}