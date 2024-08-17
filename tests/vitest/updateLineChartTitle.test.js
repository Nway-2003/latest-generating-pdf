// tests/vitest/updateLineChartTitle.test.js
import { describe, it, expect, vi } from 'vitest';

// Mocking Google Apps Script services
const mockChart = {
  modify: vi.fn().mockReturnThis(),
  setOption: vi.fn().mockReturnThis(),
  build: vi.fn().mockReturnValue('mockChart'),
};

const mockSheet = {
  getCharts: vi.fn().mockReturnValue([mockChart]),
  updateChart: vi.fn(),
};

const mockSpreadsheetApp = {
  openById: vi.fn().mockReturnValue({
    getSheetByName: vi.fn().mockReturnValue(mockSheet),
  }),
};

// Mock the Logger object
global.Logger = {
  log: vi.fn(),
};

// Assign the mock to the global object (to simulate the Google Apps Script environment)
global.SpreadsheetApp = mockSpreadsheetApp;

// Import the function to test
import { updateLineChartTitle } from '../../src/updateLineChartTitle'; // Adjust the path as needed

describe('updateLineChartTitle', () => {
  it('should update the chart title correctly', () => {
    const data = {
      Age: '30',
      Name: 'Nway Nandar Lin',
    };

    updateLineChartTitle(data);

    // Check if SpreadsheetApp.openById was called with the correct sheet ID
    expect(global.SpreadsheetApp.openById).toHaveBeenCalledWith('1skuXZpXgK08_FJXr13aeGssxYAXf-AfGdu-J6h0Wkh0');
    
    // Check if getSheetByName was called with 'Line'
    expect(mockSpreadsheetApp.openById().getSheetByName).toHaveBeenCalledWith('Line');
    
    // Check if getCharts was called
    expect(mockSheet.getCharts).toHaveBeenCalled();
    
    // Check if setOption was called with the correct title
    expect(mockChart.setOption).toHaveBeenCalledWith('title', 'Premium at 30 for Nway Nandar Lin');
    
    // Check if updateChart was called with the updated chart
    expect(mockSheet.updateChart).toHaveBeenCalledWith('mockChart');
  });
  
  it('should log a message if no charts are found', () => {
    // Mock the case where no charts are found
    mockSheet.getCharts.mockReturnValueOnce([]);
    
    updateLineChartTitle({ Age: '30', Name: 'Nway Nandar Lin' });

    // Check if the log was called with the correct message
    expect(global.Logger.log).toHaveBeenCalledWith('No charts found on the sheet.');
  });
});
