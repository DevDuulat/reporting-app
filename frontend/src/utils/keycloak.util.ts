import Keycloak from 'keycloak-js'

let $keycloak: Keycloak | null = null
let tokenUpdatePromise: Promise<string> | null = null

export function setKeycloakInstance(keycloak: Keycloak) {
  $keycloak = keycloak

  if ($keycloak) {
    $keycloak.onTokenExpired = () => {
      // console.log('Token expired, updating...');
      updateToken().catch(console.error)
    }

    $keycloak.onAuthRefreshSuccess = () => {
      // console.log('Token refreshed successfully');
    }

    $keycloak.onAuthRefreshError = () => {
      // console.error('Token refresh failed');
    }
  }
}

export function getKeycloak(): Keycloak {
  if (!$keycloak) throw new Error('Keycloak instance is not initialized')

  return $keycloak
}

export const getToken = async (): Promise<string> => updateToken()

export async function isLoggedIn(): Promise<boolean> {
  try {
    if (!$keycloak?.authenticated) return false
    await updateToken()
    return true
  } catch {
    return false
  }
}

export async function updateToken(): Promise<string> {
  if (!$keycloak) throw new Error('Keycloak is not initialized.')

  if (tokenUpdatePromise) return tokenUpdatePromise

  tokenUpdatePromise = (async () => {
    try {
      const refreshed = await $keycloak.updateToken(5)
      if (refreshed) {
        // console.log('Token updated successfully');
      }
      if (!$keycloak.token) throw new Error('No token available after update')
      return $keycloak.token
    } catch (error) {
      console.error('Failed to update token:', error)
      $keycloak.login()
      throw error
    } finally {
      tokenUpdatePromise = null
    }
  })()
  return tokenUpdatePromise
}

export async function isTokenReady(): Promise<void> {
  return new Promise((resolve) => checkToken(resolve))
}

const checkToken = (resolve: () => void) => {
  if ($keycloak?.token) resolve()
  else setTimeout(() => checkToken(resolve), 500)
}
