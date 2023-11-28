import { getCookie, setCookie } from 'cookies-next'

export const AuthenticatedFetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  const token = getCookie('token')

  if (!!!token)
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
      },
    })

  return fetch(input, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })
}

export const setCookies = (name: string, data: string) => {
  setCookie('token', data)
}
