import type { ComponentProps } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthForm from './AuthForm'
import { getAuthErrorMessage } from '../services/authService'

// Reemplaza el servicio real (y con él, Firebase) por una versión falsa
vi.mock('../services/authService', () => ({
  getAuthErrorMessage: vi.fn(() => 'Email o contraseña incorrectos.'),
}))

const renderForm = (overrides: Partial<ComponentProps<typeof AuthForm>> = {}) => {
  const props = {
    title: 'Iniciar sesión',
    submitLabel: 'Entrar',
    onSubmit: vi.fn().mockResolvedValue(undefined),
    onGoogle: vi.fn().mockResolvedValue(undefined),
    footer: <span>Pie</span>,
    ...overrides,
  }
  render(<AuthForm {...props} />)
  return props
}

describe('AuthForm', () => {
  it('envía el email y la contraseña ingresados', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByPlaceholderText('Email'), 'ana@test.com')
    await user.type(screen.getByPlaceholderText('Contraseña'), '123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(onSubmit).toHaveBeenCalledWith('ana@test.com', '123456')
  })

  it('muestra un mensaje claro cuando falla la autenticación', async () => {
    const user = userEvent.setup()
    renderForm({ onSubmit: vi.fn().mockRejectedValue(new Error('auth/invalid-credential')) })

    await user.type(screen.getByPlaceholderText('Email'), 'ana@test.com')
    await user.type(screen.getByPlaceholderText('Contraseña'), 'mala')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email o contraseña incorrectos.')
    expect(getAuthErrorMessage).toHaveBeenCalled()
  })

  it('llama a onGoogle al tocar "Continuar con Google"', async () => {
    const user = userEvent.setup()
    const { onGoogle } = renderForm()

    await user.click(screen.getByRole('button', { name: 'Continuar con Google' }))

    expect(onGoogle).toHaveBeenCalled()
  })

  it('muestra el texto explicativo cuando se le pasa', () => {
    renderForm({ description: 'Accedé a tu cuenta para ver tus tareas.' })

    expect(screen.getByText('Accedé a tu cuenta para ver tus tareas.')).toBeInTheDocument()
  })

})