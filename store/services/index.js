import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rap2api.taobao.org/app/mock/230668'

class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }

  getUserByOAuth(url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }

  getWechatOAuth(url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${encodeURIComponent(url)}`)
  }

  getColleges() {
    return axios.get(`${baseUrl}/wiki/colleges`)
  }

  getCharacters() {
    return axios.get(`${baseUrl}/wiki/characters`)
  }

  getSchool() {
    return axios.get(`${baseUrl}/wiki/school`)
  }

  getCollegeDetail(id) {
    return axios.get(`${baseUrl}/wiki/colleges/${id}`)
  }

  getCharacterDetail(id) {
    return axios.get(`${baseUrl}/wiki/characters/${id}`)
  }

  getProducts() {
    return axios.get(`${baseUrl}/api/products`)
  }

  getProductDetail(id) {
    return axios.get(`${baseUrl}/api/products/${id}`)
  }

  deleteProduct(id) {
    return axios.delete(`${baseUrl}/api/products/${id}`)
  }

  putProduct(product) {
    return axios.put(`${baseUrl}/api/products`, product)
  }

  saveProduct(product) {
    return axios.post(`${baseUrl}/api/products`, product)
  }

  getUserAndOrders() {
    return axios.get(`${apiUrl}/api/user`)
  }

  login(params) {
    return axios.post(`${baseUrl}/admin/login`, params)
  }

  logout() {
    return axios.post(`${baseUrl}/admin/logout`)
  }

  createOrder(orderInfo) {
    return axios.post(`${baseUrl}/wechat-pay`, orderInfo)
  }

  fetchPayments() {
    return axios.get(`${baseUrl}/admin/payments`)
  }
}

export default new Services()
