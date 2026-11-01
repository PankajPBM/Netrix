import React, { useState } from 'react';
import {
  BookOpen,
  Star,
  Search,
  Zap,
} from 'lucide-react';
import { useGetDevicesQuery, useToggleDeviceFavoriteMutation } from '@/services/api/deviceApi';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppDispatch } from '@/app/store';
import { openQuickConnectModal } from '@/features/remote-sessions/sessionUiSlice';

export const AddressBookPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'favorites' | 'all' | 'recent'>('favorites');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const { data: devices, isLoading } = useGetDevicesQuery();
  const [toggleFavorite] = useToggleDeviceFavoriteMutation();

  if (isLoading) {
    return <LoadingSpinner message="Loading enterprise address book..." />;
  }

  let list = devices || [];

  if (activeTab === 'favorites') {
    list = list.filter((d) => d.isFavorite);
  }

  if (selectedGroup !== 'all') {
    list = list.filter((d) => d.group === selectedGroup);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.netrixId.toLowerCase().includes(q) ||
        d.alias.toLowerCase().includes(q)
    );
  }

  const groups = Array.from(new Set((devices || []).map((d) => d.group)));

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Enterprise Address Book</h1>
          <p className="page-subtitle">
            Curated personal contacts, starred remote hosts, and department device registries
          </p>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Tabs */}
            <div className="col-12 col-md-5 d-flex gap-2">
              <button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1 ${activeTab === 'favorites' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('favorites')}
              >
                <Star size={14} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
                <span>Starred Endpoints ({devices?.filter((d) => d.isFavorite).length || 0})</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('all')}
              >
                <span>All Contacts ({devices?.length || 0})</span>
              </button>
            </div>

            {/* Group Filter */}
            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="all">All Fleet Groups</option>
                {groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="col-6 col-md-4">
              <div className="input-group">
                <span className="input-group-text"><Search size={14} /></span>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Filter address book..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Book Cards */}
      {list.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No address book entries found"
          description="Star frequently accessed devices or adjust your group filter to see saved entries."
          actionText={activeTab === 'favorites' ? 'Show All Devices' : undefined}
          onAction={activeTab === 'favorites' ? () => setActiveTab('all') : undefined}
        />
      ) : (
        <div className="row g-3">
          {list.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-3">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        className="btn btn-ghost p-0 text-warning"
                        title={item.isFavorite ? 'Remove star' : 'Star device'}
                      >
                        <Star size={16} fill={item.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <div>
                        <h6 className="fw-bold text-white mb-0">{item.name}</h6>
                        <span className="text-muted small">{item.alias}</span>
                      </div>
                    </div>
                    <StatusBadge status={item.status} pulse={item.status === 'online'} />
                  </div>

                  <div className="p-2 rounded-2 mb-3 font-mono d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--netrix-bg-app)', border: '1px solid var(--netrix-border)' }}>
                    <span className="text-muted small">NETRIX ID:</span>
                    <span className="text-primary fw-bold">{item.netrixId}</span>
                  </div>

                  <div className="d-flex flex-column gap-1 small text-muted mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Operating System:</span>
                      <span className="text-white">{item.os.split(' ')[0]} {item.os.split(' ')[1]}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Organizational Unit:</span>
                      <span className="text-white">{item.group}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Datacenter Node:</span>
                      <span className="text-white">{item.location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch(openQuickConnectModal(item.netrixId))}
                    className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                  >
                    <Zap size={14} fill="currentColor" />
                    <span>Initiate Direct Session</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
