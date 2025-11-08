import React from 'react';
import { Link } from 'react-router-dom';

const ActionCard = ({ title, subtitle, buttonText, stats, link }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm transform hover:scale-[1.02] transition-all duration-300 hover:shadow-md">
      <h3 className="text-lg font-semibold text-[#4D6A4D] mb-1">{title}</h3>
      <p className="text-sm text-[#666639] mb-4">{subtitle}</p>
      
      <div className="space-y-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center group">
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">{stat.label}</span>
            <span className="text-sm font-medium text-gray-900 group-hover:text-[#4D6A4D] transition-colors duration-200">{stat.value}</span>
          </div>
        ))}
      </div>

      <Link 
        to={link} 
        className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#4D6A4D] text-white rounded-md text-sm hover:bg-[#3D5A3D] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default ActionCard;