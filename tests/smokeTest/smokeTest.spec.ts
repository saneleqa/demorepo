import { test, expect } from '@playwright/test';

// Added @smoke tag to easily filter and run only smoke tests
test('Successful checkout flow @smoke', async ({ page }) => {
  // 1. Navigate to the app
  await page.goto('https://www.saucedemo.com/');

  // 2. Log in using a standard user for the happy path
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // ASSERTION: Verify login was successful by checking the URL or a page element
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  // 3. Add item to cart and navigate to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  
  // ASSERTION: Verify we are on the cart page
  await expect(page.locator('.title')).toHaveText('Your Cart');

  // 4. Proceed to checkout
  await page.locator('[data-test="checkout"]').click();

  // 5. Fill in checkout information
  await page.locator('[data-test="firstName"]').fill('Sam');
  await page.locator('[data-test="lastName"]').fill('Cruze');
  await page.locator('[data-test="postalCode"]').fill('2194');
  await page.locator('[data-test="continue"]').click();

  // ASSERTION: Verify we reached the overview page
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');

  // 6. Finish the transaction
  await page.locator('[data-test="finish"]').click();

  // FINAL ASSERTION: Verify the order was successfully placed
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});