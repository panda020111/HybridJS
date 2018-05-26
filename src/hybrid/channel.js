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

Channel.prototype.fire = function (e) {
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

/**
 * define dom cordova event
 */
channel.create('onResume')
channel.create('onPause')
channel.create('onDeviceReady')
channel.create('onDOMContentLoaded')
channel.create('onPluginsReady')

export default channel