import cordova from './cordova'

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
  
  // 同步返回直接处理
  // 异步返回在callFromNative中处理
  if (msg) {
    messageFromNative.push(msg)
    nextTick(processMessages)
  }
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

window.cordova = cordova

export default exec