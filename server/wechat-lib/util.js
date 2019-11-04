import xml2js from 'xml2js'
import compiled from './compiled'
import sha1 from 'sha1'

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

function formatMessage(result) {
  let message = {}

  if (typeof result === 'object') {
    const keys = Object.keys(result)

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let item = result[key]

      if (!(Array.isArray(item)) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]

        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '')
        }
      } else {
        message[key] = []

        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return message
}

function template(content, msg) {
  let type = Array.isArray(content) ? 'news' : 'text'

  let info = Object.assign({}, {
    content: content || 'Empty News',
    createTime: new Date().getTime(),
    msgType: (content && content.type) || type,
    toUserName: msg.FromUserName,
    fromUserName: msg.ToUserName
  })
  return compiled(info)
}

function signIt(nonce, ticket, timestamp, url) {
  const ret = {
    jsapi_ticket: ticket,
    nonceStr: nonce,
    timestamp,
    url
  }

  const str = raw(ret)
  const sha = sha1(str)

  return sha
}

function createNonce() {
  return Math.random().toString(36).substr(2, 15)
}

function craeteTimestamp() {
  return parseInt(new Date().getTime() / 1000, 0) + ''
}

function raw(opts) {
  let keys = Object.keys(opts).sort()
  let str = keys.reduce((acc, key) => (acc += `&${key.toLocaleLowerCase()}=${opts[key]}`), '')

  return str.substr(1)
}

function signature(ticket, url) {
  const noncestr = createNonce()
  const timestamp = craeteTimestamp()
  const signature = signIt(noncestr, ticket, timestamp, url)

  return {
    noncestr,
    timestamp,
    signature
  }
}

export {
  parseXML,
  formatMessage,
  template,
  signature
}
