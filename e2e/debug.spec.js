import { test, expect } from '@playwright/test'

test('DEBUG: Check login process step by step', async ({ page }) => {
  // Go to login page
  await page.goto('http://localhost:5173/login')
  await page.waitForTimeout(2000)
  
  console.log('Step 1: On login page')
  await page.screenshot({ path: 'debug-step1-login-page.png' })
  
  // Fill email
  await page.fill('input[placeholder="البريد الإلكتروني"]', 'ibraheemziyad45@gmail.com')
  console.log('Step 2: Email filled')
  await page.screenshot({ path: 'debug-step2-email-filled.png' })
  
  // Fill password
  await page.fill('input[placeholder="كلمة المرور"]', 'Worldwar2')
  console.log('Step 3: Password filled')
  await page.screenshot({ path: 'debug-step3-password-filled.png' })
  
  // Click submit
  await page.click('button[type="submit"]')
  console.log('Step 4: Submit clicked')
  await page.waitForTimeout(3000)
  await page.screenshot({ path: 'debug-step4-after-submit.png' })
  
  // Check current URL
  const currentUrl = page.url()
  console.log('Current URL:', currentUrl)
  
  // Check for error messages
  const errorText = await page.locator('text=بيانات الدخول غير صحيحة').count()
  const pendingText = await page.locator('text=حسابك قيد المراجعة').count()
  
  console.log('Error message visible:', errorText > 0)
  console.log('Pending message visible:', pendingText > 0)
  
  // Check localStorage
  const hasToken = await page.evaluate(() => localStorage.getItem('token'))
  console.log('Has token in localStorage:', !!hasToken)
})
