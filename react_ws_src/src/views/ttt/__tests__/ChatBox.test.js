import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import ChatBox from '../ChatBox'

describe('ChatBox', () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  }

  const defaultProps = {
    socket: mockSocket,
    isGameActive: true,
    opponentName: 'Opponent'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders chat input with correct max length', () => {
    const { container } = render(<ChatBox {...defaultProps} />)
    const textarea = container.querySelector('textarea')
    expect(textarea.getAttribute('maxLength')).toBe('500')
  })

  it('formats time correctly', () => {
    const { container } = render(<ChatBox {...defaultProps} />)
    const testDate = new Date()
    
    act(() => {
      mockSocket.on.mock.calls[0][1]({
        text: 'Test message',
        sender: 'player',
        timestamp: testDate.toISOString()
      })
    })

    const timeElement = container.querySelector('.message-time')
    expect(timeElement).toBeTruthy()
    expect(timeElement.textContent).toBe(
      testDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  })

  it('emits message with correct format when submitted', () => {
    const { container } = render(<ChatBox {...defaultProps} />)
    
    const textarea = container.querySelector('textarea')
    const form = container.querySelector('form')

    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.submit(form)

    expect(mockSocket.emit).toHaveBeenCalledWith('chat_message', expect.objectContaining({
      text: 'Test message',
      sender: 'player',
      timestamp: expect.any(String)
    }))
  })

  it('cleans up socket listener on unmount', () => {
    const { unmount } = render(<ChatBox {...defaultProps} />)
    unmount()
    expect(mockSocket.off).toHaveBeenCalledWith('chat_message')
  })
}) 