'use client'

import { getCookie } from 'cookies-next'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthenticatedFetch } from '../request'
import { User } from '../types'

type AuthProviderProps = {
  children: ReactNode
}

type AuthContextValue = {
  user: User | null
  setUser: (user: User | null) => void
  setAccessToken: (token: string | undefined) => void
  loading: boolean
}

const AuthContext = createContext({} as AuthContextValue) // TODO: Declare interface of contextValue

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)

  useEffect(() => {
    setAccessToken(getCookie('token'))
  }, [])

  useEffect(() => {
    setLoading(true)
    async function fetchUser() {
      let user: User | null = null

      if (accessToken) {
        user = await AuthenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            method: 'GET',
          }
        ).then((res) => res.json())

        setUser(user)
      } else {
        setUser(null)
      }
    }

    fetchUser()
    setLoading(false)
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
