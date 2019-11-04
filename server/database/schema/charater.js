const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const CharacterSchema = new Schema({
  _id: String,
  name: String,
  cname: String,
  playedBy: String,
  profile: String,
  images: [
    String
  ],
  nmId: String,
  sections: Mixed,
  intro: [
    String
  ],
  wikiId: Number,
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

CharacterSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = Date.now()
  }
  this.meta.updatedAt = Date.now()
  next()
})

mongoose.model('Character', CharacterSchema)
