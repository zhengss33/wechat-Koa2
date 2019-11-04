<template>
  <div>
    <div class="container">
      <div class="character-header">
        <img
          class="character-background"
          v-if="character.images && character.images.length"
          :src="imageCDN + character.images[character.images.length - 1]"
          alt="">
          <div class="media">
            <img
            v-if="character.profile"
            :src="`${imageCDN}${character.profile}?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim`" alt="">
            <div class="desc">
              <div class="names">
                <p class="cname">{{character.cname}}</p>
                <p class="name">{{character.name}}</p>
              </div>
            </div>
          </div>
      </div>

      <div class="character-body">
        <div class="intro">
          <p
            v-for="(item, index) in character.intro"
            :key="index"
          >{{item}}</p>

          <div class="stills">
            <img
              v-for="(item, index) in character.images"
              :key="index"
              :src="`${imageCDN}${item}?imageView2/1/w/750/h/460/format/jpg/q/80|imageslim`"
              alt="">
          </div>
          <div class="items"
            v-for="(item, index) in character.sections"
            :key="index"
          >
            <div class="title">{{item.title}}</div>
            <div class="body"
              v-for="(text, index) in item.content"
              :key="index"
            >{{text}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  head() {
    return {
      title: '家族成员详情'
    }
  },

  computed: {
    ...mapState({
      imageCDN: 'imageCDN',
      character: 'characterDetail'
    })
  },

  created() {
    let id = this.$route.query.id

    this.showCharacterDetail(id)
  },

  methods: {
    ...mapActions([
      'showCharacterDetail'
    ])
  }
}
</script>

<style lang="scss">
  @import '~static/scss/mixin.scss';
  @import '~static/scss/colors.scss';
  @import '~static/scss/variable.scss';

  .container {
    .character-header {
      position: relative;
      height: 8rem;
      margin-bottom: $spacing;
      overflow: hidden;

      .background {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        filter: brightness(80%) opacity(50%) grayscale(70%);
        -webkit-filter: brightness(80%) opacity(50%) grayscale(70%);
      }

      .media {
        width: 100%;
        height: 70%;
        padding: 0 $spacing;
        @include border-box;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        font-size: 0;

        > * {
          display: inline-block;
          vertical-align: middle;
          height: 100%;
        }

        img {
          max-width: 40%;
        }

        .desc {
          width: 60%;
          @include font-dpr(10px);
          position: relative;

          > * {
            position: absolute;
          }

          .names {
            color: $white;
            line-height: 230%;
            top: 30%;
            left: $spacing;

            .cname {
              font-size: 2.1em;
            }

            .name {
              font-size: 1.7em;
            }
          }
        }
      }
    }

    .character-body {
      @include border-box;
      @include font-dpr(10px);

      >*:not(.stills) {
        padding: 0 $spacing;

        .intro {
          font-size: 2em;
          text-indent: 2em;
          color: $grey-600;
        }

        .stills {
          @include x-scroll;
          padding: $spacing 0 $spacing $spacing;

          img {
            width: 80%;
          }

          img:not(:last-child) {
            margin-right: $spacing/2
          }
        }

        .items {
          .title {
            font-size: 2.2em;
            border-bottom: 1px solid $grey-400;
            padding-bottom: $spacing / 3;
          }

          .body {
            text-indent: 2em;
            font-size: 1.7em;
            color: $grey-600;
            margin: $spacing 0;
          }
        }
      }
    }
  }
</style>
