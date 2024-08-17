// src/updateLineChartTitle.js

export function updateLineChartTitle(data) {
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
  