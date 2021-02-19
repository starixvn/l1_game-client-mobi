const doAsyncWork = () => Promise.reject(new Error('Test Sentry'))
doAsyncWork()

const Test1 = () => <h1>Test Sentry</h1>

export default Test1
