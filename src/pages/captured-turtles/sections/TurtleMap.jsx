import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector } from 'react-redux';

// Custom icons for different markers
const captureIcon = L.divIcon({
  html: `
    <div style="
      background-color: #8AB28A;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    ">
      <img src="/turtle.svg" style="width: 20px; height: 20px;" />
    </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const recaptureIcon = L.divIcon({
  html: `
    <div style="
      background-color: #D4A76A;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    ">
      <img src="/turtle.svg" style="width: 20px; height: 20px;" />
    </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const MALAYSIA_BOUNDS = {
  north: 7.363417, 
  south: 0.855222, 
  west: 99.643056, 
  east: 119.267502 
};

const MALAYSIA_CENTER = {
  lat: 4.2105,
  lng: 101.9758
};

const TurtleMap = ({ captureData, recaptureData }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [MALAYSIA_CENTER.lat, MALAYSIA_CENTER.lng],
      zoom: 6,
      maxBounds: [
        [MALAYSIA_BOUNDS.south - 1, MALAYSIA_BOUNDS.west - 1],
        [MALAYSIA_BOUNDS.north + 1, MALAYSIA_BOUNDS.east + 1]
      ],
      minZoom: 5,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <div class="bg-white p-3 rounded-lg shadow-md space-y-3">
          <div class="font-medium text-gray-700 border-b pb-2">Turtle Sightings</div>
          <div class="flex items-center gap-2">
            <div style="background-color: #8AB28A; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
              <img src="/turtle.svg" style="width: 16px; height: 16px;" />
            </div>
            <span class="text-sm text-gray-600">First Captures</span>
          </div>
          <div class="flex items-center gap-2">
            <div style="background-color: #D4A76A; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
              <img src="/turtle.svg" style="width: 16px; height: 16px;" />
            </div>
            <span class="text-sm text-gray-600">Recaptures</span>
          </div>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Plot capture markers
    captureData?.forEach(capture => {
      const lat = parseFloat(capture.latitude);
      const lng = parseFloat(capture.longitude);
      
      if (lat !== null && lng !== null && lat !== undefined && lng !== undefined && 
          lat >= MALAYSIA_BOUNDS.south && lat <= MALAYSIA_BOUNDS.north &&
          lng >= MALAYSIA_BOUNDS.west && lng <= MALAYSIA_BOUNDS.east) {
        const marker = L.marker([lat, lng], { icon: captureIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-semibold text-gray-800 mb-2">First Capture</h3>
              <div class="space-y-1">
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Microchip ID:</span> ${capture.microchip_id || 'N/A'}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Location:</span> 
                  ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            </div>
          `);
        markersRef.current.push(marker);
      }
    });

    // Plot recapture markers
    recaptureData?.forEach(recapture => {
      const lat = parseFloat(recapture.latitude);
      const lng = parseFloat(recapture.longitude);
      
      if (lat !== null && lng !== null && lat !== undefined && lng !== undefined && 
          lat >= MALAYSIA_BOUNDS.south && lat <= MALAYSIA_BOUNDS.north &&
          lng >= MALAYSIA_BOUNDS.west && lng <= MALAYSIA_BOUNDS.east) {
        const marker = L.marker([lat, lng], { icon: recaptureIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-semibold text-gray-800 mb-2">Recapture</h3>
              <div class="space-y-1">
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Microchip ID:</span> ${recapture.microchip_id || 'N/A'}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Location:</span> 
                  ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </p>
              </div>
            </div>
          `);
        markersRef.current.push(marker);
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.remove();
    };
  }, [captureData, recaptureData]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-[600px] rounded-lg shadow-md"
      />
    </div>
  );
};

export default TurtleMap;