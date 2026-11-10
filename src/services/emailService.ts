import { auth } from './firebase'
import type { Task } from '../types/task'

export async function sendSummaryEmail(tasks: Task[]): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('No autenticado')

  const token = await user.getIdToken()

  const response = await fetch('/api/send-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tasks: tasks.map(({ title, completed, priority, dueDate }) => ({
        title,
        completed,
        priority,
        dueDate,
      })),
    }),
  })

  if (!response.ok) throw new Error('No se pudo enviar el email.')
}