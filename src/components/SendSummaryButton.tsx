import { useState } from 'react'

type Status = 'idle' | 'sending' | 'success' | 'error'

interface SendSummaryButtonProps {
  onSend: () => Promise<void>
  disabled?: boolean
}

export default function SendSummaryButton({ onSend, disabled }: SendSummaryButtonProps) {
  const [status, setStatus] = useState<Status>('idle')

  const handleClick = async () => {
    setStatus('sending')
    try {
      await onSend()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={disabled || status === 'sending'}
        className="border rounded-lg px-3 py-1 text-sm bg-white disabled:opacity-50"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar resumen por email'}
      </button>
      {status === 'success' && (
        <p role="status" className="text-sm text-green-700">
          ¡Resumen enviado! Revisá tu casilla (y la carpeta de spam).
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600">
          No se pudo enviar el email. Intentá de nuevo.
        </p>
      )}
    </div>
  )
}