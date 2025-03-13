import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const Message = React.memo(({ message, formatTime }) => (
  <div
    className={'message ' + (message.sender === 'player' ? 'sent' : 'received')}
  >
    <div className="message-content">
      <div className="message-text">{message.text}</div>
    </div>
    {message.timestamp && (
      <div className="message-time">{formatTime(message.timestamp)}</div>
    )}
  </div>
))

Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    timestamp: PropTypes.string
  }).isRequired,
  formatTime: PropTypes.func.isRequired
}

const ChatHeader = ({ isGameActive, displayName, connectionStatus }) => (
  <div className="chat-header">
    <div className={`status ${isGameActive ? 'online connected' : ''}`}></div>
    <h3>{displayName}</h3>
    <div className="connection-status">
      {connectionStatus}
    </div>
  </div>
)

ChatHeader.propTypes = {
  isGameActive: PropTypes.bool.isRequired,
  displayName: PropTypes.string.isRequired,
  connectionStatus: PropTypes.string.isRequired
}

const ChatMessages = ({ messages, formatTime, messagesEndRef }) => (
  <div className="chat-messages">
    {messages.length === 0 && (
      <div className="no-messages">
        No messages yet
      </div>
    )}
    {messages.map((message, index) => (
      <Message
        key={message.timestamp + '-' + index}
        message={message}
        formatTime={formatTime}
      />
    ))}
    <div ref={messagesEndRef} />
  </div>
)

ChatMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  formatTime: PropTypes.func.isRequired,
  messagesEndRef: PropTypes.object.isRequired
}

const ChatInput = ({ 
  handleSubmit, 
  newMessage, 
  setNewMessage, 
  handleKeyDown, 
  isGameActive, 
  textareaRef, 
  MESSAGE_MAX_LENGTH 
}) => (
  <form onSubmit={handleSubmit} className="chat-input">
    <textarea
      ref={textareaRef}
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={isGameActive ? 'Type a message...' : 'Game not active'}
      disabled={!isGameActive}
      maxLength={MESSAGE_MAX_LENGTH}
      rows={1}
    />
    <button type="submit" disabled={!isGameActive || !newMessage.trim()}>
      Send
    </button>
  </form>
)

ChatInput.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  isGameActive: PropTypes.bool.isRequired,
  textareaRef: PropTypes.object.isRequired,
  MESSAGE_MAX_LENGTH: PropTypes.number.isRequired
}

const formatTime = timestamp => {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (e) {
    console.error('Error formatting time:', e);
    return '';
  }
}

export default function ChatBox({ socket, isGameActive, opponentName }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [minimized, setMinimized] = useState(false)
  const [width, setWidth] = useState(300)
  const messagesEndRef = useRef(null)
  const chatBoxRef = useRef(null)
  const resizeStartXRef = useRef(0)
  const initialWidthRef = useRef(0)
  const textareaRef = useRef(null)
  const MESSAGE_MAX_LENGTH = 500
  
  const displayName = opponentName && opponentName !== 'Connecting' && opponentName !== 'Waiting' && isGameActive
    ? `${opponentName}` 
    : 'Game Chat'

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!socket) return

    socket.on('chat_message', message => {
      setMessages(prevMessages => [...prevMessages, message])
      setMinimized(false)
    })

    return () => socket.off('chat_message')
  }, [socket])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setConnectionStatus(isGameActive ? 'Online' : 'Connecting...')
  }, [isGameActive])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  const handleSubmit = event => {
    event.preventDefault()
    if (!newMessage.trim() || !socket || !isGameActive) return

    const message = {
      text: newMessage.trim(),
      sender: 'player',
      timestamp: new Date().toISOString()
    }

    setMessages(prevMessages => [...prevMessages, message])
    socket.emit('chat_message', message)
    setNewMessage('')
  }

  const toggleMinimize = () => {
    setMinimized(!minimized)
  }

  const handleResizeStart = (e) => {
    e.preventDefault()
    resizeStartXRef.current = e.clientX
    initialWidthRef.current = chatBoxRef.current.offsetWidth
    
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }

  const handleResizeMove = (e) => {
    if (chatBoxRef.current) {
      const deltaX = resizeStartXRef.current - e.clientX
      const newWidth = Math.min(Math.max(initialWidthRef.current + deltaX, 250), 500)
      setWidth(newWidth)
      chatBoxRef.current.style.width = `${newWidth}px`
    }
  }

  const handleResizeEnd = () => {
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div 
      ref={chatBoxRef}
      className={`chat-box ${minimized ? 'minimized' : ''}`}
      style={{ width: `${width}px` }}
    >
      <div 
        className="resize-handle" 
        onMouseDown={handleResizeStart}
      ></div>
      <div className="chat-toggle" onClick={toggleMinimize}></div>
      
      <ChatHeader 
        isGameActive={isGameActive}
        displayName={displayName}
        connectionStatus={connectionStatus}
      />
      
      <ChatMessages 
        messages={messages}
        formatTime={formatTime}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput 
        handleSubmit={handleSubmit}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleKeyDown={handleKeyDown}
        isGameActive={isGameActive}
        textareaRef={textareaRef}
        MESSAGE_MAX_LENGTH={MESSAGE_MAX_LENGTH}
      />
    </div>
  )
}

ChatBox.propTypes = {
  socket: PropTypes.shape({
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired
  }).isRequired,
  isGameActive: PropTypes.bool.isRequired,
  opponentName: PropTypes.string.isRequired
} 