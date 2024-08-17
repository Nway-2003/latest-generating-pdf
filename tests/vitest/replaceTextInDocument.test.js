// tests/vitest/replaceTextInDocument.test.js
import { describe, it, expect, vi } from 'vitest';
import { replaceTextInDocument } from '../../src/replaceTextInDocument';

// Mocking Google Apps Script services
const mockBody = {
  replaceText: vi.fn(),
};

const mockDoc = {
  getBody: vi.fn().mockReturnValue(mockBody),
  saveAndClose: vi.fn(),
};

const mockDocCopy = {
  getId: vi.fn().mockReturnValue('mockDocId'),
};

const mockDriveApp = {
  getFileById: vi.fn().mockReturnValue({
    makeCopy: vi.fn().mockReturnValue(mockDocCopy),
    getAs: vi.fn().mockReturnValue('mockPdfBlob'),
    setTrashed: vi.fn(),
  }),
  createFile: vi.fn().mockReturnValue({
    getId: vi.fn().mockReturnValue('mockPdfFileId'),
    setName: vi.fn().mockReturnThis(),
  }),
};

const mockDocumentApp = {
  openById: vi.fn().mockReturnValue(mockDoc),
};

// Mock the Logger object
global.Logger = {
  log: vi.fn(),
};

// Assign the mock to the global object (to simulate the Google Apps Script environment)
global.DriveApp = mockDriveApp;
global.DocumentApp = mockDocumentApp;

describe('replaceTextInDocument', () => {
  it('should replace placeholders and create a PDF correctly', () => {
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
      TotalCashOutlay: '1750',
    };

    const pdfId = replaceTextInDocument(data);

    // Verify document was copied
    expect(mockDriveApp.getFileById).toHaveBeenCalledWith('1zVXkOdafI8XjR8Szn_IT7k-LnTtPySMvaKrBp1Zr1so');
    expect(mockDriveApp.getFileById().makeCopy).toHaveBeenCalled();

    // Verify placeholders were replaced
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{Name}}', 'Nway Nandar Lin');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{Age}}', '30');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{Insurer}}', 'Global Health Insurance');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{Plan}}', 'Premium Coverage Plan');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{Rider}}', 'Accidental Death Benefit');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{MSLPremium}}', '1000');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{PlanPremium}}', '500');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{AdditionalWithdrawalLimit}}', '200');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{CashOutlay}}', '1500');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{RidersPremium}}', '250');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{TotalPremium}}', '750');
    expect(mockBody.replaceText).toHaveBeenCalledWith('{{TotalCashOutlay}}', '1750');

    // Verify document was saved and closed
    expect(mockDoc.saveAndClose).toHaveBeenCalled();

    // Verify PDF was created
    expect(mockDriveApp.getFileById).toHaveBeenCalledWith('mockDocId');
    expect(mockDriveApp.createFile).toHaveBeenCalledWith('mockPdfBlob');
    expect(mockDriveApp.createFile().setName).toHaveBeenCalledWith('Nway Nandar Lin.pdf');

    // Verify the copied document was trashed
    expect(mockDriveApp.getFileById().setTrashed).toHaveBeenCalledWith(true);

    // Verify the returned PDF ID
    expect(pdfId).toBe('mockPdfFileId');
  });
});
