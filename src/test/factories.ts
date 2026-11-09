import type { Task } from '../types/task'

export const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  userId: 'user-1',
  title: 'Tarea de prueba',
  description: '',
  completed: false,
  priority: 'medium',
  dueDate: null,
  createdAt: 1000,
  ...overrides,
})