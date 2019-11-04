import request from 'request-promise'
import * as _ from 'lodash'
import fs from 'fs'
import { signature } from './util'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: `${base}token?grant_type=client_credential`,
  temporary: {
    upload: `${base}media/upload?`, // 新增临时素材
    get: `${base}media/get?`  // 获取临时素材
  },
  permanent: {
    addNews: `${base}material/add_news?`, // 新增永久图文素材
    updateNews: `${base}material/update_news?`, // 修改永久图文素材
    uploadImg: `${base}media/uploadimg?`, // 上传图文消息内的图片获取URL
    addMaterial: `${base}material/add_material?`, // 新增其他类型永久素材
    delMaterial: `${base}material/del_material?`, // 删除永久素材
    getMaterial: `${base}material/get_material?`, // 获取永久素材
    getMaterialCount: `${base}material/get_materialcount?`, // 获取素材总数
    batchgetMaterial: `${base}material/batchget_material?` // 获取素材列表
  },
  tag: {
    create: `${base}tags/create?`,  // 创建标签
    get: `${base}tags/get?`, // 获取公众号已创建的标签
    update: `${base}tags/update?`, // 编辑标签
    del: `${base}tags/delete?`,  // 删除标签
    getTagUsers: `${base}user/tag/get?`, // 获取标签下粉丝列表
    batchTag: `${base}tags/members/batchtagging?`, // 批量为用户打标签
    batchUntag: `${base}tags/members/batchuntagging?`, // 批量为用户取消标签
    getIdList: `${base}tags/getidlist?`,  // 获取用户身上的标签列表
    getBlackList: `${base}tags/members/getblacklist?`, // 获取公众号的黑名单列表
    batchBlackList: `${base}tags/members/batchblacklist?`, // 批量拉黑用户
    batchUnBlackList: `${base}tags/members/batchunblacklist?` // 批量取消拉黑用户
  },
  user: {
    updateRemark: `${base}user/info/updateremark?`, // 设置用户备注名
    info: `${base}user/info?`, // 获取用户基本信息(UnionID机制)
    batchGetInfo: `${base}user/info/batchget?`, // 批量获取用户基本信息
    getUserListInfo: `${base}user/get?` // 获取用户列表
  },
  menu: {
    create: `${base}menu/create?`, // 自定义菜单创建接口
    get: `${base}menu/get?`, // 自定义菜单查询接口
    del: `${base}menu/delete?`, // 自定义菜单删除接口
    addConditional: `${base}menu/addconditional?`, // 创建个性化菜单
    delConditional: `${base}menu/delconditional?`, // 删除个性化菜单
    getSelfmenuInfo: `${base}get_current_selfmenu_info?` // 获取自定义菜单配置接口
  },
  ticket: {
    get: `${base}ticket/getticket?` // 获得jsapi_ticket
  }
}

export default class Wechat {
  constructor(opts) {
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.getTicket = opts.getTicket
    this.saveTicket = opts.saveTicket
  }

  async request(opts) {
    let options = Object.assign({}, opts, { json: true })

    try {
      const response = await request(options)
      console.log(`request: ${JSON.stringify(response)}`)
      return response
    } catch (err) {
      console.error(err)
    }
  }

  async fetchAccessToken() {
    let data = await this.getAccessToken()

    if (this.isExpires(data, 'access_token')) {
      data = await this.updateAccessToken()
    }

    await this.saveAccessToken(data)
    return data
  }

  async updateAccessToken() {
    const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`
    const data = await this.request({url})
    const now = new Date().getTime()
    const expiresIn = now + (data.expires_in - 20) * 1000

    data.expires_in = expiresIn
    return data
  }

  isExpires(data, type) {
    if (!data || !data[type] || !data.expires_in) {
      return true
    }

    const expiresIn = data.expires_in
    const now = new Date().getTime()

    return now > expiresIn
  }

  async handleOperation(operation, ...args) {
    const token = await this.fetchAccessToken()
    const options = this[operation](token.access_token, ...args)
    console.log('options')
    console.log(options)
    const data = await this.request(options)

    return data
  }

  uploadMaterial(token, type, material, permanent) {
    let form = {}
    let url = api.temporary.upload

    if (permanent) {
      url = api.permanent.addMaterial
      _.extend(form, permanent)
    }
    if (type === 'pic') {
      url = api.permanent.uploadImg
    }
    if (type === 'news') {
      url = api.permanent.addNews
      form = material
    } else {
      form.media = fs.createReadStream(material)
    }

    let uploadUrl = `${url}access_token=${token}`

    if (!permanent) {
      uploadUrl += `&type=${type}`
    } else if (type !== 'news') {
      form.access_token = token
    }

    const options = {
      method: 'POST',
      url: uploadUrl,
      json: true
    }

    if (type === 'news') {
      options.body = form
    } else {
      options.formData = form
    }

    return options
  }

  fetchMaterial(token, mediaId, type, permanent) {
    let form = {}
    let fetchUrl = api.temporary.get

    if (permanent) {
      fetchUrl = api.permanent.getMaterial
    }

    let url = `${fetchUrl}access_token=${token}`
    let options = { method: 'POST', url: url }

    if (permanent) {
      form.media_id = mediaId
      form.access_token = token
      options.body = form
    } else {
      if (type === 'video') {
        url = url.replace('https://', 'http://')
      }

      url += `&media_id=${mediaId}`
    }

    return options
  }

  deleteMaterial(token, mediaId) {
    const form = { media_id: mediaId }
    const url = `${api.permanent.delMaterial}access_token=${token}&media_id=${mediaId}`

    return { method: 'POST', url, body: form }
  }

  updateNews(token, mediaId, news) {
    const form = { media_id: mediaId }

    _.extend(form, news)
    const url = `${api.permanent.updateNews}access_token=${token}&media_id=${mediaId}`

    return { method: 'POST', url, body: form }
  }

  getMaterialCount(token) {
    const url = `${api.permanent.getMaterialCount}access_token=${token}`

    return { method: 'POST', url }
  }

  batchgetMaterial(token, options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 10

    const url = `${api.permanent.batchgetMaterial}access_token=${token}`

    return { method: 'POST', url, body: options }
  }

  createTag(token, name) {
    const url = `${api.tag.create}access_token=${token}`
    const form = {
      tag: {
        name
      }
    }

    return { method: 'POST', url, body: form }
  }

  getTag(token) {
    return { url: `${api.tag.get}access_token=${token}` }
  }

  updateTag(token, tagId, name) {
    const url = `${api.tag.update}access_token=${token}`
    const form = {
      tag: {
        id: tagId,
        name
      }
    }

    return { method: 'POST', url, body: form }
  }

  deleteTag(token, tagId) {
    const url = `${api.tag.del}access_token=${token}`
    const form = {
      tag: {
        id: tagId
      }
    }

    return { method: 'POST', url, body: form }
  }

  getTagUsers(token, tagId, nextOpenId) {
    const url = `${api.tag.getTagUsers}access_token=${token}`
    const form = {
      tagid: tagId,
      next_openid: nextOpenId || ''
    }

    return { method: 'POST', url, body: form }
  }

  batchTag(token, openIdList, tagId, isUntag) {
    const url = `${isUntag ? api.tag.batchUntag : api.tag.batchTag}access_token=${token}`
    const form = {
      openid_list: openIdList,
      tagid: tagId
    }

    return { method: 'POST', url, body: form }
  }

  getUserTagList(token, openId) {
    const url = `${api.tag.getIdList}access_token=${token}`
    const form = { openid: openId }
    return { method: 'POST', url, body: form }
  }

  updateRemarkUser(token, openId, remark) {
    const url = `${api.user.updateRemark}access_token=${token}`
    const form = {
      openid: openId,
      remark
    }

    return { method: 'POST', url, body: form }
  }

  getUserInfo(token, openId, lang = 'zh_CN') {
    const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang}`

    return { url }
  }

  batchGetUserInfo(token, userList) {
    const url = `${api.user.batchGetInfo}access_token=${token}`
    const form = {
      user_list: userList
    }
    return { method: 'POST', url, body: form }
  }

  getUserListInfo(token, nextOpenId = '') {
    const url = `${api.user.getUserListInfo}access_token=${token}&next_openid=${nextOpenId}`
    return { url }
  }

  createMenu(token, menu) {
    const url = `${api.menu.create}access_token=${token}`

    return { method: 'POST', url, body: menu }
  }

  getMenu(token) {
    return { url: `${api.menu.get}access_token=${token}` }
  }

  delMenu(token) {
    return { url: `${api.menu.del}access_token=${token}` }
  }

  addConditional(token, menu) {
    const url = `${api.menu.addConditional}access_token=${token}`

    return { method: 'POST', url, body: menu }
  }

  delConditional(token, menuId) {
    const url = `${api.menu.delConditional}access_token=${token}`
    return {
      method: 'POST',
      url,
      body: {
        menuid: menuId
      }
    }
  }

  getSelfmenuInfo(token) {
    const url = `${api.menu.getSelfmenuInfo}access_token=${token}`

    return { url }
  }

  async fetchTicket(token) {
    let data = await this.getTicket()

    if (this.isExpires(data, 'ticket')) {
      data = await this.updateTicket(token)
    }

    await this.saveTicket(data)
    return data
  }

  async updateTicket(token) {
    const url = `${api.ticket.get}access_token=${token}&type=jsapi`
    const data = await this.request({ url })
    const now = new Date().getTime()
    const expiresIn = now + (data.expires_in - 20) * 1000

    data.expires_in = expiresIn

    return data
  }

  signature(ticket, url) {
    return signature(ticket, url)
  }
}
