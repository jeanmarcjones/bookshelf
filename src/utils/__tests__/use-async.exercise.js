// 🐨 We'll use renderHook rather than render here
import {renderHook, act} from '@testing-library/react'
// 🐨 Here's the thing you'll be testing:
import {useAsync} from '../hooks'

beforeEach(() => {
  jest.spyOn(console, 'error')
})

afterEach(() => {
  console.error.mockRestore()
})

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

const expectedInitialState = {
  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,
  setData: expect.any(Function),
  setError: expect.any(Function),
  error: null,
  status: 'idle',
  data: null,
  run: expect.any(Function),
  reset: expect.any(Function),
}

// 🐨 flesh out these tests
test('calling run with a promise which resolves', async () => {
  // 🐨 get a promise and resolve function from the deferred utility
  const {promise, resolve} = deferred()

  // 🐨 use renderHook with useAsync to get the result
  const {result} = renderHook(() => useAsync())

  // 🐨 assert the result.current is the correct default state
  expect(result.current).toEqual(expectedInitialState)

  // 🐨 call `run`, passing the promise
  //    (💰 this updates state so it needs to be done in an `act` callback)
  let p
  act(() => {
    p = result.current.run(promise)
  })
  // 🐨 assert that result.current is the correct pending state
  expect(result.current).toEqual({
    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error: null,
    status: 'pending',
    data: null,
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  // 🐨 call resolve and wait for the promise to be resolved
  //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
  const data = Symbol('some data')
  await act(async () => {
    resolve(data)
    await p
  })
  // 🐨 assert the resolved state
  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error: null,
    status: 'resolved',
    data,
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  // 🐨 call `reset` (💰 this will update state, so...)
  act(() => {
    result.current.reset()
  })
  // 🐨 assert the result.current has actually been reset
  expect(result.current).toEqual(expectedInitialState)
})

test('calling run with a promise which rejects', async () => {
  // 🐨 this will be very similar to the previous test, except you'll reject the
  // promise instead and assert on the error state.
  // 💰 to avoid the promise actually failing your test, you can catch
  //    the promise returned from `run` with `.catch(() => {})`
  // 🐨 get a promise and resolve function from the deferred utility
  const {promise, reject} = deferred()

  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(expectedInitialState)

  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual({
    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error: null,
    status: 'pending',
    data: null,
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  const error = Symbol('some error')
  await act(async () => {
    reject(error)
    await p.catch(e => e)
  })
  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error,
    status: 'rejected',
    data: null,
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  act(() => {
    result.current.reset()
  })
  expect(result.current).toEqual(expectedInitialState)
})

test('can specify an initial state', () => {
  // 💰 useAsync(customInitialState)
  const data = Symbol('some data')
  const error = Symbol('some error')
  const {result} = renderHook(() =>
    useAsync({
      status: 'resolved',
      data,
      error,
    }),
  )

  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error,
    status: 'resolved',
    data,
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can set the data', () => {
  // 💰 result.current.setData('whatever you want')
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(expectedInitialState)

  const data = Symbol('some data')
  act(() => {
    result.current.setData(data)
  })
  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error: null,
    status: 'resolved',
    data,
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can set the error', () => {
  // 💰 result.current.setError('whatever you want')
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(expectedInitialState)

  const error = Symbol('some error')
  act(() => {
    result.current.setError(error)
  })
  expect(result.current).toEqual({
    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error,
    status: 'rejected',
    data: null,
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  // 💰 const {result, unmount} = renderHook(...)
  // 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

  const {promise, resolve} = deferred()

  const {result, unmount} = renderHook(() => useAsync())

  expect(result.current).toEqual(expectedInitialState)

  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual({
    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,
    setData: expect.any(Function),
    setError: expect.any(Function),
    error: null,
    status: 'pending',
    data: null,
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  unmount()

  await act(async () => {
    resolve()
    await p
  })
  expect(console.error).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', async () => {
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(expectedInitialState)

  await expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
