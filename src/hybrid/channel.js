let nextGuid = 1

const Channel = function (type) {
  this.type = type
  this.handlers = {}
  this.fireArgs = null
  this.numHandlers = 0
  this.onHasSubscribesChange = null
}

function forceFunction (fn) {
  if (typeof fn != 'function') throw "Function requied as first argument"
}

Channel.prototype.subscribe = function (fn) {
  forceFunction(fn)

  let guid = fn.observe_guid
  if (!guid) {
    guid = '' + nextGuid++
  }

  fn.observe_guid = guid

  if (!this.handlers[guid]) {
    this.handlers[guid] = fn
    this.numHandlers++
  }
}

Channel.prototype.unsubscribe = function (fn) {
  forceFunction(fn)

  let guid = fn.observe_guid
  let handler = this.handlers[guid]

  if (handler) {
    delete this.handlers[guid]
    this.numHandlers--
  }
} 

Channel.prototype.fire = function () {
  let fireArgs = Array.prototype.slice.call(arguments)

  if (this.numHandlers) {
    let toCall = []
    for (let key in this.handlers) {
      toCall.push(this.handlers[key])
    }

    for (let i=0; i<toCall.length; i++) {
      toCall[i].apply(this, fireArgs)
    }
  }
}

const channel = {
  create: function (type) {
    return channel[type] = new Channel(type)
  }
}

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

/**
 * define dom cordova event
 */
channel.create('onResume')
channel.create('onPause')
channel.create('onDeviceReady')
channel.create('onDOMContentLoaded')
channel.create('onPluginsReady')

export default channel