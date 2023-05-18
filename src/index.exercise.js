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

function LoginForm({ onSubmit, buttonText }) {
  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const formJson = Object.fromEntries(formData.entries())

    onSubmit(formJson)
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div>
        <lable htmlFor="username">Username</lable>
        <input id="username" name="username" type="text"/>
      </div>
      <div>
        <lable htmlFor="password">Password</lable>
        <input id="password" name="password" type="password"/>
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

function App() {
  const [openDialog, setOpenDialog] = useState(NONE)

  const handleLoginDialog = () => setOpenDialog(LOGIN)
  const handleRegisterDialog = () => setOpenDialog(REGISTER)
  const handleCloseDialog = () => setOpenDialog(NONE)

  const login = (formData) => {
    console.log('login', formData)
  }
  const register = (formData) => {
    console.log('register', formData)
  }

  return (
    <div id="root">
      <Logo height="80" width="80"/>
      <h1>Bookshelf</h1>
      <div>
        <button onClick={handleLoginDialog}>Login</button>
      </div>
      <div>
        <button onClick={handleRegisterDialog}>Register</button>
      </div>
      <Dialog aria-label="Login form" isOpen={openDialog === LOGIN} onDismiss={handleCloseDialog}>
        <CloseButton onClick={handleCloseDialog}/>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login"/>
      </Dialog>
      <Dialog aria-label="register form" isOpen={openDialog === REGISTER} onDismiss={handleCloseDialog}>
        <CloseButton onClick={handleCloseDialog}/>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register"/>
      </Dialog>
    </div>
  )
}

export const root = createRoot(document.getElementById('root'))
root.render(<App/>)
