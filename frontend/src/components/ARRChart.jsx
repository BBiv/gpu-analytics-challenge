import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useARRData } from '../hooks/useARRData';
import '../index.css'

const ARRChart = () => {
  const { data: arrData, isLoading, error } = useARRData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Loading ARR data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-red-500">
          <div>Error loading ARR data:</div>
          <div className="text-sm mt-2">{error.message}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!arrData?.data || arrData.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-gray-500">No ARR data available</div>
      </div>
    );
  }

  // Format the data for the chart
  const chartData = arrData.data.map(item => ({
    month: item.month,
    arr: item.arr,
    monthDisplay: formatMonthDisplay(item.month)
  }));

  // Custom tooltip formatter
  const formatTooltip = (value, name) => {
    if (name === 'arr') {
      return [`$${value.toLocaleString()}`, 'ARR'];
    }
    return [value, name];
  };

  // Custom x-axis tick formatter
  const formatXAxis = (tickItem) => {
    return formatMonthDisplay(tickItem);
  };

  return (
    <div className="w-[80vw] h-[25vw] bg-gray rounded-lg border border-gray-500/50 pt-5 px-3">
      <p className="mb-1 text-left pl-20">ARR</p>
      
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid stroke="#f0f0f0" opacity={'8%'} />
          <XAxis
            dataKey="month"
            tickFormatter={formatXAxis}
            stroke="#6b7280"
            fontSize={11}
            tick={{ fill: '#6b7280' }}
            tickMargin={10}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tickMargin={10}
          />
          <Line
            type="linear"
            dataKey="arr"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper function to format month display
const formatMonthDisplay = (monthString) => {
  if (!monthString) return '';
  
  const [year, month] = monthString.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

export default ARRChart;
