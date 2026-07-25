import { get, post, patch, del, withEndpointFallback } from '../request'

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '../client'

const mockResponse = (data, status = 200) => ({
  data: { data },
  status,
})

describe('request helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('calls api.get with url and config', async () => {
      api.get.mockResolvedValue(mockResponse('result'))
      const result = await get('/tickets', { params: { page: 1 } })
      expect(api.get).toHaveBeenCalledWith('/tickets', { params: { page: 1 } })
      expect(result).toBe('result')
    })

    it('extracts nested data from response', async () => {
      api.get.mockResolvedValue({ data: { data: { items: [] } } })
      const result = await get('/tickets')
      expect(result).toEqual({ items: [] })
    })
  })

  describe('post', () => {
    it('calls api.post with url and payload', async () => {
      api.post.mockResolvedValue(mockResponse('created'))
      const result = await post('/tickets', { title: 'Bug' })
      expect(api.post).toHaveBeenCalledWith('/tickets', { title: 'Bug' }, undefined)
      expect(result).toBe('created')
    })

    it('passes config as third argument', async () => {
      api.post.mockResolvedValue(mockResponse('ok'))
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      await post('/upload', new FormData(), config)
      expect(api.post).toHaveBeenCalledWith('/upload', expect.any(FormData), config)
    })
  })

  describe('patch', () => {
    it('calls api.patch with url and data', async () => {
      api.patch.mockResolvedValue(mockResponse('updated'))
      const result = await patch('/tickets/1', { status: 'closed' })
      expect(api.patch).toHaveBeenCalledWith('/tickets/1', { status: 'closed' }, undefined)
      expect(result).toBe('updated')
    })
  })

  describe('del', () => {
    it('calls api.delete with url', async () => {
      api.delete.mockResolvedValue(mockResponse('deleted'))
      const result = await del('/tickets/1')
      expect(api.delete).toHaveBeenCalledWith('/tickets/1', undefined)
      expect(result).toBe('deleted')
    })
  })

  describe('withEndpointFallback', () => {
    it('returns result from first endpoint', async () => {
      api.get.mockResolvedValue(mockResponse('ok'))
      const result = await withEndpointFallback('/categories', (ep) => get(ep))
      expect(result).toBe('ok')
    })

    it('falls back to next endpoint on 404', async () => {
      api.get
        .mockRejectedValueOnce({ response: { status: 404 } })
        .mockResolvedValueOnce(mockResponse('ok'))

      const result = await withEndpointFallback(
        ['/v1/categories', '/v2/categories'],
        (ep) => get(ep),
      )

      expect(api.get).toHaveBeenCalledTimes(2)
      expect(result).toBe('ok')
    })

    it('falls back on 405', async () => {
      api.get
        .mockRejectedValueOnce({ response: { status: 405 } })
        .mockResolvedValueOnce(mockResponse('ok'))

      const result = await withEndpointFallback(
        ['/v1/categories', '/v2/categories'],
        (ep) => get(ep),
      )

      expect(result).toBe('ok')
    })

    it('does not fall back on non-404/405 errors', async () => {
      const err = { response: { status: 422, data: { message: 'Validation error' } } }
      api.get.mockRejectedValue(err)

      await expect(
        withEndpointFallback(['/v1/categories', '/v2/categories'], (ep) => get(ep)),
      ).rejects.toThrow()

      expect(api.get).toHaveBeenCalledTimes(1)
    })

    it('throws last error when all endpoints fail with 404', async () => {
      api.get
        .mockRejectedValueOnce({ response: { status: 404 } })
        .mockRejectedValueOnce({ response: { status: 404 } })

      await expect(
        withEndpointFallback(['/v1/categories', '/v2/categories'], (ep) => get(ep)),
      ).rejects.toThrow()

      expect(api.get).toHaveBeenCalledTimes(2)
    })

    it('works with a single string endpoint', async () => {
      api.get.mockResolvedValue(mockResponse('ok'))
      const result = await withEndpointFallback('/categories', (ep) => get(ep))
      expect(result).toBe('ok')
    })
  })
})
