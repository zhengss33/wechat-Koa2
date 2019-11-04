import { resolve } from 'path'
const tip = 'welcome to azkaban!'

export default async(ctx, next) => {
  const message = ctx.weixin

  switch (message.MsgType) {
    case 'event':
      if (message.Event === 'subscribe') {
        ctx.body = {
          type: 'image',
          mediaId: 'hDQaktIw-WdqSwe9e8YrXHZL0HB-SidYWYD5MQReq2s'
        }
      } else if (message.Event === 'unsubscribe'){
        console.log('unsubscribe')
      } else if (message.Event === 'LOCATION') {
        ctx.body = `Latitude: ${message.Latitude}, Longitude: ${message.Longitude}, Precision: ${message.Precision}`
      } else if (message.Event === 'VIEW') {
        console.log(`${message.EventKey}: ${message.MenuId}`)
        ctx.body = `hello ${message.EventKey}: ${message.MenuId}`
      }
      break
    case 'text':
      // let wechat = require('../wechat')
      // let wechatClient = wechat.getWechat()
      // const data = await wechatClient.handleOperation('uploadMaterial', 'image', resolve(__dirname, '../../ready.jpg'), true)
      // const list = await wechatClient.handleOperation('batchgetMaterial', {})

      ctx.body = message.Content
      break
    case 'image':
    case 'voice':
      ctx.body = {
        type: message.MsgType,
        mediaId: message.MediaId
      }
      break
    case 'video':
      ctx.body = {
        type: message.MsgType,
        mediaId: message.MediaId,
        title: 'video test',
        description: 'video test'
      }
      break
    case 'location':
      ctx.body = `${message.Label}: ${message.Location_X}, ${message.Location_Y}`
      break
    case 'link':
      ctx.body = `${message.Title}: ${message.Url}`
      break
    default:
      ctx.body = tip
  }
}
