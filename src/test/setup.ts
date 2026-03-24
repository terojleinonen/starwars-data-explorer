import '@testing-library/jest-dom'
import { expect } from 'vitest'

// Make expect globally available
declare global {
  var expect: typeof import('vitest').expect;
}

globalThis.expect = expect;