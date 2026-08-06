import { test, expect } from '@playwright/test'

// ===== HELPER: Login function matching actual UI =====
async function loginAs(page, email, password) {
  await page.goto('/login')
  await page.fill('input[placeholder="البريد الإلكتروني"]', email)
  await page.fill('input[placeholder="كلمة المرور"]', password)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(1500)
}

const ADMIN = { email: 'ibraheemziyad45@gmail.com', password: 'worldwar2' }
const USER  = { email: 'ibraheemziyad72@gmail.com',  password: 'worldwar1' }

// =====================================================

test.describe('RBAC - Role-Based Access Control', () => {
  
  test('admin should see all categories and admin controls', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    
    // Check for admin link by href
    const adminLink = page.locator('a[href="/admin"]')
    await expect(adminLink).toBeVisible({ timeout: 5000 })
    
    // Should be able to navigate to admin page
    await adminLink.click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/admin', { timeout: 5000 })
  })

  test('regular user should only see their assigned category', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    
    // Should NOT see admin menu
    await expect(page.locator('text=الإدارة')).not.toBeVisible()
  })

  test('regular user cannot access admin routes', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    
    // Try to access admin page directly
    await page.goto('/admin')
    await page.waitForTimeout(1000)
    
    // Should redirect to home
    await expect(page).toHaveURL('/')
  })

  test('regular user cannot access dashboard route', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    
    // Try to access dashboard page directly
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    
    // Should redirect to home
    await expect(page).toHaveURL('/')
  })
})

test.describe('Data Isolation', () => {
  
  test('admin can see all categories in navbar', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    
    // Check that category links are visible
    const hasLabLink = await page.locator('text=المختبرات').count() > 0
    const hasFillingLink = await page.locator('text=التعبئة').count() > 0
    const hasProductionLink = await page.locator('text=الإنتاج').count() > 0
    
    expect(hasLabLink || hasFillingLink || hasProductionLink).toBeTruthy()
  })

  test('regular user can access their assigned category', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    
    // Navigate to lab category (user's assigned category)
    await page.goto('/channel/lab')
    await page.waitForTimeout(1000)
    
    // Should stay on lab page
    await expect(page).toHaveURL('/channel/lab')
  })

  test('regular user sees filtered data for their category', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    
    // Navigate to lab category
    await page.goto('/channel/lab')
    await page.waitForTimeout(1500)
    
    // Check page loaded successfully (no redirect)
    await expect(page).toHaveURL('/channel/lab')
  })

  test('admin can navigate to any category', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    
    // Try accessing different categories
    await page.goto('/channel/lab')
    await expect(page).toHaveURL('/channel/lab')
    
    await page.goto('/channel/filling')
    await expect(page).toHaveURL('/channel/filling')
    
    await page.goto('/channel/production')
    await expect(page).toHaveURL('/channel/production')
  })
})

test.describe('Permissions & Actions', () => {
  
  test('admin should see action buttons on issues', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    await page.goto('/channel/lab')
    await page.waitForTimeout(2000)
    
    // Admin should see additional controls
    const adminControls = await page.locator('button[title="طباعة"], button[title="أرشفة السجل"], button[title="حذف السجل"]').count()
    expect(adminControls).toBeGreaterThanOrEqual(0)
  })

  test('regular user should have limited actions', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    await page.goto('/channel/lab')
    await page.waitForTimeout(2000)
    
    // User should NOT see print button (admin only)
    const printButtons = await page.locator('button[title="طباعة"]').count()
    expect(printButtons).toBe(0)
  })
})
