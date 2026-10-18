import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from '@/routes'
import { ThemeProvider } from '@/store/ThemeContext'
import { IssuesProvider } from '@/store/IssuesContext'
import { AuthProvider } from '@/store/AuthContext'
import IOSInstructions from '@/components/shared/IOSInstructions'
import InstallPrompt from '@/components/shared/InstallPrompt'
import PWASplash from '@/components/shared/PWASplash'
import './i18n'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Installation is optional; app remains fully functional without it.
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <IssuesProvider>
          <IOSInstructions />
          <InstallPrompt />
          <PWASplash />
          <RouterProvider router={router} />
        </IssuesProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
