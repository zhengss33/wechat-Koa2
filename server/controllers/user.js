import mongoose from 'mongoose'
import {
  openidAndSessionKey,
  WXBizDataCrypt
} from '../wechat-lib/mina'

const User = mongoose.model('User')

export const decryptUserAsync = async (code, userInfo) => {
  const minaUser = await openidAndSessionKey(code)

  let user = await User.findOne({
    openid: {
      '$in': [minaUser.openid]
    }
  }).exec()

  if (!user) {
    let pc = new WXBizDataCrypt(minaUser.session_key)
    let data = pc.decryptData(userInfo.encryptedData, userInfo.iv)

    user = await User.findOne({
      openid: {
        '$in': [data.openid]
      }
    })

    if (!user) {
      let _userData = userInfo.userInfo

      user = new User({
        avatarUrl: _userData.avatarUrl,
        nickname: _userData.nickName,
        unionid: data.unionid,
        openid: [minaUser.openid],
        sex: _userData.gender,
        country: _userData.country,
        province: _userData.province,
        city: _userData.city
      })

      await user.save()
    }
  }
  return user
}

export async function getUserAsync(ctx, next) {
  const { code, userInfo } = ctx.query
  let user

  try {
    user = await decryptUserAsync(code, Object.assign({}, userInfo))
  } catch (e) {
    console.log('getUserAsync Error', e)
    return (ctx.body = {
      success: false,
      error: e
    })
  }

  console.log(user)
  ctx.body = {
    success: true,
    data: {
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      sex: user.sex
    }
  }
}

export async function loginAsync(ctx, next) {
  const {
    code,
    avatarUrl,
    nickName
  } = ctx.request.body

  try {
    const { openid, unionid } = await openidAndSessionKey(code)

    let user = await User.findOne({
      openid: {
        '$in': [openid]
      }
    }).exec()

    if (!user) {
      user = new User({
        openid: [openid],
        nickname: nickName,
        unionid,
        avatarUrl
      })
    } else {
      user.avatarUrl = avatarUrl
      user.nickname = nickName
    }

    user = await user.save()

    ctx.body = {
      success: true,
      data: {
        nickName: user.nickname,
        avatarUrl: user.avatarUrl
      }
    }
  } catch (e) {
    ctx.body = {
      success: false,
      error: e
    }
  }
}