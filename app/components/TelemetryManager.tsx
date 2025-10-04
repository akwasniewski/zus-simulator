'use client';

import { exportTelemetryData, clearTelemetryData } from '../utils/telemetry';

export default function TelemetryManager() {
  const handleExportData = () => {
    const data = exportTelemetryData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pension-calculator-telemetry-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all telemetry data?')) {
      clearTelemetryData();
      alert('Telemetry data cleared');
    }
  };

  const handleViewData = () => {
    const data = exportTelemetryData();
    console.log('Current telemetry data:', data);
    alert(`Found ${data.length} entries. Check console for details.`);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Telemetry Manager (Development Only)</h3>
      <div className="space-x-4">
        <button
          onClick={handleViewData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Data
        </button>
        <button
          onClick={handleExportData}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export JSON
        </button>
        <button
          onClick={handleClearData}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Data
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Telemetry data is stored locally for demonstration purposes. 
        In production, this would be sent to a backend API.
      </p>
    </div>
  );
}