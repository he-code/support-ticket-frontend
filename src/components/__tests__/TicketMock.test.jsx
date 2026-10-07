import { render, screen } from '@testing-library/react'
import TicketMock from '../TicketMock'

describe('TicketMock', () => {
  it('renders the ticket code and status badge', () => {
    render(<TicketMock />)
    expect(screen.getByText('#TKT-2481')).toBeInTheDocument()
    expect(screen.getByText('Abierto')).toBeInTheDocument()
  })

  it('shows the not-found variant', () => {
    render(<TicketMock notFound />)
    expect(screen.getByText('#TKT-404')).toBeInTheDocument()
    expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
  })

  it('renders priority and SLA', () => {
    render(<TicketMock priority="high" sla="04:12" />)
    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(screen.getByText(/SLA 04:12/)).toBeInTheDocument()
  })
})
