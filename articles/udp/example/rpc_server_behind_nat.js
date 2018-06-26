function fibonacci (length) {
  const res = []

  function _fibonacci (n) {
    if (n <= 1) {
      return 1
    }
    return _fibonacci(n - 1) + _fibonacci(n - 2)
  }

  for (let i = 0; i < length; i++) {
    res.push(_fibonacci(i))
  }

  return res
}

const { PeerRPCServer } = require('grenache-nodejs-utp')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

const service = peer.transport('server')
service.listen()
console.log('listening on', service.port)

service.on('request', (rid, key, payload, handler, cert, additional) => {
  console.log('received request, calculating & replying...')
  const result = fibonacci(payload.length)
  handler.reply(null, result)
})

setInterval(function () {
  link.announce('fibonacci_worker', service.port, {})
  peer.punch('fibonacci_consumer')
}, 1000)
