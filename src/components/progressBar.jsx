import React from 'react';

const ProgressBar = ({ location, sightings, percentage }) => {
  return (
    <div className="flex items-center gap-3 font-inter group">
      <div className="w-6 h-6 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
        <svg className="w-4 h-4 text-[#4D6A4D] transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      <span className="w-24 text-base text-[#333333] group-hover:text-[#4D6A4D] transition-colors duration-300">{location}</span>
      <div className="flex-1 h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#4D6A4D] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm text-[#666666] min-w-[80px] group-hover:text-[#4D6A4D] transition-colors duration-300">{sightings} sightings</span>
    </div>
  );
};

export default ProgressBar;