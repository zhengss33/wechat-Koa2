const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const CollegeSchema = new Schema({
  name: String,
  cname: String,
  profile: String,
  slogan: String,
  intro: [
    String
  ],
  wikiId: Number,
  sections: Mixed,
  members: [
    {
      nmId: {
        type: String,
        ref: 'Character'
      },
      name: String
    }
  ],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

CollegeSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = Date.now()
  }
  this.meta.updatedAt = Date.now()
  next()
})

mongoose.model('College', CollegeSchema)