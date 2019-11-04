const mongoose = require('mongoose')
const { Schema } = mongoose
const Mixed = Schema.Types.Mixed
const ObjectId = Schema.Types.ObjectId

const PaymentSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  product: {
    type: ObjectId,
    ref: 'Product'
  },
  payType: String,
  totalFee: Number,
  name: String,
  phoneNumber: String,
  address: String,
  description: String,
  order: Mixed,
  // 0 unfinished 1 finished
  success: {
    type: Number,
    default: 0
  },
  meta: {
    craeteAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

PaymentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

mongoose.model('Payment', PaymentSchema)
