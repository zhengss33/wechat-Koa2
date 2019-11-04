import * as types from './mutations-types'

const mutations = {
  [types.SET_COLLEGES](state, data) {
    state.colleges = data
  },
  [types.SET_CHARATERS](state, data) {
    state.characters = data
  },
  [types.SET_SCHOOL](state, data) {
    state.school = data
  },
  [types.SHOW_COLLEGE_DETAIL](state, data) {
    state.collegeDetail = data
  },
  [types.SHOW_CHARATER_DETAIL](state, data) {
    state.characterDetail = data
  },
  [types.SET_PRODUCTS](state, data) {
    state.products = data
  },
  [types.SHOW_PRODUCT_DETAIL](state, data) {
    state.productDetail = data
  },
  [types.SET_USER](state, data) {
    state.user = data
  },
  [types.SET_AUTH_USER](state, data) {
    state.authUser = data
  },
  [types.SET_USER_AND_ORDERS](state, data) {
    state.userAndOrders = data
  },
  [types.SET_PAYMENTS](state, data) {
    state.payments = data
  }
}

export default mutations
