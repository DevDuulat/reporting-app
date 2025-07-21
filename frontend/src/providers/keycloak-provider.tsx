import Keycloak from 'keycloak-js'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { KeycloakContext, type KeycloakContextType } from '@/hooks/useKeycloak'
import { getToken, isLoggedIn, updateToken } from '@/utils/keycloak.util'

interface Props {
  children: ReactNode
}

export function KeycloakProvider({ children }: Props) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const initializingRef = useRef(false)
  const redirectingRef = useRef(false)

  useEffect(() => {
    if (initializingRef.current) return
    initializingRef.current = true
    void initializeKeycloak()
  }, [])

  const initializeKeycloak = async () => {
    try {
      const serverHost = import.meta.env.VITE_APP_CCID_SERVER_HOST
      const realm = import.meta.env.VITE_APP_CCID_REALM
      const clientId = import.meta.env.VITE_APP_CCID_CLIENT_ID
      if (!serverHost && !realm && !clientId)
        throw new Error('Missing environment variables')
      const keycloakInstance = new Keycloak({
        url: serverHost,
        realm: realm,
        clientId: clientId
      })

      const initResult = await keycloakInstance.init({
        flow: 'standard',
        checkLoginIframe: false,
        onLoad: 'login-required'
      })

      setKeycloak(keycloakInstance)
      setupKeycloakEvents(keycloakInstance)

      if (initResult && keycloakInstance.token) {
        handleSuccessfulAuth(keycloakInstance)
      } else {
        setLoading(false)
        setTimeout(() => startAutoLogin(keycloakInstance), 500)
      }
    } catch (error) {
      setError(`Initialization failed: ${error}`)
      setLoading(false)
    }
  }

  const startAutoLogin = (keycloakInstance: Keycloak) => {
    if (redirectingRef.current) return

    redirectingRef.current = true
    try {
      const redirectUri = window.location.origin + window.location.pathname
      void keycloakInstance.login({ redirectUri })
    } catch {
      setError('Failed to redirect to login')
      setLoading(false)
      redirectingRef.current = false
    }
  }

  const handleSuccessfulAuth = (keycloakInstance: Keycloak) => {
    setAuthenticated(true)
    setToken(keycloakInstance.token!)
    setError(null)
    cleanUrl()
    setLoading(false)
  }

  const cleanUrl = () => {
    const url = new URL(window.location.href)
    let hasChanges = false

    ;['code', 'state', 'session_state', 'iss'].forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param)
        hasChanges = true
      }
    })

    if (hasChanges) {
      const cleanUrl = `${url.origin}${url.pathname}${url.search}`
      window.history.replaceState({}, '', cleanUrl)
    }
  }

  const setupKeycloakEvents = (keycloakInstance: Keycloak) => {
    keycloakInstance.onTokenExpired = async () => {
      try {
        const refreshed = await keycloakInstance.updateToken(30)
        if (refreshed && keycloakInstance.token) {
          setToken(keycloakInstance.token)
        }
      } catch {
        setError('Session expired')
        setAuthenticated(false)
        setToken(null)
      }
    }

    keycloakInstance.onAuthSuccess = () => {
      if (keycloakInstance.token) {
        handleSuccessfulAuth(keycloakInstance)
      }
    }

    keycloakInstance.onAuthError = () => {
      setError('Authentication failed')
      setAuthenticated(false)
      setToken(null)
      setLoading(false)
    }

    keycloakInstance.onAuthLogout = () => {
      setAuthenticated(false)
      setToken(null)
      setError(null)
    }
  }

  const login = useCallback(() => {
    if (keycloak && !redirectingRef.current) {
      startAutoLogin(keycloak)
    }
  }, [keycloak])
  const logout = useCallback(() => {
    if (keycloak) {
      const redirectUri = window.location.origin + window.location.pathname
      void keycloak.logout({ redirectUri })
    }
  }, [keycloak])

  const getValidToken = useCallback(async (): Promise<string> => {
    if (!keycloak) {
      throw new Error('Keycloak not initialized')
    }
    return getToken()
  }, [keycloak])

  const updateTokenCallback = useCallback(async (): Promise<string> => {
    if (!keycloak) {
      throw new Error('Keycloak not initialized')
    }
    return updateToken()
  }, [keycloak])

  const isLoggedInCallback = useCallback(async (): Promise<boolean> => {
    if (!keycloak) {
      return false
    }
    return isLoggedIn()
  }, [keycloak])

  const value: KeycloakContextType = {
    keycloak,
    authenticated,
    loading,
    token,
    error,
    login,
    logout,
    getValidToken,
    updateToken: updateTokenCallback,
    isLoggedIn: isLoggedInCallback
  }

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  )
}
