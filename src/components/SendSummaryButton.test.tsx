import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SendSummaryButton from './SendSummaryButton'

const buttonName = 'Enviar resumen por email'

describe('SendSummaryButton', () => {
  it('muestra el mensaje de éxito cuando el envío funciona', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn().mockResolvedValue(undefined)
    render(<SendSummaryButton onSend={onSend} />)

    await user.click(screen.getByRole('button', { name: buttonName }))

    expect(onSend).toHaveBeenCalled()
    expect(await screen.findByRole('status')).toHaveTextContent('Resumen enviado')
  })

  it('muestra un error cuando el envío falla', async () => {
    const user = userEvent.setup()
    render(<SendSummaryButton onSend={vi.fn().mockRejectedValue(new Error('fallo'))} />)

    await user.click(screen.getByRole('button', { name: buttonName }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo enviar el email')
  })

  it('está deshabilitado cuando se le indica', () => {
    render(<SendSummaryButton onSend={vi.fn()} disabled />)
    expect(screen.getByRole('button', { name: buttonName })).toBeDisabled()
  })
})