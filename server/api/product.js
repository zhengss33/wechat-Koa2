import mongoose from 'mongoose'

const Product = mongoose.model('Product')

export async function findProduct(_id) {
  const data = await Product
    .find({id: _id})
    .exec()

  return data
}

export async function getProducts(limit = 50) {
  const data = await Product
    .find({})
    .limit(Number(limit))
    .exec()

  return data
}

export async function getProduct(_id) {
  const data = await Product
    .findOne({ _id })
    .exec()

  return data
}

export async function save(product) {
  product = new Product(product)
  product = await product.save()

  return product
}

export async function update(product) {
  product = await product.save()

  return product
}

export async function del(product) {
  try {
    await product.remove()
  } catch (e) {
    console.log(e)
  }

  return true
}
