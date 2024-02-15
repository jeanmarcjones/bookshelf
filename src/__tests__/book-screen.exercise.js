// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

// 🐨 after each test, clear the queryCache and auth.logout
afterEach(async () => {
  queryCache.clear()
  await auth.logout()
})

test('renders all the book information', async () => {
  // 🐨 "authenticate" the client by setting the auth.localStorageKey in localStorage to some string value (can be anything for now)
  window.localStorage.setItem(auth.localStorageKey, 'token')
  // 🐨 create a user using `buildUser`
  const user = buildUser()
  // 🐨 create a book use `buildBook`
  const book = buildBook()

  // 🐨 update the URL to `/book/${book.id}`
  //   💰 window.history.pushState({}, 'page title', route)
  //   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
  window.history.pushState({}, 'Test page', `/book/${book.id}`)

  // 🐨 reassign window.fetch to another function and handle the following requests:
  // - url ends with `/bootstrap`: respond with {user, listItems: []}
  // - url ends with `/list-items`: respond with {listItems: []}
  // - url ends with `/books/${book.id}`: respond with {book}
  // 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
  // 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})
  const originalFetch = window.fetch
  window.fetch = async (url, config) => {
    if (url.endsWith(`/bootstrap`)) {
      return Promise.resolve({
        ok: true,
        json: async () => ({user: {...user, token: 'token'}, listItems: []}),
      })
    }

    if (url.endsWith(`/list-items`)) {
      return Promise.resolve({ok: true, json: async () => ({listItems: []})})
    }

    if (url.endsWith(`/books/${book.id}`)) {
      return Promise.resolve({ok: true, json: async () => ({book})})
    }

    return originalFetch(url, config)
    return Promise.reject(new Error(`NEED TO HANDLE: ${url}`))
  }

  // 🐨 render the App component and set the wrapper to the AppProviders
  // (that way, all the same providers we have in the app will be available in our tests)
  render(<App />, {wrapper: AppProviders})

  // 🐨 use findBy to wait for the book title to appear
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#findby-queries
  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])

  // 🐨 assert the book's info is in the document
  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textbox', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})
