import mongoose from 'mongoose'

const College = mongoose.model('College')
const Character = mongoose.model('Character')
const School = mongoose.model('School')

export async function getColleges() {
  const data = await College
    .find({})
    .populate({
      path: 'members.nmId',
      select: '_id name cname profile'
    })
    .exec()

  return data
}

export async function getCollege(_id) {
  const data = await College
    .findOne({ _id })
    .populate({
      path: 'members.nmId',
      select: '_id name profile cname nmId'
    })

  return data
}

export async function getCharacters(limit = 20) {
  const data = await Character
  .find({})
  .limit(Number(limit))
  .exec()

  return data
}

export async function getCharacter(_id) {
  const data = await Character
    .findOne({ _id })
    .exec()

  return data
}

export async function getSchool() {
  const data = await School
    .findOne({})
    .exec()

  return data
}
