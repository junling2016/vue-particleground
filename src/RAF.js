let requestAnimationFrame = window.requestAnimationFrame
let cancelAnimationFrame = window.cancelAnimationFrame

let lastTime = 0
const vendors = ['ms', 'moz', 'webkit', 'o']

for (var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
  requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
  cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
    window[vendors[x] + 'CancelRequestAnimationFrame']
}

if (!requestAnimationFrame) {
  requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime()
    var timeToCall = Math.max(0, 16 - (currTime - lastTime))
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall)
    }, timeToCall)
    lastTime = currTime + timeToCall
    return id
  }
}

if (!cancelAnimationFrame) {
  cancelAnimationFrame = function (id) {
    clearTimeout(id)
  }
}

export {
  requestAnimationFrame,
  cancelAnimationFrame
}
