import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResponsivePie } from '@nivo/pie';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpeciesDistribution, fetchCapturesSummary } from '../../redux/thunks/analysis.thunk';
import { fetchHeatmapData } from '../../redux/thunks/map.thunk';
import DefaultLayout from '../../components/layout/DefaultLayout';
import TurtleTable from './sections/TurtleTable';
import TurtleMap from './sections/TurtleMap';
import { IoChevronBack, IoGridOutline, IoMapOutline } from "react-icons/io5";

const CapturedTurtles = () => {
  const [viewType, setViewType] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [mapData, setMapData] = useState({
    captures: [],
    recaptures: []
  });
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const { captures, recaptures, loading: mapLoading } = useSelector((state) => state.map);
  const { speciesDistribution, capturesSummary, loading, error } = useSelector((state) => state.analysis);

  useEffect(() => {
    dispatch(fetchSpeciesDistribution());
    dispatch(fetchCapturesSummary());
    dispatch(fetchHeatmapData());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); 
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define color palette to match the Home page
  const colorPalette = [
    '#4D6A4D', // Dark green
    '#8AB28A', // Light green
    '#A9D6A9', // Very light green
    '#8B7355', // Medium brown
    '#D4A76A'  // Light brown
  ];

  // Transform species distribution data for the chart
  const speciesData = speciesDistribution
    ? speciesDistribution.map((item, index) => ({
        id: item.species_name || item.label,
        label: item.species_name || item.label,
        value: item.count || item.value,
        color: colorPalette[index % colorPalette.length],
      }))
    : [];

  // Summary stats
  const totalSightings = capturesSummary?.totalSightings ?? 0;
  const totalRecords = capturesSummary?.totalRecords ?? 0;
  const totalSpecies = capturesSummary?.totalSpecies ?? 0;

  const handleMarkerAdd = (position) => {
    setMarkers(prev => [...prev, position]);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Species Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#4D6A4D] mb-1">Species Distribution</h2>
            <p className="text-sm text-[#666639] mb-4">Recorded Species</p>
            <div className="flex flex-col items-center">
              {loading ? (
                <p>Loading species distribution...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error.message || 'Failed to load species distribution data'}</p>
              ) : (
                <>
                  <div className="w-full h-48 sm:h-[220px] relative">
                    <ResponsivePie
                      data={speciesData}
                      margin={isMobile ? { top: 10, right: 10, bottom: 10, left: 10 } : { top: 10, right: 130, bottom: 10, left: 10 }}
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
                            Percentage: {((datum.value / speciesData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      )}
                      legends={isMobile ? [] : [
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
                  </div>
                  {isMobile && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {speciesData.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span className="text-xs text-gray-700">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-domine text-[#666639] text-lg font-medium mb-8">Captures Summary</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center sm:-space-x-12 space-y-4 sm:space-y-0">
              <div className="flex flex-col items-center group z-40">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white flex flex-col items-center justify-center border border-[#E5E5E5] shadow-sm hover:shadow-lg transition-all duration-300">
                  <p className="text-3xl sm:text-4xl font-bold text-[#666639]">{capturesSummary?.total_captures || 0}</p>
                  <p className="text-sm text-[#666639] mt-1">Total Records</p>
                </div>
              </div>

              <div className="flex flex-col items-center group z-30">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white flex flex-col items-center justify-center border border-[#E5E5E5] shadow-sm hover:shadow-lg transition-all duration-300">
                  <p className="text-3xl sm:text-4xl font-bold text-[#666639]">{capturesSummary?.by_status?.Alive || 0}</p>
                  <p className="text-sm text-[#666639] mt-1">Alive</p>
                  <p className="text-xs text-[#666639] opacity-50">of {capturesSummary?.total_captures || 0}</p>
                </div>
              </div>

              <div className="flex flex-col items-center group z-20">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white flex flex-col items-center justify-center border border-[#E5E5E5] shadow-sm hover:shadow-lg transition-all duration-300">
                  <p className="text-3xl sm:text-4xl font-bold text-[#666639]">{capturesSummary?.by_gender?.Female || 0}</p>
                  <p className="text-sm text-[#666639] mt-1">Female</p>
                  <p className="text-xs text-[#666639] opacity-50">of {capturesSummary?.total_captures || 0}</p>
                </div>
              </div>

              <div className="flex flex-col items-center group z-10">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white flex flex-col items-center justify-center border border-[#E5E5E5] shadow-sm hover:shadow-lg transition-all duration-300">
                  <p className="text-3xl sm:text-4xl font-bold text-[#666639]">{capturesSummary?.by_action?.Released || 0}</p>
                  <p className="text-sm text-[#666639] mt-1">Released</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex bg-white text-white rounded-sm p-1">
              <button
                onClick={() => setViewType('table')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
                  viewType === 'table'
                    ? 'bg-[#4D6A4D] text-white shadow-sm'
                    : 'text-[#666639] bg-white  hover:text-[#4D6A4D]'
                }`}
              >
                <IoGridOutline className="w-4 h-4" />
                Table View
              </button>
              <button
                onClick={() => setViewType('map')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 ms-1 text-sm transition-colors ${
                  viewType === 'map'
                  ? 'bg-[#4D6A4D] text-white shadow-sm'
                  : 'text-[#666639] bg-white  hover:text-[#4D6A4D]'
                }`}
              >
                <IoMapOutline className="w-4 h-4" />
                Map View
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {viewType === 'table' ? (
            <TurtleTable />
          ) : (
            <TurtleMap 
              captureData={captures.filter(c => c.latitude && c.longitude)} 
              recaptureData={recaptures.filter(r => r.latitude && r.longitude)}
            />
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-domine text-[#666639]">Add a new record</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white hover:text-white transition-colors text-xl font-medium"
                >
                  ✕
                </button>
              </div>
              <TurtleForm 
                onClose={() => setShowForm(false)} 
                onSubmit={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CapturedTurtles;