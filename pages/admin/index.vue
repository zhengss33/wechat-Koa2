<template>
  <div class="content">
    <h3>登录成功 {{user.email}}</h3>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'auth',
  head() {
    return {
      'title': '后台管理首页'
    }
  },
  computed: mapState([
    'user'
  ])
}
</script>