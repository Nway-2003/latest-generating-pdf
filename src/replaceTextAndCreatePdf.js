// src/replaceTextAndCreatePdf.js
function updateLineChartTitle(data) {
    var sheetId = '1skuXZpXgK08_FJXr13aeGssxYAXf-AfGdu-J6h0Wkh0'; // Google Sheets ID
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Line');
    var charts = sheet.getCharts();
    
    if (charts.length > 0) {
      var chart = charts[0];
      var newTitle = 'Premium at ' + data['Age'] + ' for ' + data['Name'];
      var chartBuilder = chart.modify().setOption('title', newTitle);
      sheet.updateChart(chartBuilder.build());
    } else {
      console.log('No charts found on the sheet.'); // Replace Logger.log with console.log
    }
  }
  
  function replaceTextInDocument(data) {
    var templateId = '1zVXkOdafI8XjR8Szn_IT7k-LnTtPySMvaKrBp1Zr1so';
    var docCopy = DriveApp.getFileById(templateId).makeCopy();
    var docId = docCopy.getId();
    console.log('Document copied with ID: ' + docId); // Replace Logger.log with console.log
    
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
    
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
    
    var pdf = DriveApp.getFileById(docId).getAs('application/pdf');
    var name = data['Name'] || 'default';
    var pdfFile = DriveApp.createFile(pdf).setName(name + '.pdf');
    console.log('PDF created with ID: ' + pdfFile.getId()); // Replace Logger.log with console.log
    
    DriveApp.getFileById(docId).setTrashed(true);
    
    return pdfFile.getId();
  }
  
  function replaceTextAndCreatePdf(data) {
    updateLineChartTitle(data);
    var pdfId = replaceTextInDocument(data);
    var pdfUrl = 'https://drive.google.com/file/d/' + pdfId + '/preview';
    return pdfUrl;
  }
  
  module.exports = { replaceTextAndCreatePdf }; // Export function
  