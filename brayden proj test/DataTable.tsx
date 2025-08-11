import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from '@/shared/components/flowbite-proxy/Tooltip';
import 'simplebar/dist/simplebar.min.css';
import { AiOutlineSortAscending, AiOutlineSortDescending } from 'react-icons/ai';
import React from 'react';

export interface Column {
  key: string;
  title: string | JSX.Element;
  ignoreChildEvents?: boolean;
  ignoreOrderChange?: boolean;
  render?: (row: any) => JSX.Element;
  renderHeader?: (column: any) => JSX.Element;
  width?: string;
  padding?: string;
  style?: React.CSSProperties;
}

interface DataTableProps {
  columns: Column[];
  primaryKey?: string;
  data: any[];
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  onChangeOrder?: (column: string) => void;
  order?: string;
  footer?: JSX.Element | null;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  primaryKey = 'id',
  data,
  isLoading = false,
  onRowClick = noop,
  onChangeOrder,
  order,
  footer = null,
}) => {
  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-transparent rounded-md border border-silicongray-200 dark:border-silicongray-700 overflow-x-auto">
      {/* Mobile view */}
      <div className="block md:hidden mx-auto w-full">
        {data?.length > 0 &&
          data.map((row) => (
            <div
              key={row[primaryKey]}
              className={` border dark:border-silicongray-700 border-silicongray-200 rounded dark:bg-silicongray-700 bg-silicongray-50
                ${onRowClick !== noop ? 'cursor-pointer dark:hover:bg-silicongray-600 hover:bg-silicongray-50' : ''}`}
              onClick={() => onRowClick(row)}
            >
              {columns.map((column) => (
                <div
                  key={`${column.key}-${row[primaryKey]}`}
                  className="py-2"
                  onClick={(event: any) => {
                    if (!column.ignoreChildEvents || event.target === event.currentTarget) {
                      onRowClick(row);
                    }
                  }}
                >
                  <div className="text-sm font-normal text-left text-silicongray-900 dark:text-white">
                    {column.renderHeader ? column.renderHeader(column) : column.title}
                  </div>
                  <div className="text-left text-silicongray-600 dark:text-white">
                    {column.render ? (
                      column.render(row)
                    ) : (
                      <div className="truncate" style={{ maxWidth: '300px' }}>
                        {row[column.key]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        {footer && (
          <div className="bg-silicongray-50 dark:bg-silicongray-700 w-full p-4 text-center mt-2">{footer}</div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex md:flex-col custom-scrollbar">
        <table
          className="w-full dark:bg-silicongray-800 bg-silicongray-100"
          style={{
            borderRadius: 'var(--rounded-md, 6px)',
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
          }}
        >
          <thead>
            <tr
              className="flex w-full items-center gap-8 dark:text-silicongray-300 text-silicongray-700 text-sm font-semibold transition-colors duration-300 "
              style={{
                padding: 'var(--25, 10px) var(--4, 16px)',
                borderTopLeftRadius: 'var(--rounded-md, 6px)',
                borderTopRightRadius: 'var(--rounded-md, 6px)',
              }}
            >
              {columns.map((column) => {
                const isActive = order?.startsWith(column.key);
                return (
                  <th
                    key={column.key}
                    style={{
                      cursor: onChangeOrder ? 'pointer' : 'default',
                      flex: column.width ? `0 0 ${column.width}` : '1',
                      maxWidth: column.width,
                      marginLeft: column.key === 'action' ? 'auto' : undefined,
                      //textAlign: column.key === 'action' ? 'right' : undefined,
                    }}
                    className={` text-xs font-normal ${
                      column.key === 'action' ? 'pl-0 pr-[74px] text-right flex justify-end' : 'text-left'
                    } ${
                      isActive
                        ? 'bg-silicongray-200 dark:bg-silicongray-600 text-silicongray-800 dark:text-white'
                        : 'text-silicongray-500 dark:text-white'
                    }`}
                    onClick={() => !column.ignoreOrderChange && onChangeOrder && onChangeOrder(column.key)}
                  >
                    <div
                      className={
                        column.key === 'action' ? 'flex items-center justify-end' : 'flex items-center justify-between'
                      }
                    >
                      <span className="mr-1">{column.renderHeader ? column.renderHeader(column) : column.title}</span>
                      {order?.includes(column.key) && (
                        <div style={{ width: '24px', height: '24px', display: 'inline-block' }}>
                          {order.includes('ASC') && <AiOutlineSortAscending className="w-6 h-6" />}
                          {order.includes('DESC') && <AiOutlineSortDescending className="w-6 h-6" />}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="dark:bg-silicongray-900 bg-white divide-y dark:divide-silicongray-700 divide-silicongray-200 transition-colors duration-300">
            {data?.length > 0 &&
              data.map((row) => (
                <tr
                  key={row[primaryKey]}
                  className={`flex w-full items-center dark:text-silicongray-200 text-silicongray-700 text-sm border-t border-silicongray-100 dark:border-silicongray-800 ${
                    onRowClick !== noop ? 'cursor-pointer hover:bg-silicongray-300 dark:hover:bg-silicongray-800' : ''
                  }`}
                  style={{
                    padding: 'var(--3, 12px) var(--4, 16px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    flex: '1 0 0',
                    alignSelf: 'stretch',
                  }}
                  onClick={() => {
                    onRowClick(row);
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={`${column.key}-${row[primaryKey]}`}
                      style={{
                        flex: column.width ? `0 0 ${column.width}` : '1',
                        maxWidth: column.width,
                        marginLeft: column.key === 'action' ? 'auto' : undefined,
                      }}
                      className={
                        column.key === 'action'
                          ? 'pl-0 pr-0 py-0.75 text-right flex justify-end'
                          : 'px-1 py-0.75 text-left'
                      }
                    >
                      <div className="text-silicongray-600 dark:text-white">
                        <div className="truncate" style={{ maxWidth: column.width }}>
                          {column.render ? (
                            column.render(row)
                          ) : (
                            <Tooltip content={row[column.key]}>{row[column.key]}</Tooltip>
                          )}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        {footer && data.length ? (
          <div className="mt-auto bg-silicongray-50 dark:bg-silicongray-900 w-full py-4 text-left">{footer}</div>
        ) : null}
      </div>

      {data?.length === 0 && (
        <div className="p-4 w-full flex justify-center dark:text-silicongray-400 text-silicongray-500">
          <FormattedMessage id="no-records-found" />
        </div>
      )}
    </div>
  );
};

export { DataTable };
