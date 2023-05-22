/** @jsx jsx */
import { jsx } from '@emotion/core'

import { useEffect, useState } from 'react'
import * as auth from 'auth-provider'
import { AuthenticatedApp } from './authenticated-app'
import { UnauthenticatedApp } from './unauthenticated-app'
import { client } from './utils/api-client.exercise'
import { useAsync } from './utils/hooks'
import { FullPageSpinner } from './components/lib'
import { danger } from 'styles/colors'

function App() {
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    run,
    setData: setUser,
  } = useAsync()

  useEffect(() => {
    const checkToken = async () => {
      const token = await auth.getToken()
      if (token) {
        await run(client('me', { token }))
      }
    }

    checkToken()
  }, [run, setUser])

  const login = form => auth.login(form).then(u => setUser(u))
  const register = form => auth.register(form).then(u => setUser(u))
  const logout = () => {
    auth.logout()
    setUser(null)
  }

  if (isIdle || isLoading) return <FullPageSpinner />

  if (isError) return (
    <div
      css={{
        color: danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  )

  if (isSuccess) {
    return user ? (
      <AuthenticatedApp user={user} logout={logout}/>
    ) : (
      <UnauthenticatedApp login={login} register={register}/>
    )
  }
}

export { App }

/*
eslint
  no-unused-vars: "off",
*/
