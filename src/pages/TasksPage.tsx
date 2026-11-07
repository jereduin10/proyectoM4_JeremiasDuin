import { useState } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { logout } from '../services/authService'
import { createTask, deleteTask, toggleTaskCompleted, updateTask } from '../services/taskService'
import type { Task, TaskFormData } from '../types/task'

export default function TasksPage() {
  const { user } = useAuth()
  const { tasks, loading, error } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // ProtectedRoute ya garantiza que hay usuario; esto es para que TypeScript lo sepa
  if (!user) return null

  const runAction = async (action: () => Promise<unknown>) => {
    setActionError(null)
    try {
      await action()
    } catch {
      setActionError('No se pudo completar la acción. Intentá de nuevo.')
    }
  }

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data)
      setEditingTask(null)
    } else {
      await createTask(user.uid, data)
    }
  }

  const handleDelete = (task: Task) => {
    if (!window.confirm(`¿Eliminar "${task.title}"?`)) return
    if (editingTask?.id === task.id) setEditingTask(null)
    runAction(() => deleteTask(task.id))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold">Mis tareas</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline text-gray-500">{user.email}</span>
            <button onClick={logout} className="border rounded-lg px-3 py-1">
              Cerrar sesión
            </button>
          </div>
        </header>

        <TaskForm
          key={editingTask?.id ?? 'new'}
          initialTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTask(null)}
        />

        {actionError && <p role="alert" className="text-sm text-red-600">{actionError}</p>}

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggle={(task) => runAction(() => toggleTaskCompleted(task.id, !task.completed))}
          onEdit={setEditingTask}
          onDelete={handleDelete}
        />
      </div>
    </main>
  )
}