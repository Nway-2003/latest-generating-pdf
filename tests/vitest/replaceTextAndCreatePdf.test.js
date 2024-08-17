// tests/vitest/replaceTextAndCreatePdf.test.js
import { describe, it, expect, vi } from 'vitest';
const { replaceTextAndCreatePdf } = require('../../src/replaceTextAndCreatePdf'); // Ensure this path is correct

// Mock Google Apps Script services
global.SpreadsheetApp = {
  openById: vi.fn().mockReturnValue({
    getSheetByName: vi.fn().mockReturnValue({
      getCharts: vi.fn().mockReturnValue([{
        modify: vi.fn().mockReturnValue({
          setOption: vi.fn().mockReturnValue({
            build: vi.fn() // Mock build method
          })
        })
      }]),
      updateChart: vi.fn() // Mock updateChart method
    })
  })
};

global.DocumentApp = {
  openById: vi.fn().mockReturnValue({
    getBody: vi.fn().mockReturnValue({
      replaceText: vi.fn() // Mock replaceText method
    }),
    saveAndClose: vi.fn() // Mock saveAndClose method
  })
};

global.DriveApp = {
  getFileById: vi.fn().mockImplementation((fileId) => {
    if (fileId === '1zVXkOdafI8XjR8Szn_IT7k-LnTtPySMvaKrBp1Zr1so') {
      return {
        makeCopy: vi.fn().mockReturnValue({
          getId: vi.fn().mockReturnValue('mockedDocId')
        })
      };
    }
    if (fileId === 'mockedDocId') {
      return {
        getAs: vi.fn().mockReturnValue(Buffer.from('PDF Content')),
        setTrashed: vi.fn() // Mock setTrashed method
      };
    }
    return {};
  }),
  createFile: vi.fn().mockReturnValue({
    setName: vi.fn().mockReturnValue({
      getId: vi.fn().mockReturnValue('mockedPdfId') // Mock getId method
    })
  })
};

describe('replaceTextAndCreatePdf Function', () => {
  it('should generate a PDF and return the preview URL', () => {
    const data = {
      'Name': 'Nway Nandar Lin',
      'Age': '30',
      'Insurer': 'Global Health Insurance',
      'Plan': 'Premium Coverage Plan',
      'Rider': 'Accidental Death Benefit',
      'MSLPremium': '1000',
      'PlanPremium': '500',
      'AdditionalWithdrawalLimit': '200',
      'CashOutlay': '1500',
      'RidersPremium': '250',
      'TotalPremium': '750',
      'TotalCashOutlay': '1750'
    };

    const pdfUrl = replaceTextAndCreatePdf(data);

    // Expected URL format
    const expectedUrl = 'https://drive.google.com/file/d/mockedPdfId/preview';

    expect(pdfUrl).toBe(expectedUrl);
  });
});
