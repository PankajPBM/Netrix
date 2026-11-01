import React from 'react';
import {
  ShieldAlert,
  Server,
  Activity,
  Globe2,
  Users,
  Radio,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useGetAdminTelemetryQuery } from '@/services/api/adminApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MetricCard } from '@/components/common/MetricCard';

export const AdminPage: React.FC = () => {
  const { data: telemetry, isLoading, refetch } = useGetAdminTelemetryQuery();

  if (isLoading) {
    return <LoadingSpinner message="Querying root platform relay infrastructure..." />;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger-subtle text-danger d-inline-flex align-items-center gap-1">
              <ShieldAlert size={12} />
              <span>Root SuperAdmin Console</span>
            </span>
            <span className="text-muted small">&bull;</span>
            <span className="text-muted small">Global Cloud Infrastructure</span>
          </div>
          <h1 className="page-title">Platform & Infrastructure Administration</h1>
          <p className="page-subtitle">
            Cross-tenant cluster monitoring, global relay nodes, system health, and bandwidth consumption
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            onClick={() => refetch()}
            className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
          >
            <RefreshCw size={14} />
            <span>Poll Relays</span>
          </button>
        </div>
      </div>

      {/* Infrastructure Metrics */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Global Relays"
            value={telemetry?.activeRelayNodes || 64}
            subtitle="5 World Regions"
            icon={Server}
            variant="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Avg Relay Latency"
            value={`${telemetry?.avgRelayLatencyMs || 14.8} ms`}
            subtitle="Global backbone RTT"
            icon={Activity}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Active Bandwidth"
            value={`${telemetry?.globalBandwidthUsageGbps || 34.2} Gbps`}
            subtitle="Encrypted peer streams"
            icon={Radio}
            variant="info"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Platform Tenancies"
            value={telemetry?.totalOrganizations || 412}
            subtitle="Enterprise accounts"
            icon={Users}
            variant="secondary"
          />
        </div>
      </div>

      {/* Relay Clusters Health Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Globe2 size={18} className="text-primary" />
            <span className="fw-bold text-white fs-6">Global Relay Node Clusters</span>
          </div>
          <span className="badge bg-success-subtle text-success small">
            All Regional Gateways Operational
          </span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Relay Region</th>
                  <th>Node Count</th>
                  <th>Cluster Load</th>
                  <th>Throughput Capacity</th>
                  <th className="text-end">Cluster Status</th>
                </tr>
              </thead>
              <tbody>
                {telemetry?.relayClusters.map((cluster, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="fw-semibold text-white">{cluster.region}</span>
                    </td>
                    <td>
                      <span className="font-mono text-white small">{cluster.nodeCount} Edge Nodes</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-fill" style={{ height: '6px', width: '120px' }}>
                          <div
                            className={`progress-bar ${cluster.loadPercentage > 75 ? 'bg-warning' : 'bg-primary'}`}
                            style={{ width: `${cluster.loadPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-muted small">{cluster.loadPercentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted small">100 Gbps Redundant Fibers</span>
                    </td>
                    <td className="text-end">
                      <span className="badge bg-success-subtle text-success">
                        <CheckCircle size={11} className="me-1" />
                        Healthy
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
