import React from 'react'
import { createRoot } from 'react-dom/client'
import { Logo } from 'components/logo'

function App() {
  const handleLogin = () => {
    alert('login');
  }

  const handleRegister = () => {
    alert('register');
  }

  return (
    <div id="root">
      <Logo/>
      <h1>Bookshelf</h1>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export const root = createRoot(document.getElementById('root'))
root.render(<App/>)
