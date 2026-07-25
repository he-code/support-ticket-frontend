import { describe, it, expect } from 'vitest'
import { formatDate, getInitials } from '../formatters'

describe('formatDate', () => {
  it('returns fallback for null', () => {
    expect(formatDate(null)).toBe('Sin fecha')
  })

  it('returns fallback for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('Sin fecha')
  })

  it('formats valid date', () => {
    const result = formatDate('2024-06-15T10:30:00Z')
    expect(result).not.toBe('Sin fecha')
    expect(typeof result).toBe('string')
  })
})

describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('Ana Maria Lopez')).toBe('AM')
  })

  it('returns first initial for single name', () => {
    expect(getInitials('Ana')).toBe('A')
  })

  it('returns fallback for empty', () => {
    expect(getInitials('')).toBe('ST')
  })
})
