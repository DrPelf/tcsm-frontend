import React from 'react';

const StatCard = ({ value, title, subtitle }) => {
  return (
    <div className="bg-white p-6 rounded-lg flex flex-col items-center font-inter">
      <h2 className="text-5xl text-[#666639] font-semibold mb-2">{value}</h2>
      <h3 className="text-[#666639] font-medium mb-1 text-center">{title}</h3>
      <p className="text-sm text-[#666639] text-center">{subtitle}</p>
    </div>
  );
};

export default StatCard;