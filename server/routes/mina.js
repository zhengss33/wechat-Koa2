import { controller, get, post, required } from '../decorator/router'
import {
  getUserAsync,
  loginAsync
} from '../controllers/user'
import {
  openidAndSessionKey
} from '../wechat-lib/mina'

@controller('/mina')
export class MinaController {
  @get('codeAndSessionKey')
  @required({ query: ['code'] })
  async getCodeAndSessionKey(ctx, next) {
    const { code } = ctx.query
    const data = await openidAndSessionKey(code)

    ctx.body = {
      success: true,
      data
    }
  }

  @get('user')
  @required({ query: ['code', 'userInfo'] })
  async getUser(ctx, next) {
    await getUserAsync(ctx, next)
  }

  @post('login')
  @required({ body: ['code', 'avatarUrl', 'nickname'] })
  async login(ctx, next) {
    await loginAsync(ctx, next)
  }
}
