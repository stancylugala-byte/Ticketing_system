import React, { useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiServer,
  FiCpu,
  FiGrid,
  FiFilter,
  FiActivity,
  FiGitBranch
} from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import BacklogItem from '../../components/dashboard/BacklogItem';
import ActivityItem from '../../components/dashboard/ActivityItem';
import StackTrace from '../../components/dashboard/StackTrace';
import ClusterHealth from '../../components/dashboard/ClusterHealth';

const EngineeringBacklog = () => {
  const [backlogItems] = useState([
    {
      priority: 'Critical',
      title: 'Payment gateway timeout on retry',
      tag: 'feat/retry-logic',
      assignee: 'Sarah Miller',
      time: '40 min ago',
      status: 'In Progress'
    },
    {
      priority: 'Critical',
      title: 'Null pointer in authentication middleware',
      tag: 'fix/auth-leak',
      assignee: 'David Chen',
      time: '30 min ago',
      status: 'In Progress',
      component: 'Backend Auth Service'
    },
    {
      priority: 'Critical',
      title: 'Elasticsearch index sync delay',
      tag: 'fix/sync-delay',
      assignee: 'David Chen',
      time: '30 min ago',
      status: 'In Progress'
    }
  ]);

  const [activities] = useState([
    {
      type: 'commit',
      title: 'David Chen pushed 3 commits',
      description: 'fix/auth-leak',
      time: '25 min ago'
    },
    {
      type: 'ci',
      title: 'CI Build #492 Passed',
      description: 'view logs',
      time: '1 hour ago'
    },
    {
      type: 'alert',
      title: 'Ticket created from Sentry Alert',
      description: 'Alert ID: snt_9921',
      time: '3 hours ago'
    }
  ]);

  const [stackTrace] = useState({
    error: "TypeError: Cannot read property 'user' of null",
    traces: [
      "at AuthMiddleware.verify (auth.js:142:22)",
      "at processTicksAndRejections (task_queues:95:5)",
      "at async handleRequest (server.js:12:3)"
    ]
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Engineering Backlog</h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage active bug fixes, incidents, and infrastructure tasks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A202C] border border-[#2D3748] rounded-lg text-[#94A3B8] hover:text-white transition-colors">
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors">
            <FiPlus size={16} />
            New Incident
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Open Bugs"
          value="12"
          change="2"
          changeLabel="vs last week"
          trend="up"
          icon={FiAlertCircle}
        />
        <StatCard
          label="Critical Hotfixes"
          value="03"
          change="15%"
          changeLabel="vs last week"
          trend="up"
          icon={FiCheckCircle}
        />
        <StatCard
          label="Mean Time To Fix"
          value="4.2h"
          change="12%"
          changeLabel="vs last week"
          trend="down"
          icon={FiClock}
        />
        <StatCard
          label="Resolved Today"
          value="08"
          change="8%"
          changeLabel="vs last week"
          trend="up"
          icon={FiTrendingUp}
        />
      </div>

      {/* Board Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <ClusterHealth status="Optimal" label="Sync Repo" />
          <div className="flex items-center gap-2 bg-[#1A202C] border border-[#2D3748] rounded-lg px-4 py-2">
            <FiGrid className="text-[#94A3B8]" size={16} />
            <span className="text-[#94A3B8] text-sm">Board</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1A202C] border border-[#2D3748] rounded-lg px-3 py-2">
            <FiSearch className="text-[#4A5568]" size={16} />
            <input
              type="text"
              placeholder="Search backlog..."
              className="bg-transparent border-none text-white placeholder-[#4A5568] focus:outline-none w-48 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#1A202C] border border-[#2D3748] rounded-lg text-[#94A3B8] hover:text-white transition-colors">
            <FiFilter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backlog List - Left */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Backlog</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#94A3B8]">Critical Only</span>
              <button className="text-xs text-[#2563EB] hover:underline">View All</button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-4 bg-[#1A202C] border border-[#2D3748] rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-[#94A3B8] text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              <span className="text-[#94A3B8] text-sm">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D3748]"></span>
              <span className="text-[#94A3B8] text-sm">All Components</span>
            </div>
          </div>

          {/* Backlog Items */}
          {backlogItems.map((item, index) => (
            <BacklogItem key={index} {...item} />
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Stack Trace */}
          <StackTrace
            error={stackTrace.error}
            traces={stackTrace.traces}
          />

          {/* Recent Activity */}
          <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg p-4">
            <h4 className="text-white font-medium text-sm mb-3">Recent Activity</h4>
            <div className="space-y-1">
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Deployment Environment */}
          <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg p-4">
            <h4 className="text-white font-medium text-sm mb-3">Deployment Environment</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiServer className="text-[#94A3B8]" size={14} />
                  <span className="text-[#94A3B8] text-sm">STAGING</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-mono">v2.4.1-rc3</span>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiServer className="text-[#94A3B8]" size={14} />
                  <span className="text-[#94A3B8] text-sm">PRODUCTION</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-mono">v2.4.0</span>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-[#1A202C] border border-[#2D3748] rounded-lg text-[#94A3B8] hover:text-white transition-colors">
              <FiCpu size={16} />
              Trigger CI Build
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-[#1A202C] border border-[#2D3748] rounded-lg text-[#94A3B8] hover:text-white transition-colors">
              <FiActivity size={16} />
              Report Incident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringBacklog;