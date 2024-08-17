// googleAutomation.js

function updateLineChartTitle(data) {
    var sheetId = '1skuXZpXgK08_FJXr13aeGssxYAXf-AfGdu-J6h0Wkh0'; // Google Sheets ID
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Line'); // Modify 'Line' if necessary
    
    // Get all charts in the sheet
    var charts = sheet.getCharts();
    
    // Check if there is at least one chart
    if (charts.length > 0) {
      // Assuming we want to update the first chart
      var chart = charts[0];
      
      // Update the chart's title with data['Age'] and data['Name']
      var newTitle = 'Premium at ' + data['Age'] + ' for ' + data['Name'];
      
      // Create a new chart builder with the updated title
      var chartBuilder = chart.modify().setOption('title', newTitle);
      
      // Replace the old chart with the new one
      sheet.updateChart(chartBuilder.build());
    } else {
      Logger.log('No charts found on the sheet.');
    }
  }
  
  function replaceTextInDocument(data) {
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
  
  function replaceTextAndCreatePdf(data) {
    // Update line chart title
    updateLineChartTitle(data);
    
    // Replace text in Google Docs and create PDF
    var pdfId = replaceTextInDocument(data);
    
    // Get the URL of the PDF
    var pdfUrl = 'https://drive.google.com/file/d/' + pdfId + '/preview';
    return pdfUrl;
  }
  
  function doGet(e) {
    var data = {
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
   
    var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;
    
    try {
      var pdfUrl = replaceTextAndCreatePdf(data);
      var result = JSON.stringify({ pdfUrl: pdfUrl });
      
      if (callback) {
        result = callback + '(' + result + ')';
      }
      
      var response = ContentService.createTextOutput(result);
      response.setMimeType(ContentService.MimeType.JAVASCRIPT);
      return response;
    } catch (error) {
      Logger.log('Error: ' + error.message); // Log the error message
      var result = JSON.stringify({ error: error.message });
      
      if (callback) {
        result = callback + '(' + result + ')';
      }
      
      var response = ContentService.createTextOutput(result);
      response.setMimeType(ContentService.MimeType.JAVASCRIPT);
      return response;
    }
  }
  
  module.exports = { updateLineChartTitle, replaceTextInDocument, replaceTextAndCreatePdf, doGet };
  