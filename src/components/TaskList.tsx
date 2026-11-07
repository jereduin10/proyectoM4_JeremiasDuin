import type { Task } from '../types/task'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export default function TaskList({ tasks, loading, error, onToggle, onEdit, onDelete }: TaskListProps) {
  if (loading) return <p>Cargando tareas...</p>
  if (error) return <p role="alert" className="text-red-600">{error}</p>
  if (tasks.length === 0) return <p className="text-gray-500">Todavía no tenés tareas. ¡Creá la primera!</p>

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}