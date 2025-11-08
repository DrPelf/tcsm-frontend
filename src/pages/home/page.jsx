import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoLocationOutline } from "react-icons/io5";
import DefaultLayout from '../../components/layout/DefaultLayout';
import { fetchStatsSummary, fetchSpeciesDistribution, fetchConservationProgress, fetchNestingEventsVsBank } from '../../redux/thunks/analysis.thunk';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import ActionCard from '../../components/actionCard';

const Home = ({ setShowLogin, setShowSignUp }) => {
  const dispatch = useDispatch();
  const {
    statsSummary,
    speciesDistribution,
    conservationProgress,
    nestingEventsVsBank,
    nestingEventsVsBankLoading,
    nestingEventsVsBankError,
    loading,
    error,
  } = useSelector((state) => state.analysis);

  useEffect(() => {
    dispatch(fetchStatsSummary());
    dispatch(fetchSpeciesDistribution());
    dispatch(fetchConservationProgress());
    dispatch(fetchNestingEventsVsBank());
  }, [dispatch]);

  const stats = statsSummary
    ? [
        { value: statsSummary.total_nesting_events || 0, title: 'Nesting Events', subtitle: 'Currently Tracked' },
        { value: statsSummary.total_hatchlings_released || 0, title: 'Hatchlings Released', subtitle: 'Total Released' },
        { value: statsSummary.total_recaptured_terrapins || 0, title: 'Recaptured Terrapins', subtitle: 'Currently Tracked' },
        { value: statsSummary.total_species || 0, title: 'Turtle Species', subtitle: 'Recorded Species' },
      ]
    : [];

  // Transform species distribution data for the chart
  const colorPalette = [
    '#4D6A4D', // Dark green
    '#8AB28A', // Light green
    '#A9D6A9', // Very light green
    '#8B7355', // Medium brown
    '#D4A76A'  // Light brown
  ];
  const speciesData = speciesDistribution
    ? speciesDistribution.map((item, index) => ({
        id: item.species_name,
        value: item.count,
        color: colorPalette[index % colorPalette.length],
      }))
    : [];

  // Transform conservation progress data for the chart
  const conservationData = conservationProgress && conservationProgress.length > 0
    ? [
        {
          id: 'Captured',
          color: '#4D6A4D',
          data: conservationProgress.map((item) => ({ x: item.year.toString(), y: item.captured })),
        },
        {
          id: 'Released',
          color: '#4A90E2',
          data: conservationProgress.map((item) => ({ x: item.year.toString(), y: item.released })),
        },
        {
          id: 'Nesting',
          color: '#45B7AF',
          data: conservationProgress.map((item) => ({ x: item.year.toString(), y: item.nesting })),
        },
      ]
    : [];

  // Prepare nesting banks data for display 
  const nestingBanks = nestingEventsVsBank || [];
  const maxCount = nestingBanks.length > 0 ? Math.max(...nestingBanks.map(b => b.count)) : 1;

  // Transform the action cards to use real data
  const actionCards = [
    {
      title: 'Captured Turtles',
      subtitle: 'Manage captured turtle records',
      buttonText: 'Manage Captured Turtles',
      link: '/captured-turtles',
      stats: [
        { 
          label: 'Total Species', 
          value: statsSummary?.total_species || 0 
        }
      ],
      onClick: () => {
        window.scrollTo(0, 0);
      },
    },
    {
      title: 'Terrapins',
      subtitle: 'Track released terrapin growth and survival',
      buttonText: 'Manage Terrapins',
      link: '/terrapins',
      stats: [
        { 
          label: 'Hatchlings Released', 
          value: statsSummary?.total_hatchlings_released || 0 
        }
      ],
      onClick: () => {
        window.scrollTo(0, 0);
      },
    },
    {
      title: 'Nesting Terrapins',
      subtitle: 'Manage nesting females',
      buttonText: 'Manage Nesting Terrapins',
      link: '/nesters',
      stats: [
        { 
          label: 'Nesting Events', 
          value: statsSummary?.total_nesting_events || 0 
        }
      ],
      onClick: () => {
        window.scrollTo(0, 0);
      },
    },
  ];

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Header */}
        <p className="text-[#666639] text-lg">
          Track and manage data for captured turtles, terrapins, and nesting terrapins to support conservation efforts.
        </p>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conservation Progress Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#4D6A4D] mb-1">Conservation Progress</h2>
            <p className="text-sm text-[#666639] mb-4">Population growth over time</p>
            <div className="h-[300px]">
              {loading ? (
                <p>Loading conservation progress...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error.message || 'Failed to load conservation progress data'}</p>
              ) : conservationData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No conservation progress data available</p>
                </div>
              ) : (
                <ResponsiveLine
                  data={conservationData}
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
                  colors={(d) => d.color}
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
                  }}
                />
              )}
            </div>
          </div>

          {/* Species Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#4D6A4D] mb-1">Species Distribution</h2>
            <p className="text-sm text-[#666639] mb-4">Recorded Species</p>
            <div className="h-[220px]">
              {loading ? (
                <p>Loading species distribution...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error.message || 'Failed to load species distribution data'}</p>
              ) : speciesData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No species distribution data available</p>
                </div>
              ) : (
                <ResponsivePie
                  data={speciesData}
                  margin={{ top: 10, right: 130, bottom: 10, left: 10 }}
                  innerRadius={0.6}
                  padAngle={0.5}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={(d) => d.data.color}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  enableArcLinkLabels={false}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  tooltip={({ datum }) => (
                    <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                      <strong className="text-gray-700">{datum.label}</strong>
                      <div className="text-gray-600">
                        Count: {datum.value}
                        <br />
                        Percentage: {((datum.value / 100) * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                  legends={[
                    {
                      anchor: 'right',
                      direction: 'column',
                      justify: false,
                      translateX: 40,
                      translateY: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemsSpacing: 5,
                      symbolSize: 10,
                      symbolShape: 'circle',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: '#000',
                            itemBackground: 'rgba(0, 0, 0, .03)',
                          },
                        },
                      ],
                    },
                  ]}
                  theme={{
                    tooltip: {
                      container: {
                        background: '#ffffff',
                        color: '#333333',
                        fontSize: 12,
                        borderRadius: '4px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                        padding: '5px 9px',
                      },
                    },
                    legends: {
                      text: {
                        fontSize: 11,
                        fill: '#666666',
                      },
                    },
                  }}
                  transitionMode="startAngle"
                  motionConfig="stiff"
                />
              )}
            </div>
          </div>
        </div>

        {/* Nesting Banks Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#4D6A4D] mb-1">Nesting Banks</h2>
            <p className="text-sm text-[#666639] mb-2">Nesting events by bank</p>
            {nestingEventsVsBankLoading ? (
              <div className="py-8 text-[#666639]">Loading nesting banks...</div>
            ) : nestingEventsVsBankError ? (
              <div className="py-8 text-red-500">{nestingEventsVsBankError}</div>
            ) : nestingBanks.length === 0 ? (
              <div className="py-8 text-gray-500">No nesting bank data available</div>
            ) : (
              <div className="space-y-2">
                {nestingBanks.map((bank, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#4D6A4D] mr-3">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-[#666639] flex-1">{bank.bank_name}</span>
                        <span className="text-[#666639]">{bank.count} events</span>
                      </div>
                      <div className="mt-1.5 bg-[#E5E5E5] h-1.5 rounded-full">
                        <div
                          className="bg-[#4D6A4D] h-full rounded-full"
                          style={{ width: `${(bank.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-2.5 rounded-lg shadow-sm text-center flex flex-col justify-center min-h-[95px]">
                <div className="text-3xl font-bold text-[#4D6A4D]">{stat.value}</div>
                <div className="text-sm text-[#666639] font-medium leading-tight">{stat.title}</div>
                <div className="text-xs text-[#666639] leading-tight">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="bg-[#F5F5F0] -mx-4 py-8">
          <div className="max-w-7.5xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {actionCards.map((card, index) => (
                <ActionCard key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
