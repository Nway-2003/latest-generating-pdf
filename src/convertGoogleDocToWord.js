// src/convertGoogleDocToWord.js
export function convertGoogleDocToWord(docId) {
    const url = `https://www.googleapis.com/drive/v3/files/${docId}/export?mimeType=application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
  
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ScriptApp.getOAuthToken()}`
      }
    };
  
    try {
      const response = UrlFetchApp.fetch(url, options);
      const blob = response.getBlob();
  
      // Create a new file in Google Drive with the DOCX content
      const name = 'Nway_Document.docx';
      const file = DriveApp.createFile(blob).setName(name);
  
      // Set sharing permissions
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
      return file.getDownloadUrl(); // Use getDownloadUrl() to get the direct download link
    } catch (error) {
      Logger.log(`Error during conversion: ${error.message}`);
      throw new Error(`Error during conversion: ${error.message}`);
    }
  }
  