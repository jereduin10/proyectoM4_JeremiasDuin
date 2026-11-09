import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskFilters from './TaskFilters'

describe('TaskFilters', () => {
  it('marca como activo el filtro actual', () => {
    render(
      <TaskFilters filter="pending" sort="recent" onFilterChange={vi.fn()} onSortChange={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: 'Pendientes' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('avisa cuando cambia el filtro', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    render(
      <TaskFilters filter="all" sort="recent" onFilterChange={onFilterChange} onSortChange={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'Completadas' }))

    expect(onFilterChange).toHaveBeenCalledWith('completed')
  })

  it('avisa cuando cambia el orden', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <TaskFilters filter="all" sort="recent" onFilterChange={vi.fn()} onSortChange={onSortChange} />,
    )

    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'priority')

    expect(onSortChange).toHaveBeenCalledWith('priority')
  })
})