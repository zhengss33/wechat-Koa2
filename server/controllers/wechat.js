import api from '../api'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
import { getParamsAsync } from '../wechat-lib/pay'

export async function signature(ctx, next) {
  let url = ctx.query.url
  if (!url) ctx.throw(404)

  url = decodeURIComponent(url)

  const data = await api.wechat.getSignatureAsync(url)

  ctx.body = {
    success: true,
    data
  }
}

export async function redirect(ctx, next) {
  const target = `${config.SITE_ROOT_URL}/oauth`
  const scope = 'snsapi_userinfo'
  const { visit, id } = ctx.query
  const params = id ? `${visit}_${id}` : visit
  const url = api.wechat.getAuthorizeURL(scope, target, params)

  console.log(`url: ${url}`)

  ctx.redirect(url)
}

export async function oauth(ctx, next) {
  const url = decodeURIComponent(ctx.query.url)
  const urlObj = urlParse(url)
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await api.wechat.getUserByCode(code)

  console.log(user)

  ctx.session.user = user
  ctx.body = {
    success: true,
    data: user
  }
}

export async function wechatPay(ctx, next) {
  const ip = ctx.ip.replace('::ffff:', '')
  const session = ctx.session
  const {
    productId,
    name,
    phoneNumber,
    address
  } = ctx.request.body

  const product = await api.product.findProduct(productId)

  if (!product) {
    return (ctx.body = {
      success: false,
      error: '商品不在了'
    })
  }

  try {
    let user = await api.user.findUserByOpenId(session.user.openid)

    if (!user) {
      user = await api.user.saveFromSession(session)
    }

    const orderParams = {
      body: product.title,
      attach: '公众号周边手办支付',
      out_trade_no: 'Product' + (+new Date()),
      spbill_create_ip: ip,
      // total_fee: product.price * 100,
      total_fee: product.price * 100,
      openid: session.user.openid,
      trade_type: 'JSAPI'
    }

    const order = await getParamsAsync(orderParams)
    const payment = await api.payment.create({
      user,
      product,
      order,
      payType: '公众号',
      name,
      phoneNumber,
      address
    })

    ctx.body = {
      success: true,
      data: payment.order
    }
  } catch (e) {
    ctx.body = {
      success: false,
      error: e
    }
  }
}
