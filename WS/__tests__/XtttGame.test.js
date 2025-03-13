const io = require('socket.io-client')
const { createServer } = require('http')
const { Server } = require('socket.io')
const util = require('util')

const mockEmit = jest.fn()
const mockTo = jest.fn(() => ({
  emit: mockEmit
}))

global.io = {
  to: mockTo
}

global.util = {
  log: jest.fn()
}

const { onNewPlayer, onChatMessage, pair_avail_players } = require('../XtttGame')

describe('XtttGame Chat', () => {
  let mockSocket

  beforeEach(() => {
    mockSocket = {
      id: 'socket1',
      player: {
        opp: {
          sockid: 'socket2'
        }
      }
    }
    mockTo.mockClear()
    mockEmit.mockClear()
  })

  it('should broadcast chat message to opponent', () => {
    const testMessage = {
      text: 'Hello opponent',
      sender: 'player',
      timestamp: new Date().toISOString()
    }

    onChatMessage.call(mockSocket, testMessage)

    expect(mockTo).toHaveBeenCalledWith('socket2')
    expect(mockEmit).toHaveBeenCalledWith('chat_message', Object.assign({}, testMessage, {
      sender: 'opponent'
    }))
  })

  it('should not broadcast message if player is not paired', () => {
    const testMessage = {
      text: 'Hello',
      sender: 'player',
      timestamp: new Date().toISOString()
    }

    const unpairSocket = { id: 'socket3' }
    onChatMessage.call(unpairSocket, testMessage)

    expect(mockTo).not.toHaveBeenCalled()
  })
}) 