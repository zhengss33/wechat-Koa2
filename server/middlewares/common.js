import KoaBody from 'koa-body'
import session from 'koa-session'

export const koaBody = app => {
  app.use(KoaBody())
}

export const koaSession = app => {
  app.keys = ['azkaban']

  const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overWrite: true,
    signed: true,
    rolling: false
  }
  app.use(session(CONFIG, app))
}
