import axios from 'axios'

const AUTH_TOKEN_KEY = 'lms_auth_token_v1'
const DEFAULT_API_BASE_URL = 'http://localhost:8080/api'

function normalizeApiBaseUrl(baseUrl) {
  const trimmedBaseUrl = (baseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
  return trimmedBaseUrl.endsWith('/api') ? trimmedBaseUrl : `${trimmedBaseUrl}/api`
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
export const hasBackendConfig = true;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export async function apiRequest(path, { method = 'GET', body, headers = {}, signal } = {}) {
  if (!hasBackendConfig) {
    throw new Error('API base URL is not configured.')
  }

  const token = getAuthToken()
  try {
    const response = await apiClient.request({
      url: path,
      method,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      signal,
    })

    console.log('API response:', response)

    const payload = response.data
    if (payload?.status && String(payload.status).toLowerCase() !== 'success') {
      throw new Error(payload?.message || 'Request failed.')
    }

    return payload
  } catch (error) {
    console.error('API error:', error)
    if (error.response) {
      console.error('API error.response:', error.response)
    }

    const payload = error.response?.data
    const message =
      payload?.message ||
      payload?.error ||
      payload?.data?.message ||
      error.message ||
      'Request failed.'

    const requestError = new Error(message)
    requestError.response = error.response
    requestError.cause = error
    throw requestError
  }
}
