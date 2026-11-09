import { describe, it, expect } from 'vitest'
import { filterTasks, sortTasks } from './taskUtils'
import { makeTask } from '../test/factories'


describe('filterTasks', () => {
  const tasks = [
    makeTask({ id: 'a', completed: false }),
    makeTask({ id: 'b', completed: true }),
  ]

  it('devuelve todas las tareas con el filtro "all"', () => {
    expect(filterTasks(tasks, 'all')).toHaveLength(2)
  })

  it('devuelve solo las pendientes', () => {
    expect(filterTasks(tasks, 'pending').map((t) => t.id)).toEqual(['a'])
  })

  it('devuelve solo las completadas', () => {
    expect(filterTasks(tasks, 'completed').map((t) => t.id)).toEqual(['b'])
  })
})

describe('sortTasks', () => {
  it('ordena por más recientes primero', () => {
    const tasks = [
      makeTask({ id: 'a', createdAt: 1 }),
      makeTask({ id: 'b', createdAt: 3 }),
      makeTask({ id: 'c', createdAt: 2 }),
    ]
    expect(sortTasks(tasks, 'recent').map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('ordena por prioridad: alta, media y baja', () => {
    const tasks = [
      makeTask({ id: 'a', priority: 'low' }),
      makeTask({ id: 'b', priority: 'high' }),
      makeTask({ id: 'c', priority: 'medium' }),
    ]
    expect(sortTasks(tasks, 'priority').map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('ordena por vencimiento y deja las tareas sin fecha al final', () => {
    const tasks = [
      makeTask({ id: 'a', dueDate: '2026-12-01' }),
      makeTask({ id: 'b', dueDate: null }),
      makeTask({ id: 'c', dueDate: '2026-11-15' }),
    ]
    expect(sortTasks(tasks, 'dueDate').map((t) => t.id)).toEqual(['c', 'a', 'b'])
  })

  it('no modifica el array original', () => {
    const tasks = [
      makeTask({ id: 'a', priority: 'low' }),
      makeTask({ id: 'b', priority: 'high' }),
    ]
    sortTasks(tasks, 'priority')
    expect(tasks.map((t) => t.id)).toEqual(['a', 'b'])
  })
})