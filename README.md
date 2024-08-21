# Generating PDF

This project is a Vue.js application that integrates with Google Apps Script to generate and preview PDFs. The project also includes automated tests using Vitest and Playwright.

## Project Structure

**`src/`**: Main source code directory.

- **`components/`**: Vue components used in the application.
  - `Pdf.vue`: Component for previewing PDFs.

- **`tests/`**: Test files.
  - **`playwright/`**: Playwright test files.
    - `pdfPreview.spec.js`: Test for the PDF preview functionality.
  - **`vitest/`**: Vitest test files.
    - `convertGoogleDocToWord.test.js`: Tests related to Google Docs to Word conversion.
    - `googleAutomation.test.js`: Tests for Google Automation.
    - `replaceTextAndCreatePdf.test.js`: Tests for replacing text and creating PDFs.
    - `replaceTextInDocument.test.js`: Tests for replacing text in a Google Doc.
    - `updateLineChartTitle.test.js`: Tests for updating the title of a line chart.

- **`convertGoogleDocToWord.js`**: Script for converting Google Docs to Word format.
- **`googleAutomation.js`**: Script for Google Automation tasks.
- **`main.js`**: Main entry point for the Vue application.
- **`replaceTextAndCreatePdf.js`**: Script for replacing text and creating a PDF.
- **`replaceTextInDocument.js`**: Script for replacing text in a document.
- **`updateLineChartTitle.js`**: Script for updating a line chart's title.

- **`package.json`**: Project dependencies and scripts.
- **`playwright.config.js`**: Configuration for Playwright tests.
- **`vitest.config.js`**: Configuration for Vitest tests.
- **`README.md`**: Project documentation (this file).

## Setup

### Prerequisites

Ensure you have the following installed:
- Node.js (v16 or above)
- npm (v7 or above)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/latest-generating-pdf.git
    cd generating-pdf
    ```
2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Application

To run the application in development mode:
```sh
npm run dev

### Testing

Testing for playwright and vitest:
- npx playwright test (For playwright)
- npx vitest (For vitest)