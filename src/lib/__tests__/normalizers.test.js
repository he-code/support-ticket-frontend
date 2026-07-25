import { describe, it, expect } from 'vitest'
import { payloadFromResponse, collectionFromPayload, cleanParams } from '../normalizers'

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
