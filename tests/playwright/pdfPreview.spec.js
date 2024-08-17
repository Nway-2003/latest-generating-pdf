const { test, expect } = require('@playwright/test');

test('should open the PDF preview', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    // Click the "Open Preview" button
    await page.click('text=Open Preview');
    // Check if the PDF preview is displayed
    const iframe = await page.$('iframe');
    expect(iframe).toBeTruthy(); // Expect the iframe to be present
  });

  test('should close the PDF preview', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    // Click the "Open Preview" button
    await page.click('text=Open Preview');
   
    // Click the "Close" button
    await page.click('text=Close');
    // Check if the iframe is no longer visible
    const iframe = await page.$('iframe');
    expect(iframe).toBeNull(); // Expect the iframe to be absent
  });

 // Test for "Save to Word" Button
test('should trigger download on Save to Word button click', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // Click the "Open Preview" button
  await page.click('text=Open Preview');
  // Click the "Save to Word" button
  const [download] = await Promise.all([
      page.waitForEvent('download'), // Wait for the download event
      page.click('text=Save to Word'), // Click the button
  ]);
  const suggestedFilename = download.suggestedFilename(); // Get the suggested filename
  expect(suggestedFilename).toMatch(/\.docx$/); // Check if the download has a .docx extension
});

test('should render the PDF preview with the correct URL', async ({ page }) => {
  // Mocking the API response for PDF URL
  await page.route('https://script.google.com/macros/s/AKfycbzliu5roOnl4bRHpRXSFh3MMH64QZtPSdzRBcef4Mj_NM9yB3OjmVCTonmbUzPMaZHW/exec', (route) => {
      route.fulfill({
          status: 200,
          body: JSON.stringify({ pdfUrl: 'https://example.com/sample.pdf' }),
      });
  });

  await page.goto('http://localhost:3000/');
  await page.click('text=Open Preview');

  const iframe = await page.$('iframe');
  expect(iframe).toBeTruthy(); // Expect the iframe to be present

  const iframeSrc = await iframe.evaluate(el => el.src);
  expect(iframeSrc).toBe('https://example.com/sample.pdf'); // Ensure iframe src is correct
});

test('should display the correct buttons based on preview state', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Check initial state
  await expect(page.locator('text=Open Preview')).toBeVisible();
  await expect(page.locator('text=Save to Word')).toBeHidden();
  await expect(page.locator('text=Save to PDF')).toBeHidden();
  await expect(page.locator('text=Close')).toBeHidden();

  // Open preview
  await page.click('text=Open Preview');

  // Check that buttons are visible after opening the preview
  await expect(page.locator('text=Save to Word')).toBeVisible();
  await expect(page.locator('text=Save to PDF')).toBeVisible();
  await expect(page.locator('text=Close')).toBeVisible();
  await expect(page.locator('text=Open Preview')).toBeHidden();

  // Close preview
  await page.click('text=Close');

  // Check that buttons are hidden again
  await expect(page.locator('text=Save to Word')).toBeHidden();
  await expect(page.locator('text=Save to PDF')).toBeHidden();
  await expect(page.locator('text=Close')).toBeHidden();
  await expect(page.locator('text=Open Preview')).toBeVisible();
});

test('should not display PDF preview initially', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // Ensure no iframe is present initially
  const iframe = await page.$('iframe');
  expect(iframe).toBeNull(); // Expect the iframe to be absent initially
});

// Test initial state of buttons
test('should show only "Open Preview" button initially', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Ensure that only the "Open Preview" button is visible initially
  await expect(page.locator('text=Open Preview')).toBeVisible();
  await expect(page.locator('text=Save to Word')).toBeHidden();
  await expect(page.locator('text=Save to PDF')).toBeHidden();
  await expect(page.locator('text=Close')).toBeHidden();
});

