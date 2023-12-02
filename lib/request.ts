import { getCookie, setCookie } from 'cookies-next'

export const AuthenticatedFetch = async (
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

export const AuthRequest = async (
  url: string,
  data: any,
  toast: any,
  router: any,
  setAccessToken: any,
  withHeaders: boolean
) => {
  try {
    const res = await AuthenticatedFetch(url, {
      method: 'POST',
      body: data,
      headers: withHeaders ? { 'Content-Type': 'application/json' } : undefined,
    })

    const dt = await res.json()

    if (dt.statusCode >= 400) {
      toast({
        title: 'Error',
        description: dt.message,
      })
    } else {
      const token = dt.data.accessToken

      setCookies('token', token)
      setAccessToken(token)

      toast({
        title: 'Success',
        description: `${
          withHeaders
            ? 'You have successfully logged in.'
            : 'You have successfully registered your account.'
        }`,
      })

      router.push('/')
    }
  } catch (error) {
    console.log(error)
    toast({
      title: 'Error',
      description: 'Something went wrong, please try again later.',
    })
  }
}
