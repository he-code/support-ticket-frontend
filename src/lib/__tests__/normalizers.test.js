import { describe, it, expect } from 'vitest'
import { payloadFromResponse, collectionFromPayload, cleanParams, paginationFromPayload } from '../normalizers'

describe('payloadFromResponse', () => {
  it('extracts nested data.data', () => {
    expect(payloadFromResponse({ data: { data: { id: 1 } } })).toEqual({ id: 1 })
  })

  it('extracts data as fallback', () => {
    expect(payloadFromResponse({ data: { id: 1 } })).toEqual({ id: 1 })
  })

  it('returns response as-is when no wrapping', () => {
    expect(payloadFromResponse({ id: 1 })).toEqual({ id: 1 })
  })
})

describe('collectionFromPayload', () => {
  it('returns array directly', () => {
    expect(collectionFromPayload([1, 2])).toEqual([1, 2])
  })

  it('extracts .data array', () => {
    expect(collectionFromPayload({ data: { data: [1, 2] } })).toEqual([1, 2])
  })

  it('extracts .tickets array', () => {
    expect(collectionFromPayload({ data: { tickets: [1] } })).toEqual([1])
  })

  it('returns empty array when no match', () => {
    expect(collectionFromPayload({ data: { foo: 'bar' } })).toEqual([])
  })
})

describe('cleanParams', () => {
  it('removes empty strings and nulls', () => {
    expect(cleanParams({ a: '', b: null, c: 'val' })).toEqual({ c: 'val' })
  })

  it('keeps falsy but non-empty values', () => {
    expect(cleanParams({ a: 0, b: false })).toEqual({ a: 0, b: false })
  })
})

describe('paginationFromPayload', () => {
  it('preserves meta from the Laravel envelope', () => {
    const { items, meta } = paginationFromPayload({
      data: [{ id: 1 }, { id: 2 }],
      meta: { total: 30, per_page: 15 },
    })

    expect(items).toHaveLength(2)
    expect(meta?.total).toBe(30)
    expect(meta?.per_page).toBe(15)
  })

  it('reads meta from a nested envelope', () => {
    const { items, meta } = paginationFromPayload({
      data: { data: [{ id: 1 }], meta: { total: 5, per_page: 15 } },
    })

    expect(items).toHaveLength(1)
    expect(meta?.total).toBe(5)
  })

  it('returns null meta for a plain array', () => {
    const { items, meta } = paginationFromPayload([{ id: 1 }])

    expect(items).toHaveLength(1)
    expect(meta).toBeNull()
  })
})
