import type { TaskFilter, TaskSort } from '../types/task'

interface TaskFiltersProps {
  filter: TaskFilter
  sort: TaskSort
  onFilterChange: (filter: TaskFilter) => void
  onSortChange: (sort: TaskSort) => void
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

const SORTS: { value: TaskSort; label: string }[] = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'priority', label: 'Prioridad (alta primero)' },
  { value: 'dueDate', label: 'Vencimiento (más próximo)' },
]

export default function TaskFilters({ filter, sort, onFilterChange, onSortChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex gap-2" role="group" aria-label="Filtrar tareas">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            aria-pressed={filter === f.value}
            className={`rounded-full px-3 py-1 text-sm border ${
              filter === f.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="sort">Ordenar por</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as TaskSort)}
          className="border rounded-lg p-1 bg-white"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}