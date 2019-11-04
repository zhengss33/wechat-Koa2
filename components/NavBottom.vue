<template>
  <nav id="nav" v-if="navVisible">
    <nuxt-link
      v-for="(item, index) in navList"
      :key="index"
      :to="item.path"
    >
      <div v-if="index === 0">
        <img
          v-if="activeRoute !== item.name"
          src="../static/img/home.png"
          alt="">
        <img
          v-else
          src="../static/img/home-selected.png"
          alt="">
      </div>
      <div v-else-if="index === 1">
        <img
           v-if="activeRoute !== item.name"
          src="../static/img/shopping.png"
          alt="">
        <img
          v-else
          src="../static/img/shopping-selected.png"
          alt="">
      </div>
      <div v-else>
        <img
           v-if="activeRoute !== item.name"
          src="../static/img/user.png"
          alt="">
        <img
          v-else
          src="../static/img/user-selected.png"
          alt="">
      </div>
      <span>{{item.text}}</span>
    </nuxt-link>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          'path': '/',
          'name': 'index',
          'text': '霍格沃茨'
        },
        {
          'path': '/shopping',
          'name': 'shopping',
          'text': '对角巷'
        },
        {
          'path': '/user',
          'name': 'user',
          'text': '古灵阁'
        }
      ]
    }
  },

  computed: {
    activeRoute() {
      return this.$route.name
    },

    navVisible() {
      return ['index', 'shopping', 'user'].indexOf(this.activeRoute) > -1
    }
  }
}
</script>

<style lang="scss">
  @import '~static/scss/mixin.scss';
  @import '~static/scss/colors.scss';
  @import '~static/scss/variable.scss';

  $iconSize: 30px;

  #nav {
    width: 100%;
    background-color: $grey-100;
    @include border-box;
    border-top: 1px solid $grey-400;
    display: flex;
    display: -webkit-flex;
    display: -webkit-box;
    display: -ms-flexbox;
    text-align: center;
    font-size: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 3px 0;

    > * {
      height: 100%;
      @include font-dpr(14px);
      color: #565656;
      display: block;
      flex: 1;
      -webkit-flex: 1;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      display: flex;
      display: -webkit-flex;
      display: -webkit-box;
      display: -ms-flexbox;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      text-decoration: none;

      > div {
        @include size-dpr($iconSize, width, height);
        margin: auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .nuxt-link-exact-active {
      color: #5AACA5;
      line-height: 1;
    }
  }
</style>
