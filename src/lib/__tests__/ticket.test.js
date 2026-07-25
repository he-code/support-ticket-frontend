import { describe, it, expect } from 'vitest'
import {
  getTicketCode,
  getTicketTitle,
  getTicketDescription,
  getTicketCategory,
  getTicketRequester,
  getTicketAgent,
  getTicketAgentId,
  personName,
  getTicketCreatedAt,
  getStatusMeta,
  getPriorityMeta,
  getRoleLabel,
} from '../ticket'

describe('getTicketCode', () => {
  it('returns code from ticket', () => {
    expect(getTicketCode({ code: 'TK-001' })).toBe('TK-001')
  })

  it('generates code from id when missing', () => {
    expect(getTicketCode({ id: 1 })).toBe('TK-0001')
  })
})

describe('getTicketTitle', () => {
  it('returns title', () => {
    expect(getTicketTitle({ title: 'Bug' })).toBe('Bug')
  })

  it('falls back to subject', () => {
    expect(getTicketTitle({ subject: 'Issue' })).toBe('Issue')
  })
})

describe('getTicketDescription', () => {
  it('returns description', () => {
    expect(getTicketDescription({ description: 'text' })).toBe('text')
  })
})

describe('getTicketCategory', () => {
  it('returns category name from object', () => {
    expect(getTicketCategory({ category: { name: 'Redes' } })).toBe('Redes')
  })

  it('returns category_name string', () => {
    expect(getTicketCategory({ category_name: 'Hardware' })).toBe('Hardware')
  })
})

describe('getTicketRequester', () => {
  it('returns requester object', () => {
    const user = { name: 'Ana' }
    expect(getTicketRequester({ requester: user })).toBe(user)
  })

  it('returns empty object when missing', () => {
    expect(getTicketRequester({})).toEqual({})
  })
})

describe('getTicketAgent', () => {
  it('returns agent object', () => {
    const agent = { name: 'Luis' }
    expect(getTicketAgent({ agent })).toBe(agent)
  })
})

describe('getTicketAgentId', () => {
  it('returns agent_id', () => {
    expect(getTicketAgentId({ agent_id: 5 })).toBe(5)
  })

  it('extracts id from nested agent', () => {
    expect(getTicketAgentId({ agent: { id: 3 } })).toBe(3)
  })
})

describe('personName', () => {
  it('returns name', () => {
    expect(personName({ name: 'Ana' })).toBe('Ana')
  })

  it('falls back to email', () => {
    expect(personName({ email: 'a@b.com' })).toBe('a@b.com')
  })

  it('uses fallback when empty', () => {
    expect(personName({})).toBe('Sin asignar')
  })
})

describe('getTicketCreatedAt', () => {
  it('returns created_at', () => {
    expect(getTicketCreatedAt({ created_at: '2024-01-01' })).toBe('2024-01-01')
  })
})

describe('getStatusMeta', () => {
  it('returns meta for known status', () => {
    expect(getStatusMeta('open').label).toBe('Abierto')
  })

  it('returns fallback for unknown status', () => {
    expect(getStatusMeta('bogus').label).toBe('bogus')
  })
})

describe('getPriorityMeta', () => {
  it('returns meta for known priority', () => {
    expect(getPriorityMeta('urgent').label).toBe('Urgente')
  })
})

describe('getRoleLabel', () => {
  it('returns label for known role', () => {
    expect(getRoleLabel('admin')).toBe('Administrador')
  })

  it('returns raw value for unknown role', () => {
    expect(getRoleLabel('super_admin')).toBe('super_admin')
  })
})
