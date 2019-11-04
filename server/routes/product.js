import api from '../api'
import { controller, get, post, del, put } from '../decorator/router'
import xss from 'xss'
import R from 'ramda'

@controller('/api')
export class ProductController {
  @get('/products')
  async getProducts(ctx, next) {
    let { limit = 50 } = ctx.query
    const data = await api.product.getProducts(limit)

    ctx.body = {
      data,
      success: true
    }
  }

  @get('/products/:id')
  async getProduct(ctx, next) {
    const { params: { id } } = ctx

    if (!id) {
      ctx.body = {
        err: 'id is required',
        success: false
      }
    }

    const data = await api.product.getProduct(id)

    ctx.body = {
      data,
      success: true
    }
  }

  @post('/products')
  async postProducts(ctx, next) {
    let product = ctx.request.body

    console.log(ctx)
    console.log(ctx.request.body)

    product = {
      title: xss(product.title),
      price: xss(product.price),
      intro: xss(product.intro),
      images: R.map(xss)(product.images),
      parameters: R.map(
        item => ({
          key: xss(item.key),
          value: xss(item.value)
        })
      )(product.parameters)
    }

    try {
      product = await api.product.save(product)
      ctx.body = {
        success: true,
        data: product
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

  @put('/products')
  async putProducts(ctx, next) {
    let body = ctx.request.body
    const { _id } = body

    if (!_id) {
      ctx.body = {
        success: false,
        err: '_id is required'
      }
      return
    }

    let product = await api.product.getProduct(_id)

    if (!product) {
      ctx.body = {
        success: false,
        err: 'product not exist'
      }
      return
    }

    product.title = xss(body.title)
    product.price = xss(body.price)
    product.intro = xss(body.intro)
    product.images = R.map(xss)(body.images)
    product.parameters = R.map(
      item => ({
        key: xss(item.key),
        value: xss(item.value)
      })
    )(body.parameters)

    try {
      product = await api.product.update(product)

      ctx.body = {
        success: true,
        data: product
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

  @del('/products/:id')
  async delProducts(ctx, next) {
    const { params: { id } } = ctx

    if (!id) {
      ctx.body = {
        success: false,
        err: 'id is required'
      }
      return
    }

    let product = await api.product.getProduct(id)

    if (!product) {
      ctx.body = {
        success: false,
        err: 'product not exist'
      }
      return
    }

    try {
      await api.product.del(product)
      ctx.body = {
        success: true
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
}
