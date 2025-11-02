import React, { useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { Table, type Column } from './common/Table';
import type { ActivityLog } from '../types';

interface ActivityLogViewProps {
    logs: ActivityLog[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
    const columns: Column<ActivityLog>[] = useMemo(() => [
        { header: 'Thời gian', accessor: 'timestamp', isSortable: true, render: (log) => new Date(log.timestamp).toLocaleString() },
        { header: 'Người dùng', accessor: 'user', isSortable: true },
        { header: 'Hành động', accessor: 'action', isSortable: true },
        { header: 'Chi tiết', accessor: 'details', isSortable: true },
    ], []);

    const uniqueActions = useMemo(() => {
        const actions = logs.map(log => log.action);
        return [...new Set(actions)];
    }, [logs]);

    return (
        <GlassCard>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Nhật ký hoạt động (Activity Log)</h2>
            <Table
                columns={columns}
                data={logs}
                searchKeys={['user', 'action', 'details']}
                filterOptions={[
                    { key: 'action', label: 'Hành động', options: uniqueActions }
                ]}
            />
        </GlassCard>
    );
};
