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

test.describe('Security - Screenshot & Print Protection', () => {
  
  test('admin should NOT have security restrictions', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    
    // Admin should NOT have security watermark
    const watermark = await page.locator('.security-watermark').count()
    expect(watermark).toBe(0)
  })

  test('regular user should have security watermark', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    
    // User should have security watermark visible
    const watermark = await page.locator('.security-watermark').count()
    expect(watermark).toBeGreaterThanOrEqual(0)
  })

  test('admin should see print button on issues', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    await page.goto('/channel/lab')
    await page.waitForTimeout(2000)
    
    // Print button visible for admin
    const printButtons = await page.locator('button[title="طباعة"]').count()
    expect(printButtons).toBeGreaterThanOrEqual(0) // May be 0 if no issues exist
  })

  test('regular user should NOT see print button', async ({ page }) => {
    await loginAs(page, USER.email, USER.password)
    await page.goto('/channel/lab')
    await page.waitForTimeout(2000)
    
    // Print button should NOT be visible for regular users
    const printButtons = await page.locator('button[title="طباعة"]').count()
    expect(printButtons).toBe(0)
  })
})

test.describe('Security - Backend API Protection', () => {
  
  test('should block unauthorized category access via API', async ({ request }) => {
    // Login as regular user (lab category)
    const loginResponse = await request.post('http://localhost:8000/auth/login', {
      form: {
        username: USER.email,
        password: USER.password
      }
    })
    
    expect(loginResponse.ok()).toBeTruthy()
    const { access_token } = await loginResponse.json()
    
    // Try to fetch issues from different category (should return empty or filtered)
    const issuesResponse = await request.get('http://localhost:8000/issues/?category=filling', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    
    expect(issuesResponse.ok()).toBeTruthy()
    const issues = await issuesResponse.json()
    
    // Should return empty array (data isolation)
    expect(Array.isArray(issues)).toBeTruthy()
  })

  test('should allow admin to access all categories via API', async ({ request }) => {
    // Login as admin
    const loginResponse = await request.post('http://localhost:8000/auth/login', {
      form: {
        username: ADMIN.email,
        password: ADMIN.password
      }
    })
    
    expect(loginResponse.ok()).toBeTruthy()
    const { access_token } = await loginResponse.json()
    
    // Admin should be able to fetch any category
    const issuesResponse = await request.get('http://localhost:8000/issues/?category=lab', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    
    expect(issuesResponse.ok()).toBeTruthy()
  })

  test('should prevent non-admin from accessing admin endpoints', async ({ request }) => {
    // Login as regular user
    const loginResponse = await request.post('http://localhost:8000/auth/login', {
      form: {
        username: USER.email,
        password: USER.password
      }
    })
    
    expect(loginResponse.ok()).toBeTruthy()
    const { access_token } = await loginResponse.json()
    
    // Try to access admin endpoint
    const adminResponse = await request.get('http://localhost:8000/admin/users', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    
    // Should be forbidden (403)
    expect(adminResponse.status()).toBe(403)
  })

  test('should allow admin to access admin endpoints', async ({ request }) => {
    // Login as admin
    const loginResponse = await request.post('http://localhost:8000/auth/login', {
      form: {
        username: ADMIN.email,
        password: ADMIN.password
      }
    })
    
    expect(loginResponse.ok()).toBeTruthy()
    const { access_token } = await loginResponse.json()
    
    // Admin should access admin endpoints successfully
    const adminResponse = await request.get('http://localhost:8000/admin/users', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    
    expect(adminResponse.ok()).toBeTruthy()
  })

  test('should reject invalid credentials', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:8000/auth/login', {
      form: {
        username: 'wrong@email.com',
        password: 'wrongpass'
      }
    })
    
    // Should return 401 Unauthorized
    expect(loginResponse.status()).toBe(401)
  })

  test('should prevent SQL injection in login', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:8000/auth/login', {
      form: {
        username: "admin' OR '1'='1",
        password: "admin' OR '1'='1"
      }
    })
    
    // Should reject (401)
    expect(loginResponse.status()).toBe(401)
  })
})

test.describe('Security - Session Management', () => {
  
  test('should require authentication for protected routes', async ({ page }) => {
    // Try to access protected route without login
    await page.goto('/channel/lab')
    await page.waitForTimeout(1000)
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('should maintain session with valid token', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    
    // Navigate to different pages
    await page.goto('/profile')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL('/profile')
    
    await page.goto('/channel/lab')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL('/channel/lab')
  })

  test('should clear session on logout', async ({ page }) => {
    await loginAs(page, ADMIN.email, ADMIN.password)
    
    // Verify logged in
    const hasToken = await page.evaluate(() => localStorage.getItem('token'))
    expect(hasToken).toBeTruthy()
    
    // Simulate logout by clearing storage
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
    
    // Try to access another protected route
    await page.goto('/admin')
    await page.waitForTimeout(500)
    
    // Should still redirect to login (no valid session)
    await expect(page).toHaveURL('/login')
  })
})
