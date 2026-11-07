import { PRIORITY_LABELS, type Task } from '../types/task'

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const priorityStyles = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <li className="bg-white rounded-xl shadow p-4 flex gap-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Marcar "${task.title}" como completada`}
        className="mt-1 h-5 w-5"
      />

      <div className="flex-1 min-w-0">
        <h3 className={`font-medium break-words ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600 break-words">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
          <span className={`px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.dueDate && (
            // Damos vuelta "2026-11-30" a "30/11/2026" sin usar Date (evita problemas de zona horaria)
            <span className="text-gray-500">
              Vence: {task.dueDate.split('-').reverse().join('/')}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 text-sm">
        <button onClick={() => onEdit(task)} className="border rounded-lg px-2 py-1">
          Editar
        </button>
        <button onClick={() => onDelete(task)} className="border border-red-300 text-red-600 rounded-lg px-2 py-1">
          Eliminar
        </button>
      </div>
    </li>
  )
}