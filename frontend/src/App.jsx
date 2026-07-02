import { useState } from 'react';
import Sidebar from './components/Sidebar';
import SupportDashboard from './pages/SupportDashboard';

export default function App() {
  const [activePage, setActivePage] = useState('support');

  const getView = () => {
    if (activePage === 'kb') return 'kb';
    if (activePage === 'performance') return 'performance';
    return 'queue';
  };

  return (
    <>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      {(activePage === 'support' || activePage === 'kb' || activePage === 'performance') ? (
        <SupportDashboard initialView={getView()} key={activePage} />
      ) : (
        <div className="ml-[220px] flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-400">
            <p className="text-5xl mb-4">🚧</p>
            <p className="text-lg font-semibold text-gray-600">Coming Soon</p>
            <p className="text-sm mt-1">This section is under development.</p>
          </div>
        </div>
      )}
    </>
  );
}
