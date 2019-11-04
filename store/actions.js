import * as types from './mutations-types'
import Services from './services'

const nuxtServerInit = ({ commit }, { req }) => {
  if (req.session && req.session.user) {
    const { email, nickname, avatarUrl } = req.session.user
    const user = {
      email,
      nickname,
      avatarUrl
    }

    commit(types.SET_USER, user)
  }
}

const login = async ({ commit }, user) => {
  try {
    const res = await Services.login(user)
    const { data } = res

    if (data.success) commit(types.SET_USER, data.data)

    return data
  } catch (e) {
    if (e.response.status === 401) {
      throw new Error('参数错误， 登陆失败')
    }
  }
}

const logout = async ({ commit }) => {
  await Services.logout()

  commit(types.SET_USER, null)
}

const getWechatSignature = ({ commit }, url) => {
  return Services.getWechatSignature(url)
}

const getUserByOAuth = ({ commit }, url) => {
  return Services.getUserByOAuth(url)
}

const getWechatOAuth = ({ commit }, url) => {
  return Services.getWechatOAuth(url)
}

const setOAuthUser = ({ commit }, user) => {
  commit(types.SET_AUTH_USER, user)
}

const getColleges = async ({commit}) => {
  const res = await Services.getColleges()

  commit(types.SET_COLLEGES, res.data.data)
}

const getCharacters = async ({commit}) => {
  const res = await Services.getCharacters()

  commit(types.SET_CHARATERS, res.data.data)
}

const getSchool = async ({commit}) => {
  const res = await Services.getSchool()

  commit(types.SET_SCHOOL, res.data.data)
}

const showCollegeDetail = async ({commit, state}, _id) => {
  if (_id === (state.collegeDetail && state.collegeDetail._id)) return
  const res = await Services.getCollegeDetail(_id)

  commit(types.SHOW_COLLEGE_DETAIL, res.data.data)
}

const showCharacterDetail = async ({commit, state}, _id) => {
  if (_id === state.characterDetail._id) return

  const res = await Services.getCharacterDetail(_id)

  commit(types.SHOW_CHARATER_DETAIL, res.data.data)
}

const getProducts = async ({commit}) => {
  const res = await Services.getProducts()

  commit(types.SET_PRODUCTS, res.data.data)
}

const showProductDetail = async ({commit, state}, _id) => {
  if (_id === state.productDetail._id) return

  const res = await Services.getProductDetail(_id)

  commit(types.SHOW_PRODUCT_DETAIL, res.data.data)
}

const deleteProduct = async ({ dispatch }, product) => {
  await Services.deleteProduct(product._id)
  await dispatch('getProducts')
}

const putProduct = async ({ dispatch }, product) => {
  await Services.putProduct(product)
  await dispatch('getProducts')
}

const saveProduct = async ({ dispatch }, product) => {
  await Services.saveProduct(product)
  await dispatch('getProducts')
}

const getUserAndOrders = async ({commit}) => {
  const res = await Services.getUserAndOrders()

  commit(types.SET_USER_AND_ORDERS, res.data.data)
}

const createOrder = async ({commit}, orderInfo) => {
  return Services.createOrder(orderInfo)
}

const fetchPayments = async ({commit}) => {
  const data = await Services.fetchPayments()
  commit(types.SET_PAYMENTS, data)
}

export {
  getWechatSignature,
  getUserByOAuth,
  getColleges,
  getCharacters,
  getSchool,
  showCollegeDetail,
  showCharacterDetail,
  getProducts,
  showProductDetail,
  getUserAndOrders,
  deleteProduct,
  putProduct,
  saveProduct,
  nuxtServerInit,
  login,
  logout,
  getWechatOAuth,
  setOAuthUser,
  createOrder,
  fetchPayments
}
