<template>
  <div class="container">
    <div class="user-header">
      <div class="text">{{user.nickname}}</div>
      <img :src="imageCDN + user.avatarUrl" alt="">
    </div>
    <div class="user-address">
      <cell title="收货地址"></cell>
      <div class="user-content">{{user.address}}</div>
    </div>
    <div class="user-phone">
      <cell title="电话"></cell>
      <div class="user-content">{{user.phoneNumber}}</div>
    </div>
    <div class="user-name">
      <cell title="姓名"></cell>
      <div class="user-content">{{user.name}}</div>
    </div>

    <div class="user-order" v-if="user.orders">
      <cell title="我的订单"></cell>
      <div class="user-order-items" v-for="(item, index) in user.orders" :key="index">
        <img :src="imageCDN + item.image" alt="">
        <div class="user-order-intro">
          <div class="title">{{item.title}}</div>
          <div class="content">{{item.intro}}</div>
        </div>
        <div class="user-order-price">
          <span>¥{{item.price}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cell from '../../components/Cell'
import { mapState, mapActions } from 'vuex'

export default {
  head() {
    return {
      title: '古灵阁'
    }
  },

  components: {
    Cell
  },

  computed: {
    ...mapState({
      user: 'userAndOrders',
      imageCDN: 'imageCDN'
    })
  },

  created() {
    this.getUserAndOrders()
  },

  methods: {
    ...mapActions([
      'getUserAndOrders'
    ])
  }
}
</script>

<style lang="scss">
@import '~static/scss/mixin.scss';
@import '~static/scss/variable';
@import '~static/scss/colors';

.container {
  @include border-box;
  padding-bottom: $navHeight;
}

.user {
  @include border-box;
  padding: $spacing*2;
  @include font-dpr(10px);
}

  .user-header {
    padding: $spacing*2 0;
    font-size: 2.5em;
    text-align: right;

    .text {
      float: left;
    }

    img {
      width: 1.5rem;
      height: 1.5rem;
      display: inline-block;
      border-radius: 50%;
    }
  }
    

  .user-address, .user-phone, .user-name, .user-order {
    padding: $spacing/2 0;
    border-top: 1px solid $grey-400;

    .user-content {
      font-size: 1.8em;
    }
  }
  
  .user-order {
    .user-order-items {
      width: 100%;
      height: 2.5rem;
      margin-top: $spacing/2;
      font-size: 0;

      > * {
        display: inline-block;
        height: 100%;
        vertical-align: top;
        @include font-dpr(10px);
      }
      img {
        width: 25%;
      }
      .user-order-intro {
        width: 50%;
        margin-left: 5%;
        border-bottom: 1px solid $grey-300;
        color: $grey-700;
        .title {
          padding-top: 3px;
          font-size: 1.5em;
        }
        .content {
          font-size: 1.25em;
        }
      }
      .user-order-price {
        width: 20%;
        border-bottom: 1px solid $grey-300;
        text-align: center;
        color: $white;
        span {
          display: inline-block;
          width: 100%;
          margin-top: 5px;
          padding: 3px 0;
          background: $grey-800;
        }
      }
    }
  }       
</style>
