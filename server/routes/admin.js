import api from '../api'
import { controller, get, post, required } from '../decorator/router'

@controller('/admin')
export class adminController {
  @post('/login')
  @required({body: ['email', 'password']})
  async login(ctx, next) {
    const { email, password } = ctx.request.body
    const data = await api.admin.login(email, password)
    const { user, isMatch } = data

    if (isMatch) {
      if (user.role !== 'admin') {
        return (ctx.body = {
          success: false,
          error: '权限不够'
        })
      }

      ctx.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
        avatarurl: user.avatarurl
      }

      return (ctx.body = {
        success: true,
        data: {
          email: user.email,
          nickname: user.nickname,
          avatarurl: user.avatarurl
        }
      })
    } else {
      return (ctx.body = {
        success: false,
        error: '密码错误'
      })
    }
  }

  @get('/logout')
  async logout(ctx, next) {
    ctx.session = null
    ctx.body = {
      success: true
    }
  }

  @get('/payments')
  async fetchPayments(ctx, next) {
    const data = await api.payment.fetchPayments()

    ctx.body = {
      success: true,
      data
    }
  }
}
