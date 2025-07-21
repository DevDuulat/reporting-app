import {
  getToken,
  isLoggedIn,
  setKeycloakInstance,
  updateToken
} from '@/utils/keycloak.util'
import Keycloak from 'keycloak-js'
import { createContext, useCallback, useContext } from 'react'

// import {
//   getToken,
//   isLoggedIn,
//   setKeycloakInstance,
//   updateToken
// } from '@/shared/utils'

export interface KeycloakContextType {
  keycloak: Keycloak | null
  authenticated: boolean
  loading: boolean
  token: string | null
  error: string | null
  login: () => void
  logout: () => void
  getValidToken: () => Promise<string>
  updateToken: () => Promise<string>
  isLoggedIn: () => Promise<boolean>
}

export const KeycloakContext = createContext<KeycloakContextType | undefined>(
  undefined
)

export function useKeycloak() {
  const context = useContext(KeycloakContext)
  if (context === undefined)
    throw new Error('useKeycloak must be used within a KeycloakProvider')

  if (context.keycloak && !context.loading)
    setKeycloakInstance(context.keycloak)

  return context
}

export function useAuthState() {
  const { authenticated, loading, error, login, logout, keycloak } =
    useKeycloak()

  const loginWithRedirect = useCallback(
    (redirectUri?: string) => {
      if (keycloak) {
        keycloak.login({ redirectUri })
      }
    },
    [keycloak]
  )

  const logoutWithRedirect = useCallback(
    (redirectUri?: string) => {
      if (keycloak) {
        keycloak.logout({ redirectUri })
      }
    },
    [keycloak]
  )

  const updateProfile = useCallback(() => {
    if (keycloak) void keycloak.accountManagement()
  }, [keycloak])

  const getValidToken = useCallback(async (): Promise<string> => {
    if (!keycloak) throw new Error('Keycloak not initialized')
    return getToken()
  }, [keycloak])

  const refreshToken = useCallback(async (): Promise<string> => {
    if (!keycloak) {
      throw new Error('Keycloak not initialized')
    }
    return updateToken()
  }, [keycloak])

  const checkLogin = useCallback(async (): Promise<boolean> => {
    if (!keycloak) {
      return false
    }
    return isLoggedIn()
  }, [keycloak])

  return {
    authenticated,
    loading,
    error,
    login,
    logout,
    loginWithRedirect,
    logoutWithRedirect,
    updateProfile,
    isReady: !loading,
    getValidToken,
    updateToken: refreshToken,
    isLoggedIn: checkLogin
  }
}
