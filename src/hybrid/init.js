import cordova from './cordova.js'
import hdp from './hdp.js'

// 添加几个监听事件
cordova.addDocumentEventHandler('pause')
cordova.addDocumentEventHandler('resume')
cordova.addDocumentEventHandler('deviceready')

window.hdp = hdp