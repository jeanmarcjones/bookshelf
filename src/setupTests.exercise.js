// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
import {server} from "./test/server";

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
