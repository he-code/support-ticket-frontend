import { describe, it, expect } from 'vitest'
import { statusOptions, priorityOptions, roleOptions } from '../constants'

describe('constants', () => {
  it('statusOptions has correct length', () => {
    expect(statusOptions).toHaveLength(7)
  })

  it('priorityOptions has correct length', () => {
    expect(priorityOptions).toHaveLength(4)
  })

  it('roleOptions has correct roles', () => {
    const values = roleOptions.map((r) => r.value)
    expect(values).toContain('admin')
    expect(values).toContain('support_agent')
    expect(values).toContain('user')
  })
})
