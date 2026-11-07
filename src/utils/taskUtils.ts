import type { Priority, Task, TaskFilter, TaskSort } from '../types/task'

const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === 'pending') return tasks.filter((t) => !t.completed)
  if (filter === 'completed') return tasks.filter((t) => t.completed)
  return tasks
}

export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  // Copiamos el array para no modificar el original
  const copy = [...tasks]

  switch (sort) {
    case 'priority':
      // Alta primero; si empatan, la más nueva primero
      return copy.sort(
        (a, b) =>
          PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority] ||
          b.createdAt - a.createdAt,
      )

    case 'dueDate':
      // Vence antes primero; las que no tienen fecha van al final
      return copy.sort((a, b) => {
        if (a.dueDate === b.dueDate) return b.createdAt - a.createdAt
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })

    default:
      return copy.sort((a, b) => b.createdAt - a.createdAt)
  }
}