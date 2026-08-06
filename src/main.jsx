import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from '@/routes'
import { ThemeProvider } from '@/store/ThemeContext'
import { IssuesProvider } from '@/store/IssuesContext'
import { AuthProvider } from '@/store/AuthContext'
import './i18n'
import './index.css'
import './security.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <IssuesProvider>
          <RouterProvider router={router} />
        </IssuesProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
