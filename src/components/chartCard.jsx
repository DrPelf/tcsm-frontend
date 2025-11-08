import React from 'react';

const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="font-domine text-[#4D6A4D] text-xl font-medium mb-1">{title}</h2>
      <p className="font-inter text-[#666666] text-sm mb-4">{subtitle}</p>
      {children}
    </div>
  );
};

export default ChartCard;