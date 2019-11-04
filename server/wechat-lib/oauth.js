import request from 'request-promise'

const base = 'https://api.weixin.qq.com/sns/'
const api = {
  authorize: `https://open.weixin.qq.com/connect/oauth2/authorize?`,  // 用户同意授权，获取code
  accessToken: `${base}oauth2/access_token?`, // 通过code换取网页授权access_token
  userInfo: `${base}userinfo?`  // 拉取用户信息(需scope为 snsapi_userinfo)
}

export default class WechatOAuth {
  constructor(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appSecret
  }

  async request(opts) {
    let options = Object.assign({}, opts, { json: true })

    try {
      const response = await request(options)
      console.log(`${options.url} request:\n ${JSON.stringify(response)}`)
      return response
    } catch (err) {
      console.error(err)
    }
  }

  getAuthorizeURL(scope = 'snsapi_base', targetUrl, state) {
    const url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(targetUrl)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`

    return url
  }

  async fetchAccessToken(code) {
    const { appID, appSecret } = this
    const url = `${api.accessToken}appid=${appID}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
    const data = await this.request({ url })

    return data
  }

  async getUserInfo(token, openID, lang = 'zh_CN') {
    const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`
    const data = await this.request({ url })

    return data
  }
}
