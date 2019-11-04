<template>
  <div id="app">
    <v-header></v-header>
    <div id="container">
      <v-aside></v-aside>
      <nuxt></nuxt>
    </div>
  </div>
</template>

<script>
import vHeader from '../components/Header'
import vAside from '../components/Aside'

export default {
  components: {
    vHeader,
    vAside
  }
}
</script>

<style lang="scss" scope>
  #container {
    display: flex;
  }
</style>
