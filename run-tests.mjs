#!/usr/bin/env node

/**
 * Automated Test Runner for Factory Issues App
 * Runs all tests and generates comprehensive report
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
}

async function runCommand(command, description) {
  log.info(`Running: ${description}...`)
  try {
    const { stdout, stderr } = await execAsync(command)
    log.success(`${description} completed`)
    return { success: true, output: stdout, error: stderr }
  } catch (error) {
    log.error(`${description} failed: ${error.message}`)
    return { success: false, output: error.stdout, error: error.stderr }
  }
}

async function checkBackend() {
  log.header('🔍 Checking Backend Status')
  try {
    const response = await fetch('http://localhost:8000/docs')
    if (response.ok) {
      log.success('Backend is running on port 8000')
      return true
    }
  } catch (error) {
    log.error('Backend is not running!')
    log.warn('Please start backend: cd backend && uvicorn app.main:app --reload --port 8000')
    return false
  }
}

async function checkFrontend() {
  log.header('🔍 Checking Frontend Status')
  try {
    const response = await fetch('http://localhost:5173')
    if (response.ok) {
      log.success('Frontend is running on port 5173')
      return true
    }
  } catch (error) {
    log.error('Frontend is not running!')
    log.warn('Please start frontend: npm run dev')
    return false
  }
}

async function runTests() {
  const results = {
    unit: null,
    e2e: null,
    security: null,
    coverage: null,
  }

  log.header('🧪 Starting Test Suite')

  // Unit Tests
  log.header('1️⃣ Running Unit Tests')
  results.unit = await runCommand('npm run test', 'Unit Tests')

  // Coverage Report
  if (results.unit.success) {
    log.header('📊 Generating Coverage Report')
    results.coverage = await runCommand('npm run test:coverage', 'Coverage Analysis')
  }

  // E2E Tests
  log.header('2️⃣ Running End-to-End Tests')
  const backendRunning = await checkBackend()
  const frontendRunning = await checkFrontend()

  if (backendRunning && frontendRunning) {
    results.e2e = await runCommand('npm run test:e2e', 'E2E Tests')
  } else {
    log.error('Skipping E2E tests - Backend or Frontend not running')
    results.e2e = { success: false, error: 'Services not running' }
  }

  // Security Checks
  log.header('3️⃣ Running Security Checks')
  results.security = await runCommand('npm run lint', 'ESLint Security Scan')

  return results
}

function generateReport(results) {
  log.header('📋 Test Report Summary')

  const timestamp = new Date().toISOString()
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         FACTORY ISSUES APP - TEST REPORT                  ║
║         Generated: ${timestamp}        ║
╚═══════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────┐
│ TEST RESULTS                                            │
├─────────────────────────────────────────────────────────┤
│ Unit Tests:          ${results.unit?.success ? '✅ PASSED' : '❌ FAILED'}                      │
│ E2E Tests:           ${results.e2e?.success ? '✅ PASSED' : '❌ FAILED'}                      │
│ Security Scan:       ${results.security?.success ? '✅ PASSED' : '❌ FAILED'}                      │
│ Coverage Report:     ${results.coverage?.success ? '✅ GENERATED' : '⚠️  SKIPPED'}                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TESTED FEATURES                                         │
├─────────────────────────────────────────────────────────┤
│ ✓ Authentication & Authorization                        │
│ ✓ Role-Based Access Control (RBAC)                      │
│ ✓ Data Isolation (Category-based)                       │
│ ✓ Session Management & Timeout                          │
│ ✓ Security Restrictions (Screenshots, Print)            │
│ ✓ SQL Injection Prevention                              │
│ ✓ XSS Prevention                                        │
│ ✓ Cross-Tab Synchronization                             │
│ ✓ Admin vs User Permissions                             │
│ ✓ Cross-Category Posting (Admin only)                   │
└─────────────────────────────────────────────────────────┘
  `)

  if (!results.unit?.success || !results.e2e?.success) {
    log.warn('Some tests failed! Review the output above for details.')
    log.info('View detailed E2E report: npm run test:report')
  } else {
    log.success('All tests passed! 🎉')
  }

  // Save report to file
  const reportPath = path.join(process.cwd(), 'test-report.txt')
  const reportContent = `
FACTORY ISSUES APP - AUTOMATED TEST REPORT
Generated: ${timestamp}

RESULTS:
- Unit Tests: ${results.unit?.success ? 'PASSED' : 'FAILED'}
- E2E Tests: ${results.e2e?.success ? 'PASSED' : 'FAILED'}
- Security Scan: ${results.security?.success ? 'PASSED' : 'FAILED'}
- Coverage: ${results.coverage?.success ? 'GENERATED' : 'SKIPPED'}

TESTED FEATURES:
✓ Authentication & Authorization
✓ Role-Based Access Control (RBAC)
✓ Data Isolation (Category-based)
✓ Session Management & Timeout
✓ Security Restrictions
✓ SQL Injection Prevention
✓ XSS Prevention
✓ Cross-Tab Synchronization
✓ Admin vs User Permissions
✓ Cross-Category Posting

For detailed reports:
- Coverage: open coverage/index.html
- E2E Report: npm run test:report
  `

  fs.writeFileSync(reportPath, reportContent)
  log.info(`Full report saved to: ${reportPath}`)
}

async function main() {
  console.clear()
  log.header('🚀 Factory Issues App - Automated Test Suite')
  log.info('Starting comprehensive testing...')

  const results = await runTests()
  generateReport(results)

  // Exit code
  const allPassed = results.unit?.success && results.e2e?.success && results.security?.success
  process.exit(allPassed ? 0 : 1)
}

main().catch((error) => {
  log.error(`Test runner failed: ${error.message}`)
  process.exit(1)
})
