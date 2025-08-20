import React, { useState, useEffect } from 'react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

const ServerTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  
  const { data, isLoading, error } = usePerformanceMetrics(page, perPage);
  
  const servers = data?.data || [];
  const pagination = data?.pagination || {};

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log('Server data received:', data);
      console.log('Servers array:', servers);
      console.log('Pagination:', pagination);
    }
  }, [data, servers, pagination]);

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-lg shadow-md overflow-hidden h-96">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading server data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Server data error:', error);
    return (
      <div className="bg-neutral-900 rounded-lg shadow-md overflow-hidden h-96">
        <div className="p-8 text-center">
          <p className="text-red-600">Error loading server data. Please try again.</p>
          <p className="text-sm text-white mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[80vw] h-[25vw] bg-gray rounded-lg shadow-md overflow-hidden h-80 flex flex-col">
      {/* Table Header */}
      <div className="flex-shrink-0">
        <table className="w-full">
          <thead className="bg-stone-800">
            <tr>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white tracking-wider">
                Server ID
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white tracking-wider">
                GPU ID
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white tracking-wider">
                GPU type
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white tracking-wider">
                Last 7 days
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-white tracking-wider">
                Last 30 days
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-medium text-white tracking-wider">
                Total Earnings
              </th>
            </tr>
          </thead>
        </table>
      </div>
      
      {/* Table Body - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <tbody className="bg-neutral-900 divide-y divide-neutral-600">
            {servers.length > 0 ? (
              servers.map((server, index) => (
                <tr 
                  key={`${server.server_id}-${server.gpu_id}-${index}`}
                  className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="pl-1 py-4 whitespace-nowrap text-sm text-white">
                    {server.server_id.slice(0,3) + "..." + server.server_id.slice(-4) || 'N/A'}
                  </td>
                  <td className="p py-4 whitespace-nowrap text-sm text-white">
                    {server.name || 'N/A'}
                  </td>
                  <td className="p py-4 whitespace-nowrap text-sm text-white">
                    {server.gpu_id.slice(0,3) + "..." + server.gpu_id.slice(-4) || 'N/A'}
                  </td>
                  <td className="p py-4 whitespace-nowrap text-sm text-white">
                    {server.gpu_type || 'N/A'}
                  </td>
                  <td className="p py-4 whitespace-nowrap text-sm text-white">
                    {server.revenue_7d ? `$${parseFloat(server.revenue_7d).toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="p py-4 whitespace-nowrap text-sm text-white">
                    {server.revenue_30d ? `$${parseFloat(server.revenue_30d).toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="p py-4 whitespace-nowrap text-sm text-white text-right">
                    {server.total_earnings ? `$${parseFloat(server.total_earnings).toFixed(2)}` : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-white">
                  No server data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - Fixed at Bottom */}
      {pagination.total_pages > 1 && (
        <div className="flex-shrink-0 bg-stone-800 px-4 py-2 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <label className="text-xs text-white">Show:</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1); // Reset to first page when changing page size
              }}
              className="border border-gray-600 rounded px-1 py-0.5 text-xs bg-neutral-700"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-xs text-white">per page</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-0.5 text-xs border border-gray-500 disabled:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Previous
            </button>
            
            <span className="text-xs text-white">
              Page {page} of {pagination.total_pages}
            </span>
            
            <button
              onClick={() => setPage(Math.min(pagination.total_pages, page + 1))}
              disabled={page >= pagination.total_pages}
              className="px-3 py-0.5 text-xs border border-gray-500 disabled:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Next
            </button>
          </div>
          
          <div className="text-xs text-white">
            Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, pagination.total_count)} of {pagination.total_count} results
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerTable;
