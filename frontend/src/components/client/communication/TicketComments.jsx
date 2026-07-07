import { useState } from 'react';

// Mock tickets
const MOCK_TICKETS = [
  { id: 'TK-1001', subject: 'Login button not responding', status: 'In Progress' },
  { id: 'TK-1002', subject: 'Cannot upload profile picture', status: 'Pending' },
  { id: 'TK-1003', subject: 'Payment processing error', status: 'Resolved' },
  { id: 'TK-1005', subject: 'Email notifications not working', status: 'In Progress' }
];

// Mock comments per ticket
const MOCK_COMMENTS = {
  'TK-1001': [
    {
      id: 1,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'The login button is completely unresponsive. I\'ve tried on Chrome, Firefox, and Safari.',
      timestamp: '2024-07-10 14:30',
      avatar: 'AT'
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      authorType: 'agent',
      role: 'Senior Support Engineer',
      message: 'Thank you for reporting this. I\'m investigating the issue now. Can you tell me if you see any error messages in the browser console?',
      timestamp: '2024-07-10 14:45',
      avatar: 'SJ'
    },
    {
      id: 3,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'Yes, I see "TypeError: Cannot read property \'submit\' of undefined"',
      timestamp: '2024-07-10 15:00',
      avatar: 'AT'
    },
    {
      id: 4,
      author: 'Sarah Johnson',
      authorType: 'agent',
      role: 'Senior Support Engineer',
      message: 'Perfect, that helps a lot! I\'ve identified the issue. It\'s related to a recent deployment. Our team is working on a fix and it should be resolved within the next hour.',
      timestamp: '2024-07-10 15:15',
      avatar: 'SJ'
    }
  ],
  'TK-1002': [
    {
      id: 1,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'When I try to upload a profile picture, nothing happens. The file selector opens but after I select an image, it doesn\'t upload.',
      timestamp: '2024-07-09 10:00',
      avatar: 'AT'
    },
    {
      id: 2,
      author: 'Michael Chen',
      authorType: 'agent',
      role: 'Support Specialist',
      message: 'Hi Alex, I\'d like to help you with this. What file format and size is the image you\'re trying to upload?',
      timestamp: '2024-07-09 10:20',
      avatar: 'MC'
    },
    {
      id: 3,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'It\'s a JPG file, about 2.5MB in size.',
      timestamp: '2024-07-09 14:00',
      avatar: 'AT'
    }
  ],
  'TK-1003': [
    {
      id: 1,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'URGENT: Payment processing is failing. I get an error message "Transaction declined - contact support"',
      timestamp: '2024-07-07 09:00',
      avatar: 'AT'
    },
    {
      id: 2,
      author: 'Emily Rodriguez',
      authorType: 'agent',
      role: 'Senior Support Engineer',
      message: 'I\'m escalating this to our payment team immediately. Can you provide the transaction ID?',
      timestamp: '2024-07-07 09:10',
      avatar: 'ER'
    },
    {
      id: 3,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'Transaction ID: TXN-9847562',
      timestamp: '2024-07-07 09:15',
      avatar: 'AT'
    },
    {
      id: 4,
      author: 'Emily Rodriguez',
      authorType: 'agent',
      role: 'Senior Support Engineer',
      message: 'Thank you! I\'ve found the issue - there was a temporary gateway outage. We\'ve applied a hotfix and verified your transaction is now processing successfully. Please try again.',
      timestamp: '2024-07-07 14:00',
      avatar: 'ER'
    },
    {
      id: 5,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'Confirmed working now! Thank you for the quick response.',
      timestamp: '2024-07-07 14:30',
      avatar: 'AT'
    }
  ],
  'TK-1005': [
    {
      id: 1,
      author: 'Alex Thompson',
      authorType: 'client',
      message: 'I haven\'t been receiving any email notifications for the past few days.',
      timestamp: '2024-07-10 08:00',
      avatar: 'AT'
    },
    {
      id: 2,
      author: 'David Kim',
      authorType: 'agent',
      role: 'Technical Support Lead',
      message: 'Let me check your notification settings. Can you verify your email address is correct in your profile?',
      timestamp: '2024-07-10 08:15',
      avatar: 'DK'
    }
  ]
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function TicketComments() {
  const [selectedTicket, setSelectedTicket] = useState('TK-1001');
  const [comments, setComments] = useState(MOCK_COMMENTS[selectedTicket] || []);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  const currentTicket = MOCK_TICKETS.find(t => t.id === selectedTicket);

  const handleTicketChange = (ticketId) => {
    setSelectedTicket(ticketId);
    setComments(MOCK_COMMENTS[ticketId] || []);
    setNewComment('');
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    setPosting(true);
    
    // Simulate posting delay
    setTimeout(() => {
      const newCommentObj = {
        id: comments.length + 1,
        author: 'Alex Thompson',
        authorType: 'client',
        message: newComment.trim(),
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        avatar: 'AT'
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');
      setPosting(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handlePostComment();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800 rounded-2xl shadow-xl p-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-24 -mt-24"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm">
              💬
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Ticket Comments</h2>
              <p className="text-blue-100 text-xs">Collaborate with support agents through threaded conversations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Selector */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 mb-6">
        <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Select Ticket to View Comments
        </label>
        <select
          value={selectedTicket}
          onChange={(e) => handleTicketChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer"
        >
          {MOCK_TICKETS.map(ticket => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.id} - {ticket.subject} ({ticket.status})
            </option>
          ))}
        </select>
      </div>

      {/* Comments Thread - Maximized Space */}
      <div className="flex-1 bg-white border-2 border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-0">
        {/* Compact Ticket Info Header */}
        <div className="px-6 py-4 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 text-blue-700 text-xs font-mono font-bold rounded-lg">
                {currentTicket?.id}
              </span>
              <h3 className="text-base font-bold text-gray-900">{currentTicket?.subject}</h3>
            </div>
            <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-md">
              {currentTicket?.status}
            </span>
          </div>
        </div>

        {/* Comments List - Maximum Space */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white">
          {comments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-4xl mb-4 mx-auto shadow-lg">
                💬
              </div>
              <p className="text-lg text-gray-600 font-semibold mb-1">No comments yet</p>
              <p className="text-sm text-gray-400">Be the first to start the conversation</p>
            </div>
          ) : (
            comments.map(comment => (
              <div
                key={comment.id}
                className={`flex gap-5 animate-fadeIn ${comment.authorType === 'client' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg transform hover:scale-110 transition-transform
                    ${comment.authorType === 'client' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'}`}
                >
                  {comment.avatar}
                </div>

                {/* Comment Content */}
                <div className={`flex-1 max-w-2xl ${comment.authorType === 'client' ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${comment.authorType === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-sm font-bold text-gray-900">{comment.author}</span>
                    {comment.role && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 font-medium">{comment.role}</span>
                      </>
                    )}
                  </div>
                  <div
                    className={`inline-block px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-lg hover:shadow-xl transition-shadow
                      ${comment.authorType === 'client'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                        : 'bg-white border-2 border-gray-200 text-gray-900 rounded-bl-sm'
                      }`}
                  >
                    {comment.message}
                  </div>
                  <div className={`text-xs text-gray-400 mt-2 font-medium ${comment.authorType === 'client' ? 'text-right' : 'text-left'}`}>
                    {formatTimestamp(comment.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input - Compact */}
        <div className="border-t-2 border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white shrink-0">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Write your comment here..."
              rows={2}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none hover:border-gray-400 transition-colors"
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                title="Attach file"
              >
                📎
              </button>
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim() || posting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl"
              >
                {posting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Press <kbd className="px-2 py-0.5 bg-gray-200 rounded text-gray-700 font-mono text-xs font-semibold">Ctrl+Enter</kbd> to post
          </p>
        </div>
      </div>
    </div>
  );
}
