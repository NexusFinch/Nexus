'use client';

import React from 'react';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
}

export function BarChart({ data }: BarChartProps) {
  // In a real implementation, this would use a charting library like Chart.js or Recharts
  // For now, we'll create a simple representation
  
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end">
        {data.labels.map((label, index) => (
          <div key={label} className="flex-1 flex flex-col items-center space-y-2">
            {data.datasets.map((dataset, datasetIndex) => {
              const height = (dataset.data[index] / maxValue) * 100;
              return (
                <div 
                  key={dataset.label}
                  className="w-4/5 rounded-t"
                  style={{ 
                    height: `${height}%`, 
                    backgroundColor: dataset.backgroundColor,
                    marginBottom: datasetIndex === 0 ? 0 : '2px'
                  }}
                  title={`${dataset.label}: ${dataset.data[index]}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {data.labels.map(label => (
          <div key={label} className="text-xs text-center">{label}</div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        {data.datasets.map(dataset => (
          <div key={dataset.label} className="flex items-center">
            <div 
              className="w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: dataset.backgroundColor }}
            />
            <span className="text-xs">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
    }[];
  };
}

export function LineChart({ data }: LineChartProps) {
  // Simplified representation
  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center text-gray-500">
        Line Chart Component (Would use Chart.js or Recharts in production)
      </div>
    </div>
  );
}

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export function PieChart({ data }: PieChartProps) {
  // Simplified representation
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        {data.datasets[0].data.map((value, index) => {
          const percentage = (value / total) * 100;
          // This is a simplified representation - in a real app we'd use a proper charting library
          return (
            <div key={index} className="flex items-center mt-2">
              <div 
                className="w-4 h-4 mr-2 rounded-sm" 
                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
              />
              <span className="text-sm">
                {data.labels[index]}: {percentage.toFixed(1)}% ({value})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
