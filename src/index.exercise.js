import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Dialog from '@reach/dialog'
import '@reach/dialog/styles.css'
import { Logo } from 'components/logo'
import button from 'bootstrap/js/src/button'

const LOGIN = 'login'
const REGISTER = 'register'
const NONE = 'none'

function CloseButton({ onClick, ...props }) {
  return (
    <div>
      <button onClick={onClick} {...props}>close</button>
    </div>
  )
}

function App() {
  // TODO rename
  const [openDialog, setOpenDialog] = useState(NONE)

  const handleLogin = () => setOpenDialog(LOGIN)
  const handleRegister = () => setOpenDialog(REGISTER)
  const handleClose = () => setOpenDialog(NONE)

  return (
    <div id="root">
      <Logo height="80" width="80"/>
      <h1>Bookshelf</h1>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <button onClick={handleRegister}>Register</button>
      </div>

      <Dialog aria-label="Login form" isOpen={openDialog === LOGIN} onDismiss={handleClose}>
        <CloseButton onClick={handleClose}/>
        <h3>Login</h3>
      </Dialog>

      <Dialog aria-label="register form" isOpen={openDialog === REGISTER} onDismiss={handleClose}>
        <CloseButton onClick={handleClose}/>
        <h3>Register</h3>
      </Dialog>
    </div>
  )
}

export const root = createRoot(document.getElementById('root'))
root.render(<App/>)
