
import React, { useState, useMemo, ReactNode } from 'react';
import { Input } from './Input';
import { Select } from './Select';

export interface Column<T> {
    header: string;
    accessor: keyof T | 'actions';
    isSortable?: boolean;
    render?: (item: T) => ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchKeys: (keyof T)[];
    filterOptions?: { key: keyof T; label: string; options: string[] }[];
}

const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | 'none' }) => (
    <span className="ml-1 text-slate-500">
        {direction === 'asc' && '↑'}
        {direction === 'desc' && '↓'}
        {direction === 'none' && '↕'}
    </span>
);


export function Table<T extends { id: string | number }>({ columns, data, searchKeys, filterOptions = [] }: TableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T | 'actions'; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const itemsPerPage = 10;

    const filteredData = useMemo(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                searchKeys.some(key => {
                    const value = item[key];
                    return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }
        
        Object.entries(filters).forEach(([key, value]) => {
             if (value) {
                filtered = filtered.filter(item => String(item[key as keyof T]) === value);
             }
        });

        return filtered;
    }, [data, searchTerm, filters, searchKeys]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof T];
            const bValue = b[sortConfig.key as keyof T];

            if (aValue === undefined || bValue === undefined) return 0;
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage]);
    
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (key: keyof T | 'actions') => {
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            setSortConfig({ key, direction: 'desc' });
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    };
    
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    return (
        <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    {/* FIX: Added a unique `id` prop to the Input component, as it is required. */}
                    <Input
                        id="table-search"
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {filterOptions.map(filter => (
                    <Select
                        key={String(filter.key)}
                        id={`table-filter-${String(filter.key)}`}
                        value={filters[String(filter.key)] || ''}
                        onChange={(e) => handleFilterChange(String(filter.key), e.target.value)}
                        options={[{ value: '', label: `Tất cả ${filter.label}` }, ...filter.options.map(opt => ({ value: opt, label: opt }))]}
                    />
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-slate-400/10 dark:bg-slate-900/20 rounded-lg">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                    <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-300/20 dark:bg-slate-800/30">
                        <tr>
                            {columns.map(col => (
                                <th key={String(col.accessor)} scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        {col.header}
                                        {col.isSortable && (
                                            <button onClick={() => handleSort(col.accessor)}>
                                                <SortIcon direction={sortConfig?.key === col.accessor ? sortConfig.direction : 'none'} />
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(item => (
                            <tr key={item.id} className="border-b border-slate-300/30 dark:border-slate-700/50 hover:bg-slate-300/10 dark:hover:bg-slate-800/20">
                                {columns.map(col => (
                                    <td key={`${item.id}-${String(col.accessor)}`} className="px-6 py-4">
                                        {col.render ? col.render(item) : String(item[col.accessor as keyof T] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                         {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center px-6 py-8 text-slate-500">
                                    Không tìm thấy dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
             {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <div className="inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-slate-500 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-l-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                            Trước
                        </button>
                         <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-slate-500 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-r-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
