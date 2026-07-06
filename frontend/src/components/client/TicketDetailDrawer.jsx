import { useEffect, useState, useRef } from 'react';
import { getTicketById, addComment, closeTicket, reopenTicket } from '../../api/clientApi';

const priorityStyles = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-600',
};

const statusStyles = {
  'Open': 'border-2 border-blue-500 text-blue-600 bg-blue-50',
  'In Progress': 'bg-orange-500 text-white',
  'Pending': 'bg-gray-300 text-gray-700',
  'Resolved': 'bg-green-500 text-white',
  'Closed': 'bg-slate-700 text-white',
};

function timeLabel(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function initials(name = 'Unknown') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function TicketDetailDrawer({ ticketId, onClose, onUpdate }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.comments]);

  const loadTicket = async () => {
    setLoading(true);
    try {
      const response = await getTicketById(ticketId);
      setTicket(response.data.data);
    } catch (err) {
      console.error('Failed to load ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;

    setSending(true);
    try {
      await addComment(ticketId, comment.trim());
      setComment('');
      await loadTicket();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to send comment:', err);
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!confirm('Are you sure you want to close this ticket?')) return;

    setActionLoading(true);
    try {
      await closeTicket(ticketId);
      await loadTicket();
      onUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopenTicket = async () => {
    if (!confirm('Are you sure you want to reopen this ticket?')) return;

    setActionLoading(true);
    try {
      await reopenTicket(ticketId);
      await loadTicket();
      onUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reopen ticket');
    } finally {
      setActionLoading(false);
    }
  };

  if (!ticketId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl border border-gray-200 shadow-sm text-gray-400">
        <span className="text-5xl mb-3">👈</span>
        <p className="text-sm font-medium">Select a ticket to view details</p>
      </div>
    );
  }

  if (loading || !ticket) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500">Loading ticket...</p>
        </div>
      </div>
    );
  }

  const comments = ticket.comments || [];
  const canClose = ticket.status === 'Resolved';
  const canReopen = ticket.status === 'Closed';
  const canComment = ticket.status !== 'Closed';

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">
            #{ticket.id.slice(0, 8).toUpperCase()}
          </span>
          <h2 className="text-base font-bold text-gray-900">{ticket.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Info Row - Status, Priority, Category */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-200 bg-gray-50 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusStyles[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Priority</span>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${priorityStyles[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>
        {ticket.category && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Category</span>
            <span className="text-xs font-medium text-gray-700">
              {ticket.category.category_name}
            </span>
          </div>
        )}
        {ticket.assignee && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Assigned To</span>
            <span className="text-xs font-medium text-gray-700">
              {ticket.assignee.full_name}
            </span>
          </div>
        )}
      </div>

      {/* Ticket Tracking - SLA & Timestamps */}
      <div className="px-5 py-3 border-b border-gray-200 bg-white">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">🕐 Created:</span>
            <span className="font-medium text-gray-700">{timeLabel(ticket.created_at || ticket.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">🔄 Updated:</span>
            <span className="font-medium text-gray-700">{timeLabel(ticket.updated_at || ticket.updatedAt)}</span>
          </div>
          {ticket.slaPolicy && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">⚡ Response SLA:</span>
                <span className="font-medium text-blue-700">{ticket.slaPolicy.response_time}h</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">✓ Resolution SLA:</span>
                <span className="font-medium text-blue-700">{ticket.slaPolicy.resolution_time}h</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {/* Communication Center */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-5 py-3 border-b border-gray-200 bg-white">
          <p className="text-sm font-bold text-gray-900">Communication</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">💬</span>
              <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(c => {
                const isAgent = ['SupportOfficer', 'Developer', 'Admin'].includes(c.author?.role);
                return (
                  <div key={c.comment_id} className={`flex items-start gap-3 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${isAgent ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                      {initials(c.author?.full_name)}
                    </div>
                    <div className={`flex flex-col max-w-[75%] gap-1 ${isAgent ? 'items-end' : 'items-start'}`}>
                      <p className="text-xs font-semibold text-gray-600">
                        {c.author?.full_name || 'Unknown'}
                      </p>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                        ${isAgent
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                        }`}>
                        {c.comment}
                      </div>
                      <span className="text-xs text-gray-400">{timeLabel(c.created_at)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Reply Box */}
        {canComment && (
          <div className="border-t border-gray-200 bg-white px-5 py-4">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none placeholder-gray-400 transition-colors"
              placeholder="Type your message..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSendComment();
                }
              }}
            />
            <div className="flex items-center justify-end mt-3">
              <button
                onClick={handleSendComment}
                disabled={sending || !comment.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>➤</span>
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        {canReopen ? (
          <button
            onClick={handleReopenTicket}
            disabled={actionLoading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>↺</span>
            Reopen Ticket
          </button>
        ) : canClose ? (
          <button
            onClick={handleCloseTicket}
            disabled={actionLoading}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>✓</span>
            Close Ticket
          </button>
        ) : (
          <div className="text-xs text-gray-500 italic">
            {ticket.status === 'Closed' 
              ? 'This ticket is closed' 
              : 'Ticket must be marked as Resolved by support before you can close it'}
          </div>
        )}
        
        <div className="text-xs text-gray-400">
          Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono">Ctrl+Enter</kbd> to send
        </div>
      </div>
    </div>
  );
}
