import React, { useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Link } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../../components/layout/DefaultLayout';
import TerrapinTable from './sections/TerrapinTable';
import { fetchHatchlingsPerYear } from '../../redux/thunks/analysis.thunk';

const TerrapinsPage = () => {
  const dispatch = useDispatch();
  const { hatchlingsPerYear, hatchlingsPerYearLoading, hatchlingsPerYearError } = useSelector((state) => state.analysis);

  useEffect(() => {
    dispatch(fetchHatchlingsPerYear());
  }, [dispatch]);

  // Transform hatchlings per year data for the chart
  const chartData = hatchlingsPerYear && hatchlingsPerYear.length > 0 ? [
    {
      id: 'Hatchlings Released',
      color: '#4D6A4D',
      data: hatchlingsPerYear.map(item => ({ 
        x: item.year.toString(), 
        y: item.count 
      })),
    }
  ] : [
    {
      id: 'Hatchlings Released',
      color: '#4D6A4D',
      data: [],
    }
  ];

  // Statistics data
  const statistics = [
    {
      label: 'Total Hatchlings',
      value: hatchlingsPerYear ? hatchlingsPerYear.reduce((sum, item) => sum + item.count, 0) : 0,
      subtext: 'released'
    },
    {
      label: 'Years Active',
      value: hatchlingsPerYear ? hatchlingsPerYear.length : 0,
      subtext: 'with releases'
    },
    {
      label: 'Peak Year',
      value: hatchlingsPerYear && hatchlingsPerYear.length > 0 
        ? hatchlingsPerYear.reduce((max, item) => item.count > max.count ? item : max, hatchlingsPerYear[0]).year
        : '-',
      subtext: 'highest releases'
    },
    {
      label: 'Recent Activity',
      value: hatchlingsPerYear && hatchlingsPerYear.length > 0 
        ? hatchlingsPerYear[hatchlingsPerYear.length - 1].count
        : 0,
      subtext: 'last recorded year'
    }
  ];

  return (
    <DefaultLayout>
      <div className="max-w-7.5xl mx-auto">
        {/* Back button and Title */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="flex items-center text-[#666639] hover:text-[#4D6A4D] transition-colors">
            <IoChevronBack className="w-5 h-5" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>

        {/* Growth Statistics Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="font-domine text-[#4D6A4D] text-lg font-medium mb-1">Hatchling Release Statistics</h2>
          <p className="font-inter text-[#666639] text-sm mb-4">Number of hatchlings released per year</p>
          
          {/* Chart */}
          <div className="h-[300px] mb-6">
            {hatchlingsPerYearLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#666639]">Loading chart data...</p>
              </div>
            ) : hatchlingsPerYearError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">Error loading chart data: {hatchlingsPerYearError}</p>
              </div>
            ) : chartData[0].data.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No hatchling release data available</p>
              </div>
            ) : (
              <ResponsiveLine
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                curve="monotoneX"
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableGridX={false}
                colors={d => d.color}
                lineWidth={2}
                enablePoints={true}
                useMesh={true}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fill: '#666639',
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: '#E5E5E5',
                    },
                  },
                  tooltip: {
                    container: {
                      background: '#ffffff',
                      color: '#333333',
                      fontSize: 12,
                      borderRadius: '4px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                      padding: '5px 9px',
                    }
                  }
                }}
                tooltip={({ point }) => (
                  <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                    <strong className="text-gray-700">{point.serieId}</strong>
                    <div className="text-gray-600">
                      Year: {point.data.x}<br />
                      Count: {point.data.y}
                    </div>
                  </div>
                )}
              />
            )}
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statistics.map((stat, index) => (
              <div 
                key={index}
                className="bg-[#F5F5F0] p-4 rounded-lg"
              >
                <h3 className="text-sm font-medium text-[#666639]">{stat.label}</h3>
                <p className="mt-1">
                  <span className="text-2xl font-semibold text-[#666639]">{stat.value}</span>
                  <span className="text-sm text-[#666639] opacity-70 ml-1">{stat.subtext}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <TerrapinTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TerrapinsPage;