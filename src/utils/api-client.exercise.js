import { logout } from '../auth-provider'

const apiURL = process.env.REACT_APP_API_URL

function client(endpoint, { token, data, headers, customHeaders, ...customConfig } = {}) {
  const config = {
    method: data ? 'POST' : 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    body: JSON.stringify(data),
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      await logout();
      window.location.assign(window.location)
      return Promise.reject({ message: 'Please re-authenticate' })
    }

    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export { client }
