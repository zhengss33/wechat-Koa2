import api from '../api'
import { controller, get } from '../decorator/router'

@controller('/wiki')
export class WechatController {
  @get('colleges')
  async getColleges(ctx, next) {
    const data = await api.wiki.getColleges()

    ctx.body = {
      data: data,
      success: true
    }
  }

  @get('colleges/:id')
  async getCollege(ctx, next) {
    const { params: { id } } = ctx

    console.log('id')
    console.log(id)

    if (!id) {
      ctx.body = { success: false, err: 'id is required' }
      return
    }

    const data = await api.wiki.getCollege(id)

    ctx.body = {
      data,
      success: true
    }
  }

  @get('characters')
  async getCharaters(ctx, next) {
    let { limit = 20 } = ctx.query

    const data = await api.wiki.getCharacters(limit)

    ctx.body = {
      data,
      success: true
    }
  }

  @get('characters/:id')
  async getCharacter(ctx, next) {
    const { params: { id } } = ctx

    if (!id) return (ctx.body = { success: false, err: 'id is required' })

    const data = await api.wiki.getCharacter(id)

    ctx.body = {
      data,
      success: true
    }
  }

  @get('school')
  async getSchool(ctx, next) {
    const data = await api.wiki.getSchool()

    ctx.body = {
      data,
      success: true
    }
  }
}
