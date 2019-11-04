import mongoose from 'mongoose'
import config from '../config'
import fs from 'fs'
import { resolve } from 'path'
import R from 'ramda'

const models = resolve(__dirname, '../database/schema')

const formatData = R.map(item => {
  item._id = item.nmId

  return item
})

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*js$/))
  .forEach(file => require(resolve(models, file)))

let character = require(resolve(__dirname, '../database/json/finalCharatersData.json'))
let college = require(resolve(__dirname, '../database/json/completeColleges.json'))
let school = require(resolve(__dirname, '../database/json/school.json'))

character = formatData(character)

export const database = app => {
  mongoose.set('debug', true)

  mongoose.connect(config.db, {useNewUrlParser: true})
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })
  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.on('open', async () => {
    console.log('Connected to MongoDB', config.db)

    const Character = mongoose.model('Character')
    const College = mongoose.model('College')
    const User = mongoose.model('User')
    const School = mongoose.model('School')

    const existCharater = await Character.find({}).exec()
    const existCollege = await College.find({}).exec()
    const existUser = await User.findOne({
      email: '493164072@qq.com'
    }).exec()
    const existSchool = await School.find({}).exec()

    if (!existCharater.length) Character.insertMany(character)
    if (!existCollege.length) College.insertMany(college)
    if (!existSchool.length) School.insertMany(school)

    if (!existUser) {
      console.log('写入管理员数据')
      let user = new User({
        email: '493164072@qq.com',
        password: 'kk123456',
        role: 'admin'
      })

      await user.save()
    }
  })
}
