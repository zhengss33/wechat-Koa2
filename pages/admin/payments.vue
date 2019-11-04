<template>
  <div class="content">
    <div class="related-products">
      <table class="table">
        <thead>
          <tr>
            <th>图片</th>
            <th>标题</th>
            <th>价格</th>
            <th>支付价格</th>
            <th>姓名</th>
            <th>电话</th>
            <th>地址</th>
            <th>支付方式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in payments" :key="item._id">
            <td>
              <div class="img" v-for="(image, index) in item.images" :key="index">
                <img :src="`${imageCDN}${image}?imageView2/1/format/jpg/q/75/imageslim`" alt="">
              </div>
            </td>
            <td>{{item.product.title}}</td>
            <td>{{item.product.price}}</td>
            <td>{{item.product.totalFee}}</td>
            <td>{{item.name}}</td>
            <td>{{item.phoneNumber}}</td>
            <td>{{item.address}}</td>
            <td>{{item.payType}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import vSnackbar from '../../components/Snackbar'

export default {
  middleware: 'auth',
  layout: 'admin',
  head() {
    return {
      title: '订单列表'
    }
  },
  components: {
    vSnackbar
  },
  data() {
    return {}
  },
  computed: {
    ...mapState([
      'imageCDN',
      'payments'
    ])
  },
  async created() {
    this.fetchPayments()
  },
  methods: {
    ...mapActions([
      'fetchPayments'
    ])
  }
}
</script>
