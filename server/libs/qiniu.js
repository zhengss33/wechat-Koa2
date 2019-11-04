import qiniu from 'qiniu'
import config from '../config'

const bucket = 'azkaban'
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const qiniuConfig = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig)

export const uptoken = key => {
  const options = {
    scope: `${bucket}:${key}`
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)

  return uploadToken
}

export const fetchImage = async (url, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, function (err, respBody, respInfo) {
      if (err) {
        reject(err)
        // throw err;
        console.log(err)
      } else {
        if (respInfo.statusCode === 200) {
          resolve(respBody)
        } else {
          console.log(respInfo.statusCode, respBody)
        }
      }
    })
  })
}
