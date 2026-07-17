import { useState } from 'react';
import TrackStatus from './tracking/TrackStatus';
import ViewAssignedStaff from './tracking/ViewAssignedStaff';
import ViewResolutionTimeline from './tracking/ViewResolutionTimeline';

const SUB_VIEWS = [
  { id: 'track-status', label: 'Track Status', component: TrackStatus },
  { id: 'assigned-staff', label: 'View Assigned Staff', component: ViewAssignedStaff },
  { id: 'resolution-timeline', label: 'View Resolution Timeline', component: ViewResolutionTimeline }
];

export default function TicketTracking() {
  const [activeView, setActiveView] = useState('track-status');

  const ActiveComponent = SUB_VIEWS.find(v => v.id === activeView)?.component || TrackStatus;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sub-navigation tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {SUB_VIEWS.map(view => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all
                  ${activeView === view.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700 hover:text-gray-900 dark:text-white'
                  }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content panel with fade transition */}
      <div className="p-6">
        <div
          key={activeView}
          className="animate-fadeIn"
        >
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
