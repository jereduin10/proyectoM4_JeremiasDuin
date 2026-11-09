import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpia el DOM después de cada test para que no se mezclen entre sí
afterEach(() => cleanup())