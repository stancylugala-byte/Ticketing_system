// Chat with Support — uses ticket comments as the communication channel
import CommentsView from './CommentsView';

export default function ChatView() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Chat with Support</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Send messages directly to your assigned support specialist through your ticket.</p>
      </div>
      <CommentsView />
    </div>
  );
}
