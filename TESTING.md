# 🧪 Comprehensive Testing Guide - Factory Issues App

## 📋 Table of Contents
1. [Test Infrastructure Overview](#test-infrastructure-overview)
2. [Running Tests](#running-tests)
3. [Test Coverage](#test-coverage)
4. [AI-Powered Testing Tools](#ai-powered-testing-tools)
5. [Security Testing](#security-testing)
6. [RBAC & Data Isolation Tests](#rbac--data-isolation-tests)
7. [Continuous Integration](#continuous-integration)

---

## 🏗️ Test Infrastructure Overview

### **Tools Installed:**
- ✅ **Vitest** - Unit & Component Testing
- ✅ **Playwright** - End-to-End Testing
- ✅ **Testing Library** - React Component Testing
- ✅ **ESLint Security Plugin** - Static Code Analysis

### **Test Structure:**
```
factory-issues-app/
├── e2e/                          # End-to-End Tests
│   ├── auth.spec.js             # Authentication & Session Tests
│   ├── rbac.spec.js             # Role-Based Access Control Tests
│   └── security.spec.js         # Security & Protection Tests
├── src/
│   └── test/
│       └── setup.js             # Test Environment Setup
├── playwright.config.js         # Playwright Configuration
├── vitest.config.js            # Vitest Configuration
└── TESTING.md                   # This file
```

---

## 🚀 Running Tests

### **1. Unit & Component Tests**
```bash
# Run all unit tests
npm run test

# Run with UI dashboard
npm run test:ui

# Run with coverage report
npm run test:coverage
```

### **2. End-to-End Tests**
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# View test report
npm run test:report
```

### **3. Run All Tests**
```bash
npm run test:all
```

---

## 📊 Test Coverage

### **Authentication Tests** (`e2e/auth.spec.js`)
- ✅ Login with valid credentials (Admin)
- ✅ Login with valid credentials (User)
- ✅ Login with invalid credentials (should fail)
- ✅ Logout functionality
- ✅ "Remember Me" checkbox persistence
- ✅ Session timeout after 30 minutes of inactivity
- ✅ Forced redirect to login when session expired
- ✅ Cross-tab logout synchronization

### **RBAC Tests** (`e2e/rbac.spec.js`)
- ✅ Admin can see all categories
- ✅ Regular user only sees assigned category
- ✅ Admin can access admin routes
- ✅ Regular user cannot access admin routes
- ✅ Admin can approve users with category assignment
- ✅ Regular user can only post to assigned category
- ✅ Admin can post to any category
- ✅ Data isolation: User cannot see other categories' issues
- ✅ Admin can see all issues from all categories
- ✅ Admin can cross-post issues to multiple categories

### **Security Tests** (`e2e/security.spec.js`)
- ✅ Admin has no security restrictions
- ✅ Regular user has security restrictions active
- ✅ Watermark appears for regular users
- ✅ Right-click blocked for regular users
- ✅ Print button only visible to admins
- ✅ PrintScreen triggers security warning
- ✅ Page blurs when user switches tabs
- ✅ Security violations logged to backend
- ✅ SQL injection prevention
- ✅ XSS attack prevention
- ✅ Unauthorized API access blocked (403 Forbidden)
- ✅ Permission escalation prevented

---

## 🤖 AI-Powered Testing Tools

### **1. Qodo (CodiumAI) - Recommended**
**Installation:**
1. Install VS Code extension: "Qodo Gen"
2. Open any file (e.g., `AuthContext.jsx`)
3. Right-click → "Qodo: Generate Tests"
4. AI will analyze and create comprehensive test scenarios

**What Qodo Does:**
- Analyzes edge cases you didn't think of
- Generates unit tests automatically
- Suggests security vulnerabilities
- Tests error handling paths

### **2. GitHub Copilot**
**Usage:**
```javascript
// Type comment:
// Test: should prevent unauthorized category access

// Copilot will generate:
test('should prevent unauthorized category access', async () => {
  // Complete test code auto-generated
})
```

### **3. Playwright Codegen (Record & Replay)**
```bash
# Start codegen - records your actions
npx playwright codegen http://localhost:5173

# Actions you perform will be converted to test code automatically
```

**How to use:**
1. Run the command above
2. Browser opens with Playwright Inspector
3. Navigate and interact with your app
4. Playwright writes test code as you click
5. Copy generated code to `e2e/` folder

---

## 🔒 Security Testing

### **Static Code Analysis**

**Install SonarQube (Docker):**
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

**Run Security Scan:**
```bash
# Install SonarScanner
npm install -g sonarqube-scanner

# Run scan
sonar-scanner \
  -Dsonar.projectKey=factory-issues-app \
  -Dsonar.sources=./src,./backend/app \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

**What SonarQube Finds:**
- 🐛 Bugs & Code Smells
- 🔐 Security Vulnerabilities
- 💾 Memory Leaks
- ⚡ Performance Issues
- 📊 Code Duplication

### **Security Checklist**
- ✅ SQL Injection Prevention (Tested)
- ✅ XSS Prevention (Tested)
- ✅ CSRF Protection (Token-based auth)
- ✅ Data Isolation (Category-based RBAC)
- ✅ Session Timeout (30 minutes)
- ✅ Screenshot Protection (Regular users only)
- ✅ Print Protection (Admin only)
- ✅ Permission Escalation Prevention (Tested)

---

## 🎯 RBAC & Data Isolation Tests

### **Test Scenarios Covered:**

#### **1. Category-Based Data Isolation**
```javascript
// Test: User assigned to "lab" cannot see "filling" issues
await page.goto('/channel/filling')
const issues = await page.locator('.issue-card').count()
expect(issues).toBe(0) // Should be empty
```

#### **2. Cross-Category Posting Prevention**
```javascript
// Test: User tries to post to wrong category
const response = await request.post('/issues/', {
  category: 'filling' // User is assigned to 'lab'
})
expect(response.status()).toBe(403) // Forbidden
```

#### **3. Admin Privilege Verification**
```javascript
// Test: Admin can access everything
await page.goto('/admin')
await expect(page).toHaveURL('/admin') // Success

await page.goto('/dashboard')
await expect(page).toHaveURL('/dashboard') // Success
```

---

## 🔄 Continuous Integration

### **GitHub Actions Workflow**
Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run unit tests
        run: npm run test
      
      - name: Install Playwright
        run: npx playwright install
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📈 Test Metrics

### **Expected Coverage:**
- **Unit Tests:** 80%+ code coverage
- **E2E Tests:** 100% critical user flows
- **Security Tests:** All authentication & authorization paths

### **Performance Benchmarks:**
- Login: < 2 seconds
- Page load: < 1 second
- API response: < 500ms
- Session check: < 100ms

---

## 🛠️ Maintenance

### **Regular Testing Schedule:**
- 🔵 **Before every commit:** Run unit tests
- 🟢 **Before every deploy:** Run E2E tests
- 🟡 **Weekly:** Run security scan
- 🔴 **Monthly:** Review and update test scenarios

### **Adding New Tests:**
1. Identify the feature/bug
2. Write failing test first (TDD)
3. Implement the feature
4. Verify test passes
5. Commit both code and test

---

## 📞 Support

For issues with tests:
1. Check logs: `playwright-report/`
2. Run with headed mode: `npm run test:e2e:headed`
3. Enable debug mode: `DEBUG=pw:api npm run test:e2e`

---

## ✅ Quick Test Checklist

Before deploying to production:
- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] Security scan shows no critical issues
- [ ] Coverage > 80%
- [ ] No console errors in browser
- [ ] Backend logs show no errors
- [ ] Session timeout works
- [ ] RBAC restrictions enforced
- [ ] Security protections active for users
- [ ] Print feature only for admins

---

**Testing Infrastructure Complete!** 🎉

Your app now has enterprise-grade testing coverage with AI-powered tools, security scanning, and comprehensive E2E tests.
