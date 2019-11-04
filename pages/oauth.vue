<template></template>
<script>
import { mapActions } from 'vuex'

const getUrlParam = (param) => {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)

  return result ? decodeURIComponent(result[2]) : null
}

export default {
  async beforeMount() {
    const url = window.location.href
    const { data } = await this.getWechatOAuth(url)
    console.log(data)

    if (data.success) {
      await this.setOAuthUser(data.data)
      const paramArr = getUrlParam('state').split('_')
      const target = paramArr.length === 1 ? `/${paramArr[0]}` : `/${paramArr[0]}?id=${paramArr[1]}`

      this.$router.replace(target)
    } else {
      throw new Error('用户信息获取失败')
    }
  },

  asyncData({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },

  methods: {
    ...mapActions([
      'getWechatOAuth',
      'setOAuthUser'
    ])
  }
}
</script>

<style scoped>
</style>
