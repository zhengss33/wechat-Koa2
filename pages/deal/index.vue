<template>
  <div class="container">
    <div class="product">
      <div
        class="swiper"
        v-swiper="swiperConfig"
        v-if="product && product.images"
      >
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in product.images"
            :key="index"
          >
            <img :src="imageCDN + item" alt="">
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets"></div>
      </div>

      <div class="content">
        <div class="price" v-if="product.price">
          <span class="main-price">{{Number(product.price).toFixed(2) - Number(product.price).toFixed(2).substr(-3)}}</span>
          <span class="other-price">{{Number(product.price).toFixed(2).substr(-3)}}</span>
        </div>

        <div class="name">{{product.title}}</div>
        <div class="intro">{{product.intro}}</div>

        <div class="info">
          <cell
            v-for="(item, index) in product.parameters"
            :key="index"
            :title="item.key"
            :content="Number(item.value)"
          ></cell>
        </div>
        <div class="attentions">
          <div class="title">购买提示</div>
          <ol>
            <li v-for="(item, index) in attentions" :key="index">{{item}}</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="product-footer">
      <span @click="showInfo=true">购买</span>
    </div>
    <transition name="slide-top">
      <div class="payment-modal" v-if="showInfo">
        <div class="payment-modal-header">
          <span>准备购买</span>
          <span @click="showInfo=false">取消</span>
        </div>
        <div class="payment-modal-body">
          <div class="info-item">
            <img :src="imageCDN + product.images[0]" alt="">
            <div>
              <p>{{ product.title }}</p>
              <p> 价格 ¥{{ product.price }}</p>
            </div>
          </div>
          <div class="info-item">
            <span>收件人</span>
            <input type="text" v-model.trim="info.name" placeholder="你的名字">
          </div>
          <div class="info-item">
            <span>电话</span>
            <input type="text" v-model.trim="info.phoneNumber" placeholder="你的电话">
          </div>
          <div class="info-item">
            <span>地址</span>
            <input type="text" v-model.trim="info.address" placeholder="你的地址">
          </div>
        </div>
        <div class="payment-modal-footer" @click="handPayment">确认支付</div>
      </div>
    </transition>
    <transition name="fade">
      <span class="modal" v-if="modal.visible">{{ modal.content }}</span>
    </transition>
  </div>
</template>

<script>
import Cell from '../../components/Cell.vue'
import { mapState, mapActions } from 'vuex'
import wechat from '../../static/mixin/wechatMixin'

export default {
  middleware: 'wechat-auth',
  mixins: [wechat],
  head() {
    return {
      title: '购买页面'
    }
  },

  components: {
    Cell
  },

  data() {
    return {
      swiperConfig: {
        autoplay: 4000,
        direction: 'horizontal',
        loop: true,
        pagination: '.swiper-pagination'
      },

      attentions: [
        '商品和服务的差异',
        '清关服务',
        '物流服务',
        '需要更多帮助，请联系管理员'
      ],

      showInfo: false,

      info: {
        name: '',
        phoneNumber: '',
        address: ''
      },

      modal: {
        visible: false,
        content: '成功',
        timer: null
      }
    }
  },

  computed: {
    ...mapState({
      'imageCDN': 'imageCDN',
      'product': 'productDetail'
    })
  },

  async beforeMount() {
    const id = this.$route.query.id
    const url = window.location.href

    this.showProductDetail(id)
    await this.wechatInit(url)

    window.wx.error(function (res) {
      console.log('error', res)
    })
  },

  methods: {
    async handPayment() {
      const {
        name,
        address,
        phoneNumber
      } = this.info

      if (!name || !address || !phoneNumber) {
        this.toggleModal('收货信息忘填了哦~')

        return
      }

      if (true) {
        this.toggleModal('暂不支持支付功能')
        return
      }

      const res = await this.createOrder({
        productId: this.product._id,
        name: name,
        address: address,
        phoneNumber: phoneNumber
      })

      const data = res.data

      if (!data || !data.success) {
        this.toggleModal('服务器异常，请等待后重新尝试')

        return
      }

      window.wx.chooseWXPay({
        timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
        package: data.package, // 统一支付接口返回的 prepay_id 参数值，提交格式如：prepay_id=***）
        signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.paySign, // 支付签名
        success: (response) => {
          try {
            window.WeixinJSBridge.log(response.err_msg)
          } catch (e) {
            console.error(e)
          }

          if (response.err_msg === 'get_brand_wcpay_request:ok') {
            // 支付成功
            this.toggleModal('支付成功')
          }
        }
      })
    },
    toggleModal(content) {
      const modal = this.modal
      clearTimeout(modal.timer)
      modal.visible = true
      modal.content = content
      modal.timer = setTimeout(() => {
        modal.visible = false
      }, 1500)
    },
    ...mapActions([
      'showProductDetail',
      'createOrder'
    ])
  }
}
</script>

<style lang="scss" scoped src="./index.scss"></style>
