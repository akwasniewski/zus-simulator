'use client';

import { exportTelemetryData, clearTelemetryData } from '../utils/telemetry';
import { useState, useEffect } from 'react';

export default function TelemetryManager() {
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);

  const loadTelemetryData = () => {
    const data = exportTelemetryData();
    setTelemetryData(data);
    setShowData(true);
  };

  useEffect(() => {
    // Load data on component mount
    loadTelemetryData();
  }, []);

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
      setTelemetryData([]);
      alert('Telemetry data cleared');
    }
  };

  const handleViewData = () => {
    const data = exportTelemetryData();
    console.log('Current telemetry data:', data);
    alert(`Found ${data.length} entries. Check console for details.`);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('pl-PL');
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="p-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Telemetry Manager</h3>
        <div className="space-x-4">
          <button
            onClick={handleViewData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View in Console
          </button>
          <button
            onClick={handleExportData}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export JSON
          </button>
          <button
            onClick={loadTelemetryData}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Refresh Data
          </button>
          <button
            onClick={handleClearData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Data
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Total entries: {telemetryData.length}
        </p>
      </div>

      {/* Data Display */}
      {showData && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h4 className="text-lg font-semibold">Telemetry Data</h4>
          </div>
          
          {telemetryData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No telemetry data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Timestamp</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Age</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Gender</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Salary</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Expected</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Calculated</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Years to Retire</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Retirement Balance</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Zip Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {telemetryData.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {formatDate(entry.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {entry.formData.currentAge}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {entry.formData.gender === 'female' ? 'K' : 'M'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {formatCurrency(parseFloat(entry.formData.currentSalary || '0'))}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {entry.expectedPension ? formatCurrency(entry.expectedPension) : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {formatCurrency(entry.calculationResult.monthlyPension || 0)}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {entry.calculationResult.yearsToRetirement}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {entry.formData.currentRetirementBalance ? 
                          formatCurrency(parseFloat(entry.formData.currentRetirementBalance)) : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {entry.formData.zipCode || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}