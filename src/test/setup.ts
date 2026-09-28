import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)

// next/font is resolved by the Next compiler; under Vitest each loader just
// returns the class/variable shape the layout reads.
vi.mock('next/font/local', () => ({
  default: () => ({ className: 'font', variable: 'font-variable', style: { fontFamily: 'font' } }),
}))
