import mongoose from 'mongoose'

const User = mongoose.model('User')

export async function login(email, password) {
  const user = await User.findOne({ email }).exec()
  const isMatch = user && await user.comparePassword(password, user.password)

  return {
    user,
    isMatch
  }
}
