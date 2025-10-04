# Pension Calculator Telemetry System

## Overview
This telemetry system captures user interaction data when they submit the pension calculator form. The data is used for analytics and improving the calculator experience.

## Data Collected

### User Form Data
- `gender`: User's gender selection
- `currentAge`: User's current age
- `currentSalary`: User's monthly salary
- `workStartYear`: Year when user started working
- `considerSickLeave`: Whether user wants to consider sick leave
- `hasChildren`: Whether user has children
- `numberOfChildren`: Number of children (if any)
- `hasRetirementAccount`: Whether user provided retirement account balance (auto-detected)
- `currentRetirementBalance`: Current retirement account balance (if provided)
- `retirementAge`: Planned retirement age
- `zipCode`: Postal code (anonymized as 'PROVIDED' or 'NOT_PROVIDED')

### Expected Pension
- `expectedPension`: The pension amount user expects (from landing page form)

### Calculation Results
- `monthlyPension`: Calculated monthly pension
- `monthlyPensionAdjusted`: Inflation-adjusted pension
- `FootOfReturn`: Foot of return calculation
- `totalSavings`: Total accumulated savings
- `yearsToRetirement`: Years until retirement

### Metadata
- `timestamp`: When the calculation was performed
- `sessionId`: Unique session identifier
- `userAgent`: Browser/device information

## Storage

### Development Mode
- Data is stored in `localStorage` under the key `pensionCalculatorTelemetry`
- Maximum 100 entries are kept to prevent storage overflow
- Use the `TelemetryManager` component to view/export/clear data

### Production Mode
To implement in production:
1. Create a backend API endpoint (e.g., `/api/telemetry`)
2. Uncomment the fetch call in `saveTelemetryData` function
3. Add proper error handling and retry logic
4. Implement data privacy compliance (GDPR, etc.)

## Files

- `/app/utils/telemetry.ts` - Core telemetry functionality
- `/app/components/TelemetryManager.tsx` - Development utility component
- `/telemetry-data.json` - Example data structure

## Usage

The telemetry system automatically activates when a user completes the pension calculator form. No additional setup is required.

For development, you can add the TelemetryManager component to any page:

```tsx
import TelemetryManager from './components/TelemetryManager';

// Add to your component
<TelemetryManager />
```

## Privacy Notes

- Postal codes are anonymized
- No personally identifiable information is stored
- Data is used only for improving the calculator
- Users should be informed about data collection through privacy policy

## Data Export

The `TelemetryManager` component allows exporting data as JSON files for analysis. The exported file includes all telemetry entries with timestamps for data analysis.