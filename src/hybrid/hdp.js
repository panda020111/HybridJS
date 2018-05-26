import exec from './exec.js'
import Promise from './promise.js'

window.console.log('promise', Promise)
const hdp = {}

hdp.isApp = function () {
  return window.navigator.userAgent.indexOf('hybrid_app') > -1
}

hdp.exec = function (service) {
  if (!service) {
    return Promise.reject('invalida service name')
  }

  if (!this.isApp()) {
    window.console.warn("error msg: not in hybrid app")
    return Promise.reject("not in hybrid app")
  }

  const args = Array.prototype.slice.call(arguments)
  return new Promise((resolve, reject) => {
    function successCb (data) {
      resolve(data)
    }

    function failCb (err) {
      reject(err)
    }

    const pluginName = args.shift();
    const action = args.shift();
    
    if (pluginName && action) {
      exec(successCb, failCb, pluginName, action, args)
    } else {
      reject('error message pluginName || action name is illegal')
    }
  })
}

export default hdp