const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const SchoolSchema = new Schema({
  name: String,
  cname: String,
  image: String,
  intro: [
    String
  ],
  subjects: Mixed,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

SchoolSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = Date.now()
  }
  this.meta.updateAt = Date.now()
  next()
})

mongoose.model('School', SchoolSchema)
