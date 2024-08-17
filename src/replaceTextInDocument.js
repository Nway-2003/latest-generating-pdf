// src/replaceTextInDocument.js
export function replaceTextInDocument(data) {
    var templateId = '1zVXkOdafI8XjR8Szn_IT7k-LnTtPySMvaKrBp1Zr1so'; // Google Docs template ID
  
    // Make a copy of the document
    var docCopy = DriveApp.getFileById(templateId).makeCopy();
    var docId = docCopy.getId();
    Logger.log('Document copied with ID: ' + docId); // Log the copied document ID
  
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
  
    // Replace placeholders with actual data
    body.replaceText('{{Name}}', data['Name'] || '');
    body.replaceText('{{Age}}', data['Age'] || '');
    body.replaceText('{{Insurer}}', data['Insurer'] || '');
    body.replaceText('{{Plan}}', data['Plan'] || '');
    body.replaceText('{{Rider}}', data['Rider'] || '');
    body.replaceText('{{MSLPremium}}', data['MSLPremium'] || '');
    body.replaceText('{{PlanPremium}}', data['PlanPremium'] || '');
    body.replaceText('{{AdditionalWithdrawalLimit}}', data['AdditionalWithdrawalLimit'] || '');
    body.replaceText('{{CashOutlay}}', data['CashOutlay'] || '');
    body.replaceText('{{RidersPremium}}', data['RidersPremium'] || '');
    body.replaceText('{{TotalPremium}}', data['TotalPremium'] || '');
    body.replaceText('{{TotalCashOutlay}}', data['TotalCashOutlay'] || '');
  
    doc.saveAndClose();
  
    // Convert to PDF
    var pdf = DriveApp.getFileById(docId).getAs('application/pdf');
    var name = data['Name'] || 'default'; // Use the Name field for the filename
    var pdfFile = DriveApp.createFile(pdf).setName(name + '.pdf');
    Logger.log('PDF created with ID: ' + pdfFile.getId()); // Log the created PDF ID
  
    // Optionally, delete the copied document
    DriveApp.getFileById(docId).setTrashed(true);
  
    return pdfFile.getId();
  }
  