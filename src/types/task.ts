export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  dueDate: string | null // formato "2026-11-30", viene directo de <input type="date">
  createdAt: number // Date.now(), fácil de ordenar y de usar en tests
}

// Lo que completa el usuario en el formulario.
// El resto (id, userId, completed, createdAt) lo pone la app o Firestore.
export type TaskFormData = Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>