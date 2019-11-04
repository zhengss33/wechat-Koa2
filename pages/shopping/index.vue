<template>
  <div class="container">
    <div class="shopping">
      <div class="title">周边手办</div>
      <div class="list" v-if="products.length">
        <div
          class="items"
          v-for="(item, index) in products"
          :key="index"
          @click="showProductDetail(item)"
        >
          <div class="image" :style="{backgroundImage: `url(${imageCDN + item.images[0]})`}"> </div>
          <div class="body">
            <div class="name">{{item.title}}</div>
            <div class="content">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  middleware: 'wechat-auth',
  head() {
    return {
      title: '对角巷'
    }
  },

  computed: {
    ...mapState([
      'products',
      'imageCDN'
    ])
  },

  created() {
    this.getProducts()
  },

  methods: {
    showProductDetail(item) {
      this.$router.push({
        path: '/deal',
        query: {
          id: item._id
        }
      })
    },
    ...mapActions([
      'getProducts'
    ])
  }
}
</script>

<style lang="scss">
  @import '~static/scss/mixin.scss';
  @import '~static/scss/colors.scss';
  @import '~static/scss/variable.scss';

  .container {
    @include border-box;
    padding-bottom: $navHeight;

    .shopping {
      background-color: $grey-200;

      > * {
        width: 100%;
        background-color: $white;
      }

      .title {
        @include font-dpr(18px);
        text-align: center;
        margin-bottom: $spacing;
        padding: $spacing/2 0;
      }

      .list {
        @include border-box;
        padding-bottom: $spacing*3;

        .items {
          display: flex;
          height: 8rem;
          padding: $spacing;
          // max-height: 300px;
          font-size: 0;
          overflow: hidden;
          border-bottom: 2px solid $grey-200;

          .image {
            display: block;
            width: 8rem;
            height: 8rem;
            background-repeat: no-repeat;
            background-size: cover; 
          }

          .body {
            flex: 1;
            height: 100%;
            @include display-flex;
            @include flex-column;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            @include border-box;
            @include font-dpr(10px);
            margin-left: 10px;

            .name {
              font-size: 1.8em;
              line-height: 1.7em;
              @include text-overflow;
            }

            .content {
              width: 100%;
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              font-size: 1.4em;
              line-height: 1.4em;
              color: $grey-600;
            }

            .footer {
              text-align: right;
              height: 1em;
              font-size: 2em;
              color: $blue;
            }
          }
        }
      }
    }
  }
</style>
