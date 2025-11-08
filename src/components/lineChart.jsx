import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const LineChart = () => {
  const data = [
    {
      id: 'Captured',
      data: [
        { x: 2018, y: 45 },
        { x: 2019, y: 65 },
        { x: 2020, y: 95 },
        { x: 2021, y: 125 },
        { x: 2022, y: 160 },
        { x: 2023, y: 195 },
        { x: 2024, y: 250 },
      ],
    },
    {
      id: 'Released',
      data: [
        { x: 2018, y: 35 },
        { x: 2019, y: 55 },
        { x: 2020, y: 75 },
        { x: 2021, y: 100 },
        { x: 2022, y: 130 },
        { x: 2023, y: 165 },
        { x: 2024, y: 180 },
      ],
    },
    {
      id: 'Nesting',
      data: [
        { x: 2018, y: 15 },
        { x: 2019, y: 20 },
        { x: 2020, y: 25 },
        { x: 2021, y: 35 },
        { x: 2022, y: 50 },
        { x: 2023, y: 65 },
        { x: 2024, y: 75 },
      ],
    },
  ];

  return (
    <div style={{ height: 300 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 260 }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 12,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
        }}
        enableGridX={true}
        enableGridY={true}
        colors={{ scheme: 'category10' }}
        lineWidth={1.5}
        enablePoints={true}
        pointSize={8}
        pointColor="#ffffff"
        pointBorderWidth={1.5}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea={false}
        useMesh={true}
      />
    </div>
  );
};

export default LineChart; 