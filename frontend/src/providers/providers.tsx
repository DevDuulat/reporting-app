import { ThemeProvider } from '@/components/theme-provider'
import { KeycloakProvider } from './keycloak-provider'

export const Providers = ({ children }: { children: any }) => {
  return (
    <KeycloakProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </KeycloakProvider>
  )
}
