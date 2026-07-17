import { useState, useEffect, useRef } from 'react';

// Mock chat history
const CHAT_HISTORY = [
  {
    id: 'chat-1',
    title: 'Account Settings Issue',
    lastMessage: 'Thank you for that information...',
    timestamp: 'Today 2:32 PM',
    unread: 0,
    status: 'active'
  },
  {
    id: 'chat-2',
    title: 'Payment Processing',
    lastMessage: 'We\'ve resolved the issue',
    timestamp: 'Yesterday',
    unread: 0,
    status: 'resolved'
  },
  {
    id: 'chat-3',
    title: 'Login Problem',
    lastMessage: 'I\'ll check that for you',
    timestamp: 'Jul 8',
    unread: 2,
    status: 'active'
  },
  {
    id: 'chat-4',
    title: 'Feature Request',
    lastMessage: 'I\'ve forwarded your request',
    timestamp: 'Jul 7',
    unread: 0,
    status: 'closed'
  }
];

// Mock chat messages
const INITIAL_MESSAGES = [
  {
    id: 1,
    author: 'Maya Rodriguez',
    authorType: 'agent',
    message: 'Hi Alex! I\'m Maya, your support agent. How can I help you today?',
    timestamp: '14:30',
    avatar: 'MR'
  },
  {
    id: 2,
    author: 'You',
    authorType: 'client',
    message: 'Hi Maya! I\'m having some issues with my account settings.',
    timestamp: '14:31',
    avatar: 'AT'
  },
  {
    id: 3,
    author: 'Maya Rodriguez',
    authorType: 'agent',
    message: 'I\'d be happy to help you with that. Can you tell me more about what you\'re experiencing?',
    timestamp: '14:31',
    avatar: 'MR'
  },
  {
    id: 4,
    author: 'You',
    authorType: 'client',
    message: 'When I try to update my notification preferences, the changes don\'t seem to save.',
    timestamp: '14:32',
    avatar: 'AT'
  }
];

export default function ChatWithSupport() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState('chat-1');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setSending(true);

    // Add client message
    const clientMessage = {
      id: messages.length + 1,
      author: 'You',
      authorType: 'client',
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatar: 'AT'
    };

    setMessages([...messages, clientMessage]);
    setNewMessage('');
    setSending(false);

    // Simulate agent typing
    setIsTyping(true);

    // Mock agent auto-reply after 2 seconds
    setTimeout(() => {
      setIsTyping(false);
      const agentMessage = {
        id: messages.length + 2,
        author: 'Maya Rodriguez',
        authorType: 'agent',
        message: 'Thank you for that information. Let me check your account settings right now.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        avatar: 'MR'
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-800 rounded-2xl shadow-xl p-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white dark:bg-slate-800 opacity-5 rounded-full -mr-24 -mt-24"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 bg-opacity-20 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm">
              💭
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Chat with Support</h2>
              <p className="text-purple-100 text-xs">Get instant help from our dedicated support agents in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat History Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b-2 border-gray-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat History
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {CHAT_HISTORY.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border-2
                  ${selectedChat === chat.id 
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-md' 
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:shadow-sm'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`text-sm font-bold line-clamp-1 ${selectedChat === chat.id ? 'text-purple-900' : 'text-gray-900 dark:text-white'}`}>
                    {chat.title}
                  </h4>
                  {chat.unread > 0 && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-1 mb-2">{chat.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-slate-400">{chat.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${chat.status === 'active' ? 'bg-green-100 text-green-700' : 
                      chat.status === 'resolved' ? 'bg-blue-100 text-blue-700' : 
                      'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>
                    {chat.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t-2 border-gray-200 dark:border-slate-700">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>
        </div>

        {/* Chat Container - Maximum Space */}
        <div className="flex-1 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Agent Status Header - Compact */}
          <div className="px-6 py-4 border-b-2 border-gray-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg">
                  MR
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Connected with Maya Rodriguez</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600 dark:text-slate-300 font-medium">Senior Support Engineer</span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

        {/* Messages - Maximum Space */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-4 animate-fadeIn ${message.authorType === 'client' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0 self-end shadow-lg transform hover:scale-110 transition-transform
                  ${message.authorType === 'client' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'}`}
              >
                {message.avatar}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-md ${message.authorType === 'client' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-lg hover:shadow-xl transition-shadow
                    ${message.authorType === 'client'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                      : 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-bl-sm'
                    }`}
                >
                  {message.message}
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 mt-2 px-2 font-medium">{message.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 animate-fadeIn">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg">
                MR
              </div>
              <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-6 py-4 shadow-lg">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Compact */}
        <div className="border-t-2 border-gray-200 dark:border-slate-700 p-4 bg-gradient-to-r from-white to-purple-50 shrink-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none hover:border-gray-400 transition-colors"
            />
            <button
              className="px-4 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 dark:text-slate-200 rounded-xl transition-all shadow-md hover:shadow-lg text-lg"
              title="Attach file"
            >
              📎
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-200 hover:shadow-xl"
            >
              {sending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Press <kbd className="px-2 py-0.5 bg-gray-200 rounded text-gray-700 dark:text-slate-200 font-mono text-xs font-semibold">Enter</kbd> to send • Avg response: <span className="font-semibold text-purple-600">2 min</span>
          </p>
        </div>
      </div>
    </div>

      {/* Info Banner - Compact */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shrink-0 shadow-lg">
            💬
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-purple-900 mb-1">
              24/7 Real-time Support
            </h4>
            <p className="text-xs text-purple-800 leading-relaxed">
              Our dedicated support team is available around the clock. All messages are saved to your ticket history automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
