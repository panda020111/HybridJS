/**
 * cordova js
 */

import channel from './channel.js'

const documentEventHandlers = {}
const windowEventHandlers = {}

const m_document_addEventListener = document.addEventListener;
const m_document_removeEventListener = document.removeEventListener;
const m_window_addEventListener = window.addEventListener;
const m_window_removeEventListener = window.removeEventListener;

/**
 * 创建event事件；
 * @param {*} type 
 * @param {*} data 
 */
function createEvent(type, data) {
  const event = document.createEvent('Events')
  event.initEvent(type, false, false)

  if (data) {
    for (let i in data) {
      if (data.hasOwnProperty(i)) {
        event[i] = data[i]
      }
    }
  }

  return event;
}

document.addEventListener = function (evt, handler, capture) {
  const e = evt.toLowerCase()
  if (typeof documentEventHandlers[e] != 'undefined') {
    documentEventHandlers[e].subscribe(handler)
  } else {
    m_document_addEventListener.call(document, evt, handler, capture)
  }
}

document.removeEventListener = function (evt, handler, capture) {
  const e = evt.toLowerCase()
  if (typeof windowEventHandlers[e] != 'undefined') {
    windowEventHandlers[e].unsubscribe(handler)
  } else {
    m_document_removeEventListener.call(document, evt, handler, capture)
  }
}

window.addEventListener = function (evt, handler, capture) {
  const e = evt.toLowerCase()
  if (typeof windowEventHandlers[e] != 'undefined') {
    windowEventHandlers[e].subscribe(handler)
  } else {
    m_window_addEventListener.call(window, evt, handler, capture)
  }
}

window.removeEventListener = function (evt, handler, capture) {
  const e = evt.toLowerCase()
  if (typeof windowEventHandlers[e] != 'undefined') {
    windowEventHandlers[e].unsubscribe(handler)
  } else {
    m_window_removeEventListener.call(window, evt, handler, capture)
  }
}

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

  addDocumentEventHandler: function (event) {
    return (documentEventHandlers[event] = channel.create(event))
  },

  addWindowEventHandler: function (event) {
    return (windowEventHandlers[event] = channel.create(event))
  },

  firDocumentEvent: function(type, data) {
    const evt = createEvent(type, data)
    if (typeof documentEventHandlers[type] != 'undefined') {
      documentEventHandlers[type].fire(evt)
    } else {
      document.dispatchEvent(evt)
    }
  },

  fireWindowEvent: function (type, data) {
    const evt = createEvent(type, data)
    if (typeof windowEventHandlers[type] != 'undefined') {
      windowEventHandlers[type].fire(evt)
    } else {
      window.dispatchEvent(evt)
    }
  },

  callbackFromNative: function (callbackId, isSuccess, status, args) {
    const callback = cordova.callbacks[callbackId];
    window.console.log('hello callback from native' + callbackId);
    if (callback) {
      window.console.log('callback is exeist' + callbackId);

      if (isSuccess) {
        callback.success && callback.success.apply(null, args);
      } else {
        callback.fail && callback.fail.apply(null, args);
      }
    }
  }
}

export default cordova