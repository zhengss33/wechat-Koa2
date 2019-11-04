import { getWechat, getOAuth } from '../wechat'

const mongoose = require('mongoose')
const client = getWechat()
const oauth = getOAuth()
const User = mongoose.model('User')

export async function getSignatureAsync(url) {
  const tokenData = await client.fetchAccessToken()
  const token = tokenData.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.signature(ticket, url)
  params.appId = client.appID

  return params
}

export function getAuthorizeURL(...args) {
  return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode(code) {
  const data = await oauth.fetchAccessToken(code)
  const user = await oauth.getUserInfo(data.access_token, data.openid)
  const existUser = await User.findOne({
    openid: {
      '$in': [data.openid]
    }
  }).exec()

  if (!existUser) {
    const userData = new User({
      openid: [data.openid],
      nickname: user.nickname,
      address: user.address,
      province: user.province,
      country: user.country,
      city: user.city,
      headimgUrl: user.headimgUrl,
      sex: user.sex
    })

    await userData.save()
  }

  return {
    openid: [data.openid],
    nickname: user.nickname,
    address: user.address,
    province: user.province,
    country: user.country,
    city: user.city,
    headimgUrl: user.headimgUrl,
    sex: user.sex
  }
}
