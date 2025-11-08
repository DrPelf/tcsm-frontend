import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const DonutChart = () => {
  const data = [
    {
      id: "Batagur borneensis",
      label: "Batagur borneensis",
      value: 40,
      color: "#4D6A4D"
    },
    {
      id: "Cuora amboinensis",
      label: "Cuora amboinensis",
      value: 15,
      color: "#D4A76A"
    },
    {
      id: "Other species",
      label: "Other species",
      value: 45,
      color: "#4A6FA5"
    }
  ];

  return (
    <div style={{ height: 300, width: '100%' }}>
      <ResponsivePie
        data={data}
        margin={{ top: 10, right: 10, bottom: 80, left: 10 }}
        innerRadius={0.6}
        padAngle={0.5}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={d => d.data.color}
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
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemWidth: 120,
            itemHeight: 20,
            itemsSpacing: 10,
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                  itemBackground: 'rgba(0, 0, 0, .03)'
                }
              }
            ]
          }
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
            }
          },
          legends: {
            text: {
              fontSize: 12,
              fill: '#666666'
            }
          }
        }}
        transitionMode="startAngle"
        motionConfig="stiff"
      />
    </div>
  );
};

export default DonutChart;