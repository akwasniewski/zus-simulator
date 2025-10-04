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

  const handleExportToExcel = () => {
    const data = exportTelemetryData();
    
    if (data.length === 0) {
      alert('Brak danych do eksportu');
      return;
    }

    // Prepare data for Excel export
    const excelData = data.map(entry => ({
      'Data i czas': formatDate(entry.timestamp),
      'Wiek': entry.formData.currentAge,
      'Płeć': entry.formData.gender === 'female' ? 'Kobieta' : 'Mężczyzna',
      'Pensja (PLN)': parseFloat(entry.formData.currentSalary || '0'),
      'Oczekiwana emerytura (PLN)': entry.expectedPension || 0,
      'Obliczona emerytura (PLN)': entry.calculationResult.monthlyPension || 0,
      'Lat do emerytury': entry.calculationResult.yearsToRetirement,
      'Saldo emerytalne (PLN)': entry.formData.currentRetirementBalance ? parseFloat(entry.formData.currentRetirementBalance) : 0,
      'Kod pocztowy': entry.formData.zipCode || '',
      'Rok rozpoczęcia pracy': entry.formData.workStartYear,
      'Dzieci': entry.formData.hasChildren ? (entry.formData.numberOfChildren || 0) : 0,
      'Uwzględnić zwolnienie chorobowe': entry.formData.considerSickLeave ? 'Tak' : 'Nie',
      'Wiek emerytalny': entry.formData.retirementAge,
      'ID sesji': entry.sessionId
    }));

    // Convert to CSV format (Excel can open CSV files)
    const headers = Object.keys(excelData[0]);
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    // Create and download CSV file
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `pension-calculator-telemetry-${new Date().toISOString().split('T')[0]}.csv`;
    csvLink.click();
    
    URL.revokeObjectURL(csvUrl);
  };

  const handleExportToXLSX = async () => {
    const data = exportTelemetryData();
    
    if (data.length === 0) {
      alert('Brak danych do eksportu');
      return;
    }

    try {
      // Dynamically import xlsx library
      const XLSX = await import('xlsx');
      
      // Prepare data for Excel export
      const excelData = data.map(entry => ({
        'Data i czas': formatDate(entry.timestamp),
        'Wiek': parseInt(entry.formData.currentAge) || 0,
        'Płeć': entry.formData.gender === 'female' ? 'Kobieta' : 'Mężczyzna',
        'Pensja (PLN)': parseFloat(entry.formData.currentSalary || '0'),
        'Oczekiwana emerytura (PLN)': entry.expectedPension || 0,
        'Obliczona emerytura (PLN)': Math.round((entry.calculationResult.monthlyPension || 0) * 100) / 100,
        'Lat do emerytury': entry.calculationResult.yearsToRetirement || 0,
        'Saldo emerytalne (PLN)': entry.formData.currentRetirementBalance ? parseFloat(entry.formData.currentRetirementBalance) : 0,
        'Kod pocztowy': entry.formData.zipCode || '',
        'Rok rozpoczęcia pracy': parseInt(entry.formData.workStartYear) || 0,
        'Dzieci': entry.formData.hasChildren ? (parseInt(entry.formData.numberOfChildren) || 0) : 0,
        'Uwzględnić zwolnienie chorobowe': entry.formData.considerSickLeave ? 'Tak' : 'Nie',
        'Wiek emerytalny': parseInt(entry.formData.retirementAge) || 0,
        'ID sesji': entry.sessionId,
        'User Agent': entry.userAgent || 'Nieznany'
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      const colWidths = [
        { wch: 20 }, // Data i czas
        { wch: 8 },  // Wiek
        { wch: 12 }, // Płeć
        { wch: 15 }, // Pensja
        { wch: 18 }, // Oczekiwana emerytura
        { wch: 18 }, // Obliczona emerytura
        { wch: 15 }, // Lat do emerytury
        { wch: 18 }, // Saldo emerytalne
        { wch: 12 }, // Kod pocztowy
        { wch: 18 }, // Rok rozpoczęcia pracy
        { wch: 8 },  // Dzieci
        { wch: 25 }, // Uwzględnić zwolnienie chorobowe
        { wch: 15 }, // Wiek emerytalny
        { wch: 25 }, // ID sesji
        { wch: 30 }  // User Agent
      ];
      worksheet['!cols'] = colWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Telemetria Kalkulatora');
      
      // Add metadata sheet
      const metadataSheet = XLSX.utils.json_to_sheet([
        { 'Informacja': 'Eksport danych telemetrii', 'Wartość': 'Kalkulator Emerytury ZUS' },
        { 'Informacja': 'Data eksportu', 'Wartość': new Date().toLocaleString('pl-PL') },
        { 'Informacja': 'Liczba rekordów', 'Wartość': data.length },
        { 'Informacja': 'Format danych', 'Wartość': 'Microsoft Excel (.xls)' },
        { 'Informacja': 'Kodowanie', 'Wartość': 'UTF-8' }
      ]);
      metadataSheet['!cols'] = [{ wch: 20 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadane');
      
      // Generate Excel file and download
      const fileName = `kalkulator-emerytury-telemetria-${new Date().toISOString().split('T')[0]}.xls`;
      XLSX.writeFile(workbook, fileName, { bookType: 'xls' });
      
    } catch (error) {
      console.error('Błąd podczas eksportu do Excel:', error);
      alert('Błąd podczas eksportu do Excel. Spróbuj eksport CSV jako alternatywę.');
    }
  };

  const handleClearData = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie dane telemetrii?')) {
      clearTelemetryData();
      setTelemetryData([]);
      alert('Dane telemetrii zostały usunięte');
    }
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
        <h3 className="text-lg font-bold mb-4">Menedżer Telemetrii</h3>
        <div className="space-x-4">
          <button
            onClick={handleExportData}
            className="bg-[var(--green)] text-white px-4 py-2 rounded hover:opacity-80 focus:ring-2 focus:ring-[var(--green)] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
          >
            Eksportuj do JSON
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-[var(--green)] text-white px-4 py-2 rounded hover:opacity-80 focus:ring-2 focus:ring-[var(--green)] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
          >
            Eksportuj do CSV
          </button>
          <button
            onClick={handleExportToXLSX}
            className="bg-[var(--green)] text-white px-4 py-2 rounded hover:opacity-80 focus:ring-2 focus:ring-[var(--green)] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
          >
            Eksportuj do Excela (.xls)
          </button>
          <button
            onClick={loadTelemetryData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 cursor-pointer"
          >
            Odśwież Dane
          </button>
          <button
            onClick={handleClearData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-80 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 cursor-pointer"
          >
            Wyczyść Dane
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Łącznie wpisów: {telemetryData.length}
        </p>
      </div>

      {/* Data Display */}
      {showData && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h4 className="text-lg font-semibold">Dane Telemetrii</h4>
          </div>
          
          {telemetryData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Brak dostępnych danych telemetrii
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Data i czas</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Wiek</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Płeć</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Pensja</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Oczekiwana</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Obliczona</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Lat do emerytury</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Saldo emerytalne</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Kod pocztowy</th>
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