// googleAutomation.test.js
import { describe, it, expect } from 'vitest';
import { updateLineChartTitle, replaceTextInDocument, doGet } from '../../src/googleAutomation.js';

describe('Google Automation Tests', () => {

  it('should update line chart title', () => {
    const data = {
      Age: '30',
      Name: 'Nway Nandar Lin'
    };

    const mockSpreadsheetApp = {
      openById: () => ({
        getSheetByName: () => ({
          getCharts: () => [{
            modify: () => ({
              setOption: () => ({
                build: () => {}
              })
            })
          }],
          updateChart: () => {}
        })
      })
    };

    global.SpreadsheetApp = mockSpreadsheetApp;
    global.Logger = { log: () => {} };

    updateLineChartTitle(data);
    expect(mockSpreadsheetApp.openById().getSheetByName('Line').getCharts().length).toBe(1);
  });

  it('should replace text in document and create PDF', () => {
    const data = {
      Name: 'Nway Nandar Lin',
      Age: '30',
      Insurer: 'Global Health Insurance',
      Plan: 'Premium Coverage Plan',
      Rider: 'Accidental Death Benefit',
      MSLPremium: '1000',
      PlanPremium: '500',
      AdditionalWithdrawalLimit: '200',
      CashOutlay: '1500',
      RidersPremium: '250',
      TotalPremium: '750',
      TotalCashOutlay: '1750'
    };
  
    const mockDriveApp = {
      getFileById: () => ({
        makeCopy: () => ({
          getId: () => 'newDocId'
        }),
        getAs: () => 'application/pdf',
        setName: function () {
          return this; // return the object to allow chaining
        },
        setTrashed: () => {}
      }),
      createFile: () => ({
        setName: function () {
          return this; // return the object to allow chaining
        },
        getId: () => 'pdfId'
      })
    };
  
    const mockDocumentApp = {
      openById: () => ({
        getBody: () => ({
          replaceText: () => {}
        }),
        saveAndClose: () => {} // Properly mock saveAndClose
      })
    };
  
    global.DriveApp = mockDriveApp;
    global.DocumentApp = mockDocumentApp;
    global.Logger = { log: () => {} };
  
    const pdfId = replaceTextInDocument(data);
    expect(pdfId).toBe('pdfId');
  });
  
  it('should handle doGet and return PDF URL', () => {
    const e = {
      parameter: {}
    };
  
    const mockContentService = {
      createTextOutput: function (content) {
        return {
          content: content,
          setMimeType: function (mimeType) {
            this.mimeType = mimeType;
            return this;
          }
        };
      },
      MimeType: {
        JAVASCRIPT: 'application/javascript',
      }
    };
  
    global.ContentService = mockContentService;
    global.Logger = { log: () => {} };
  
    const result = doGet(e);
    
    // Ensure the response is what we expect
    expect(result.content).toContain('https://drive.google.com/file/d/');
    expect(result.mimeType).toBe('application/javascript');
  });  


});
