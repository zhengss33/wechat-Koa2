<template>
  <div class="container">
    <div class="college-media">
      <img :src="`${imageCDN}${college.profile}`" alt="">
      <div class="desc">
        <div class="words">{{college.slogan}}</div>
        <div class="name">{{college.name}}</div>
      </div>
    </div>

    <div class="college-body">
      <div class="title">{{college.cname}}</div>
      <div class="body">
        <p v-for="(item, index) in college.intro" :key="index">{{item}}</p>
      </div>
      <div class="title">主要角色</div>
      <div
        class="members"
        v-for="item in college.members"
        :key="item.name"
        @click="showCharacter(item.nmId)"
      >
        <div class="cname" :class="{link: item.nmId}">{{item.name}}</div>
      </div>

      <div class="college-history"
        v-for="(item, index) in college.sections"
        :key="index"
      >
        <div class="title">{{item.title}}</div>
        <p class="content"
          v-for="(text, index) in item.content"
          :key="index"
        >{{text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  head() {
    return {
      title: '学院详情'
    }
  },

  computed: {
    ...mapState({
      'college': 'collegeDetail',
      'imageCDN': 'imageCDN'
    })
  },

  created() {
    let id = this.$route.query.id

    this.showCollegeDetail(id)
  },

  methods: {
    showCharacter(item) {
      this.$router.push({
        path: '/character',
        query: {
          id: item._id
        }
      })
    },
    ...mapActions([
      'showCollegeDetail'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '~static/scss/mixin.scss';
@import '~static/scss/colors.scss';
@import '~static/scss/variable.scss';

.container {
  .college-media {
    @include font-dpr(25px);
    overflow: hidden;
    position: relative;
    font-size: 0;

    img {
      width: 100%;
    }

    .desc {
      width: 100%;
      @include border-box;
      padding: $spacing;
      text-align: left;
      position: absolute;
      bottom: 0;
      left: 0;
      color: $white;
      @include font-dpr(10px);
      line-height: .7rem;
      background: rgba($color: #000000, $alpha: 0.5);

      .words {
        margin-bottom: 5px;
        font-size: 1.4em;
        line-height: 1.5;
      }

      .name {
        font-size: 2em;
      }
    }
  }

  .college-body {
    padding: $spacing;
    @include border-box;
    margin-top: -25px;

    .title {
      @include font-dpr(20px);
      padding-bottom: $spacing/3;
      border-bottom: 1px solid $grey-700;
      margin-top: 25px;
    }

    .members {
      @include font-dpr(16px);
      margin: $spacing/2  0;
      color: $grey-600;
      .cname {
        font-size: 1em;
        color: $black;

        &.link {
          color: blue;
          cursor: pointer;
        }
      }
    }

    .college-history {

    }
  }
}
</style>