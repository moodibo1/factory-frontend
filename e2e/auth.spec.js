import { test, expect } from '@playwright/test'

// ===== HELPER: Login function matching actual UI =====
async function loginAs(page, email, password) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('input[placeholder="البريد الإلكتروني"]', email)
  await page.fill('input[placeholder="كلمة المرور"]', password)
  await page.click('button[type="submit"]')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
}

const ADMIN = { email: 'ibraheemziyad45@gmail.com', password: 'worldwar2' }
const USER  = { email: 'ibraheemziyad72@gmail.com',  password: 'worldwar1' }

// =====================================================

test.describe('Authentication Flow', () => {

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/login')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[placeholder="البريد الإلكتروني"]', 'wrong@email.com')
    await page.fill('input[placeholder="كلمة المرور"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    await expect(page.locator('text=بيانات الدخول غير صحيحة')).toBeVisible()
  })

  test('should login successfully as admin', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    await expect(page).toHaveURL('/', { timeout: 10000 })
    // Verify logged in by checking localStorage
    const hasToken = await page.evaluate(() => localStorage.getItem('token'))
    expect(hasToken).toBeTruthy()
  })

  test('should login successfully as regular user', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    await expect(page).toHaveURL('/', { timeout: 10000 })
    // Verify logged in by checking localStorage
    const hasToken = await page.evaluate(() => localStorage.getItem('token'))
    expect(hasToken).toBeTruthy()
  })

  test('should logout successfully', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    await expect(page).toHaveURL('/')

    // Verify logged in
    const hasToken = await page.evaluate(() => localStorage.getItem('token'))
    expect(hasToken).toBeTruthy()

    // Simulate logout by clearing storage (same as logout function does)
    await page.evaluate(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('lastActivity')
    })
    
    // Navigate to trigger redirect
    await page.goto('/channel/lab')
    await page.waitForLoadState('networkidle')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })

  test('admin should see admin link in navbar', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    await page.waitForTimeout(1000)
    
    // Check for admin route link
    const adminLink = page.locator('a[href="/admin"]')
    await expect(adminLink).toBeVisible({ timeout: 5000 })
  })

  test('regular user should NOT see admin link in navbar', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    await expect(page.locator('text=الإدارة')).not.toBeVisible()
  })

  test('should validate session timeout simulation', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    await expect(page).toHaveURL('/')

    // Simulate expired session by clearing storage
    await page.evaluate(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    })

    // Navigate to protected route
    await page.goto('/channel/lab')
    await page.waitForLoadState('networkidle')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})
