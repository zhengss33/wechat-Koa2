<template>
  <div class="container">
    <div class="banner-cover">
      <img class="banner" :class="{'active': isAnimation}" src="../static/img/banner.jpg" @load="isAnimation = true"/>
      <div class="banner-title" :class="{'active': isAnimation}">THE HOME OF</div>
      <img class="banner-subtitle" :class="{'active': isAnimation}" src="../static/img/harrypotter.svg"/>
    </div>
    <div class="colleges">
      <div 
        class="college-item" 
        v-for="item in colleges"
        :key="item.wikiId"
        @click="showCollege(item)">
        <div class="college-desc">
          <div class="words">{{item.slogan}}</div>
          <div class="cname">{{item.cname}}</div>
          <div class="name">{{item.name}}</div>
        </div>
        <a class="college-flag" :style="{backgroundImage: `url(${imageCDN}${item.profile})`}"></a>
      </div>
    </div>

    <div class="characters">
      <div class="character-title">主要成员</div>
      <div class="character-container">
        <div
          class="character-item"
          v-for="item in characters"
          :key="item._id"
          @click="showCharacter(item)"
          >
          <a class="character-profile" :style="{backgroundImage: `url(${imageCDN}${item.profile || item.images[0]})`}"></a>
          <div class="character-desc">
            <div class="cname">{{item.cname}}</div>
            <div class="name">{{item.name}}</div>
            <div class="playedby">{{item.playedBy}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="school">
      <div class="school-title">
        {{school.cname}}
        <span class="school-subtitle">{{school.name}}</span>
      </div>
      
      <div class="school-intro">
        <p v-for="(item, index) in school.intro" :key="index">{{item}}</p>
      </div>

      <div class="school-subjects">
        <div class="subject-title">科目</div>
        <div class="subject" v-for="(subject, index) in school.subjects" :key="index">
          <div class="subject-name">{{subject.title}}</div>
          <div class="subject-content">{{subject.content}}</div>
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
      title: '霍格沃茨'
    }
  },
  data() {
    return {
      isAnimation: false
    }
  },

  async created() {
    this.getColleges()
    this.getCharacters()
    await this.getSchool()
    console.log(this.school)
  },

  computed: {
    ...mapState([
      'colleges',
      'characters',
      'school',
      'imageCDN'
    ])
  },

  methods: {
    showCollege(item) {
      this.$router.push({
        path: '/college',
        query: {
          id: item._id
        }
      })
    },
    showCharacter(item) {
      this.$router.push({
        path: '/character',
        query: {
          id: item._id
        }
      })
    },
    ...mapActions([
      'getColleges',
      'getCharacters',
      'getSchool'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '~static/scss/index.scss'
</style>
