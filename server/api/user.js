import mongoose from 'mongoose'

const User = mongoose.model('User')

export async function findUserByOpenId(openid) {
  const user = await User
    .findOne({
      openid: {
        '$in': [openid]
      }
    }).exec()

  return user
}

export async function saveFromSession(session) {
  const { 
    openid, unionid, nickname, address, province, country, city, sex, headimgurl, avatarUrl
  } = session.user
  let user = new User({
    openid: [openid],
    unionid,
    nickname,
    address,
    province,
    country,
    city,
    sex,
    headimgurl,
    avatarUrl
  })

  user = await user.save()
  return user
}
