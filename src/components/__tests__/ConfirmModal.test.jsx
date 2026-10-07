import { fireEvent, render, screen } from '@testing-library/react'
import ConfirmModal from '../ConfirmModal'

function buildProps(overrides = {}) {
  return {
    title: 'Delete item?',
    description: 'This action is irreversible.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    tone: 'rose',
    loading: false,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  }
}

describe('ConfirmModal', () => {
  it('renders title and description', () => {
    render(<ConfirmModal {...buildProps()} />)
    expect(screen.getByText('Delete item?')).toBeInTheDocument()
    expect(screen.getByText('This action is irreversible.')).toBeInTheDocument()
  })

  it('renders confirm and cancel labels', () => {
    render(<ConfirmModal {...buildProps()} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const props = buildProps()
    render(<ConfirmModal {...props} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(props.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button clicked', () => {
    const props = buildProps()
    render(<ConfirmModal {...props} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(props.onCancel).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when loading', () => {
    render(<ConfirmModal {...buildProps({ loading: true })} />)
    expect(screen.getByText('Cancel')).toBeDisabled()
    expect(screen.getByText('Procesando...')).toBeDisabled()
  })

  it('shows processing text when loading', () => {
    render(<ConfirmModal {...buildProps({ loading: true })} />)
    expect(screen.getByText('Procesando...')).toBeInTheDocument()
  })

  it('calls onCancel on Escape key', () => {
    const props = buildProps()
    render(<ConfirmModal {...props} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(props.onCancel).toHaveBeenCalledTimes(1)
  })

  it('does not call onCancel on Escape when loading', () => {
    const props = buildProps({ loading: true })
    render(<ConfirmModal {...props} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(props.onCancel).not.toHaveBeenCalled()
  })

  it('closes on backdrop click', () => {
    const props = buildProps()
    render(<ConfirmModal {...props} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(props.onCancel).toHaveBeenCalledTimes(1)
  })

  it('does not close on backdrop click when loading', () => {
    const props = buildProps({ loading: true })
    render(<ConfirmModal {...props} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(props.onCancel).not.toHaveBeenCalled()
  })

  it('does not close on inner content click', () => {
    const props = buildProps()
    render(<ConfirmModal {...props} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(props.onCancel).not.toHaveBeenCalled()
  })

  it('accepts custom tone', () => {
    const props = buildProps({ tone: 'amber', confirmLabel: 'OK' })
    render(<ConfirmModal {...props} />)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('focuses cancel by default, not the destructive action', () => {
    render(<ConfirmModal {...buildProps()} />)
    expect(screen.getByText('Cancel')).toHaveFocus()
  })

  it('traps Tab within the dialog buttons', () => {
    render(<ConfirmModal {...buildProps()} />)
    const dialog = screen.getByRole('dialog')

    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(screen.getByText('Delete')).toHaveFocus()

    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(screen.getByText('Cancel')).toHaveFocus()
  })

  it('traps Shift+Tab cycling backwards', () => {
    render(<ConfirmModal {...buildProps()} />)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true })
    expect(screen.getByText('Delete')).toHaveFocus()
  })

  it('marks the dialog as modal and labelled', () => {
    render(<ConfirmModal {...buildProps()} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('restores focus to the triggering element on unmount', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const { unmount } = render(<ConfirmModal {...buildProps()} />)
    expect(screen.getByText('Cancel')).toHaveFocus()
    unmount()
    expect(trigger).toHaveFocus()

    document.body.removeChild(trigger)
  })
})

