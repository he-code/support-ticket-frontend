import { fireEvent, render, screen } from '@testing-library/react'
import PaginationBar from '../PaginationBar'

describe('PaginationBar', () => {
  it('returns null when totalPages <= 1', () => {
    const { container } = render(
      <PaginationBar onPageChange={vi.fn()} page={1} total={5} totalPages={1} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders total count text', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={1} total={25} totalPages={5} />,
    )
    expect(screen.getByText('25 resultados')).toBeInTheDocument()
  })

  it('renders start and end page buttons', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={3} total={50} totalPages={10} />,
    )
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders page numbers around current page', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={5} total={100} totalPages={20} />,
    )
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('disables prev button on first page', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={1} total={25} totalPages={5} />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={5} total={25} totalPages={5} />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons[buttons.length - 1]).toBeDisabled()
  })

  it('calls onPageChange when page button clicked', () => {
    const onPageChange = vi.fn()
    render(
      <PaginationBar onPageChange={onPageChange} page={1} total={25} totalPages={5} />,
    )
    fireEvent.click(screen.getByText('3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with prev when clicking prev', () => {
    const onPageChange = vi.fn()
    render(
      <PaginationBar onPageChange={onPageChange} page={3} total={25} totalPages={5} />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next when clicking next', () => {
    const onPageChange = vi.fn()
    render(
      <PaginationBar onPageChange={onPageChange} page={3} total={25} totalPages={5} />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('shows ellipsis for large gaps before', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={8} total={100} totalPages={20} />,
    )
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('shows ellipsis for large gaps after', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={3} total={100} totalPages={20} />,
    )
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('highlights active page', () => {
    render(
      <PaginationBar onPageChange={vi.fn()} page={3} total={25} totalPages={5} />,
    )
    const pages = ['1', '2', '3', '4', '5']
    const activeButton = pages.find((p) => {
      const el = screen.getByText(p)
      return el.tagName === 'SPAN'
    })
    expect(activeButton).toBe('3')
  })
})
