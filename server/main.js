const ws = require('nodejs-websocket')
const dayjs = require('dayjs')

console.log('开始建立连接...')

const users = []

function sendTime () {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

function broadcast (payload) {
  server.connections.forEach(conn => {
    conn.sendText(JSON.stringify(payload))
  })
}

const server = ws.createServer(con => {
  con.on('text', payload => {
    const { nickname, uid, message = '', type } = JSON.parse(payload) || {}
    if (type === 1) {
      users.push({ nickname, uid })
      broadcast({
        type: 1,
        date: sendTime(),
        msg: `${nickname}加入了聊天室`,
        users: users,
        uid,
        nickname
      })
    } else {
      broadcast({
        type: 2,
        date: sendTime(),
        nickname,
        message,
        uid
      })
    }
  })

  con.on('close', function(code, reason) {
    console.log('关闭连接')
  })

  con.on('error', function(code, reason) {
    console.log('异常关闭')
  })

}).listen(8001)
console.log('WebSocket建立完毕')
