import { ThemeProvider } from '@/components/theme-provider'
import { KeycloakProvider } from './keycloak-provider'
import { BrowserRouter, useLocation } from 'react-router-dom'

function InnerProviders({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isGrantRoute = location.pathname.startsWith('/grants/')

  if (isGrantRoute) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    )
  }

  return (
    <KeycloakProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </KeycloakProvider>
  )
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <InnerProviders>{children}</InnerProviders>
    </BrowserRouter>
  )
}
