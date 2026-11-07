import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { subscribeToTasks } from '../services/taskService'
import type { Task } from '../types/task'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToTasks(
      user.uid,
      (data) => {
        setTasks(data)
        setError(null)
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar las tareas.')
        setLoading(false)
      },
    )

    // Al desmontar o cambiar de usuario, cortamos la suscripción
    return unsubscribe
  }, [user])

  return { tasks, loading, error }
}