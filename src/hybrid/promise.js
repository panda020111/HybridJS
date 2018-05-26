function Promise_ (fn) {
  window.console.log('fn==>', fn)
}

const Promise = window.Promise || Promise_
export default Promise