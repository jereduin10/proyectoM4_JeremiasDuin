import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from './TaskForm'
import { makeTask } from '../test/factories'

describe('TaskForm', () => {
  it('muestra un error y no envía si el título está vacío', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Agregar tarea' }))

    expect(screen.getByRole('alert')).toHaveTextContent('El título es obligatorio.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envía los datos y limpia el formulario al crear', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Título'), 'Comprar pan')
    await user.type(screen.getByLabelText('Descripción'), 'En la panadería')
    await user.selectOptions(screen.getByLabelText('Prioridad'), 'high')
    await user.click(screen.getByRole('button', { name: 'Agregar tarea' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Comprar pan',
      description: 'En la panadería',
      priority: 'high',
      dueDate: null,
    })
    await waitFor(() => expect(screen.getByLabelText('Título')).toHaveValue(''))
  })

  it('carga los datos de la tarea en modo edición', () => {
    const task = makeTask({ title: 'Estudiar', priority: 'low' })
    render(<TaskForm initialTask={task} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Título')).toHaveValue('Estudiar')
    expect(screen.getByLabelText('Prioridad')).toHaveValue('low')
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })

  it('muestra un error si guardar falla', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('fallo'))
    render(<TaskForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Título'), 'Algo')
    await user.click(screen.getByRole('button', { name: 'Agregar tarea' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar la tarea')
  })
})