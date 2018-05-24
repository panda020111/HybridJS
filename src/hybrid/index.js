const cordova = {
  callbackId: Math.floor(Math.random() * 200000),
  callbacks: {},
  callbackStatus: {
    NO_RESULT: 0,
    OK: 1,
    CLASS_NOT_FOUND_EXCEPTION: 2,
    ILLEGAL_ACCESS_EXCEPTION: 3,
    INSTANTIATION_EXCEPTION: 4,
    MALFORMED_URL_EXCEPTION: 5,
    IO_EXCEPTION: 6,
    INVALID_ACTION: 7,
    JSON_EXCEPTION: 8,
    ERROR: 9
  },
  callbackSucess: function (callbackId, args) {
    cordova.callbackFromNative(callbackId, true, args.status, [args.message])
  }, 
  callbackError: function (callbackId, args) {
    cordova.callbackFromNative(callbackId, false, args.status, [args.message])
  },
  callbackFromNative: function (callbackId, isSuccess, status, args) {
    const callback = cordova.callbacks[callbackId]
    try {
      if (callback) {
        if (isSuccess) {
          callback.success && callback.success.apply(null, args)
        } else {
          callback.fail && callback.fail.apply(null, args)
        }
      } else {
        window.console.warn("callback is not exist")
      }
    } catch (err) {
      window.console.warn("callback execute error")
    } 
  }
}

// native注入到webview中；
const nativeApiProvider = window._HybridNative;
const bridgeSecret = 1
const messageFromNative = []

const nextTick = function (fn) {
  setTimeout(fn)
}

function exec(success, fail, service, action, args) {
  const callbackId = service + cordova.callbackId++
  const argsJson = JSON.stringify(args)

  cordova.callbacks[callbackId] = {
    success: success,
    fail: fail
  }

  const msg = nativeApiProvider.exec(bridgeSecret, service, action, callbackId, argsJson)
  messageFromNative.push(msg)
  nextTick(processMessages)
}

// process a single message, as decode by NativeToJsMessageQueue
function processMessage(message) {
  const firstChar = message.charAt(0)
  if (firstChar === 'S' || firstChar === 'F') {
    const success = firstChar === 'S'
    const spaceIdx = message.indexOf(' ', 2)
    const status = message.slice(2 ,spaceIdx)
    const nextSpaceIdx = message.indexOf(' ', spaceIdx + 1)
    const callbackId = message.slice(spaceIdx + 1, nextSpaceIdx)
    const payloadMessage = message.slice(nextSpaceIdx + 1)
    let payload = []
    buildPayload(payload, payloadMessage)

    cordova.callbackFromNative(callbackId, success, status, payload);
  } else {
    window.console.log('process message failed')
  }
}

function processMessages() {
  if (messageFromNative.length === 0) {
    return ;
  }

  try {
    const msg = popMessageFromQueue();
    processMessage(msg)

  } finally {
    if (messageFromNative.length > 0) {
      nextTick(processMessages)
    }
  }
}

function buildPayload(payload, message) {
  const payloadKind = message.charAt(0)
  if (payloadKind === 's') {
    payload.push(message.slice(1))
  } else if (payloadKind === 't') {
    payload.push(true)
  } else if (payloadKind === 'f') {
    payload.push(false)
  } else if (payloadKind === 'A') {
    // todo
    
  } else if (payloadKind === 'M') {
    // todo

  } else {
    payload.push(JSON.parse(message))
  }
} 

function popMessageFromQueue() {
  const message = messageFromNative.shift()
  return message
}

export default exec