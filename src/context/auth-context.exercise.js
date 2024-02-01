import React from 'react'

const AuthContext = React.createContext()

const useAuth = () => {
  const context = React.useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContext.Provider');
  }

  return context
}

export {AuthContext, useAuth}
