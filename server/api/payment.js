import mongoose from 'mongoose'

const Payment = mongoose.model('Payment')

export async function fetchPayments() {
  const data = Payment.find({}).populate('product user').exec()

  return data
}

export async function create({user, product, order, payType, name, phoneNumber, address}) {
  let payment = new Payment({
    user: user._id,
    product: product._id,
    totalFee: product.price,
    order,
    payType,
    name,
    phoneNumber,
    address
  })

  payment = await payment.save()

  return payment
}
