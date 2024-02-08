// 🐨 you'll need the test server
// 💰 the way that our tests are set up, you'll find this in `src/test/server/test-server.js`
import {server, rest} from 'test/server'
// 🐨 grab the client
import {client} from '../api-client'

// 🐨 add a beforeAll to start the server with `server.listen()`
beforeAll(() => server.listen())
// 🐨 add an afterAll to stop the server when `server.close()`
afterAll(() => server.close())
// 🐨 afterEach test, reset the server handlers to their original handlers
// via `server.resetHandlers()`
afterEach(() => server.resetHandlers())

// 🐨 flesh these out:
const apiURL = process.env.REACT_APP_API_URL
const endpoint = 'test-endpoint'
const mockResult = {mockValue: 'VALUE'}

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  // 🐨 add a server handler to handle a test request you'll be making
  // 💰 because this is the first one, I'll give you the code for how to do that.
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  // 🐨 call the client (don't forget that it's asynchronous)
  const received = await client(endpoint)
  // 🐨 assert that the resolved value from the client call is correct
  expect(received).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  // 🐨 create a fake token (it can be set to any string you want)
  const token = 'token'
  // 🐨 create a "request" variable with let
  let request
  // 🐨 create a server handler to handle a test request you'll be making
  // 🐨 inside the server handler, assign "request" to "req" so we can use that
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  // 🐨 call the client with the token (note that it's async)
  await client(endpoint, {token})
  // 🐨 verify that `request.headers.get('Authorization')` is correct (it should include the token)
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  // 🐨 do a very similar setup to the previous test
  let request
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )
  // 🐨 create a custom config that specifies properties like "mode" of "cors" and a custom header
  const config = {
    headers: {
      custom: 'header',
    },
    method: 'POST',
  }
  // 🐨 call the client with the endpoint and the custom config
  await client(endpoint, config)
  // 🐨 verify the request had the correct properties
  expect(request.headers.get('custom')).toBe('header')
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  // 🐨 create a mock data object
  // 🐨 create a server handler very similar to the previous ones to handle the post request
  //    💰 Use rest.post instead of rest.get like we've been doing so far
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(req.body))
    }),
  )
  // 🐨 call client with an endpoint and an object with the data
  //    💰 client(endpoint, {data})
  const received = await client(endpoint, {data: mockResult})
  // 🐨 verify the request.body is equal to the mock data object you passed
  expect(received).toEqual(mockResult)
})
