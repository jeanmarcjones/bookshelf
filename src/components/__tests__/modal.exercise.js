/** @jsx jsx */
import {jsx} from '@emotion/core'

import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// 🐨 you're gonna need this stuff:
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('can be opened and closed', async () => {
  // 🐨 render the Modal, ModalOpenButton, and ModalContents
  render(
    <Modal>
      <ModalOpenButton>
        <button>Login</button>
      </ModalOpenButton>
      <ModalContents aria-label="Login form" title="Login">
        <p>Content</p>
      </ModalContents>
    </Modal>,
  )

  // 🐨 click the open button
  await userEvent.click(screen.getByRole('button', {name: /login/i}))

  // 🐨 verify the modal contains the modal contents, title, and label
  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', 'Login form')
  const inModal = within(modal)
  expect(inModal.getByRole('heading', {name: 'Login'})).toBeInTheDocument()
  expect(inModal.getByText('Content')).toBeInTheDocument()

  // 🐨 click the close button
  await userEvent.click(screen.getByRole('button', {name: /close/i}))

  // 🐨 verify the modal is no longer rendered
  // 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
  // 💰 Remember all userEvent utils are async, so you need to await them.
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
