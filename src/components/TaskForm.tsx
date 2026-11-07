import { useState, type FormEvent } from 'react'
import { PRIORITY_LABELS, type Priority, type Task, type TaskFormData } from '../types/task'

interface TaskFormProps {
  initialTask?: Task | null
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel?: () => void
}

export default function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  const isEditing = Boolean(initialTask)
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null, // Firestore no acepta undefined, usamos null
      })
      if (!isEditing) {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setDueDate('')
      }
    } catch {
      setError('No se pudo guardar la tarea. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <h2 className="font-semibold">{isEditing ? 'Editar tarea' : 'Nueva tarea'}</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">Título</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg p-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="border rounded-lg p-2"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="priority" className="text-sm font-medium">Prioridad</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="border rounded-lg p-2"
          >
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="dueDate" className="text-sm font-medium">Vencimiento</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50"
        >
          {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar tarea'}
        </button>
        {isEditing && onCancel && (
          <button type="button" onClick={onCancel} className="border rounded-lg px-4 py-2">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}