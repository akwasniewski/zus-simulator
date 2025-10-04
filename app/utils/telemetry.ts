import { FormData } from './pensionCalculator';

export interface TelemetryEntry {
  timestamp: string;
  sessionId: string;
  formData: FormData & {
    // Include additional fields that might not be in FormData interface
    hasRetirementAccount?: boolean;
  };
  expectedPension: number | null;
  calculationResult: {
    monthlyPension: number;
    monthlyPensionAdjusted: number;
    FootOfReturn: number;
    AverageFuturePension: number;
    totalSavings: number;
    yearsToRetirement: number;
    yearsNeededForDesiredPension?: number;
  };
  userAgent: string;
}

// Generate a simple session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Save telemetry data to localStorage (for demo purposes)
// In a real application, this would send data to a backend API
export const saveTelemetryData = async (
  formData: FormData, 
  calculationResult: any, 
  expectedPension: number | null = null
): Promise<void> => {
  try {
    console.log('Starting telemetry save...');
    console.log('Form data received:', formData);
    console.log('Calculation result received:', calculationResult);
    console.log('Expected pension received:', expectedPension);
    
    // Determine if user provided retirement account info
    const hasRetirementAccount = !!(formData.currentRetirementBalance && parseFloat(formData.currentRetirementBalance) > 0);
    
    const telemetryEntry: TelemetryEntry = {
      timestamp: new Date().toISOString(),
      sessionId: generateSessionId(),
      formData: {
        ...formData,
        hasRetirementAccount, // Add this field for telemetry purposes
      },
      expectedPension,
      calculationResult,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
    };

    console.log('Telemetry entry created:', telemetryEntry);

    // Get existing telemetry data
    const existingData = localStorage.getItem('pensionCalculatorTelemetry');
    console.log('Existing telemetry data:', existingData);
    const telemetryArray: TelemetryEntry[] = existingData ? JSON.parse(existingData) : [];
    
    // Add new entry
    telemetryArray.push(telemetryEntry);
    console.log('Updated telemetry array length:', telemetryArray.length);
    
    // Keep only last 100 entries to prevent localStorage from growing too large
    if (telemetryArray.length > 100) {
      telemetryArray.shift();
    }
    
    // Save back to localStorage
    const dataToSave = JSON.stringify(telemetryArray, null, 2);
    localStorage.setItem('pensionCalculatorTelemetry', dataToSave);
    console.log('Data saved to localStorage successfully');
    
    console.log('Telemetry data saved:', telemetryEntry);
    
    // In a real application, you would also send this to your backend:
    // await fetch('/api/telemetry', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(telemetryEntry)
    // });
    
  } catch (error) {
    console.error('Failed to save telemetry data:', error);
  }
};

// Utility function to export telemetry data
export const exportTelemetryData = (): TelemetryEntry[] => {
  try {
    const data = localStorage.getItem('pensionCalculatorTelemetry');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to export telemetry data:', error);
    return [];
  }
};

// Utility function to clear telemetry data
export const clearTelemetryData = (): void => {
  try {
    localStorage.removeItem('pensionCalculatorTelemetry');
    console.log('Telemetry data cleared');
  } catch (error) {
    console.error('Failed to clear telemetry data:', error);
  }
};