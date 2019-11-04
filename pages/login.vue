<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="card-inner">登录</div>
      </div>
      <div class="card-body">
        <div class="form">
          <input class="form-control" v-model="user.email">
          <input class="form-control" type="password" v-model="user.password">
          <button class="btn login-btn" @click="loginHandle">登录</button>
        </div>
      </div>
    </div>
    <v-snackbar :open.sync="openSnackbar"></v-snackbar>
  </div>
</template>

<script>
import vSnackbar from '../components/Snackbar'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      user: {},
      openSnackbar: false
    }
  },

  components: {
    vSnackbar
  },

  methods: {
    async loginHandle() {
      let { email, password } = this.user
      let res

      if (!email || !password) {
        this.openSnackbar = true

        return ''
      }

      try {
        res = await this.login(this.user)
        console.log(res)

        if (res.success) {
          this.$router.push('/admin')
        } else {
          alert(`登陆失败, ${res.error}`)
        }
      } catch (e) {
        console.log(e)
      }
    },

    ...mapActions([
      'login'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '~static/scss/admin.scss'
</style>
