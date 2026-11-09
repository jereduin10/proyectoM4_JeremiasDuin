import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskList from './TaskList'
import { makeTask } from '../test/factories'

const baseProps = {
  loading: false,
  error: null,
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
}

describe('TaskList', () => {
  it('muestra el estado de carga', () => {
    render(<TaskList {...baseProps} tasks={[]} loading />)
    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument()
  })

  it('muestra el mensaje de error', () => {
    render(<TaskList {...baseProps} tasks={[]} error="No se pudieron cargar las tareas." />)
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudieron cargar las tareas.')
  })

  it('muestra un mensaje cuando no hay tareas', () => {
    render(<TaskList {...baseProps} tasks={[]} />)
    expect(screen.getByText(/Todavía no tenés tareas/)).toBeInTheDocument()
  })

  it('renderiza un elemento por cada tarea', () => {
    const tasks = [
      makeTask({ id: 'a', title: 'Primera' }),
      makeTask({ id: 'b', title: 'Segunda' }),
    ]
    render(<TaskList {...baseProps} tasks={tasks} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Primera')).toBeInTheDocument()
    expect(screen.getByText('Segunda')).toBeInTheDocument()
  })

  it('llama a onToggle al tildar la tarea', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const task = makeTask({ title: 'Lavar ropa' })
    render(<TaskList {...baseProps} tasks={[task]} onToggle={onToggle} />)

    await user.click(screen.getByRole('checkbox'))

    expect(onToggle).toHaveBeenCalledWith(task)
  })

  it('llama a onDelete al tocar Eliminar', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const task = makeTask()
    render(<TaskList {...baseProps} tasks={[task]} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(onDelete).toHaveBeenCalledWith(task)
  })
})