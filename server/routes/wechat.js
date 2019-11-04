import { controller, get, post, required } from '../decorator/router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/wechatmiddle'
import { signature, redirect, oauth, wechatPay } from '../controllers/wechat'

@controller('')
export class WechatController {
  @get('/wechat-hear')
  async wechatHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @post('/wechat-hear')
  async wechatPostHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @get('/wechat-signature')
  async wechatSignature(ctx, next) {
    await signature(ctx, next)
  }

  @get('/wechat-redirect')
  async wechatRedirect(ctx, next) {
    await redirect(ctx, next)
  }

  @get('/wechat-oauth')
  async wechatOAuth(ctx, next) {
    await oauth(ctx, next)
  }

  @post('/wechat-pay')
  @required({ body: ['productId', 'name', 'phoneNumber', 'address'] })
  async createOrder(ctx, next) {
    await wechatPay(ctx, next)
  }
}
