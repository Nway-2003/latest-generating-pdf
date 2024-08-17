// tests/vitest/convertGoogleDocToWord.test.js
import { describe, it, expect, vi } from 'vitest';
import { convertGoogleDocToWord } from '../../src/convertGoogleDocToWord';

// Mocking Google Apps Script services
const mockBlob = {
 
};

const mockFile = {
  setName: vi.fn().mockReturnThis(),
  setSharing: vi.fn().mockReturnThis(),
  getDownloadUrl: vi.fn().mockReturnValue('https://drive.google.com/file/d/mockDocId/download')
};

const mockDriveApp = {
  createFile: vi.fn().mockReturnValue(mockFile),
  Access: {
    ANYONE_WITH_LINK: 'ANYONE_WITH_LINK'
  },
  Permission: {
    VIEW: 'VIEW'
  }
};

const mockUrlFetchApp = {
  fetch: vi.fn().mockReturnValue({
    getBlob: vi.fn().mockReturnValue(mockBlob)
  })
};

// Mock the Logger object
global.Logger = {
  log: vi.fn(),
};

// Assign the mocks to the global object (to simulate the Google Apps Script environment)
global.DriveApp = mockDriveApp;
global.UrlFetchApp = mockUrlFetchApp;
global.ScriptApp = {
  getOAuthToken: vi.fn().mockReturnValue('mockOAuthToken')
};

describe('convertGoogleDocToWord', () => {
  it('should convert a Google Doc to a Word document and return the download URL', () => {
    const docId = 'mockDocId';
    const url = convertGoogleDocToWord(docId);

    // Verify that UrlFetchApp.fetch was called with the correct URL and options
    expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
      `https://www.googleapis.com/drive/v3/files/mockDocId/export?mimeType=application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer mockOAuthToken`
        }
      }
    );

    // Verify that the file was created and named correctly
    expect(mockDriveApp.createFile).toHaveBeenCalledWith(mockBlob);
    expect(mockFile.setName).toHaveBeenCalledWith('Nway_Document.docx');

    // Verify that the sharing permissions were set correctly
    expect(mockFile.setSharing).toHaveBeenCalledWith(
      'ANYONE_WITH_LINK',
      'VIEW'
    );

    // Verify that the correct download URL was returned
    expect(url).toBe('https://drive.google.com/file/d/mockDocId/download');
  });

  it('should log and throw an error if the conversion fails', () => {
    // Mock UrlFetchApp.fetch to throw an error
    mockUrlFetchApp.fetch.mockImplementationOnce(() => {
      throw new Error('Mocked fetch error');
    });

    const docId = 'mockDocId';

    // Test that the function throws an error
    expect(() => convertGoogleDocToWord(docId)).toThrow('Error during conversion: Mocked fetch error');

    // Verify that the error was logged
    expect(Logger.log).toHaveBeenCalledWith('Error during conversion: Mocked fetch error');
  });
});
